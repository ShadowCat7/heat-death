import entityFactory from '../entity/entity.js';
import createTimer from '../utility/timer.js';
import { DAY_DURATION } from '../hud/clock.js';
import tree from './tree.js';

const TREE_RESPAWN_TIMER = DAY_DURATION;

export default {
    create: (options) => {
        options.width = 40;
        options.height = 40;
        options.causesCollisions = true;
        options.type = 'stump';

        options.interactive = false;

        options.color = '#A0522D';

        const timer = createTimer(TREE_RESPAWN_TIMER);

        options.update = (stump, controls, entityList, elapsedTime) => {
            if (timer.update(elapsedTime)) {
                const index = entityList.indexOf(stump);
                entityList[index] = tree.create({
                    x: stump.x,
                    y: stump.y,
                });
            }
        };

        return entityFactory.create(options);
    },
};