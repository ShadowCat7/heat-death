import playerFactory from './player/player.js';
import monsterFactory from './entity/monsters/monster.js';
import { chasePlayerIfClose, moveRandom } from './entity/monsters/behaviors.js';
import inventoryMenu from './player/inventory.js';
import craftingMenu from './player/crafting.js';
import speech from './player/speech.js';
import load from './load.js';
import level0_0 from './levels/level0_0.js';
import level1_0 from './levels/level1_0.js';
import { loadGame, startGame } from './utility/game.js';
import hud from './hud/hud.js';

import './cheats.js';
import levels from './levels/levels.js';
import sign from './entity/sign.js';
import notify from './utility/notify.js';
import bulletinMenu from './player/bulletin-board.js';
import bulletin from './entity/bulletin.js';
import person, { CARPENTER } from './entity/people/person.js';
import { LEVEL_WIDTH } from './constants.js';

let sprites = null;

let player = null;

let currentControls = {};

let isInventoryOpen = false;
let isCraftingOpen = false;
let isBulletinOpen = false;

const possibleQuests = [0];

function draw(ctx) {
    if (isBulletinOpen) {
        bulletinMenu.draw(ctx);
    } else if (isInventoryOpen) {
        inventoryMenu.draw(ctx);
    } else if (isCraftingOpen) {
        craftingMenu.draw(ctx);
    } else if (currentControls.map) {
        levels.drawMap(ctx, player);
    } else {
        levels.draw(ctx, player);

        speech.draw(ctx);

        hud.draw(ctx, player);
    }

    notify.draw(ctx);
}

function update(controls, elapsedTime) {
    currentControls = controls;

    if (notify.update(controls)) {
        return;
    }

    if (player.talkingTo) {
        speech.open(player.talkingTo.getText());

        speech.update(controls, () => {
            player.talkingTo = null;
        });

        return;
    }

    if (player.checkBulletin) {
        player.checkBulletin = false;
        bulletinMenu.updateMenuItems(possibleQuests, true);
        isBulletinOpen = true;
    }

    if (controls.questLog && !controls.previousControls.questLog) {
        bulletinMenu.updateMenuItems(player.quests, false);
        isBulletinOpen = !isBulletinOpen;
        isInventoryOpen = false;
        isCraftingOpen = false;
    }

    if (controls.inventory && !controls.previousControls.inventory) {
        isInventoryOpen = !isInventoryOpen;
        isCraftingOpen = false;
        isBulletinOpen = false;

        inventoryMenu.changeTitle('Inventory');
        inventoryMenu.updateMenuItems(player.inventory, player.entityInRange && player.entityInRange.type === 'person');
    }

    if (player.addItemMenu) {
        isInventoryOpen = true;
        isCraftingOpen = false;
        isBulletinOpen = false;

        inventoryMenu.changeTitle('Use Item');
        inventoryMenu.updateMenuItems(player.inventory);
    }

    if (controls.crafting  && !controls.previousControls.crafting) {
        isCraftingOpen = !isCraftingOpen;
        isInventoryOpen = false;
        isBulletinOpen = false;

        craftingMenu.updateMenuItems(player.inventory);
    }

    if (isInventoryOpen) {
        inventoryMenu.update(true, controls, (itemType, action) => {
            player.addItemMenu = false;

            if (!itemType) {
                isInventoryOpen = false;
            } else if (action === 'drop') {
                const droppedItem = player.dropItem(itemType, action);
                if (droppedItem) {
                    levels.createEntity(droppedItem);
                }

                isInventoryOpen = false;
            } else if (action === 'give') {
                if (player.giveItem(itemType)) {
                    isInventoryOpen = false;
                }
            } else {
                const actionSucceeded = player.useItem(itemType);

                if (actionSucceeded) {
                    isInventoryOpen = false;
                } else {
                    notify.alert('Nothing happens');
                }
            }
        });
    } else if (isCraftingOpen) {
        craftingMenu.update(true, controls, (itemType) => {
            isCraftingOpen = false;

            if (itemType) {
                player.craftItem(itemType);

                craftingMenu.updateMenuItems(player.inventory);
            }
        });
    } else if (isBulletinOpen) {
        bulletinMenu.update(true, controls, (questId) => {
            if (questId !== null) {
                player.quests.push(questId);
                possibleQuests.splice(questId, 1);
            }

            isBulletinOpen = false;
        });
    } else if (!controls.map) {
        hud.update(elapsedTime);

        levels.update(controls, elapsedTime, player);
    }
}

loadGame((images) => {
    sprites = images;

    inventoryMenu.initialize(sprites);

    craftingMenu.initialize(sprites);

    bulletinMenu.initialize(sprites);

    speech.initialize(sprites);

    sign.initialize(sprites);
    bulletin.initialize(sprites);

    /*
    const monster = monsterFactory.create({
        x: -440,
        y: -440,
        behavior: chasePlayerIfClose,
    });
    entityList.push(monster);*/

    player = playerFactory.create({
        x: 280,
        y: 280,
    });

    levels.insert(load(level0_0), 0, 0);
    levels.insert(load(level1_0), 1, 0);

    levels.createEntity(person.create({
        x: 480 + LEVEL_WIDTH,
        y: 160,
        personId: CARPENTER,
        behavior: moveRandom,
    }));

    startGame(update, draw);
});