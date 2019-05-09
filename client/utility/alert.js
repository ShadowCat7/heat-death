import { DEFAULT_BORDER_WIDTH, DEFAULT_LINE_HEIGHT, DEFAULT_PADDING, drawBorderedText } from './draw-utility.js';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';

const ALERT_WIDTH = 400;
const ALERT_HEIGHT = DEFAULT_BORDER_WIDTH * 2 + DEFAULT_PADDING * 2 + DEFAULT_LINE_HEIGHT;
const ALERT_X = VIEW_WIDTH / 2 - ALERT_WIDTH / 2;
const ALERT_Y = VIEW_HEIGHT / 2 - ALERT_HEIGHT / 2;

let alertText = null;

export default {
    alert: (text) => {
        alertText = text;
    },
    draw: (ctx) => {
        if (alertText) {
            drawBorderedText(ctx, alertText, {
                x: ALERT_X,
                y: ALERT_Y,
                width: ALERT_WIDTH,
            });
        }
    },
    update: (controls) => {
        if (alertText && (
            controls.interact && !controls.previousControls.interact ||
            controls.escape && !controls.previousControls.escape)) {

            alertText = null;
            return true;
        }

        return false;
    },
}