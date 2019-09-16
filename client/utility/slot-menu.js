import { GRID_SIZE, VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';
import {
    DEFAULT_LINE_HEIGHT,
    DEFAULT_PADDING, drawItemInSlot, drawRect,
    drawSlot,
    drawText,
    fillScreen,
} from './draw-utility.js';

import actionMenu, { CANCEL } from './action-menu.js';
import { CLICKED, getMouseOnState } from '../click/click-element.js';
import clickElementFactory, { DRAG, DROPPED } from '../click/drag-element.js';
import { freshPress } from './controls.js';

const CURSOR_WIDTH = 30;
const H_TEXT_PADDING = DEFAULT_PADDING * 2 + CURSOR_WIDTH;
const STARTING_LINE = DEFAULT_PADDING * 2 + DEFAULT_LINE_HEIGHT;
const LINE_COUNT = Math.floor((VIEW_HEIGHT - STARTING_LINE) / (DEFAULT_LINE_HEIGHT + DEFAULT_PADDING));

const SLOTS_PER_ROW = 6;
const SLOT_MARGIN = 50;
const SLOT_SIZE = 60;
const SLOT_SPACE = SLOT_MARGIN + SLOT_SIZE;
const MENU_PADDING = (VIEW_WIDTH - (SLOT_SPACE * SLOTS_PER_ROW - SLOT_MARGIN)) / 2;
const SLOT_TEXT_TOP_MARGIN = 10;

export const SWAP = 'swap';

export default({
    items,
    title,
    cursorImage,
}) => {
    let cursorPosition = 0;
    let cursorShown = false;
    let titleText = title;

    let elements = [];

    return {
        changeTitle: (title) => {
            titleText = title;
        },
        changeItems: (newItems) => {
            items = newItems;
            elements = [];

            for (let i = 0; i < (items.length / SLOTS_PER_ROW); i++) {
                for (let j = 0; j < SLOTS_PER_ROW; j++) {
                    elements.push(clickElementFactory({
                        x: MENU_PADDING + SLOT_SPACE * j,
                        y: 120 + SLOT_SPACE * i,
                        width: SLOT_SIZE,
                        height: SLOT_SIZE,
                    }));
                }
            }
        },
        draw: (ctx, controls) => {
            fillScreen(ctx, '#000000aa');

            drawText(ctx, titleText, VIEW_WIDTH / 2, DEFAULT_PADDING, { textAlign: 'center' });

            let draggedIndex = null;

            elements.forEach((element, index) => {
                const item = items[index] || {};
                const { x, y } = element;

                drawSlot(ctx, { x, y });

                if (item.id) {
                    if (element.getState() === DRAG) {
                        draggedIndex = index;
                    } else {
                        drawItemInSlot(ctx, { x, y });
                    }

                    drawText(ctx, item.label, element.x + SLOT_SIZE / 2, element.y + SLOT_SIZE + SLOT_TEXT_TOP_MARGIN, {
                        textAlign: 'center',
                        fontSize: '16px',
                    });
                }
            });

            if (draggedIndex !== null) {
                const draggedElement = elements[draggedIndex]
                const dragPosition = draggedElement.getDragPosition();

                drawRect(
                    ctx,
                    {
                        width: GRID_SIZE,
                        height: GRID_SIZE,
                    },
                    dragPosition.x - GRID_SIZE / 2,
                    dragPosition.y - GRID_SIZE / 2,
                    'green',
                );
            }

            actionMenu.draw(ctx);
        },
        update: (showCursor, controls, chooseCallback) => {
            cursorShown = showCursor;

            const isActionMenuOpen = actionMenu.update(controls, (action) => {
                if (action !== CANCEL) {
                    chooseCallback(items[cursorPosition].id, action);
                }
            });

            if (isActionMenuOpen) return;

            if (freshPress(controls, 'escape')) {
                chooseCallback(null);
            }

            elements.forEach((element, index) => {
                const state = element.update(controls);

                if (state === CLICKED) {
                    const item = items[index];

                    if (item.actions) {
                        actionMenu.changeActions(item.actions);
                        //actionMenu.open();
                    } else {
                        chooseCallback(items[cursorPosition].id);
                    }
                } else if (state === DROPPED) {
                    let dropIndex = null;

                    const element = elements.find((e, i) => {
                        dropIndex = i;
                        return getMouseOnState(controls, e.x, e.y, SLOT_SIZE, SLOT_SIZE) === CLICKED;
                    });

                    if (element && dropIndex !== null) {
                        chooseCallback({
                            action: SWAP,
                            index1: index,
                            index2: dropIndex
                        });
                    }
                }
            });
            //
            // if (cursorShown) {
            //     if (controls.moveUp && !controls.previousControls.moveUp) {
            //         cursorPosition--;
            //     } else if (controls.moveDown && !controls.previousControls.moveDown) {
            //         cursorPosition++;
            //     }
            //
            //     if (controls.moveRight && !controls.previousControls.moveRight && items.length > LINE_COUNT) {
            //         cursorPosition += LINE_COUNT;
            //     } else if (controls.moveLeft && !controls.previousControls.moveLeft && items.length > LINE_COUNT) {
            //         cursorPosition -= LINE_COUNT;
            //     }
            //
            //     if (controls.escape && !controls.previousControls.escape) {
            //         chooseCallback(null);
            //     }
            //
            //     if (controls.interact && !controls.previousControls.interact) {
            //         const item = items[cursorPosition];
            //         if (item.actions) {
            //             actionMenu.changeActions(item.actions);
            //             actionMenu.open();
            //         } else {
            //             chooseCallback(items[cursorPosition].id);
            //         }
            //     }
            //
            //     cursorPosition = Math.max(cursorPosition, 0);
            //     cursorPosition = Math.min(cursorPosition, items.length - 1);
            // }
        },
    };
};