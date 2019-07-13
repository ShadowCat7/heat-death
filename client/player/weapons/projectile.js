import entityFactory, { defaultDrawFunc } from '../../entity/entity.js';

export default {
    create: (options) => {
        options.type = 'projectile';

        options.interactive = true;

        options.update = null;

        options.color = 'orange';

        options.update = (entity, controls, entityList, elapsedTime, player) => {
            const {
                speed,
                x,
                y,
                direction,
            } = entity;

            const newX = x + Math.cos(direction) * speed * elapsedTime;
            const newY = y + Math.sin(-direction) * speed * elapsedTime;

            entity.x = newX;
            entity.y = newY;
        };

        const entity = entityFactory.create(options);

        entity.draw = entity.draw || defaultDrawFunc(entity);

        return entity;
    },
}