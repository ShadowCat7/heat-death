import { VIEW_HEIGHT, VIEW_WIDTH } from './constants.js';

const V_PADDING = 10;
const H_PADDING = 10;
const CURSOR_WIDTH = 30;
const H_TEXT_PADDING = H_PADDING + CURSOR_WIDTH + H_PADDING;
const LINE_HEIGHT = 30;
const STARTING_LINE = V_PADDING + V_PADDING + LINE_HEIGHT;

const LINE_COUNT = Math.floor((VIEW_HEIGHT - STARTING_LINE) / (LINE_HEIGHT + V_PADDING));

export default ({
    items,
    title,
    cursorImage,
}) => {
    let cursorPosition = 0;
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
                let yPosition = cursorPosition;
                let xPosition = H_PADDING;

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
                    cursorPosition--;
                } else if (controls.moveDown && !controls.previousControls.moveDown) {
                    cursorPosition++;
                }

                if (controls.moveRight && !controls.previousControls.moveRight && items.length > LINE_COUNT) {
                    cursorPosition += LINE_COUNT;
                } else if (controls.moveLeft && !controls.previousControls.moveLeft && items.length > LINE_COUNT) {
                    cursorPosition -= LINE_COUNT;
                }

                if (controls.escape) {
                    chooseCallback(null);
                }

                if (controls.interact && !controls.previousControls.interact) {
                    const item = items[cursorPosition];
                    //if (item.actions) {
                    //    isActionsOpen = true;
                    //} else {
                        chooseCallback(items[cursorPosition].id);
                    //}
                }

                cursorPosition = Math.max(cursorPosition, 0);
                cursorPosition = Math.min(cursorPosition, items.length - 1);
            }
        },
    };
};