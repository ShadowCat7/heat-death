import load from '../load.js';

const saveDataDiv = document.getElementById('save');
const loadDataTextarea = document.getElementById('load');

loadDataTextarea.addEventListener('keydown', (e) => {
    e.stopPropagation();
});

export default {
    showData: (entity) => {
        saveDataDiv.innerText = JSON.stringify(entity.data || {});
    },
    storeData: (entity) => {
        const json = loadDataTextarea.value || '';
        let data = null;

        try {
            data = JSON.parse(json.trim());
        } catch {
            console.error('Bad JSON');
        }

        if (data) {
            loadDataTextarea.value = '';

            entity.data = data;
        }
    },
    save: (data) => {
        const saveData = [];

        for (let coord in data) {
            const entity = data[coord];
            const entityData = {
                type: entity.type,
                x: entity.x,
                y: entity.y,
                data: entity.data,
            };

            saveData.push(entityData);
        }

        saveDataDiv.innerText = `export default ${JSON.stringify(saveData)}`;
    },
    load: () => {
        const json = loadDataTextarea.value || '';
        let data = null;

        try {
            data = JSON.parse(json.trim());
        } catch {
            console.error('Bad JSON');
        }

        if (data) {
            loadDataTextarea.value = '';

            return load(data);
        }
    }
};