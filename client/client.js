import './cheats.js';
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

import levels from './levels/levels.js';
import sign from './entity/sign.js';
import notify from './utility/notify.js';
import bulletinMenu from './player/bulletin-board.js';
import bulletin from './entity/bulletin.js';
import person, { CARPENTER } from './entity/people/person.js';
import { LEVEL_WIDTH } from './constants.js';
import events, { EVENTS } from './utility/events.js';

let sprites = null;

let player = null;

let currentControls = {};

const possibleQuests = [0];
let currentEvent = null;

const doEventIfRaisedFunc = (controls, currentEvent) => {
    return (control, event) => {
        if (controls[control] && !controls.previousControls[control]) {
            if (currentEvent === event) {
                events.drop();
            } else {
                events.raise(event);
            }
        }
    };
};

const drawGame = (ctx) => {
    levels.draw(ctx, player);

    speech.draw(ctx);

    hud.draw(ctx, player);
};

function draw(ctx) {
    drawGame(ctx);

    if (currentEvent === EVENTS.BULLETIN) {
        bulletinMenu.draw(ctx);
    } else if (currentEvent === EVENTS.INVENTORY || currentEvent === EVENTS.INTERACT) {
        inventoryMenu.draw(ctx);
    } else if (currentEvent === EVENTS.CRAFTING) {
        craftingMenu.draw(ctx);
    } else if (currentControls.map) {
        levels.drawMap(ctx, player);
    } else {
        drawGame(ctx);
    }

    notify.draw(ctx);
}

function update(controls, elapsedTime) {
    currentControls = controls;

    if (notify.update(controls)) {
        return;
    }

    currentEvent = events.get();
    const doEventIfRaised = doEventIfRaisedFunc(controls, currentEvent);

    doEventIfRaised('questLog', EVENTS.BULLETIN);
    doEventIfRaised('crafting', EVENTS.CRAFTING);
    doEventIfRaised('inventory', EVENTS.INVENTORY);

    currentEvent = events.get();
    const isEventUnhandled = !events.isAcknowledged();

    if (currentEvent === EVENTS.TALKING) {
        if (isEventUnhandled) {
            speech.open(player.talkingTo.getText(), ['talk']);
            events.acknowledge();
        }

        speech.update(controls, (action) => {
            events.drop();
            player.talkingTo = null;
        });
    } else if (currentEvent === EVENTS.BULLETIN) {
        if (isEventUnhandled) {
            if (player.talkingTo) {
                player.talkingTo = null;
                bulletinMenu.updateMenuItems(possibleQuests, true);
            } else {
                bulletinMenu.updateMenuItems(player.quests, false);
            }

            events.acknowledge();
        }

        bulletinMenu.update(true, controls, (questId) => {
            if (questId !== null) {
                player.quests.push(questId);
                possibleQuests.splice(questId, 1);
            }

            events.drop();
        });
    } else if (currentEvent === EVENTS.INVENTORY || currentEvent === EVENTS.INTERACT) {
        if (isEventUnhandled) {
            if (player.interactWith) {
                inventoryMenu.changeTitle('Use Item');
                inventoryMenu.updateMenuItems(player.inventory, player.entityInRange && player.entityInRange.type === 'person');
            } else {
                inventoryMenu.changeTitle('Inventory');
                inventoryMenu.updateMenuItems(player.inventory);
            }

            events.acknowledge();
        }

        inventoryMenu.update(true, controls, (itemType, action) => {
            player.addItemMenu = false;

            if (!itemType || !action) {
                events.drop();
            } else if (action === 'drop') {
                player.dropItem(itemType, action);

                events.drop();
            } else if (action === 'give') {
                if (player.giveItem(itemType)) {
                    events.drop();
                }
            } else {
                const actionSucceeded = player.useItem(itemType);

                if (actionSucceeded) {
                    events.drop();
                } else {
                    notify.alert('Nothing happens');
                }
            }
        });
    } else if (currentEvent === EVENTS.CRAFTING) {
        if (isEventUnhandled) {
            craftingMenu.updateMenuItems(player.inventory);
            events.acknowledge();
        }

        craftingMenu.update(true, controls, (itemType) => {
            if (itemType) {
                player.craftItem(itemType);

                craftingMenu.updateMenuItems(player.inventory);
            } else {
                events.drop();
            }
        });
    } else if (!controls.map) {
        hud.update(elapsedTime);

        levels.update(controls, elapsedTime, player);

        levels.cleanEntities();
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