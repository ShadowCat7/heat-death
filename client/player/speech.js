import { VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';
import { drawRect } from '../draw-utility.js';

const V_PADDING = 10;
const H_PADDING = 10;
const CURSOR_WIDTH = 30;
const LINE_HEIGHT = 30;
const SPEECH_BORDER = 5;

const SPEECH_HEIGHT = SPEECH_BORDER * 2 + V_PADDING * 3 + LINE_HEIGHT * 2;
const SPEECH_Y_POSITION = VIEW_HEIGHT - SPEECH_HEIGHT;

const TEXT_X = SPEECH_BORDER + H_PADDING;
const TEXT_Y = SPEECH_Y_POSITION + SPEECH_BORDER + V_PADDING;

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

            if (textIndex > textToShow.length) {
                isOpen = false;
                textIndex = 0;
                closeCallback();
            }
        }
    },
    draw: (ctx) => {
        if (!isOpen) return;

        drawRect(ctx, {
            width: VIEW_WIDTH,
            height: SPEECH_HEIGHT,
        }, 0, SPEECH_Y_POSITION, '#fff');

        drawRect(ctx, {
            width: VIEW_WIDTH - SPEECH_BORDER * 2,
            height: SPEECH_HEIGHT - SPEECH_BORDER * 2,
        }, SPEECH_BORDER, SPEECH_Y_POSITION + SPEECH_BORDER, '#000');

        ctx.font = '30px Arial';
        ctx.fillStyle = '#e0e0e0';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        ctx.fillText(textToShow[textIndex], TEXT_X, TEXT_Y);
        ctx.fillText(textToShow[textIndex + 1] || '', TEXT_X, TEXT_Y + LINE_HEIGHT + V_PADDING);

        if (textIndex + 1 < textToShow.length) {
            ctx.drawImage(cursorImage, CURSOR_X, CURSOR_Y);
        } else {
            drawRect(ctx, {
                width: CURSOR_WIDTH,
                height: CURSOR_WIDTH,
            }, CURSOR_X, CURSOR_Y);
        }
    },
};