export const EVENTS = {
    INTERACT: 'INTERACT',
    TALKING: 'TALKING',
    BULLETIN: 'BULLETIN',
    CRAFTING: 'CRAFTING',
    INVENTORY: 'INVENTORY',
};

let currentEvent = null;
let isEventAcknowledged = false;

export default {
    raise: (event) => {
        isEventAcknowledged = false;
        currentEvent = event;
    },
    drop: () => {
        isEventAcknowledged = false;
        currentEvent = null;
    },
    get: () => {
        return currentEvent;
    },
    isAcknowledged: () => {
        return isEventAcknowledged;
    },
    acknowledge: () => {
        isEventAcknowledged = true;
    },
};