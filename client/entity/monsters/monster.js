import entityFactory from '../entity.js';
import { isEntitiesColliding } from '../../physics.js';

const MAX_SPEED = 150;

export default {
    create: (options) => {
        options.width = 30;
        options.height = 30;
        options.type = 'monster';
        options.maxSpeed = MAX_SPEED;

        options.update = null;

        options.draw = null;

        options.color = 'yellow';

        options.update = (monster, controls, entityList, elapsedTime) => {
            let { newX, newY } = monster.behavior(elapsedTime);

            for (let i = 0; i < entityList.length; i++) {
                const entity = entityList[i];
                if (!entity.causesCollisions || entity === monster) continue;

                const { x, y } = isEntitiesColliding(monster, newX, newY, entity);
                newX = x;
                newY = y;
            }

            monster.x = newX;
            monster.y = newY;
        };

        const monster = entityFactory.create(options);

        monster.behavior = options.behavior(monster);

        return monster;
    },
};