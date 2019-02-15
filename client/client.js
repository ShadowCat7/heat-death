import playerFactory from './player/player.js';
import { snapToGrid } from './physics.js';
import { GRID_SIZE, VIEW_HEIGHT, VIEW_WIDTH } from './constants.js';
import monster from './entity/monsters/monster.js';
import { chasePlayer, chasePlayerIfClose, moveRandom, standStill } from './entity/monsters/behaviors.js';
import createMenu from './menu.js';
import load from './load.js';
import level0 from './levels/level0.js';

import { loadGame, startGame } from './game.js';

let sprites = null;

let player = null;
let entityList = [];

let currentControls = {};

let inventoryMenu = null;
let isInventoryOpen = false;

function draw(ctx) {
    if (currentControls.inventory) {
        inventoryMenu.draw(ctx, player);
    } else if (player.addItemMenu) {
        inventoryMenu.draw(ctx, player);
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

        // player health bar
        ctx.fillStyle = '#909090';
        ctx.fillRect(0, 0, VIEW_WIDTH, 21);

        ctx.fillStyle = 'green';
        ctx.fillRect(3, 3, player.health / 1000 * (VIEW_WIDTH - 6), 15);

        ctx.font = '12px Arial';
        ctx.fillStyle = '#eee';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`${player.health}/1000`, VIEW_WIDTH / 2, 6);
    }
}

function update(controls, elapsedTime) {
    currentControls = controls;

    if (controls.inventory && !controls.previousControls.inventory) {
        isInventoryOpen = !isInventoryOpen;
    } else {
        isInventoryOpen = player.addItemMenu;
    }

    if (!isInventoryOpen && !controls.map) {
        for (let i = 0; i < entityList.length; i++) {
            entityList[i].update(controls, entityList, elapsedTime, player);
        }
    } else if (isInventoryOpen) {
        const inventory = [];

        for (let itemType in player.inventory) {
            const itemCount = player.inventory[itemType];

            inventory.push({
                label: `${itemType}: ${itemCount}`,
                id: itemType,
                //actions: [
                //    'use',
                //    'drop',
                //],
            });
        }

        inventoryMenu.changeItems(inventory);

        inventoryMenu.update(true, controls, (itemType) => {
            player.addItemToFire(itemType);
            player.addItemMenu = false;
        });
    }
}

loadGame((images) => {
    sprites = images;

    inventoryMenu = createMenu({
        items: [],
        title: 'Inventory',
        cursorImage: sprites['arrow'],
    });

    player = playerFactory.create({
        x: 0,
        y: 0,
    });
    entityList.push(player);

    entityList = entityList.concat(load(level0));

    startGame(update, draw);
});