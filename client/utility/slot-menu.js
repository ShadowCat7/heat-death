import { VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';
import {
    DEFAULT_LINE_HEIGHT,
    DEFAULT_PADDING,
    drawText,
    fillScreen,
} from './draw-utility.js';

import actionMenu, { CANCEL } from './action-menu.js';

const CURSOR_WIDTH = 30;
const H_TEXT_PADDING = DEFAULT_PADDING * 2 + CURSOR_WIDTH;
const STARTING_LINE = DEFAULT_PADDING * 2 + DEFAULT_LINE_HEIGHT;
const LINE_COUNT = Math.floor((VIEW_HEIGHT - STARTING_LINE) / (DEFAULT_LINE_HEIGHT + DEFAULT_PADDING));

export default({
   items,
   title,
   cursorImage,
}) => {
    let cursorPosition = 0;
    let cursorShown = false;
    let titleText = title;

    return {
        changeTitle: (title) => {
            titleText = title;
        },
        changeItems: (newItems) => {
            items = newItems;
        },
        draw: (ctx) => {
            fillScreen(ctx, '#000000aa');

            drawText(ctx, titleText, VIEW_WIDTH / 2, DEFAULT_PADDING, { textAlign: 'center' });

            const itemLabels = items.map(item => item.label);
            drawText(ctx, itemLabels.slice(0, LINE_COUNT), H_TEXT_PADDING, STARTING_LINE);
            drawText(ctx, itemLabels.slice(LINE_COUNT, LINE_COUNT * 2), H_TEXT_PADDING + VIEW_WIDTH / 2, STARTING_LINE);

            if (cursorShown) {
                let xPosition = DEFAULT_PADDING;
                let yPosition = cursorPosition;

                if (cursorPosition >= LINE_COUNT) {
                    yPosition -= LINE_COUNT;
                    xPosition += VIEW_WIDTH / 2;
                }

                ctx.drawImage(cursorImage, xPosition, DEFAULT_PADDING + (DEFAULT_PADDING + DEFAULT_LINE_HEIGHT) * (yPosition + 1) - 2);

                actionMenu.draw(ctx);
            }
        },
        update: (showCursor, controls, chooseCallback) => {
            cursorShown = showCursor;

            const isActionMenuOpen = actionMenu.update(controls, (action) => {
                if (action !== CANCEL) {
                    chooseCallback(items[cursorPosition].id, action);
                }
            });

            if (isActionMenuOpen) return;

            if (cursorShown) {
                if (controls.moveUp && !controls.previousControls.moveUp) {
                    cursorPosition--;
                } else if (controls.moveDown && !controls.previousControls.moveDown) {
                    cursorPosition++;
                }

                if (controls.moveRight && !controls.previousControls.moveRight && items.length > LINE_COUNT) {
                    cursorPosition += LINE_COUNT;
                } else if (controls.moveLeft && !controls.previousControls.moveLeft && items.length > LINE_COUNT) {
                    cursorPosition -= LINE_COUNT;
                }

                if (controls.escape && !controls.previousControls.escape) {
                    chooseCallback(null);
                }

                if (controls.interact && !controls.previousControls.interact) {
                    const item = items[cursorPosition];
                    if (item.actions) {
                        actionMenu.changeActions(item.actions);
                        actionMenu.open();
                    } else {
                        chooseCallback(items[cursorPosition].id);
                    }
                }

                cursorPosition = Math.max(cursorPosition, 0);
                cursorPosition = Math.min(cursorPosition, items.length - 1);
            }
        },
    };
};