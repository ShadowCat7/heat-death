import weaponFactory from './weapon.js';

const SWORD_WIDTH = 10;
const SWORD_LENGTH = 30;
const ATTACK_TIME_LIMIT = 0.3;

export default {
    create: () => {
        return weaponFactory.create({
            width: SWORD_WIDTH,
            length: SWORD_LENGTH,
            attackTimeLimit: ATTACK_TIME_LIMIT,
            color: '#55aacc',
        });
    }
};