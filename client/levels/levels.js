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

        entityList = entityList.concat(entities);

        levels[x][y] = entities;
    },
    draw: (ctx, player) => {
        let viewX = player.x - VIEW_WIDTH / 2 + player.rect.width / 2;
        let viewY = player.y - VIEW_HEIGHT / 2 + player.rect.height / 2;

        player.draw(ctx, viewX, viewY, player);

        // Array.prototype.sort mutates
        entityList.sort((e1, e2) => {
            if (e1.y === e2.y) return 0;
            return e1.y > e2.y ? 1 : -1;
        });

        for (let i = 0; i < entityList.length; i++) {
            entityList[i].draw(ctx, viewX, viewY, player);
        }
    },
    drawMap: (ctx, player) => {
        map.draw(ctx, player, entityList);
    },
    update: (controls, elapsedTime, player) => {
        for (let i = 0; i < entityList.length; i++) {
            entityList[i].update(controls, entityList, elapsedTime, player);
        }

        player.update(controls, entityList, elapsedTime, player);
    },
    createEntity: (entity) => {
        entityList.push(entity);
    },
    load: () => {

    },
};