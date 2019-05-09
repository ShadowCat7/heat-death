import entityFactory, { defaultDrawFunc } from '../entity/entity.js';
import { drawInteractText } from '../utility/draw-utility.js';

const INTERACT_TEXT = {
    'herb': 'Pick herb',
};

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

            if (entity.inInteractRange) {
                drawInteractText(ctx, viewX, viewY, INTERACT_TEXT[entity.itemType], entity);
            }
        };

        return entity;
    },
};