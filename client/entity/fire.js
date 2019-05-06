import entityFactory, { defaultDrawFunc } from '../entity/entity.js';
import createTimer from '../utility/timer.js';
import { VIEW_WIDTH } from '../constants.js';

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

            const x = entity.x - viewX;
            const y = entity.y - viewY;

            if (entity.inInteractRange) {
                ctx.font = '22px Arial';
                ctx.fillStyle = '#eee';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText('Fuel the fire', x + entity.rect.width / 2, y);
            }
        };

        return entity;
    },
};