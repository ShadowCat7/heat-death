import createMenu from '../utility/slot-menu.js';

let inventoryMenu = null;

const getInventory = (inventory, entityInRange) => {
    const inventoryItems = [];

    inventory.forEach(i => {
        const item = i || {};

        const actions = ['use'];
        if (entityInRange) {
            actions.push('give');
        }

        actions.push('drop');

        inventoryItems.push({
            label: `${item.key}: ${item.count}`,
            id: item.key,
            disabled: item.count === 0,
            actions,
        });
    });

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