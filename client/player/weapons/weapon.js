import { drawRect, rotateDrawRect } from '../../utility/draw-utility.js';
import createTimer from '../../utility/timer.js';

// this angle should be determined from weapon.length
const HALF_SWING = Math.PI / 3;

const getWeaponPosition = (weapon, player) => {
    let weaponX = player.x;
    let weaponY = player.y;
    let drawX = player.x;
    let drawY = player.y;
    let rotateX = 0;
    let rotateY = 0;

    const animationComplete = weapon.getAttackTime() / weapon.attackTimeLimit;
    const movingPosition = (player.rect.width + weapon.width) * animationComplete;
    const rotation = -HALF_SWING + 2 * HALF_SWING * animationComplete;

    console.log(rotation);

    let width;
    let height;
    if (player.direction === 'up') {
        weaponY -= weapon.length;
        weaponX = player.x - weapon.width + movingPosition;
        width = weapon.width;
        height = weapon.length;
        drawX += player.rect.width / 2 - weapon.width / 2;
        drawY += -weapon.length;
        rotateX += weapon.width / 2;
        rotateY += weapon.length;
    } else if (player.direction === 'down') {
        weaponY += player.rect.height;
        weaponX = player.x + player.rect.width - movingPosition;
        width = weapon.width;
        height = weapon.length;
        drawX += player.rect.width / 2 - weapon.width / 2;
        drawY += player.rect.height;
        rotateX +=  weapon.width / 2;
        //rotateY += 0;
    } else if (player.direction === 'left') {
        weaponX -= weapon.length;
        weaponY = player.y + player.rect.height - movingPosition;
        width = weapon.length;
        height = weapon.width;
        drawX += -weapon.length;
        drawY += player.rect.height / 2 - weapon.width / 2;
        rotateX += weapon.length;
        rotateY += weapon.width / 2;
    } else if (player.direction === 'right') {
        weaponX += player.rect.width;
        weaponY = player.y - weapon.width + movingPosition;
        width = weapon.length;
        height = weapon.width;
        drawX += player.rect.width;
        drawY += player.rect.height / 2 - weapon.width / 2;
        //rotateX += 0;
        rotateY += weapon.width / 2;
    }

    return { weaponX, weaponY, width, height, rotation, rotateX, rotateY, drawX, drawY };
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
                    weaponX, weaponY, width, height, rotation, rotateX, rotateY, drawX, drawY
                } = getWeaponPosition(weapon, player);

                if (!isSwinging) {
                    isSwinging = true;

                    if (weapon.onSwing) {
                        weapon.onSwing(weapon, player);
                    }
                }

                weapon.x = weaponX;
                weapon.y = weaponY;
                weapon.rect = { width, height };
                weapon.rotation = rotation;
                weapon.rotateX = rotateX;
                weapon.rotateY = rotateY;
                weapon.drawX = drawX;
                weapon.drawY = drawY;
            }
        };

        if (!weapon.draw) {
            weapon.draw = (ctx, viewX, viewY) => {
                const x = weapon.drawX - viewX;
                const y = weapon.drawY - viewY;

                rotateDrawRect(ctx, {
                    rect: weapon.rect,
                    x,
                    y,
                    color: weapon.color || '#55aacc',
                    rotateX: weapon.rotateX,
                    rotateY: weapon.rotateY,
                    rotation: weapon.rotation,
                });

                // hitbox draw
                drawRect(ctx, weapon.rect, weapon.x - viewX, weapon.y - viewY, '#aa77cc');
            };
        }

        return weapon;
    },
};