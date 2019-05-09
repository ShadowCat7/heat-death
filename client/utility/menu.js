import { VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';
import { DEFAULT_PADDING, drawBorderedText, drawText } from './draw-utility.js';

const V_PADDING = 10;
const H_PADDING = 10;
const CURSOR_WIDTH = 30;
const H_TEXT_PADDING = H_PADDING + CURSOR_WIDTH + H_PADDING;
const LINE_HEIGHT = 30;
const STARTING_LINE = V_PADDING + V_PADDING + LINE_HEIGHT;

const LINE_COUNT = Math.floor((VIEW_HEIGHT - STARTING_LINE) / (LINE_HEIGHT + V_PADDING));

const ACTION_MENU_BORDER = 5;
const ACTION_MENU_WIDTH = 200;
const ACTION_MENU_TOTAL_WIDTH = ACTION_MENU_WIDTH + ACTION_MENU_BORDER * 2 + H_TEXT_PADDING + H_PADDING;
const ACTION_MENU_INTERIOR_WIDTH = ACTION_MENU_TOTAL_WIDTH - ACTION_MENU_BORDER * 2;
const ACTION_MENU_X = VIEW_WIDTH - ACTION_MENU_INTERIOR_WIDTH - ACTION_MENU_BORDER;

const ALERT_WIDTH = 400;
const ALERT_HEIGHT = ACTION_MENU_BORDER * 2 + V_PADDING * 2 + LINE_HEIGHT;
const ALERT_X = VIEW_WIDTH / 2 - ALERT_WIDTH / 2;
const ALERT_Y = VIEW_HEIGHT / 2 - ALERT_HEIGHT / 2;

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
    let alertText = null;
    let titleText = title;

    return {
        alert: (text) => {
            alertText = text;
        },
        changeTitle: (title) => {
            titleText = title;
        },
        changeItems: (newItems) => {
            items = newItems;
        },
        draw: (ctx) => {
            drawText(ctx, titleText, VIEW_WIDTH / 2, V_PADDING, { textAlign: 'center' });

            const itemLabels = items.map(item => item.label);
            drawText(ctx, itemLabels.slice(0, LINE_COUNT), H_TEXT_PADDING, V_PADDING * 2 + LINE_HEIGHT);
            drawText(ctx, itemLabels.slice(LINE_COUNT, LINE_COUNT * 2), H_TEXT_PADDING + VIEW_WIDTH / 2, V_PADDING * 2 + LINE_HEIGHT);

            if (cursorShown) {
                if (isActionsOpen) {
                    const item = items[cursorPosition];
                    const actions = item.actions;
                    const height = (actions.length + 1) * (LINE_HEIGHT + V_PADDING) + V_PADDING * 2;

                    drawBorderedText(ctx, actions.concat([CANCEL_TEXT]), {
                        x: VIEW_WIDTH - ACTION_MENU_TOTAL_WIDTH,
                        y: VIEW_HEIGHT - height,
                        width: ACTION_MENU_TOTAL_WIDTH,
                        height,
                        horizontalPadding: DEFAULT_PADDING * 2 + CURSOR_WIDTH,
                    });

                    const actionMenuY = VIEW_HEIGHT - height + ACTION_MENU_BORDER;
                    const cursorX = ACTION_MENU_X + H_PADDING;
                    const cursorY = actionMenuY + V_PADDING + (V_PADDING + LINE_HEIGHT) * cursorActionPosition;
                    ctx.drawImage(cursorImage, cursorX, cursorY);
                }

                let xPosition = H_PADDING;
                let yPosition = cursorPosition;

                if (cursorPosition >= LINE_COUNT) {
                    yPosition -= LINE_COUNT;
                    xPosition += VIEW_WIDTH / 2;
                }

                ctx.drawImage(cursorImage, xPosition, V_PADDING + (V_PADDING + LINE_HEIGHT) * (yPosition + 1) - 2);
            }

            if (alertText) {
                drawBorderedText(ctx, alertText, {
                    x: ALERT_X,
                    y: ALERT_Y,
                    width: ALERT_WIDTH,
                });
            }
        },
        update: (showCursor, controls, chooseCallback) => {
            cursorShown = showCursor;

            if (alertText && controls.interact && !controls.previousControls.interact) {
                alertText = null;
            } else if (cursorShown) {
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
                    if (alertText) {
                        alertText = null;
                    } else if (isActionsOpen) {
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