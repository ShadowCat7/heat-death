import entityFactory, { defaultDrawFunc } from './entity.js';
import { isEntitiesColliding } from '../utility/physics.js';
import { standStill } from './monsters/behaviors.js';
import { drawInteractText } from '../utility/draw-utility.js';

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
        options.talkable = true;
        options.personId = 'person id';

        options.getText = () => {
            return ['Do you like my place?'];
        };

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

            if (person.inInteractRange) {
                drawInteractText(ctx, viewX, viewY, 'Talk', person);
            }
        };

        person.behavior = options.behavior ?
            options.behavior(person) :
            standStill(person);

        return person;
    },
};