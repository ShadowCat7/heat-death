import { isInsideRect } from '../utility/physics.js';
import { drawText } from '../utility/draw-utility.js';

const createClickElement = ({
    x,
    y,
    width,
    height,
    type,
    entity,
}) => {
    const clickElement = {
        x,
        y,
        type,
        rect: {
            width,
            height,
        },
    };

    clickElement.type = entity.type;
    entity.x = x;
    entity.y = y;

    let hover = false;
    let clicked = false;
    let selected = false;

    clickElement.update = (mouseInfo) => {
        if (selected) {
            clicked = false;
        }

        if (isInsideRect(mouseInfo.x, mouseInfo.y, entity.rect, entity.x, entity.y)) {
            hover = true;

            if (mouseInfo.leftMouseClick) {
                clicked = true;
            } else if (clicked) {
                selected = true;
            }
        } else {
            hover = false;

            if (!mouseInfo.leftMouseClick) {
                clicked = false;
            }
        }

        return selected && clicked;
    };

    clickElement.draw = (ctx, player) => {
        entity.draw(ctx, 0, 0, player);

        if (hover) {
            drawText(ctx, entity.type, x + entity.rect.width / 2, y + entity.rect.width / 2, {
                fontSize: '22px',
                textColor: '#000',
                textAlign: 'center',
                textBaseline: 'middle',
            });
        }

        if (selected) {
            ctx.strokeStyle = '#ffff88';
            ctx.strokeRect(x, y, entity.rect.width, entity.rect.height);
        }
    };

    return clickElement;
};

export default {
    create: (options) => {
        return createClickElement(options);
    },
};
