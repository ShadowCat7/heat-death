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
        options.type = 'bulletin';

        options.image = image;

        options.interactive = true;

        options.color = '#af7e50';

        const bulletin = entityFactory.create(options);

        const defaultDraw = defaultDrawFunc(bulletin);
        bulletin.draw = (ctx, viewX, viewY) => {
            defaultDraw(ctx, viewX, viewY);

            if (bulletin.inInteractRange) {
                drawInteractText(ctx, viewX, viewY, 'Read bulletin board', bulletin);
            }
        };

        return bulletin;
    },
};