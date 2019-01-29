import entityFactory from '../entity/entity.js';

export default {
    create: (options) => {
        options.width = 40;
        options.height = 40;
        options.causesCollisions = true;
        options.type = 'stump';

        options.interactive = true;

        options.update = null;

        options.color = '#A0522D';

        return entityFactory.create(options);
    },
};