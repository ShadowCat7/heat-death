import { VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';
import { drawRect } from './draw-utility.js';

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

const CANCEL = 'cancel';

export default({
    items,
    title,
    cursorImage,
}) => {
    let cursorPosition = 0;
    let cursorActionPosition = 0;
    let cursorShown = false;
    let isActionsOpen = false;

    return {
        changeItems: (newItems) => {
            items = newItems;
        },
        draw: (ctx) => {
            ctx.font = '30px Arial';
            ctx.fillStyle = '#e0e0e0';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(title, VIEW_WIDTH / 2, V_PADDING);

            items.forEach((item, i) => {
                ctx.font = '30px Arial';
                ctx.fillStyle = '#e0e0e0';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';

                let indexPosition = i;
                if (i >= LINE_COUNT) indexPosition -= LINE_COUNT;

                const hPosition = H_TEXT_PADDING + (i >= LINE_COUNT ? VIEW_WIDTH / 2 : 0);

                ctx.fillText(item.label, hPosition, V_PADDING + (V_PADDING + LINE_HEIGHT) * (indexPosition + 1));
            });

            if (cursorShown) {
                if (isActionsOpen) {
                    const item = items[cursorPosition];
                    const actions = item.actions;
                    const height = (actions.length + 1) * (LINE_HEIGHT + V_PADDING) + V_PADDING * 2;

                    // border
                    drawRect(ctx, {
                        width: ACTION_MENU_TOTAL_WIDTH,
                        height,
                    }, VIEW_WIDTH - ACTION_MENU_TOTAL_WIDTH, VIEW_HEIGHT - height, '#e0e0e0');

                    const actionMenuY = VIEW_HEIGHT - height + ACTION_MENU_BORDER;

                    // inside
                    drawRect(ctx, {
                        width: ACTION_MENU_INTERIOR_WIDTH,
                        height: height - ACTION_MENU_BORDER * 2,
                    }, ACTION_MENU_X,
                        actionMenuY,
                        '#000',
                    );

                    const textColor = item.disabled ? '#777' : '#e0e0e0';

                    let i = 0;
                    actions.forEach((action) => {
                        ctx.font = '30px Arial';
                        ctx.fillStyle = textColor;
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'top';

                        const vPosition = actionMenuY + V_PADDING + (V_PADDING + LINE_HEIGHT) * i;

                        ctx.fillText(action, ACTION_MENU_X + H_TEXT_PADDING, vPosition);
                        i++;
                    });

                    ctx.font = '30px Arial';
                    ctx.fillStyle = '#e0e0e0';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';

                    const vPosition = actionMenuY + V_PADDING + (V_PADDING + LINE_HEIGHT) * i;

                    ctx.fillText(CANCEL, ACTION_MENU_X + H_TEXT_PADDING, vPosition);

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