import clock from './hud/clock.js';

window.heatDeath = {
    setTime: (time) => {
        if (typeof time === 'number') {
            clock.setTime(time);
        } else {
            console.error('parameter {time} must be of type number')
        }
    },
};