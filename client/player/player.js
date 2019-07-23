import entityFactory, { defaultDrawFunc } from '../entity/entity.js';

import {
    isCirclesColliding,
    isEntitiesColliding,
    isRectsColliding,
    rectEntityDistance,
} from '../utility/physics.js';

import { GRID_SIZE, INTERACT_RADIUS } from '../constants.js';
import item from '../entity/item.js';
import stump from '../entity/stump.js';
import { CRAFTABLE_ITEMS } from './crafting.js';
import notify from '../utility/notify.js';
import { QUESTS } from './bulletin-board.js';
import swordFactory from './weapons/sword.js';

const MAX_SPEED = 300;

export default {
    create: (options) => {
        options.width = 30;
        options.height = 30;

        options.type = 'player';

        options.inventory = {
            metal: 10,
        };
        options.quests = [];
        options.health = 100;

        options.direction = 'down';

        let interactWith = null;

        options.update = (player, controls, entityList, elapsedTime) => {
            player.entityInRange = null;
            const weapon = player.weapon;

            let newX = player.x;
            let newY = player.y;

            if (controls.moveUp) {
                newY -= elapsedTime * MAX_SPEED;
                if (!player.attacking) {
                    player.direction = 'up';
                }
            }
            if (controls.moveDown) {
                newY += elapsedTime * MAX_SPEED;
                if (!player.attacking) {
                    player.direction = 'down';
                }
            }
            if (controls.moveLeft) {
                newX -= elapsedTime * MAX_SPEED;
                if (!player.attacking) {
                    player.direction = 'left';
                }
            }
            if (controls.moveRight) {
                newX += elapsedTime * MAX_SPEED;
                if (!player.attacking) {
                    player.direction = 'right';
                }
            }

            if (!player.attacking && controls.attack && !controls.previousControls.attack) {
                player.attacking = true;
                // Setting default positioning for player position and direction
                weapon.update(elapsedTime, player);
            }

            let closestItemIndex = null;
            let closestItemDistance = null;

            for (let i = 0; i < entityList.length; i++) {
                const entity = entityList[i];

                if (entity === player) continue;
                entity.inInteractRange = false;

                const { x, y, didCollide } = isEntitiesColliding(player, newX, newY, entity);

                if (entity.type === 'monster' && player.attacking) {
                    // TODO: Adding newX and newY because our position hasn't been updated.
                    // If we're running into a wall this might extend our range sometimes.
                    // We can fix this by doing a loop on walls first, which will help
                    // clean up our chunking (level) logic.
                    const colliding = isRectsColliding(
                        weapon.rect,
                        weapon.x + newX,
                        weapon.y + newY,
                        entity.rect,
                        entity.x,
                        entity.y
                    );

                    if (colliding) {
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

            player.x = newX;
            player.y = newY;

            if (player.attacking) {
                weapon.update(elapsedTime, player);
            }

            if (closestItemIndex !== null) {
                const entity = entityList[closestItemIndex];
                entity.inInteractRange = true;

                if (controls.interact && !controls.previousControls.interact) {
                    if (entity.type === 'item') {
                        const itemType = entity.itemType;

                        entityList.splice(closestItemIndex, 1);
                        if (!player.inventory[itemType]) {
                            player.inventory[itemType] = entity.count;
                        } else {
                            player.inventory[itemType]++;
                        }
                    } else if (entity.type === 'fire') {
                        player.addItemMenu = true;
                        interactWith = entity;
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
                    } else if (entity.talkable) {
                        player.talkingTo = entity;
                    } else if (entity.type === 'bulletin') {
                        player.checkBulletin = true;
                    }
                } else {
                    player.entityInRange = entity;
                }
            }
        };

        options.color = '#5555ff';

        const player = entityFactory.create(options);

        const defaultDraw = defaultDrawFunc(player);
        player.draw = (ctx, viewX, viewY) => {
            defaultDraw(ctx, viewX, viewY);

            if (player.attacking) {
                player.weapon.draw(ctx, viewX, viewY);
            }
        };

        player.weapon = swordFactory.create({ speed: 1000 });

        player.dropItem = (itemType) => {
            const itemCount = player.inventory[itemType];

            const droppedItem = item.create({
                causesCollisions: false,
                width: GRID_SIZE,
                height: GRID_SIZE,
                x: player.x,
                y: player.y,
                itemType,
                count: itemCount,
            });

            player.inventory[itemType] = 0;

            return droppedItem;
        };

        player.useItem = (itemType) => {
            const itemCount = player.inventory[itemType];

            let loseItems = false;

            switch (itemType) {
                case 'wood':
                    if (interactWith.type === 'fire') {
                        player.health += 10 * itemCount;
                        loseItems = true;
                    }
                    break;
                case 'corpse':
                    player.health +=  itemCount;
                    break;
                case 'cauldron':
                    if (interactWith.type === 'fire') {
                        interactWith.hasCauldron = true;
                        loseItems = true;
                    }
                    break;
                case 'herb':
                    if (interactWith.type === 'fire') {
                        if (interactWith.hasCauldron) {
                            notify.alert(`You got ${itemCount} potions!`);
                            player.inventory['potion'] = itemCount;
                        } else {
                            player.health += itemCount;
                        }

                        loseItems = true;
                    }
                    break;
                default:
                    return false;
            }

            if (loseItems) {
                player.inventory[itemType] = 0;
            }

            return true;
        };

        player.craftItem = (itemType) => {
            const item = CRAFTABLE_ITEMS.find(item => item.name === itemType);

            if (!player.inventory[item.name]) {
                player.inventory[item.name] = 1;
            } else {
                player.inventory[item.name]++;
            }

            for (let itemName in item.cost) {
                player.inventory[itemName] -= item.cost[itemName];
            }
        };

        player.giveItem = (itemType) => {
            const givingTo = player.entityInRange;

            const finishQuestId = player.quests.find(questId => {
                const quest = QUESTS[questId];

                return quest.goal.personId === givingTo.personId
                    && quest.goal.item === itemType &&
                    player.inventory[itemType] >= quest.goal.itemCount;
            });

            const finishQuest = QUESTS[finishQuestId];

            if (finishQuest) {
                const rewardText = [];

                player.inventory[finishQuest.goal.item] -= finishQuest.goal.itemCount;

                for (let itemName in finishQuest.reward) {
                    rewardText.push(`  +${finishQuest.reward[itemName]} ${itemName}`);

                    if (!player.inventory[itemName]) {
                        player.inventory[itemName] = finishQuest.reward[itemName];
                    } else {
                        player.inventory[itemName] += finishQuest.reward[itemName];
                    }
                }

                notify.alert([
                    'You finished the quest!',
                    'You get:',
                ].concat(rewardText));

                player.quests.splice(player.quests.indexOf(finishQuest), 1);

                return true;
            }

            notify.alert(['That doesn\'t do anything.']);

            return false;
        };

        return player;
    },
};