import createMenu from '../utility/menu.js';

let inventoryMenu = null;

const getInventory = (inventory, entityInRange) => {
    const inventoryItems = [];

    for (let itemType in inventory) {
        const itemCount = inventory[itemType];

        const actions = ['use'];
        if (entityInRange) {
            actions.push('give');
        }

        actions.push('drop');

        inventoryItems.push({
            label: `${itemType}: ${itemCount}`,
            id: itemType,
            disabled: itemCount === 0,
            actions,
        });
    }

    return inventoryItems;
};

export default {
    changeTitle: (title) => {
        inventoryMenu.changeTitle(title);
    },
    initialize: (sprites) => {
        inventoryMenu = createMenu({
            items: [],
            title: 'Inventory',
            cursorImage: sprites['arrow'],
        });
    },
    updateMenuItems: (inventory, entityInRange) => {
        inventoryMenu.changeItems(getInventory(inventory, entityInRange));
    },
    update: (showCursor, controls, chooseCallback) => {
        inventoryMenu.update(showCursor, controls, chooseCallback);
    },
    draw: (ctx) => {
        inventoryMenu.draw(ctx);
    },
};