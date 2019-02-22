import entityFactory, { defaultDrawFunc } from '../entity/entity.js';

export default {
    create: (options) => {
        options.width = options.width || 40;
        options.height = options.width || 40;
        options.causesCollisions = options.causesCollisions !== undefined ? options.causesCollisions : true;
        options.type = 'item';
        options.count = options.count || 1;

        options.interactive = true;

        options.update = null;

        options.draw = null;

        options.color = 'green';

        const entity = entityFactory.create(options);

        const defaultDraw = defaultDrawFunc(entity);
        entity.draw = (ctx, viewX, viewY) => {
            defaultDraw(ctx, viewX, viewY);

            const x = entity.x - viewX;
            const y = entity.y - viewY;

            if (entity.inInteractRange) {
                ctx.font = '22px Arial';
                ctx.fillStyle = '#eee';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(entity.itemType, x + entity.rect.width / 2, y);
            }
        };

        return entity;
    },
};