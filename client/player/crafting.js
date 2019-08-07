import createMenu from '../utility/menu.js';

export const CRAFTABLE_ITEMS = [{
    name: 'shelter',
    cost: {
        'wood': 30,
    },
}, {
    name: 'cauldron',
    cost: {
        'metal': 10,
    },
}];

let craftingMenu = null;

const getCraftingMenuItem = (item, inventory) => {
    let costText = '';
    let cannotBuild = true;


    for (let itemName in item.cost) {
        const inventoryItem = inventory.getKey(itemName) || {};
        console.log(inventoryItem);

        const count = inventoryItem.count || 0;

        costText += `${itemName} ${count}/${item.cost[itemName]} `;

        if (count >= item.cost[itemName]) {
            cannotBuild = false;
        }
    }

    return {
        label: `${item.name} (${costText.trim()})`,
        id: item.name,
        disabled: cannotBuild,
        actions: ['craft'],
    };
};

export default {
    initialize: (sprites) => {
        craftingMenu = createMenu({
            items: [],
            title: 'Crafting',
            cursorImage: sprites['arrow'],
        });
    },
    updateMenuItems: (inventory) => {
        craftingMenu.changeItems(CRAFTABLE_ITEMS.map(item => {
            return getCraftingMenuItem(item, inventory);
        }));
    },
    update: (showCursor, controls, chooseCallback) => {
        craftingMenu.update(showCursor, controls, chooseCallback);
    },
    draw: (ctx) => {
        craftingMenu.draw(ctx);
    },
};