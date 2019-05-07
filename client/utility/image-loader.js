import spriteData from '../sprite.js';

let image = null;

export default (callback) => {
    image = new Image();

    image.onload = () => {
        const promises = [];
        const imageNames = [];

        for (let imageName in spriteData.spriteData) {
            const imageData = spriteData.spriteData[imageName];
            imageNames.push(imageName);

            promises.push(createImageBitmap(image, imageData.x, imageData.y, imageData.width, imageData.height));
        }

        Promise.all(promises).then((images) => {
            const sprites = {};
            imageNames.forEach((name, i) => sprites[name] = images[i]);
            callback(sprites);
        });
    };

    image.src = spriteData.sprite;
};