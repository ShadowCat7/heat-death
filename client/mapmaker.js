import { snapToGrid } from './physics.js';
import { GRID_SIZE, VIEW_HEIGHT, VIEW_WIDTH } from './constants.js';

import block from './entity/block.js';
import item from './entity/item.js';
import fire from './entity/fire.js';
import tree from './entity/tree.js';
import clickableFactory from './map-making/click-element.js';

import { loadGame, startGame } from './game.js';
import { drawLine, drawRect } from './draw-utility.js';
import save from './map-making/save.js';
import playerFactory from './player/player.js';

let sprites = null;

const entityMap = {};
const clickElements = [];

let currentControls = {};

let cameraX = 0;
let cameraY = 0;
const CAMERA_MAX_SPEED = 300;

let leftMouseClick = false;
let rightMouseClick = false;
let mouseX = 0;
let mouseY = 0;

let selectedElement = null;

const PANEL_PAD = 10;
const PANEL_WIDTH = GRID_SIZE * 2 + PANEL_PAD * 3;

const player = playerFactory.create({
    x: 0,
    y: 0,
});

const entityTypeMap = {
    'block': block.create,
    'fire': fire.create,
    'item': item.create,
    'tree': tree.create,
};

function draw(ctx) {
    if (currentControls.map) {
        const MAP_GRID_SIZE = 4;
        const gridView = snapToGrid(cameraX, cameraY);
        gridView.x = gridView.x / GRID_SIZE * MAP_GRID_SIZE - 400;
        gridView.y = gridView.y / GRID_SIZE * MAP_GRID_SIZE - 300;

        for (let coordinates in entityMap) {
            const entity = entityMap[coordinates];
            const x = entity.x / GRID_SIZE * MAP_GRID_SIZE - gridView.x;
            const y = entity.y / GRID_SIZE * MAP_GRID_SIZE - gridView.y;

            ctx.fillStyle = entity.color || '#ffffff';
            ctx.fillRect(x, y, MAP_GRID_SIZE, MAP_GRID_SIZE);
        }
    } else {
        const startingGridLine = snapToGrid(cameraX, cameraY);

        // draw grid lines
        for (let i = 0; i <= VIEW_WIDTH; i += GRID_SIZE) {
            const x = startingGridLine.x - cameraX + i
            drawLine(ctx, x, 0, x, VIEW_HEIGHT, '#aaa');
        }

        for (let i = 0; i <= VIEW_HEIGHT; i += GRID_SIZE) {
            const y = startingGridLine.y - cameraY + i;
            drawLine(ctx, 0, y, VIEW_WIDTH, y, '#aaa');
        }

        player.draw(ctx, cameraX, cameraY);

        for (let coordinates in entityMap) {
            entityMap[coordinates].draw(ctx, cameraX, cameraY);
        }

        if (selectedElement) {
            selectedElement.draw(ctx, 0, 0);
        }

        drawRect(ctx, { width: PANEL_WIDTH, height: VIEW_HEIGHT }, 0, 0, '#ddd');

        for (let i = 0; i < clickElements.length; i++) {
            clickElements[i].draw(ctx);
        }

        ctx.font = '12px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        const x = Math.floor((mouseX + cameraX) / GRID_SIZE) * GRID_SIZE;
        const y = Math.floor((mouseY + cameraY) / GRID_SIZE) * GRID_SIZE;
        ctx.fillText(`${x}, ${y}`, 5, VIEW_HEIGHT);
    }
}

function update(controls, elapsedTime) {
    currentControls = controls;

    let newX = 0;
    let newY = 0;

    if (controls.moveUp) {
        newY -= elapsedTime * CAMERA_MAX_SPEED;
    }
    if (controls.moveDown) {
        newY += elapsedTime * CAMERA_MAX_SPEED;
    }
    if (controls.moveLeft) {
        newX -= elapsedTime * CAMERA_MAX_SPEED;
    }
    if (controls.moveRight) {
        newX += elapsedTime * CAMERA_MAX_SPEED;
    }

    cameraX += newX;
    cameraY += newY;

    if (controls.save && !controls.previousControls.save) {
        save(entityMap);
    }

    for (let i = 0; i < clickElements.length; i++) {
        const selected = clickElements[i].update({
            leftMouseClick,
            rightMouseClick,
            x: mouseX,
            y: mouseY,
        });

        if (selected) {
            selectedElement = entityTypeMap[clickElements[i].type]({});
        }
    }

    if (selectedElement) {
        selectedElement.x = mouseX - selectedElement.rect.width / 2;
        selectedElement.y = mouseY - selectedElement.rect.height / 2;
    }

    if (selectedElement &&
        mouseX > PANEL_WIDTH &&
        mouseX < VIEW_WIDTH &&
        mouseY > 0 &&
        mouseY < VIEW_HEIGHT) {

        const x = Math.floor((mouseX + cameraX) / GRID_SIZE) * GRID_SIZE;
        const y = Math.floor((mouseY + cameraY) / GRID_SIZE) * GRID_SIZE;
        const coordinate = `x${x}y${y}`;

        if (leftMouseClick) {
            entityMap[coordinate] = entityTypeMap[selectedElement.type]({
                x,
                y,
            });
        } else if (rightMouseClick) {
            delete entityMap[coordinate];
        }
    }
}

loadGame((images) => {
    sprites = images;

    let x = PANEL_PAD;
    let y = PANEL_PAD;
    for (let entityType in entityTypeMap) {
        clickElements.push(clickableFactory.create({
            x,
            y,
            entity: entityTypeMap[entityType]({}),
        }));

        if (x === PANEL_PAD * 2 + GRID_SIZE) {
            x = PANEL_PAD;
            y += PANEL_PAD + GRID_SIZE;
        } else {
            x += PANEL_PAD + GRID_SIZE;
        }
    }

    clickElements.push(clickableFactory.create({
        x: 10,
        y: 10,
        entity: block.create({}),
    }));

    clickElements.push(clickableFactory.create({
        x: 60,
        y: 10,
        entity: fire.create({}),
    }));

    const canvas = document.getElementById('game');

    canvas.onmousedown = (e) => {
        e.stopPropagation();
        e.preventDefault();

        leftMouseClick = e.button === 0;
        rightMouseClick = e.button === 2;
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    canvas.onmouseup = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (e.button === 0) {
            leftMouseClick = false;
        } else if (e.button === 2) {
            rightMouseClick = false;
        }

        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    document.onmousemove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    startGame(update, draw);
});