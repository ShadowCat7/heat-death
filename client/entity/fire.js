import entityFactory, { defaultDrawFunc } from '../entity/entity.js';
import createTimer from '../utility/timer.js';
import { drawInteractText } from '../utility/draw-utility.js';

export default {
    create: (options) => {
        options.width = 40;
        options.height = 40;
        options.causesCollisions = true;
        options.type = 'fire';

        options.interactive = true;

        options.update = null;

        options.draw = null;

        options.color = 'red';

        const timer = createTimer(1);

        options.update = (entity, controls, entityList, elapsedTime, player) => {
            if (player.health > 0) {
                if (timer.update(elapsedTime)) {
                    player.health--;
                }
            }
        };

        const entity = entityFactory.create(options);

        const defaultDraw = defaultDrawFunc(entity);
        entity.draw = (ctx, viewX, viewY, player) => {
            defaultDraw(ctx, viewX, viewY);

            if (entity.inInteractRange) {
                drawInteractText(ctx, viewX, viewY, 'Fuel the fire', entity);
            }
        };

        return entity;
    },
};