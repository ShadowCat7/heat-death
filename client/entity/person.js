import entityFactory, { defaultDrawFunc } from './entity.js';
import { isEntitiesColliding } from '../utility/physics.js';

const MAX_SPEED = 20;

export default {
    create: (options) => {
        options.width = 30;
        options.height = 30;
        options.causesCollisions = false;
        options.type = 'person';
        options.maxSpeed = MAX_SPEED;

        options.update = null;

        options.draw = null;

        options.color = 'purple';
        options.interactive = true;

        options.update = (person, controls, entityList, elapsedTime, player) => {
            let { newX, newY } = person.behavior(elapsedTime, player);

            for (let i = 0; i < entityList.length; i++) {
                const entity = entityList[i];
                if (!entity.causesCollisions || entity === person) continue;

                const { x, y } = isEntitiesColliding(person, newX, newY, entity);
                newX = x;
                newY = y;
            }

            person.x = newX;
            person.y = newY;
        };

        const person = entityFactory.create(options);

        const defaultDraw = defaultDrawFunc(person);
        person.draw = (ctx, viewX, viewY) => {
            defaultDraw(ctx, viewX, viewY);

            const x = person.x - viewX;
            const y = person.y - viewY;

            if (person.inInteractRange) {
                ctx.font = '22px Arial';
                ctx.fillStyle = '#eee';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText('Talk', x + person.rect.width / 2, y);
            }
        };

        person.behavior = options.behavior(person);

        return person;
    },
};