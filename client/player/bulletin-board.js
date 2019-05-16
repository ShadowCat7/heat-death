import createMenu from '../utility/menu.js';

export const QUESTS = [{
    name: 'Quest 0',
    goal: {
        personId: 'person id',
        item: 'wood',
        itemCount: 5,
    },
    reward: {
        'metal': 10,
    },
}];

let bulletinMenu = null;

const getQuests = (questIds, isBulletinBoard) => {
    return questIds.map((questId) => {
        const quest = QUESTS[questId];

        return {
            id: questId,
            label: quest.name,
            disabled: false,
            actions: isBulletinBoard ? ['take'] : [],
        }
    });
};

export default {
    initialize: (sprites) => {
        bulletinMenu = createMenu({
            items: [],
            title: 'Bulletin Board',
            cursorImage: sprites['arrow'],
        });
    },
    updateMenuItems: (questIds, isBulletinBoard) => {
        if (isBulletinBoard) {
            bulletinMenu.changeTitle('Bulletin Board');
        } else {
            bulletinMenu.changeTitle('Quest Log');
        }

        bulletinMenu.changeItems(getQuests(questIds, isBulletinBoard));
    },
    update: (showCursor, controls, chooseCallback) => {
        bulletinMenu.update(showCursor, controls, chooseCallback);
    },
    draw: (ctx) => {
        bulletinMenu.draw(ctx);
    },
};