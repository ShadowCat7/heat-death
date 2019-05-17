import clock, { MINUTES_IN_HOUR } from '../../hud/clock.js';
import { LEVEL_WIDTH } from '../../constants.js';

const BED_TIME = 22.00 * MINUTES_IN_HOUR;
const WAKE_TIME = 1.00 * MINUTES_IN_HOUR;

export const getPath = () => {
    const time = clock.getTime();

    if (time >= BED_TIME || time <= WAKE_TIME) {
        return {
            x: 480 + LEVEL_WIDTH,
            y: 160,
        };
    }

    return null;
};
