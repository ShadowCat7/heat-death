import entityFactory from '../entity/entity.js';
import { drawRect } from '../draw-utility.js';
import { isRectsColliding } from '../physics.js';

export default {
    create: (options) => {
        options.width = 40;
        options.height = 40;
        options.causesCollisions = true;
        options.type = 'tree';

        options.interactive = true;

        options.update = null;

        options.color = '#A0522D';

        options.draw = (entity, ctx, viewX, viewY, player) => {
            const x = entity.x - viewX;
            const y = entity.y - viewY;

            const isPlayerBehindTree = isRectsColliding(
                player.rect,
                player.x,
                player.y,
                { width: entity.rect.width * 3, height: entity.rect.height * 3 },
                entity.x - entity.rect.width,
                entity.y - entity.rect.height * 3,
            );

            // trunk
            drawRect(ctx, {
                width: entity.rect.width,
                height: entity.rect.height * 2,
            }, x, y - entity.rect.height, isPlayerBehindTree ? '#A0522D99' : '#A0522D');
            // leaves
            drawRect(ctx, {
                width: entity.rect.width * 3,
                height: entity.rect.height * 2,
            }, x - entity.rect.width, y - entity.rect.height * 3, isPlayerBehindTree ? '#33996699' : '#339966');
        };

        return entityFactory.create(options);
    },
};