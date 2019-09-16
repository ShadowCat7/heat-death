import clock from './clock.js';
import { HP_BAR_HEIGHT, VIEW_WIDTH } from '../constants.js';
import { drawText } from '../utility/draw-utility.js';

export default {
    draw: (ctx, player) => {
        // player health bar
        ctx.fillStyle = '#909090';
        ctx.fillRect(0, 0, VIEW_WIDTH, HP_BAR_HEIGHT);

        ctx.fillStyle = 'green';
        ctx.fillRect(3, 3, player.health / 1000 * (VIEW_WIDTH - 6), 15);

        drawText(ctx, `${player.health}/1000`, VIEW_WIDTH / 2, 6, {
            fontSize: '12px',
            textAlign: 'center',
        });

        clock.draw(ctx);
    },
    update: (elapsedTime) => {
        clock.update(elapsedTime);
    },
};