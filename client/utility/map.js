import { snapToGrid } from './physics.js';
import { GRID_SIZE, VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';

export default {
    draw: (ctx, player, entityList) => {
        const MAP_GRID_SIZE = 4;
        const gridView = snapToGrid(player.x, player.y);
        gridView.x = gridView.x / GRID_SIZE * MAP_GRID_SIZE - VIEW_WIDTH / 2;
        gridView.y = gridView.y / GRID_SIZE * MAP_GRID_SIZE - VIEW_HEIGHT / 2;

        for (let i = 0; i < entityList.length; i++) {
            const entity = entityList[i];
            const x = entity.x / GRID_SIZE * MAP_GRID_SIZE - gridView.x;
            const y = entity.y / GRID_SIZE * MAP_GRID_SIZE - gridView.y;

            ctx.fillStyle = entity.color || '#ffffff';
            ctx.fillRect(x, y, MAP_GRID_SIZE, MAP_GRID_SIZE);
        }
    },
};