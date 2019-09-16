import { GRID_SIZE } from '../constants.js';

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

export const getDirection = (x1, y1, x2, y2) => {
    return Math.atan2(y2 - y1, x2 - x1);
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

export const moveEntityTo = (entity, x, y, elapsedTime) => {
    const theta = getDirection(entity.x, entity.y, x, y);

    const xDiff = entity.maxSpeed * Math.cos(theta) * elapsedTime;
    const yDiff = entity.maxSpeed * Math.sin(theta) * elapsedTime;

    return {
        newX: entity.x + xDiff,
        newY: entity.y + yDiff,
    }
};

// TODO
export const areLinesIntersecting = (line1, line2) => {
    let interceptX;
    let interceptY;

    if (line1.x1 === line1.x2) {
        if (line2.x1 === line2.x2) {

        }

        if (line2.x1 <= line1.x1 && line1.x1 <= line2.x2) {
            return;
        }
    } else if (line2.x1 === line2.x2) {
        return;
    } else {
        const slope1 = (line1.y1 - line1.y2) / (line1.x1 - line1.x2);
        const yIntercept1 = line1.y1 - slope1 * line1.x1;

        const slope2 = (line2.y1 - line2.y2) / (line2.x1 - line2.x2);
        const yIntercept2 = line2.y1 - slope2 * line2.x1;

        interceptX = (yIntercept2 - yIntercept1) / (slope1 - slope2);
        interceptY = slope1 * interceptX + yIntercept1;
    }

    if (interceptX >= line1.x1 && interceptX <= line1.x2
        && interceptX >= line2.x1 && interceptX <= line2.x2
        && interceptY >= line1.y1 && interceptY <= line1.y2
        && interceptY >= line2.y1 && interceptY <= line2.y2) {

        return { x: interceptX, y: interceptY };
    }

    return null;
};