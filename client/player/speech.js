import { VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';
import { DEFAULT_BORDER_COLOR, drawBorder, drawBorderedText, drawRect, drawText } from '../utility/draw-utility.js';
import actionMenu from '../utility/action-menu.js';

const V_PADDING = 10;
const H_PADDING = 10;
const CURSOR_WIDTH = 30;
const LINE_HEIGHT = 30;
const SPEECH_BORDER = 5;

export const SPEECH_HEIGHT = SPEECH_BORDER * 2 + V_PADDING * 3 + LINE_HEIGHT * 2;
const SPEECH_Y_POSITION = VIEW_HEIGHT - SPEECH_HEIGHT;

const CURSOR_X = VIEW_WIDTH - SPEECH_BORDER - H_PADDING - CURSOR_WIDTH;
const CURSOR_Y = VIEW_HEIGHT - SPEECH_BORDER - V_PADDING - CURSOR_WIDTH;

let textToShow = [];
let textIndex = 0;
let isOpen = false;
let cursorImage = null;
let usingActionMenu = false;

export default {
    initialize: (sprites) => {
        cursorImage = sprites['arrow'];

        actionMenu.initialize(sprites);
    },
    open: (text, actions) => {
        textIndex = 0;
        textToShow = text;
        isOpen = true;

        if (actions) {
            usingActionMenu = true;
            actionMenu.changeActions(actions);
        } else {
            usingActionMenu = false;
        }
    },
    update: (controls, closeCallback) => {
        if (!isOpen) return;

        const actionsOpen = actionMenu.update(controls, (action) => {
            isOpen = false;
            closeCallback(action);
        });

        if (!actionsOpen && controls.interact && !controls.previousControls.interact) {
            textIndex += 2;

            if (textIndex >= textToShow.length) {

                if (usingActionMenu) {
                    actionMenu.open();
                } else {
                    isOpen = false;
                    closeCallback();
                }
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

        actionMenu.draw(ctx);
    },
};