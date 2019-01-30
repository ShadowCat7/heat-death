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
                updateFunc(buttonsPressed, timeSinceLastUpdate);
            }, 0);

            animationFrameId = requestAnimationFrame(draw, canvas);
        }

        function draw() {
            let currentTime = new Date().getTime();
            let timeSinceLastUpdate = (currentTime - previousUpdate) / 1000;
            let timeSinceLastDraw = (currentTime - previousDraw) / 1000;
            let fps = 1 / timeSinceLastDraw;
            previousDraw = currentTime;

            self.fps = self.fps * FPS_SMOOTHNESS + fps * FPS_ONE_FRAME_WEIGHT;

            setTimeout(function () {
                drawFunc(timeSinceLastUpdate);
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

    document.addEventListener('keydown', function (e) {
        e.stopPropagation();
        keysPressedLabel.innerHTML = (e.code);
        buttonsPressed[e.code] = true;
    });

    document.addEventListener('keyup', function (e) {
        e.stopPropagation();
        buttonsPressed[e.code] = false;
    });
}

export default {
    create: function (canvas, updateFunc, drawFunc) {
        return new Engine(canvas, updateFunc, drawFunc);
    }
};
