import entityFactory, { defaultDrawFunc } from './entity.js';

const MAX_SPEED = 150;

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

        return person;
    },
};