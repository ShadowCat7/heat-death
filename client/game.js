import engineFactory from './engine.js';
import loadImages from './image-loader.js';
import spriteData from './sprite.js';
import { controlsToString, getControls } from './controls.js';

let canvas = null;
let fpsLabel = null;
let engine = null;
let previousControls = {};

let spriteSheet = null;
let showDevInfo = false;
let devDiv = null;
let controlsList = null;

let controls = {};
let providedUpdate = null;
let providedDraw = null;

function draw() {
    let ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    //ctx.scale(2,2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fpsLabel.innerHTML = Math.round(engine.fps);

    providedDraw(ctx);
}

function update(buttonsPressed, elapsedTime) {
    controls = getControls(buttonsPressed);

    controls.previousControls = previousControls;

    if (controls.showDevInfo && !controls.previousControls.showDevInfo) {
        showDevInfo = !showDevInfo;
        devDiv.hidden = showDevInfo;
    }

    providedUpdate(controls, elapsedTime);

    previousControls = controls;
}

export const startGame = (updateFunc, drawFunc) => {
    providedUpdate = updateFunc;
    providedDraw = drawFunc;
    engine = engineFactory.create(canvas, update, draw);
    engine.start();
};

export const loadGame = (callback) => {
    document.addEventListener('DOMContentLoaded', () => {
        devDiv = document.getElementById('dev');
        devDiv.hidden = showDevInfo;
        devDiv.innerHTML = `
<p>fps:</p>
<p id="fps"></p>
<p>keycode: <span id="keypressed"></span></p>
<img id="sprite" />
<p id="controls"></p>
        `;

        canvas = document.getElementById('game');
        canvas.oncontextmenu = () => {
            return false;
        };

        //canvas.width = 1600;
        //canvas.height = 1200;
        //canvas.style.width = "800px";
        //canvas.style.height = "600px";

        fpsLabel = document.getElementById('fps');
        spriteSheet = document.getElementById('sprite');
        spriteSheet.src = spriteData.sprite;
        controlsList = document.getElementById('controls');
        controlsList.innerHTML = controlsToString();

        new Promise(loadImages).then(callback);
    });
};