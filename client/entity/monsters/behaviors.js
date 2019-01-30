import createTimer from '../../timer.js';
import { distance, getDirection } from '../../physics.js';

export const moveRandom = (monster) => {
    const timer = createTimer(Math.random() * 4 + 3);
    let direction = Math.random() * 8;

    return (elapsedTime) => {
        if (timer.update(elapsedTime)) {
            timer.changeTimeLimit(Math.random() * 4 + 3);
            direction = Math.random() * 8;
        }

        let newX = monster.x;
        let newY = monster.y;

        if (direction < 1) {
            newX -= elapsedTime * monster.maxSpeed;
        } else if (direction < 2) {
            newX += elapsedTime * monster.maxSpeed;
        } else if (direction < 3) {
            newY -= elapsedTime * monster.maxSpeed;
        } else if (direction < 4) {
            newY += elapsedTime * monster.maxSpeed;
        } else if (direction < 5) {
            newX -= elapsedTime * monster.maxSpeed;
            newY -= elapsedTime * monster.maxSpeed;
        } else if (direction < 6) {
            newX -= elapsedTime * monster.maxSpeed;
            newY += elapsedTime * monster.maxSpeed;
        } else if (direction < 7) {
            newX += elapsedTime * monster.maxSpeed;
            newY -= elapsedTime * monster.maxSpeed;
        } else if (direction < 8) {
            newX += elapsedTime * monster.maxSpeed;
            newY += elapsedTime * monster.maxSpeed;
        }

        return { newX, newY };
    }
};

export const standStill = (monster) => {
    return () => {
        return {
            newX: monster.x,
            newY: monster.y,
        };
    };
};

export const chasePlayer = (monster) => {
    return (elapsedTime, player) => {
        const theta = getDirection(monster.x, monster.y, player.x, player.y);

        const xDiff = monster.maxSpeed * Math.cos(theta) * elapsedTime;
        const yDiff = monster.maxSpeed * Math.sin(theta) * elapsedTime;

        return {
            newX: monster.x + xDiff,
            newY: monster.y + yDiff,
        }
    };
};

export const chasePlayerIfClose = (monster, distanceToChangeBehavior) => {
    const chase = chasePlayer(monster);
    const random = moveRandom(monster);
    return (elapsedTime, player) => {
        if (distance(monster.x, monster.y, player.x, player.y) <= (distanceToChangeBehavior || 200)) {
            return chase(elapsedTime, player);
        } else {
            return random(elapsedTime);
        }
    };
};