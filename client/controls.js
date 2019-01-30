const controlMap = {
    'KeyW': 'moveUp',
    'KeyS': 'moveDown',
    'KeyA': 'moveLeft',
    'KeyD': 'moveRight',
    'KeyE': 'interact',
    'KeyI': 'inventory',
    'KeyM': 'map',
    'Space': 'attack',
    'Escape': 'escape',
    'KeyV': 'showDevInfo',
};

export const controlsToString = () => {
    let controls = '';
    for (let control in controlMap) {
        controls += `<p>${control}: ${controlMap[control]},</p>`;
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