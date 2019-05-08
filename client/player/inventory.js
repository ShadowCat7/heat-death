import createMenu from '../utility/menu.js';

export const INVENTORY_ITEMS = [
    'wood',
    'corpse',
];

let inventoryMenu = null;

const getInventory = (inventory) => {
    const inventoryItems = [];

    for (let itemType in inventory) {
        const itemCount = inventory[itemType];

        inventoryItems.push({
            label: `${itemType}: ${itemCount}`,
            id: itemType,
            disabled: itemCount === 0,
            actions: [
                'use',
                'drop',
            ],
        });
    }

    return inventoryItems;
};

export default {
    alert: (alertText) => {
        inventoryMenu.alert(alertText);
    },
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
    updateMenuItems: (inventory) => {
        inventoryMenu.changeItems(getInventory(inventory));
    },
    update: (showCursor, controls, chooseCallback) => {
        inventoryMenu.update(showCursor, controls, chooseCallback);
    },
    draw: (ctx) => {
        inventoryMenu.draw(ctx);
    },
};