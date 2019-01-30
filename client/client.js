import engineFactory from './engine.js';
import playerFactory from './player/player.js';
import block from './entity/block.js';
import item from './entity/item.js';
import fire from './entity/fire.js';
import tree from './entity/tree.js';
import { snapToGrid } from './physics.js';
import { GRID_SIZE } from './constants.js';
import monster from './entity/monsters/monster.js';
import { chasePlayer, chasePlayerIfClose, moveRandom, standStill } from './entity/monsters/behaviors.js';
import createMenu from './menu.js';

import loadImages from './image-loader.js';
import spriteData from './sprite.js';

let canvas = null;
let fpsLabel = null;
let engine = null;
let previousControls = {};
let spriteSheet = null;
let sprites = null;

let player = null;
const entityList = [];

let controls = {};

let inventoryMenu = null;

function draw() {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fpsLabel.innerHTML = Math.round(engine.fps);

    if (controls.inventory) {
        inventoryMenu.draw(ctx, player);
    } else if (player.addItemMenu) {
        inventoryMenu.draw(ctx, player);
    } else if (controls.map) {
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
        for (let i = 0; i < entityList.length; i++) {
            entityList[i].draw(ctx, player.x - 400 + 15, player.y - 300 + 15, player);
        }
    }
}

function update(buttonsPressed, elapsedTime) {
    controls = {};

    // w
    if (buttonsPressed[87]) {
        controls.moveUp = true;
    }
    // s
    if (buttonsPressed[83]) {
        controls.moveDown = true;
    }
    // a
    if (buttonsPressed[65]) {
        controls.moveLeft = true;
    }
    // d
    if (buttonsPressed[68]) {
        controls.moveRight = true;
    }
    // shift
    if (buttonsPressed[16]) {
        controls.shift = true;
    }
    // e
    if (buttonsPressed[69]) {
        controls.interact = true;
    }
    // i
    if (buttonsPressed[73]) {
        controls.inventory = true;
    }
    // m
    if (buttonsPressed[77]) {
        controls.map = true;
    }
    // spacebar
    if (buttonsPressed[32]) {
        controls.attack = true;
    }
    // escape
    if (buttonsPressed[27]) {
        controls.escape = true;
    }

    controls.previousControls = previousControls;

    if (!controls.inventory && !controls.map && !player.addItemMenu) {
        for (let i = 0; i < entityList.length; i++) {
            entityList[i].update(controls, entityList, elapsedTime, player);
        }
    } else if (player.addItemMenu || controls.inventory) {
        const inventory = [];

        for (let itemType in player.inventory) {
            const itemCount = player.inventory[itemType];

            inventory.push({
                label: `${itemType}: ${itemCount}`,
                id: itemType,
            });
        }

        inventoryMenu.changeItems(inventory);

        inventoryMenu.update(player.addItemMenu, controls, (itemType) => {
            player.addItemToFire(itemType);
            player.addItemMenu = false;
        });
    }

    previousControls = controls;
}

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('game');
    fpsLabel = document.getElementById('fps');
    spriteSheet = document.getElementById('sprite');
    spriteSheet.src = spriteData.sprite;

    engine = engineFactory.create(canvas, update, draw);

    new Promise(loadImages).then((images) => {
        sprites = images;

        engine.start();

        inventoryMenu = createMenu({
            items: [],
            title: 'Inventory',
            cursorImage: sprites['arrow'],
        });

        player = playerFactory.create({
            x: -120,
            y: -120,
        });
        entityList.push(player);

        entityList.push(monster.create({
            x: -40,
            y: -40,
            behavior: chasePlayerIfClose,
        }));

        entityList.push(block.create({
            x: 40,
            y: 40,
        }));

        entityList.push(block.create({
            x: 80,
            y: 40,
        }));

        entityList.push(block.create({
            x: 40,
            y: 120,
        }));
        entityList.push(block.create({
            x: 80,
            y: 120,
        }));

        entityList.push(block.create({
            x: 400,
            y: 400,
        }));

        entityList.push(block.create({
            x: 400,
            y: 440,
        }));

        entityList.push(block.create({
            x: 480,
            y: 400,
        }));

        entityList.push(block.create({
            x: 480,
            y: 440,
        }));

        entityList.push(item.create({
            x: 360,
            y: 360,
            itemType: 'wood',
        }));

        entityList.push(fire.create({
            x: 400,
            y: 40,
        }));

        entityList.push(tree.create({
            x: 520,
            y: 40,
        }));
    });
});
