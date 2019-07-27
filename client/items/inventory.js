const removeItem = (map, list, key, count) => {
    if (!key) {
        return null;
    }

    const item = map[key];

    if (!item) {
        return null;
    }

    if (!count) {
        count = item.count;
    }

    let returnCount = count;

    if (item.count <= count) {
        delete map[key];
        list[index] = null;
        returnCount = item.count;
    } else {
        item.count -= count;
    }

    return {
        key: item.key,
        count: returnCount,
    };
};

export default (size) => {
    const map = {};
    const list = [];

    list[size - 1] = null;
    list.fill(null, 0, size - 2);

    return {
        addItem: (key, count) => {
            let item = map[key];
            let index = null;

            if (!item) {
                for (let i = 0; i < size || index !== null; i++) {
                    if (!list[i]) {
                        index = i;
                    }
                }

                if (index === null) {
                    return false;
                }

                item = { key, index, count };

                map[key] = item;
                list[index] = key;
            } else {
                item.count += count;
            }

            return true;
        },
        removeItem: (index, count) => {
            const key = list[index];

            return removeItem(map, list, key, count);
        },
        removeKey: (key, count) => {
            return removeItem(map, list, key, count);
        },
        swapItems: (index1, index2) => {
            const item1 = list[index1];
            const item2 = list[index2];

            list[index1] = item2;
            list[index2] = item1;

            item1.index = index2;
            item2.index = index1;
        },
        forEach: (func) => {
            for (let i = 0; i < list.length; i++) {
                const item = map[list[i]];
                func(item);
            }
        },
        getItem: (index) => {
            const key = list[index];

            return {
                key,
                count: map[key].count,
            };
        },
        getKey: (key) => {
            const item = map[key];

            return {
                key,
                count: item.count,
            };
        },
    };
};