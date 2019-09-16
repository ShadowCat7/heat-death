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
                return true;
            }

            return false;
        },
        update: (elapsedTime) => {
            if (isOnCooldown && timer.update(elapsedTime)) {
                isOnCooldown = false;
                timer.reset();
            }
        },
        getCooldownComplete: () => Math.min(timer.getTime() / cooldown, 1),
    };
};