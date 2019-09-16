import { isInsideRect } from '../utility/physics.js';

export const START_CLICK = 'startClick';
export const HOLD_CLICK = 'holdClick';
export const CLICKED = 'clicked';
export const HOVER = 'hover';
export const NONE = 'none';

export const getMouseOnState = (controls, x, y, width, height) => {
    if (isInsideRect(controls.mouseX, controls.mouseY, { width, height }, x, y)) {
        if (controls.leftClick)
            return controls.previousControls.leftClick ? HOLD_CLICK : START_CLICK;

        if (controls.previousControls.leftClick)
            return CLICKED;

        return HOVER;
    }

    return NONE;
};

export default (options) => {
    const {
        x,
        y,
        width,
        height,
    } = options;

    let state = NONE;
    let isClickStarting = false;

    return {
        x: x,
        y: y,
        getState: () => state,
        update: (controls) => {
            state = getMouseOnState(controls, x, y, width, height);

            if (state === START_CLICK) {
                isClickStarting = true;
            } else if (!isClickStarting && (state === CLICKED || state === HOLD_CLICK)) {
                state = NONE;
            }

            return state;
        },
    }
}