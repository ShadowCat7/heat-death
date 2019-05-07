import entityFactory, { defaultDrawFunc } from './entity.js';
import { drawInteractText } from '../utility/draw-utility.js';

let image = null;

export default {
    initialize: (sprites) => {
        image = sprites['sign'];
    },
    create: (options) => {
        options.width = 40;
        options.height = 40;
        options.causesCollisions = true;
        options.type = 'sign';

        options.image = image;

        options.interactive = true;
        options.talkable = true;

        options.getText = () => {
            return options.data.text;
        };

        const sign = entityFactory.create(options);

        const defaultDraw = defaultDrawFunc(sign);
        sign.draw = (ctx, viewX, viewY) => {
            defaultDraw(ctx, viewX, viewY);

            if (sign.inInteractRange) {
                drawInteractText(ctx, viewX, viewY, 'Read sign', sign);
            }
        };

        return sign;
    },
};