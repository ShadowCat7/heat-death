import entityFactory, { defaultDrawFunc } from '../entity.js';
import { isEntitiesColliding, moveEntityTo } from '../../utility/physics.js';
import { standStill } from '../monsters/behaviors.js';
import { drawInteractText } from '../../utility/draw-utility.js';

import {
    getPath as getCarpenterPath,
    getText as getCarpenterText,
} from './carpenter.js';

const MAX_SPEED = 20;

export const CARPENTER = 'carpenter';

const personMap = {
    [CARPENTER]: {
        getPath: getCarpenterPath,
        getText: getCarpenterText,
    }
};

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

        const personFuncs = personMap[options.personId];

        options.getText = () => {
            if (personFuncs) {
                return personFuncs.getText();
            }

            return ['Do you like my place?'];
        };

        options.update = (person, controls, entityList, elapsedTime, player) => {
            let newPosition;

            if (personFuncs) {
                const path = personFuncs.getPath();

                if (path) {
                    newPosition = moveEntityTo(person, path.x, path.y, elapsedTime);
                }
            }

            if (!newPosition) {
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