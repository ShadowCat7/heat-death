import createTimer from '../utility/timer.js';
import { VIEW_WIDTH, HP_BAR_HEIGHT } from '../constants.js';

const V_PADDING = 10;
const H_PADDING = 10;
const TEXT_X = VIEW_WIDTH - H_PADDING - 80;
const TEXT_Y = V_PADDING + HP_BAR_HEIGHT;

let clock = 1435;
const clockTimer = createTimer(1);

export default {
    draw: (ctx) => {
        let hours = Math.floor(clock / 60);
        if (hours < 10) {
            hours = '0' + hours;
        }

        let minutes = clock % 60;
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        ctx.font = '30px Arial';
        ctx.fillStyle = '#e0e0e0';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        ctx.fillText(`${hours}:${minutes}`, TEXT_X, TEXT_Y);
    },
    update: (elapsedTime) => {
        if (clockTimer.update(elapsedTime)) {
            clock += 1;

            // 60 min in an hour, * 24 hours
            if (clock >= 1440) clock = 0;
        }
    },
    getTime: () => {
        return clock;
    },
};