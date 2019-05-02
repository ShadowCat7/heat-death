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
    'KeyP': 'P',
    'KeyC': 'C',
};

export const controlsToString = () => {
    let controls = '';
    for (let control in controlMap) {
        controls += `<p>${friendlyKeyMap[control]}: ${controlMap[control]},</p>`;
    }
    return controls;
};

export const getControls = (buttonsPressed) => {
    const controls = {};
    for (let button in buttonsPressed) {
        controls[controlMap[button]] = buttonsPressed[button];
    }

    return controls;
};