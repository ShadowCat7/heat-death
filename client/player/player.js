import entityFactory, { defaultDrawFunc } from '../entity/entity.js';

import {
    isCirclesColliding,
    isEntitiesColliding,
    isRectsColliding,
    rectEntityDistance,
} from '../utility/physics.js';

import {  INTERACT_RADIUS } from '../constants.js';
import itemFactory from '../entity/item.js';
import { CRAFTABLE_ITEMS } from './crafting.js';
import notify from '../utility/notify.js';
import { QUESTS } from './bulletin-board.js';
import swordFactory from './weapons/sword.js';
import createInventory from '../items/item-storage.js';
import levels from '../levels/levels.js';
import interactions from './interactions.js';
import dash from '../spells/dash.js';

const INVENTORY_SIZE = 18;

const MAX_SPEED = 300;

export default {
    create: (options) => {
        options.width = 30;
        options.height = 30;

        options.type = 'player';

        options.inventory = createInventory(INVENTORY_SIZE);
        options.inventory.addItem('metal', 10);

        options.quests = [];
        options.health = 100;

        options.direction = 'down';

        options.spells = [{
            key: 'leftClick',
            spell: dash(),
        }, {
            key: 'rightClick',
            spell: null,
        }];

        options.velocityX = 0;
        options.velocityY = 0;

        const setVelocityX = (newValue) => {
            if (Math.abs(newValue) >= Math.abs(player.velocityX)) {
                player.velocityX = newValue;
            }
        };
        const setVelocityY = (newValue) => {
            if (Math.abs(newValue) >= Math.abs(player.velocityY)) {
                player.velocityY = newValue;
            }
        };

        options.update = (player, controls, entityList, elapsedTime) => {
            player.entityInRange = null;
            const weapon = player.weapon;

            let isCasting = false;

            player.spells.forEach(spell => {
                if (!spell.spell) return;

                spell.spell.update(elapsedTime, controls, player);
                controls[spell.key] && spell.spell.activate(player, controls);

                if (spell.spell.isActivated()) {
                    isCasting = true;
                }
            });

            if (!isCasting) {
                if (controls.moveUp) {
                    setVelocityY(-MAX_SPEED);
                    if (!player.attacking) {
                        player.direction = 'up';
                    }
                } else if (controls.moveDown) {
                    setVelocityY(MAX_SPEED);
                    if (!player.attacking) {
                        player.direction = 'down';
                    }
                } else {
                    if (Math.abs(player.velocityY) < MAX_SPEED) {
                        player.velocityY = 0;
                    } else {
                        player.velocityY += player.velocityY > 0 ? -MAX_SPEED : MAX_SPEED;
                    }
                }

                if (controls.moveLeft) {
                    setVelocityX(-MAX_SPEED);
                    if (!player.attacking) {
                        player.direction = 'left';
                    }
                } else if (controls.moveRight) {
                    setVelocityX(MAX_SPEED);
                    if (!player.attacking) {
                        player.direction = 'right';
                    }
                } else {
                    if (Math.abs(player.velocityX) < MAX_SPEED) {
                        player.velocityX = 0;
                    } else {
                        player.velocityX += player.velocityX > 0 ? -MAX_SPEED : MAX_SPEED;
                    }
                }
            }

            if (Math.abs(player.velocityY) > MAX_SPEED) {
                player.velocityY += player.velocityY > 0 ? -MAX_SPEED : MAX_SPEED;
            }
            if (Math.abs(player.velocityX) > MAX_SPEED) {
                player.velocityX += player.velocityX > 0 ? -MAX_SPEED : MAX_SPEED;
            }

            if (!player.attacking && controls.attack && !controls.previousControls.attack) {
                player.attacking = true;
                // Setting default positioning for player position and direction
                weapon.update(elapsedTime, player);
            }

            let newX = player.x + player.velocityX * elapsedTime;
            let newY = player.y + player.velocityY * elapsedTime;

            let closestItemIndex = null;
            let closestItemDistance = null;

            for (let i = 0; i < entityList.length; i++) {
                const entity = entityList[i];

                if (entity === player) continue;
                entity.inInteractRange = false;

                const { x, y, didCollide } = isEntitiesColliding(player, newX, newY, entity);

                // fighting monsters
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
                        levels.createEntity(itemFactory.dropItem(
                            entity.x,
                            entity.y,
                            { key: 'corpse' },
                            entity.rect,
                        ));
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

            // interact with closest entity
            if (closestItemIndex !== null) {
                const entity = entityList[closestItemIndex];
                entity.inInteractRange = true;

                if (controls.interact && !controls.previousControls.interact) {
                    const interaction =  interactions.getInteraction('player', entity.type);

                    if (!interaction) {
                        player.entityInRange = entity;
                    }

                    interaction(player, entity);
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
            const item = player.inventory.removeKey(itemType);

            if (item) {
                return itemFactory.dropItem(player.x, player.y, item);
            }
        };

        player.useItem = (itemType) => {
            if (player.interactWith) {
                const interaction = interactions.getInteraction(player.interactWith.type, itemType);

                if (interaction) {
                    interaction(player, player.interactWith, itemType);
                    return true;
                }
            } else {
                const interaction = interactions.getInteraction('player', itemType);

                if (interaction) {
                    interaction(player, itemType);
                    return true;
                }
            }

            return false;
        };

        player.craftItem = (itemType) => {
            // TODO possibly add multiple crafting options
            const craftableItem = CRAFTABLE_ITEMS.find(item => item.name === itemType);

            for (let itemName in craftableItem.cost) {
                player.inventory.removeKey(itemName, craftableItem.cost[itemName]);
            }

            if (!player.inventory.addItem(craftableItem.name)) {
                itemFactory.dropItem(player.x, player.y, {
                    key: craftableItem.name,
                    count: 1,
                });
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

                player.inventory.removeKey(finishQuest.goal.item, finishQuest.goal.itemCount);

                for (let itemName in finishQuest.reward) {
                    rewardText.push(`  +${finishQuest.reward[itemName]} ${itemName}`);

                    player.inventory.addItem(itemName, finishQuest.reward[itemName]);
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