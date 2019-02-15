const saveDataDiv = document.getElementById('save');

export default (data) => {
    const saveData = [];

    for (let coord in data) {
        const entity = data[coord];
        const entityData = {
            type: entity.type,
            x: entity.x,
            y: entity.y,
        };

        saveData.push(entityData);
    }

    saveDataDiv.innerText = `export default ${JSON.stringify(saveData)}`;
};