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
import level0 from './levels/level0.js';
import { loadGame, startGame } from './utility/game.js';
import hud from './hud/hud.js';

let sprites = null;

let player = null;
let entityList = [];

let currentControls = {};

let isInventoryOpen = false;
let isCraftingOpen = false;

function draw(ctx) {
    if (isInventoryOpen) {
        inventoryMenu.draw(ctx);
    } else if (isCraftingOpen) {
        craftingMenu.draw(ctx);
    } else if (currentControls.map) {
        const MAP_GRID_SIZE = 4;
        const gridView = snapToGrid(player.x, player.y);
        gridView.x = gridView.x / GRID_SIZE * MAP_GRID_SIZE - 400;
        gridView.y = gridView.y / GRID_SIZE * MAP_GRID_SIZE - 300;

        for (let i = 0; i < entityList.length; i++) {
            const entity = entityList[i];
            const x = entity.x / GRID_SIZE * MAP_GRID_SIZE - gridView.x;
            const y = entity.y / GRID_SIZE * MAP_GRID_SIZE - gridView.y;

            ctx.fillStyle = entity.color || '#ffffff';
            ctx.fillRect(x, y, MAP_GRID_SIZE, MAP_GRID_SIZE);
        }
    } else {
        let viewX = player.x - VIEW_WIDTH / 2 + player.rect.width / 2;
        let viewY = player.y - VIEW_HEIGHT / 2 + player.rect.height / 2;

        for (let i = 0; i < entityList.length; i++) {
            entityList[i].draw(ctx, viewX, viewY, player);
        }

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
                entityList.push(droppedItem);
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

        for (let i = 0; i < entityList.length; i++) {
            entityList[i].update(controls, entityList, elapsedTime, player);
        }
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
        x: 0,
        y: 0,
    });
    entityList.push(player);

    entityList = entityList.concat(load(level0));

    startGame(update, draw);
});