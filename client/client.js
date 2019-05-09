import playerFactory from './player/player.js';
import monsterFactory from './entity/monsters/monster.js';
import { chasePlayerIfClose } from './entity/monsters/behaviors.js';
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
import alert from './utility/alert.js';

let sprites = null;

let player = null;

let currentControls = {};

let isInventoryOpen = false;
let isCraftingOpen = false;

function draw(ctx) {
    if (isInventoryOpen) {
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
    
    alert.draw(ctx);
}

function update(controls, elapsedTime) {
    currentControls = controls;

    if (alert.update(controls)) return;

    if (player.talkingTo) {
        speech.open(player.talkingTo.getText());

        speech.update(controls, () => {
            player.talkingTo = null;
        });

        return;
    }

    if (controls.inventory && !controls.previousControls.inventory) {
        isInventoryOpen = !isInventoryOpen;
        isCraftingOpen = false;

        inventoryMenu.changeTitle('Inventory');
        inventoryMenu.updateMenuItems(player.inventory);
    }

    if (player.addItemMenu) {
        isInventoryOpen = true;
        isCraftingOpen = false;

        inventoryMenu.changeTitle('Use Item');
        inventoryMenu.updateMenuItems(player.inventory);
    }

    if (controls.crafting  && !controls.previousControls.crafting) {
        isCraftingOpen = !isCraftingOpen;
        isInventoryOpen = false;

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
            } else {
                const actionSucceeded = player.useItem(itemType);

                if (actionSucceeded) {
                    isInventoryOpen = false;
                } else {
                    alert.alert('Nothing happens');
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
    } else if (!controls.map) {
        hud.update(elapsedTime);

        levels.update(controls, elapsedTime, player);
    }
}

loadGame((images) => {
    sprites = images;

    inventoryMenu.initialize(sprites);

    craftingMenu.initialize(sprites);

    speech.initialize(sprites);

    sign.initialize(sprites);

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

    startGame(update, draw);
});