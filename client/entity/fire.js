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

        options.hasCauldron = false;

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

            if (entity.hasCauldron) {
                ctx.fillStyle = '#2a2a2a';

                ctx.fillRect(
                    entity.x - viewX + 5,
                    entity.y - viewY + 5,
                    options.width - 10,
                    options.height - 10
                );
            }

            if (entity.inInteractRange) {
                const text = entity.hasCauldron ? 'Fill the cauldron' : 'Fuel the fire';

                drawInteractText(ctx, viewX, viewY, text, entity);
            }
        };

        return entity;
    },
};