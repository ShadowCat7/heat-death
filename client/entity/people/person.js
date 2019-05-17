import entityFactory, { defaultDrawFunc } from '../entity.js';
import { isEntitiesColliding, moveEntityTo } from '../../utility/physics.js';
import { standStill } from '../monsters/behaviors.js';
import { drawInteractText } from '../../utility/draw-utility.js';

import { getPath as getCarpenterPath } from './carpenter.js';

const MAX_SPEED = 20;

export const CARPENTER = 'carpenter';

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
        options.personId = options.personId || 'person id';

        options.pathFunc = () => {};

        switch (options.personId) {
            case CARPENTER:
                options.pathFunc = getCarpenterPath;
                break;
            default:
        }

        options.getText = () => {
            return ['Do you like my place?'];
        };

        options.update = (person, controls, entityList, elapsedTime, player) => {
            const path = options.pathFunc();

            let newPosition;

            if (path) {
                newPosition = moveEntityTo(person, path.x, path.y, elapsedTime);
            } else {
                newPosition = person.behavior(elapsedTime, player);
            }

            let { newX, newY } = newPosition;

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