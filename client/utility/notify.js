import {
    CENTER_BOX_ALIGN,
    drawBorderedText,
    getDimensions, MIDDLE_BOX_ALIGN,
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
                drawOptions = getDimensions(ctx, alertText, {
                    horizontalBoxAlign: CENTER_BOX_ALIGN,
                    verticalBoxAlign: MIDDLE_BOX_ALIGN,
                });
            }

            drawBorderedText(ctx, alertText, drawOptions);
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