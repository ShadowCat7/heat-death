import { drawRect } from '../../utility/draw-utility.js';
import createTimer from '../../utility/timer.js';

const getWeaponPosition = (weapon, player) => {
    let weaponX = player.x;
    let weaponY = player.y;

    const movingPosition = (player.rect.width + weapon.width) * (weapon.getAttackTime() / weapon.attackTimeLimit);

    let width;
    let height;
    if (player.direction === 'up') {
        weaponY -= player.rect.height;
        weaponX = player.x - weapon.width + movingPosition;
        width = weapon.width;
        height = weapon.length;
    } else if (player.direction === 'down') {
        weaponY += player.rect.height;
        weaponX = player.x + player.rect.width - movingPosition;
        width = weapon.width;
        height = weapon.length;
    } else if (player.direction === 'left') {
        weaponX -= player.rect.width;
        weaponY = player.y + player.rect.height - movingPosition;
        width = weapon.length;
        height = weapon.width;
    } else if (player.direction === 'right') {
        weaponX += player.rect.width;
        weaponY = player.y - weapon.width + movingPosition;
        width = weapon.length;
        height = weapon.width;
    }

    return { weaponX, weaponY, width, height };
};

export default {
    create: (options) => {
        const weapon = { ...options };

        weapon.rect = {
            width: weapon.width,
            height: weapon.length,
        };

        const attackTimer = createTimer(weapon.attackTimeLimit);
        let isSwinging = false;

        weapon.getAttackTime = attackTimer.getTime;

        weapon.update = (elapsedTime, player) => {
            if (attackTimer.update(elapsedTime)) {
                player.attacking = false;
                isSwinging = false;
            } else {
                const {
                    weaponX, weaponY, width, height,
                } = getWeaponPosition(weapon, player);

                if (!isSwinging) {
                    isSwinging = true;
                    weapon.onSwing(weapon, player);
                }

                weapon.x = weaponX;
                weapon.y = weaponY;
                weapon.rect = { width, height };
            }
        };

        if (!weapon.draw) {
            weapon.draw = (ctx, viewX, viewY) => {
                const x = weapon.x - viewX;
                const y = weapon.y - viewY;

                drawRect(ctx, weapon.rect, x, y, weapon.color || '#55aacc');                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            };
        }

        return weapon;
    },
};