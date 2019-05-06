import playerFactory from './player/player.js';
import monsterFactory from './entity/monsters/monster.js';
import { snapToGrid } from './utility/physics.js';
import { GRID_SIZE, HP_BAR_HEIGHT, VIEW_HEIGHT, VIEW_WIDTH } from './constants.js';
import monster from './entity/monsters/monster.js';
import { chasePlayer, chasePlayerIfClose, moveRandom, standStill } from './entity/monsters/behaviors.js';
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
}

function update(controls, elapsedTime) {
    currentControls = controls;

    if (player.isTalking) {
        speech.open(['Hello!', 'My dialogue has 3 lines.', 'See?']);

        speech.update(controls, () => {
            player.isTalking = false;
        });

        return;
    }

    if (controls.inventory && !controls.previousControls.inventory) {
        isInventoryOpen = !isInventoryOpen;
        isCraftingOpen = false;

        inventoryMenu.updateMenuItems(player.inventory);
    }

    if (player.addItemMenu) {
        isInventoryOpen = true;
        isCraftingOpen = false;

        inventoryMenu.updateMenuItems(player.inventory);
    }

    if (controls.crafting  && !controls.previousControls.crafting) {
        isCraftingOpen = !isCraftingOpen;
        isInventoryOpen = false;

        craftingMenu.updateMenuItems(player.inventory);
    }

    if (isInventoryOpen) {
        inventoryMenu.update(true, controls, (itemType, action) => {
            isInventoryOpen = false;
            player.addItemMenu = false;

            if (!itemType) return;

            const droppedItem = player.useItem(itemType, action);
            if (droppedItem) {
                levels.createEntity(droppedItem);
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