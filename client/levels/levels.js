import map from '../utility/map.js';

import { LEVEL_HEIGHT, LEVEL_WIDTH, VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';

const levels = [];

let entityList = [];

export default {
    insert: (entities, x, y) => {
        if (!levels[x]) {
            levels[x] = [];
        }

        const levelX = LEVEL_WIDTH * x;
        const levelY = LEVEL_HEIGHT * y;

        for (let i = 0; i < entities.length; i++) {
            entities[i].x += levelX;
            entities[i].y += levelY;
        }

        levels[x][y] = entities;
    },
    draw: (ctx, player) => {
        let viewX = player.x - VIEW_WIDTH / 2 + player.rect.width / 2;
        let viewY = player.y - VIEW_HEIGHT / 2 + player.rect.height / 2;

        for (let i = 0; i < entityList.length; i++) {
            entityList[i].draw(ctx, viewX, viewY, player);
        }

        player.draw(ctx, viewX, viewY, player);
    },
    drawMap: (ctx, player) => {
        map.draw(ctx, player, entityList);
    },
    update: (controls, elapsedTime, player) => {
        entityList = levels[0][0].concat(levels[1][0]);

        for (let i = 0; i < entityList.length; i++) {
            entityList[i].update(controls, entityList, elapsedTime, player);
        }

        player.update(controls, entityList, elapsedTime, player);
    },
    createEntity: (entity) => {
        levels[0][0].push(entity);
    },
    load: () => {

    },
};