import clickElementFactory, { NONE, START_CLICK } from './click-element.js';
import { distance } from '../utility/physics.js';

export const DRAG = 'drag';
export const DROPPED = 'dropped';

export default (options) => {
    const {
        width,
        height,
    } = options;

    let x = options.x;
    let y = options.y;

    let state = NONE;
    const clickElement = clickElementFactory(options);
    let isClickStarting = false;
    let isDragging = false;

    return {
        x: options.x,
        y: options.y,
        getDragPosition: () => {
            return { x, y };
        },
        getState: () => state,
        update: (controls) => {
            let newState = clickElement.update(controls);

            if (newState === START_CLICK) {
                isClickStarting = true;
            } else if (isClickStarting && controls.leftClick) {
                if (isDragging
                    || distance(controls.mouseX, controls.mouseY, options.x + width / 2, options.y + height / 2) > 30) {

                    x = controls.mouseX;
                    y = controls.mouseY;
                    isDragging = true;
                    newState = DRAG;
                }
            } else {
                if (isDragging) {
                    newState = DROPPED;
                }

                isDragging = false;
                isClickStarting = false;
            }

            state = newState;
            return state;
        },
    }
}