import entityFactory from '../entity/entity.js';

export default {
    create: (options) => {
        options.width = 40;
        options.height = 40;
        options.causesCollisions = true;
        options.type = 'block';

        options.update = null;

        options.draw = null;

        options.color = '#909090';

        return entityFactory.create(options);
    },
};