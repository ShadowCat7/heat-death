import { drawRect } from '../utility/draw-utility.js';

export const defaultDrawFunc = (entity) => {
    return (ctx, viewX, viewY, player) => {
        if (entity.rect) {
            const x = entity.x - viewX;
            const y = entity.y - viewY;

            drawRect(ctx, entity.rect, x, y, entity.color || '#ffffff');
        }

        if (entity.radius) {
            ctx.beginPath();
            ctx.arc(x, y, entity.radius, 0, 2 * Math.PI);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }
    };
};

const createEntity = ({
    x,
    y,
    width,
    height,
    radius,
    causesCollisions,
    type,
    update,
    draw,
    ...passThrough
}) => {
    const entity = {
        x,
        y,
        causesCollisions,
        type,
        ...passThrough
    };

    if (radius) {
        entity.radius = radius;
    } else if (width && height) {
        entity.rect = {
            width,
            height,
        };
    }

    if (update) {
        entity.update = (controls, entityList, elapsedTime, player) => {
            update(entity, controls, entityList, elapsedTime, player);
        };
    } else {
        entity.update = () => {};
    }

    if (draw) {
        entity.draw = (ctx, viewX, viewY, player) => {
            draw(entity, ctx, viewX, viewY, player);
        };
    } else {
        entity.draw = defaultDrawFunc(entity);
    }

    return entity;
};

export default {
    create: (options) => {
        return createEntity(options);
    },
};
