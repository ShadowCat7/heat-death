import clock from './hud/clock.js';

let showHitboxes = false;

const cheats = {
    setTime: (time) => {
        if (typeof time === 'number') {
            clock.setTime(time);
        } else {
            console.error('parameter {time} must be of type number')
        }
    },
    toggleHitboxes: () => {
        showHitboxes = !showHitboxes;
    },
    isShowingHitboxes: () => {
        return showHitboxes;
    },
};

window.heatDeath = { ...cheats };

export default cheats;