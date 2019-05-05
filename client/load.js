import block from './entity/block.js';
import fire from './entity/fire.js';
import tree from './entity/tree.js';
import person from './entity/person.js';

export default (saveData) => {
    return saveData.map(e => {
        let genFunction = null;
        switch (e.type) {
            case 'tree':
                genFunction = tree.create;
                break;
            case 'fire':
                genFunction = fire.create;
                break;
            case 'block':
                genFunction = block.create;
                break;
            case 'person':
                genFunction = person.create;
                break;
            default:
                console.error('This entity type does not exist (load.js).');
        }

        return genFunction({
            x: e.x,
            y: e.y,
            type: e.type,
        });
    });
}