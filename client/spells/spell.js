import timerFactory from '../utility/timer.js';

export default (options) => {
    const {
        cooldown,
    } = options;

    let isOnCooldown = false;
    const timer = timerFactory(cooldown);

    return {
        activate: () => {
            if (!isOnCooldown) {
                isOnCooldown = true;
                timer.reset();
                return true;
            }

            return false;
        },
        update: (elapsedTime) => {
            if (isOnCooldown && timer.update(elapsedTime)) {
                isOnCooldown = false;
            }
        },
    };
};