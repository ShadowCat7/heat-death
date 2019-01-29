import entityFactory, { defaultDrawFunc } from '../entity/entity.js';
import createTimer from '../timer.js';
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
                ctx.font = '30px Arial';
                ctx.fillStyle = '#eee';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText('Add wood', x + entity.rect.width / 2, y);
            }

            ctx.fillStyle = '#909090';
            ctx.fillRect(0, 0, VIEW_WIDTH, 21);

            ctx.fillStyle = 'green';
            ctx.fillRect(3, 3, player.health / 1000 * (VIEW_WIDTH - 6), 15);

            ctx.font = '12px Arial';
            ctx.fillStyle = '#eee';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(`${player.health}/1000`, VIEW_WIDTH / 2, 6);
        };

        return entity;
    },
};