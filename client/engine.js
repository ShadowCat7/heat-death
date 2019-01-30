const EPSILON = 0.00000001;
const TARGET_FPS = 60;
const TARGET_SPF = 1 / TARGET_FPS;
const FPS_SMOOTHNESS = 0.9;
const FPS_ONE_FRAME_WEIGHT = 1.0 - FPS_SMOOTHNESS;
const MIN_FPS = 20;
const MAX_SPF = 1 / MIN_FPS;

function Engine(canvas, updateFunc, drawFunc) {
    var self = this;
    var animationFrameId = null;
    var timeoutId = null;
    const buttonsPressed = {};
    var keysPressedLabel = document.getElementById('keypressed');

    self.fps = TARGET_FPS;

    function mainLoop() {
        var previousUpdate = new Date().getTime();
        var previousDraw = new Date().getTime();

        function update() {
            var currentTime = new Date().getTime();
            var timeSinceLastUpdate = (currentTime - previousUpdate) / 1000;
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
            var currentTime = new Date().getTime();
            var timeSinceLastUpdate = (currentTime - previousUpdate) / 1000;
            var timeSinceLastDraw = (currentTime - previousDraw) / 1000;
            var fps = 1 / timeSinceLastDraw;
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
    }

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
