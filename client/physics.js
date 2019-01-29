import { GRID_SIZE } from './constants.js';

export const distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
};

export const rectDistance = (rect1, x1, y1, rect2, x2, y2) => {
    return distance(
        x1 + rect1.width / 2,
        y1 + rect1.height / 2,
        x2 + rect2.width / 2,
        y2 + rect2.height / 2
    );
};

export const rectEntityDistance = (entity1, entity2) => {
    return rectDistance(entity1.rect, entity1.x, entity1.y, entity2.rect, entity2.x, entity2.y);
};

export const isInsideRect = (x1, y1, rect2, x2, y2) => {
    return x1 > x2 && x1 < x2 + rect2.width && y1 > y2 && y1 < y2 + rect2.height;
};

export const isRectsColliding = (rect1, x1, y1, rect2, x2, y2) => {
    if (isInsideRect(x1, y1, rect2, x2, y2))
        return true;

    if (isInsideRect(x1 + rect1.width, y1, rect2, x2, y2))
        return true;

    if (isInsideRect(x1, y1 + rect1.height, rect2, x2, y2))
        return true;

    if (isInsideRect(x1 + rect1.width, y1 + rect1.height, rect2, x2, y2))
        return true;

    return false;
};

export const isInsideCircle = (x1, y1, radius2, x2, y2) => {
    return distance(x1, y1, x2, y2) <= radius;
};

export const isCirclesColliding = (radius1, x1, y1, radius2, x2, y2) => {
    return distance(x1, y1, x2, y2) <= radius1 + radius2;
};

export const snapToGrid = (x, y) => {
    return {
        x: Math.round(x / GRID_SIZE) * GRID_SIZE,
        y: Math.round(y / GRID_SIZE) * GRID_SIZE,
    };
};

export const isEntitiesColliding = (entity1, x1, y1, entity2) => {
    let newX = x1;
    let newY = y1;

    let didCollide = false;

    if (isRectsColliding(entity1.rect, x1, y1, entity2.rect, entity2.x, entity2.y)) {
        if (isRectsColliding(entity1.rect, x1, entity1.y, entity2.rect, entity2.x, entity2.y)) {
            const isCollidingLeft = newX > entity2.x;
            let x = snapToGrid(isCollidingLeft ? x1 : x1 + entity1.rect.width, entity1.y).x;

            newX = isCollidingLeft ? x : x - entity1.rect.width;
            didCollide = true;
        }

        if (isRectsColliding(entity1.rect, entity1.x, newY, entity2.rect, entity2.x, entity2.y)) {
            const isCollidingUp = y1 > entity2.y;
            let y = snapToGrid(entity1.x, isCollidingUp ? y1 : y1 + entity1.rect.height).y;

            newY = isCollidingUp ? y : y - entity1.rect.height;
            didCollide = true;
        }

        // if you're gonna run into a corner you're gonna get stuck
        // try alternating solutions to get out
        if (!didCollide) {
            if (entity1.attemptY) {
                newY = entity1.y;
                entity1.attemptY = false;
            } else {
                newX = entity1.x;
                entity1.attemptY = true;
            }
        }

        didCollide = true;
    }

    return {
        x: newX,
        y: newY,
        didCollide,
    };
};