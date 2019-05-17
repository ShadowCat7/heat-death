import createTimer from '../utility/timer.js';
import { VIEW_WIDTH, HP_BAR_HEIGHT } from '../constants.js';
import { drawText } from '../utility/draw-utility.js';

const V_PADDING = 10;
const H_PADDING = 10;
const TEXT_X = VIEW_WIDTH - H_PADDING - 80;
const TEXT_Y = V_PADDING + HP_BAR_HEIGHT;

// 60 min in an hour, * 24 hours
export const MINUTES_IN_HOUR = 60;
export const DAY_DURATION = MINUTES_IN_HOUR * 24;

let clock = 1435;
const clockTimer = createTimer(1);

export default {
    draw: (ctx) => {
        let hours = Math.floor(clock / MINUTES_IN_HOUR);
        if (hours < 10) {
            hours = '0' + hours;
        }

        let minutes = clock % MINUTES_IN_HOUR;
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        drawText(ctx, `${hours}:${minutes}`, TEXT_X, TEXT_Y);
    },
    update: (elapsedTime) => {
        if (clockTimer.update(elapsedTime)) {
            clock += 1;

            if (clock >= DAY_DURATION) clock = 0;
        }
    },
    getTime: () => {
        return clock;
    },
    setTime: (time) => {
        clock = time % DAY_DURATION;
        clockTimer.reset();
    },
};