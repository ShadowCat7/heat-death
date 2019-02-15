import entityFactory, { defaultDrawFunc } from '../entity/entity.js';

import {
    isCirclesColliding,
    isEntitiesColliding,
    isRectsColliding,
    rectEntityDistance,
} from '../physics.js';

import { INTERACT_RADIUS, VIEW_WIDTH } from '../constants.js';
import item from '../entity/item.js';
import stump from '../entity/stump.js';
import createTimer from '../timer.js';
import { drawRect } from '../draw-utility.js';

const MAX_SPEED = 300;
const ATTACK_TIME_LIMIT = 0.3;
const attackTimer = createTimer(ATTACK_TIME_LIMIT);
const SWORD_WIDTH = 10;
const SWORD_LENGTH = 30;

const getSwordPosition = (player, direction) => {
    let swordX = player.x;
    let swordY = player.y;

    const movingPosition = (player.rect.width + SWORD_WIDTH) * (attackTimer.getTime() / ATTACK_TIME_LIMIT);

    let width;
    let height;
    if (direction === 'up') {
        swordY -= player.rect.height;
        swordX = player.x - SWORD_WIDTH + movingPosition;
        width = SWORD_WIDTH;
        height = SWORD_LENGTH;
    } else if (direction === 'down') {
        swordY += player.rect.height;
        swordX = player.x + player.rect.width - movingPosition;
        width = SWORD_WIDTH;
        height = SWORD_LENGTH;
    } else if (direction === 'left') {
        swordX -= player.rect.width;
        swordY = player.y + player.rect.height - movingPosition;
        width = SWORD_LENGTH;
        height = SWORD_WIDTH;
    } else if (direction === 'right') {
        swordX += player.rect.width;
        swordY = player.y - SWORD_WIDTH + movingPosition;
        width = SWORD_LENGTH;
        height = SWORD_WIDTH;
    }

    return { swordX, swordY, width, height };
};

export default {
    create: (options) => {
        options.width = 30;
        options.height = 30;

        options.type = 'player';

        options.inventory = {};
        options.health = 100;

        let direction = null;
        let attacking = false;

        options.update = (player, controls, entityList, elapsedTime) => {
            let newX = player.x;
            let newY = player.y;

            if (controls.moveUp) {
                newY -= elapsedTime * MAX_SPEED;
                if (!attacking) {
                    direction = 'up';
                }
            }
            if (controls.moveDown) {
                newY += elapsedTime * MAX_SPEED;
                if (!attacking) {
                    direction = 'down';
                }
            }
            if (controls.moveLeft) {
                newX -= elapsedTime * MAX_SPEED;
                if (!attacking) {
                    direction = 'left';
                }
            }
            if (controls.moveRight) {
                newX += elapsedTime * MAX_SPEED;
                if (!attacking) {
                    direction = 'right';
                }
            }

            if (!attacking && controls.attack && !controls.previousControls.attack) {
                attacking = true;
            }

            if (attacking) {
                if (attackTimer.update(elapsedTime)) {
                    attacking = false;
                }
            }

            let closestItemIndex = null;
            let closestItemDistance = null;

            for (let i = 0; i < entityList.length; i++) {
                const entity = entityList[i];

                if (entity === player) continue;
                entity.inInteractRange = false;

                const { x, y, didCollide } = isEntitiesColliding(player, newX, newY, entity);

                if (entity.type === 'monster' && attacking) {
                    let { swordX, swordY, height, width } = getSwordPosition(player, direction);

                    if (isRectsColliding({ width, height }, swordX, swordY, entity.rect, entity.x, entity.y)) {
                        entityList[i] = item.create({
                            causesCollisions: false,
                            width: entity.rect.width,
                            height: entity.rect.height,
                            x: entity.x,
                            y: entity.y,
                            itemType: 'corpse',
                        });
                    }
                }

                if (entity.type === 'monster' && didCollide) {
                    if (player.health > 0) {
                        player.health -= 1;
                    }
                } else {
                    if (entity.causesCollisions) {
                        newX = x;
                        newY = y;
                    }

                    if (entity.interactive && isCirclesColliding(
                        INTERACT_RADIUS,
                        player.x + player.rect.width / 2,
                        player.y + player.rect.height / 2,
                        INTERACT_RADIUS,
                        entity.x + entity.rect.width / 2,
                        entity.y + entity.rect.height / 2)
                    ) {
                        if (closestItemDistance) {
                            const newClosestDistance = rectEntityDistance(player, entity);

                            if (newClosestDistance < closestItemDistance) {
                                closestItemIndex = i;
                                closestItemDistance = newClosestDistance;
                            }
                        } else {
                            closestItemIndex = i;
                            closestItemDistance = rectEntityDistance(player, entity);
                        }
                    }
                }
            }

            if (closestItemIndex !== null) {
                if (controls.interact && !controls.previousControls.interact) {
                    const entity = entityList[closestItemIndex];

                    if (entity.type === 'item') {
                        const itemType = entity.itemType;

                        entityList.splice(closestItemIndex, 1);
                        if (!player.inventory[itemType]) {
                            player.inventory[itemType] = 1;
                        } else {
                            player.inventory[itemType]++;
                        }
                    } else if (entity.type === 'fire') {
                        player.addItemMenu = true;
                    } else if (entity.type === 'tree') {
                        if (!player.inventory.wood) {
                            player.inventory.wood = 10;
                        } else {
                            player.inventory.wood += 10;
                        }

                        entityList[closestItemIndex] = stump.create({
                            x: entity.x,
                            y: entity.y,
                        });
                    }
                } else {
                    entityList[closestItemIndex].inInteractRange = true;
                }
            }

            player.x = newX;
            player.y = newY;
        };

        options.color = '#5555ff';

        const player = entityFactory.create(options);

        const defaultDraw = defaultDrawFunc(player);
        player.draw = (ctx, viewX, viewY) => {
            defaultDraw(ctx, viewX, viewY);

            if (attacking) {
                let { swordX, swordY, width, height } = getSwordPosition(player, direction);

                drawRect(ctx, {
                    width,
                    height,
                }, swordX - viewX, swordY - viewY, '#55aacc');
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        };

        player.addItemToFire = (itemType) => {
            const itemCount = player.inventory[itemType];

            switch (itemType) {
                case 'wood': player.health += 10 * itemCount; break;
                case 'corpse': player.health += 1 * itemCount; break;
                default: return;
            }

            player.inventory[itemType] = 0;
        };

        return player;
    },
};