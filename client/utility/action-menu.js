import {
    BOTTOM_BOX_ALIGN,
    RIGHT_BOX_ALIGN,
    drawBorderedText,
    getDimensions, DEFAULT_BORDER_WIDTH, DEFAULT_PADDING, DEFAULT_LINE_HEIGHT,
} from './draw-utility.js';

import { SPEECH_HEIGHT } from '../player/speech.js';

const CURSOR_WIDTH = 30;
const CURSOR_PADDING = DEFAULT_BORDER_WIDTH + DEFAULT_PADDING;

const CANCEL = 'cancel';

let cursorImage = null;
let isOpen = false;
let actions = [];
let cursorPosition = 0;
let drawOptions = null;

export default {
    initialize: (sprites) => {
        cursorImage = sprites['arrow'];
    },
    changeActions: (actionMenuChoices) => {
        actions = actionMenuChoices.concat(CANCEL);
    },
    open: () => {
        isOpen = true;
        cursorPosition = 0;
    },
    update: (controls, closeCallback) => {
        if (!isOpen) return false;

        if (controls.escape) {
            closeCallback(CANCEL);
            return false;
        }

        if (controls.moveUp && !controls.previousControls.moveUp) {
            cursorPosition--;
            cursorPosition = Math.max(cursorPosition, 0);
        } else if (controls.moveDown && !controls.previousControls.moveDown) {
            cursorPosition++;
            cursorPosition = Math.min(cursorPosition, actions.length - 1);
        }

        if (controls.interact && !controls.previousControls.interact) {
            isOpen = false;
            closeCallback(actions[cursorPosition]);
        }

        return true;
    },
    draw: (ctx) => {
        if (!isOpen) return;

        if (!drawOptions) {
            drawOptions = getDimensions(ctx, actions, {
                y: -SPEECH_HEIGHT + DEFAULT_BORDER_WIDTH,
                horizontalBoxAlign: RIGHT_BOX_ALIGN,
                verticalBoxAlign: BOTTOM_BOX_ALIGN,
                leftPadding: CURSOR_WIDTH + DEFAULT_PADDING * 2,
            });
        }

        drawBorderedText(ctx, actions, drawOptions);

        const cursorY = drawOptions.y + CURSOR_PADDING + (DEFAULT_LINE_HEIGHT + DEFAULT_PADDING) * cursorPosition;

        ctx.drawImage(cursorImage, drawOptions.x + CURSOR_PADDING, cursorY);
    },
};