export default (timeLimit) => {
    let time = 0;
    let limit = timeLimit;

    return {
        update: (elapsedTime) => {
            time += elapsedTime;

            if (time >= timeLimit) {
                time -= timeLimit;
                return true;
            }

            return false;
        },
        changeTimeLimit: (newLimit) => { limit = newLimit; },
        getTime: () => {
            return time;
        },
    };
};