import { VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';
import { DEFAULT_BORDER_COLOR, drawBorder, drawBorderedText, drawRect, drawText } from '../utility/draw-utility.js';

const V_PADDING = 10;
const H_PADDING = 10;
const CURSOR_WIDTH = 30;
const LINE_HEIGHT = 30;
const SPEECH_BORDER = 5;

const SPEECH_HEIGHT = SPEECH_BORDER * 2 + V_PADDING * 3 + LINE_HEIGHT * 2;
const SPEECH_Y_POSITION = VIEW_HEIGHT - SPEECH_HEIGHT;

const CURSOR_X = VIEW_WIDTH - SPEECH_BORDER - H_PADDING - CURSOR_WIDTH;
const CURSOR_Y = VIEW_HEIGHT - SPEECH_BORDER - V_PADDING - CURSOR_WIDTH;

let textToShow = [];
let textIndex = 0;
let isOpen = false;
let cursorImage = null;

export default {
    initialize: (sprites) => {
        cursorImage = sprites['arrow'];
    },
    open: (text) => {
        textToShow = text;
        isOpen = true;
    },
    update: (controls, closeCallback) => {
        if (!isOpen) return;

        if (controls.interact && !controls.previousControls.interact) {
            textIndex += 2;

            if (textIndex >= textToShow.length) {
                isOpen = false;
                textIndex = 0;
                closeCallback();
            }
        }
    },
    draw: (ctx) => {
        if (!isOpen) return;

        drawBorderedText(ctx, textToShow.slice(textIndex, textIndex + 2), {
            x: 0,
            y: SPEECH_Y_POSITION,
            width: VIEW_WIDTH,
            height: SPEECH_HEIGHT,
        });

        if (textIndex + 2 < textToShow.length) {
            ctx.drawImage(cursorImage, CURSOR_X, CURSOR_Y);
        } else {
            drawRect(ctx, {
                width: CURSOR_WIDTH,
                height: CURSOR_WIDTH,
            }, CURSOR_X, CURSOR_Y, DEFAULT_BORDER_COLOR);
        }
    },
};