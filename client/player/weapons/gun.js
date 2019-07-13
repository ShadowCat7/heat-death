import weaponFactory from './weapon.js';
import projectileFactory from './projectile.js';
import levels from '../../levels/levels.js';

const SWORD_WIDTH = 10;
const SWORD_LENGTH = 10;
const ATTACK_TIME_LIMIT = 0.3;

export default {
    create: (options) => {
        const {
            speed,
        } = options;

        return weaponFactory.create({
            width: SWORD_WIDTH,
            length: SWORD_LENGTH,
            attackTimeLimit: ATTACK_TIME_LIMIT,
            color: '#55aacc',
            onSwing: (weapon, player) => {
                let direction;
                if (player.direction === 'right') {
                    direction = 0;
                } else if (player.direction === 'up') {
                    direction = Math.PI / 2;
                } else if (player.direction === 'left') {
                    direction = Math.PI;
                } else {
                    direction = -Math.PI / 2;
                }

                // Need prettier values for x/y
                const projectile = projectileFactory.create({
                    x: player.x,
                    y: player.y,
                    width: 10,
                    height: 10,
                    direction,
                    speed,
                });

                levels.createEntity(projectile);
            },
        });
    },
};