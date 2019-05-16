import {
    drawBorderedText,
    getDimensions,
} from './draw-utility.js';

let alertText = null;
let drawOptions = null;

export default {
    alert: (text) => {
        alertText = text;

        drawOptions = null;
    },
    draw: (ctx) => {
        if (alertText) {
            if (!drawOptions) {
                drawOptions = getDimensions(ctx, alertText, { isBoxCentered: true });
            }

            drawBorderedText(ctx, alertText, {
                isBoxCentered: true,
                ...drawOptions
            });
        }
    },
    update: (controls) => {
        if (alertText) {
            if (controls.interact && !controls.previousControls.interact ||
                controls.escape && !controls.previousControls.escape) {

                alertText = null;
            }

            return true;
        }

        return false;
    },
}