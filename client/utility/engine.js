const EPSILON = 0.00000001;
const TARGET_FPS = 60;
const FPS_SMOOTHNESS = 0.9;
const FPS_ONE_FRAME_WEIGHT = 1.0 - FPS_SMOOTHNESS;
const MIN_FPS = 20;
const MAX_SPF = 1 / MIN_FPS;

function Engine(canvas, updateFunc, drawFunc) {
    let self = this;
    let animationFrameId = null;
    let timeoutId = null;
    const buttonsPressed = {};
    const keysPressedLabel = document.getElementById('keypressed');
    const mouse = {
        x: 0,
        y: 0,
        leftClick: false,
        rightClick: false,
    };

    self.fps = TARGET_FPS;

    function mainLoop() {
        let previousUpdate = new Date().getTime();
        let previousDraw = new Date().getTime();

        function update() {
            let currentTime = new Date().getTime();
            let timeSinceLastUpdate = (currentTime - previousUpdate) / 1000;
            previousUpdate = currentTime;

            if (timeSinceLastUpdate < EPSILON)
                timeSinceLastUpdate = EPSILON;
            else if (timeSinceLastUpdate > MAX_SPF)
                timeSinceLastUpdate = MAX_SPF;

            setTimeout(function () {
                updateFunc(buttonsPressed, mouse, timeSinceLastUpdate);
            }, 0);

            animationFrameId = requestAnimationFrame(draw, canvas);
        }

        function draw() {
            let currentTime = new Date().getTime();
            let timeSinceLastDraw = (currentTime - previousDraw) / 1000;
            let fps = 1 / timeSinceLastDraw;
            previousDraw = currentTime;

            self.fps = self.fps * FPS_SMOOTHNESS + fps * FPS_ONE_FRAME_WEIGHT;

            setTimeout(function () {
                drawFunc(mouse);
            }, 0);

            timeoutId = setTimeout(update, 0);
        }

        update();
    }

    self.start = function () {
        mainLoop();
    };

    self.stop = function () {
        cancelAnimationFrame(animationFrameId);
        clearTimeout(timeoutId);
    };

    document.addEventListener('keydown', (e) => {
        e.stopPropagation();

        keysPressedLabel.innerHTML = (e.code);
        buttonsPressed[e.code] = true;

        if (!(buttonsPressed['KeyR'] && buttonsPressed['ControlLeft'] ||
            buttonsPressed['Tab'] && buttonsPressed['AltLeft'])) {
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {
        e.stopPropagation();
        buttonsPressed[e.code] = false;
    });

    canvas.onmousedown = (e) => {
        e.stopPropagation();
        e.preventDefault();

        mouse.leftClick = e.button === 0;
        mouse.rightClick = e.button === 2;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    canvas.onmouseup = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (e.button === 0) {
            mouse.leftClick = false;
        } else if (e.button === 2) {
            mouse.rightClick = false;
        }

        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, false);

    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
    }, false);
}

export default {
    create: function (canvas, updateFunc, drawFunc) {
        return new Engine(canvas, updateFunc, drawFunc);
    }
};
