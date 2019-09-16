import { VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';

const controlMap = {
    'KeyW': 'moveUp',
    'KeyS': 'moveDown',
    'KeyA': 'moveLeft',
    'KeyD': 'moveRight',
    'KeyE': 'interact',
    'KeyI': 'inventory',
    'KeyC': 'crafting',
    'KeyM': 'map',
    'Space': 'attack',
    'Escape': 'escape',
    'KeyV': 'showDevInfo',
    'KeyP': 'save',
    'Period': 'load',
    'KeyO': 'storeData',
    'KeyQ': 'questLog',
};

const friendlyKeyMap = {
    'KeyW': 'W',
    'KeyS': 'S',
    'KeyA': 'A',
    'KeyD': 'D',
    'KeyE': 'E',
    'KeyI': 'I',
    'KeyM': 'M',
    'Space': 'Spacebar',
    'Escape': 'Escape',
    'KeyV': 'V',
    'KeyC': 'C',
    'KeyP': 'P',
    'Period': 'Period',
    'KeyO': 'O',
    'KeyQ': 'Q',
};

export const controlsToString = () => {
    let controls = '';
    for (let control in controlMap) {
        controls += `<p>${friendlyKeyMap[control]}: ${controlMap[control]},</p>`;
    }
    return controls;
};

export const getControls = (buttonsPressed, mouse) => {
    const controls = {};
    for (let button in buttonsPressed) {
        controls[controlMap[button]] = buttonsPressed[button];
    }

    if (mouse.leftClick) {
        controls.leftClick = true;
    }

    controls.mouseX = mouse.x;
    controls.mouseY = mouse.y;

    return controls;
};

export const freshPress = (controls, key) => {
    return controls[key] && !controls.previousControls[key];
};

export const nonePressed = (controls, keys) => {
    const anyPressed = keys.find(key => controls[key]);
    return !anyPressed;
};

export const getMouseRelativeToPlayer = (controls, player) => {
    const roomX = player.x + player.rect.width / 2 - VIEW_WIDTH / 2;
    const roomY = player.y + player.rect.height / 2 - VIEW_HEIGHT / 2;

    const mouseX = controls.mouseX + roomX;
    const mouseY = controls.mouseY + roomY;

    return {
        x: mouseX,
        y: mouseY,
    };
};