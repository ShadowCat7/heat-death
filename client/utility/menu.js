import { VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';
import {
    DEFAULT_BORDER_WIDTH,
    DEFAULT_LINE_HEIGHT,
    DEFAULT_PADDING,
    DEFAULT_TEXT_COLOR,
    drawBorderedText,
    drawText,
} from './draw-utility.js';

const CURSOR_WIDTH = 30;
const H_TEXT_PADDING = DEFAULT_PADDING * 2 + CURSOR_WIDTH;
const STARTING_LINE = DEFAULT_PADDING * 2 + DEFAULT_LINE_HEIGHT;
const LINE_COUNT = Math.floor((VIEW_HEIGHT - STARTING_LINE) / (DEFAULT_LINE_HEIGHT + DEFAULT_PADDING));

const ACTION_MENU_WIDTH = 200;
const ACTION_MENU_TOTAL_WIDTH = ACTION_MENU_WIDTH + DEFAULT_BORDER_WIDTH * 2 + H_TEXT_PADDING + DEFAULT_PADDING;
const ACTION_MENU_X = VIEW_WIDTH - ACTION_MENU_TOTAL_WIDTH;

const DISABLED_TEXT_COLOR = '#777';

const CANCEL_TEXT = 'cancel';

export default({
    items,
    title,
    cursorImage,
}) => {
    let cursorPosition = 0;
    let cursorActionPosition = 0;
    let cursorShown = false;
    let isActionsOpen = false;
    let titleText = title;

    return {
        changeTitle: (title) => {
            titleText = title;
        },
        changeItems: (newItems) => {
            items = newItems;
        },
        draw: (ctx) => {
            drawText(ctx, titleText, VIEW_WIDTH / 2, DEFAULT_PADDING, { textAlign: 'center' });

            const itemLabels = items.map(item => item.label);
            drawText(ctx, itemLabels.slice(0, LINE_COUNT), H_TEXT_PADDING, STARTING_LINE);
            drawText(ctx, itemLabels.slice(LINE_COUNT, LINE_COUNT * 2), H_TEXT_PADDING + VIEW_WIDTH / 2, STARTING_LINE);

            if (cursorShown) {
                if (isActionsOpen) {
                    const item = items[cursorPosition];
                    const actions = item.actions;
                    const height = (actions.length + 1) * (DEFAULT_LINE_HEIGHT + DEFAULT_PADDING) + DEFAULT_PADDING * 2;
                    const actionMenuY = VIEW_HEIGHT - height;

                    drawBorderedText(ctx, actions.concat([]), {
                        x: VIEW_WIDTH - ACTION_MENU_TOTAL_WIDTH,
                        y: actionMenuY,
                        width: ACTION_MENU_TOTAL_WIDTH,
                        height,
                        leftPadding: H_TEXT_PADDING,
                        textColor: item.disabled ? DISABLED_TEXT_COLOR : DEFAULT_TEXT_COLOR,
                    });

                    drawText(ctx, CANCEL_TEXT,
                        ACTION_MENU_X + DEFAULT_BORDER_WIDTH + H_TEXT_PADDING,
                        VIEW_HEIGHT - (DEFAULT_PADDING + DEFAULT_LINE_HEIGHT + DEFAULT_BORDER_WIDTH)
                    );

                    const cursorX = ACTION_MENU_X + DEFAULT_BORDER_WIDTH + DEFAULT_PADDING;
                    const cursorY = actionMenuY + DEFAULT_BORDER_WIDTH + DEFAULT_PADDING + (DEFAULT_PADDING + DEFAULT_LINE_HEIGHT) * cursorActionPosition;
                    ctx.drawImage(cursorImage, cursorX, cursorY);
                }

                let xPosition = DEFAULT_PADDING;
                let yPosition = cursorPosition;

                if (cursorPosition >= LINE_COUNT) {
                    yPosition -= LINE_COUNT;
                    xPosition += VIEW_WIDTH / 2;
                }

                ctx.drawImage(cursorImage, xPosition, DEFAULT_PADDING + (DEFAULT_PADDING + DEFAULT_LINE_HEIGHT) * (yPosition + 1) - 2);
            }
        },
        update: (showCursor, controls, chooseCallback) => {
            cursorShown = showCursor;

            if (cursorShown) {
                if (controls.moveUp && !controls.previousControls.moveUp) {
                    if (isActionsOpen) {
                        cursorActionPosition--;
                        cursorActionPosition = Math.max(cursorActionPosition, 0);
                    } else {
                        cursorPosition--;
                    }
                } else if (controls.moveDown && !controls.previousControls.moveDown) {
                    if (isActionsOpen) {
                        cursorActionPosition++;
                        cursorActionPosition = Math.min(cursorActionPosition, items[cursorPosition].actions.length);
                    } else {
                        cursorPosition++;
                    }
                }

                if (!isActionsOpen && controls.moveRight && !controls.previousControls.moveRight && items.length > LINE_COUNT) {
                    cursorPosition += LINE_COUNT;
                } else if (!isActionsOpen && controls.moveLeft && !controls.previousControls.moveLeft && items.length > LINE_COUNT) {
                    cursorPosition -= LINE_COUNT;
                }

                if (controls.escape && !controls.previousControls.escape) {
                    if (isActionsOpen) {
                        isActionsOpen = false;
                    } else {
                        chooseCallback(null);
                    }
                }

                if (controls.interact && !controls.previousControls.interact) {
                    if (isActionsOpen) {
                        const action = items[cursorPosition].actions[cursorActionPosition];

                        // cancel
                        if (!action) {
                            isActionsOpen = false;
                        } else if (!items[cursorPosition].disabled) {
                            isActionsOpen = false;
                            chooseCallback(items[cursorPosition].id, action);
                        }
                    } else {
                        const item = items[cursorPosition];
                        if (item.actions) {
                            isActionsOpen = true;
                        } else {
                            chooseCallback(items[cursorPosition].id);
                        }
                    }
                }

                cursorPosition = Math.max(cursorPosition, 0);
                cursorPosition = Math.min(cursorPosition, items.length - 1);
            }
        },
    };
};