import entityFactory, { defaultDrawFunc } from '../entity/entity.js';
import { drawInteractText } from '../utility/draw-utility.js';
import { GRID_SIZE } from '../constants.js';
import levels from '../levels/levels.js';

const INTERACT_TEXT = {
    'herb': 'Pick herb',
};

const createItem = (options) => {
    options.width = options.width || GRID_SIZE;
    options.height = options.width || GRID_SIZE;
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
            const interactText = INTERACT_TEXT[entity.itemType] || entity.itemType;

            drawInteractText(ctx, viewX, viewY, interactText, entity);
        }
    };

    return entity;
};

export default {
    dropItem: (x, y, item, rect) => {
        const itemEntity = createItem({
            causesCollisions: false,
            width: rect && rect.width,
            height: rect && rect.height,
            x,
            y,
            itemType: item.key,
            count: item.count || 1,
        });

        levels.createEntity(itemEntity);

        return itemEntity;
    },
    create: createItem,
};