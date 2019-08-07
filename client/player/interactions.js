import items from '../items/items.js';
import notify from '../utility/notify.js';
import itemFactory from '../entity/item.js';
import events, { EVENTS } from '../utility/events.js';
import levels from '../levels/levels.js';
import stump from '../entity/stump.js';

const getKey = (interactWithType, usedType) => {
    return `${interactWithType}--${usedType}`;
};

const interactions = {
    player: {
        item: (player, entity) => {
            if (player.inventory.addItem(entity.itemType, entity.count)) {
                levels.removeEntity(entity);
            }
        },
        fire: (player, entity) => {
            player.interactWith = entity;
            events.raise(EVENTS.INTERACT);
        },
        tree: (player, entity) => {
            levels.removeEntity(entity);
            levels.createEntity(stump.create({
                x: entity.x,
                y: entity.y,
            }));

            // TODO turn tree into stump

            if (!player.inventory.addItem(items.wood, 10)) {
                itemFactory.dropItem(player.x, player.y, { name: items.wood, });
            }
        },
        person: (player, entity) => {
            player.talkingTo = entity;
            events.raise(EVENTS.TALKING);
        },
        bulletin: (player, entity) => {
            player.talkingTo = entity;
            events.raise(EVENTS.BULLETIN);
        },
    },
    fire: {
        [items.wood]: (player, interactWith) => {
            const item = player.inventory.removeKey(items.wood);
            player.health += 10 * item.count;
        },
        [items.corpse]: (player, interactWith) => {
            const item = player.inventory.removeKey(items.corpse);
            player.health += item.count;
        },
        [items.cauldron]: (player, interactWith) => {
            player.inventory.removeKey(items.cauldron, 1);
            interactWith.hasCauldron = true;
        },
        [items.herb]: (player, interactWith) => {
            const item = player.inventory.removeKey(items.herb);

            if (interactWith.hasCauldron) {
                if (player.inventory.addItem(items.potion, item.count)) {
                    notify.alert(`You got ${item.count} potions!`);
                } else {
                    itemFactory.dropItem(player.x, player.y, { key: items.potion, count: item.count });
                }
            } else {
                player.health += item.count;
            }
        }
    },
};

const interactionsFlat = {};

for (let interactWithType in interactions) {
    if (interactions.hasOwnProperty(interactWithType)) {
        const interactionSet = interactions[interactWithType];

        for (let usedType in interactionSet) {
            if (interactionSet.hasOwnProperty(usedType)) {
                interactionsFlat[getKey(interactWithType, usedType)] = interactionSet[usedType];
            }
        }
    }
}

const getInteraction = (interactWithType, usedType) => {
    return interactionsFlat[getKey(interactWithType, usedType)];
};

export default {
    getInteraction: (interactWithType, usedType) => {
        return getInteraction(interactWithType, usedType);
    },
}