import spellFactory from './spell.js';
import { getMouseRelativeToPlayer } from '../utility/controls.js';
import { distance } from '../utility/physics.js';
import timerFactory from '../utility/timer.js';

const COOLDOWN = 3;
const NAME = 'Dash';

const DASH_SPEED = 1100;
const DASH_DURATION = 0.25;

export default () => {
    const spell = spellFactory({
        cooldown: COOLDOWN,
    });

    const timer = timerFactory(DASH_DURATION);
    let isActivated = false;
    let dashX = null;
    let dashY = null;

    return {
        isActivated: () => isActivated,
        getName: () => NAME,
        update: (elapsedTime, controls, player) => {
            spell.update(elapsedTime);

            if (isActivated) {
                if (timer.update(elapsedTime)) {
                    isActivated = false;
                } else {
                    player.velocityX = dashX;
                    player.velocityY = dashY;
                }
            }
        },
        activate: (player, controls) => {
            if (spell.activate()) {
                isActivated = true;
                timer.reset();

                const mouse = getMouseRelativeToPlayer(controls, player);
                const playerX = player.x + player.rect.width / 2;
                const playerY = player.y + player.rect.height / 2;

                const distanceBetween = distance(mouse.x, mouse.y, playerX, playerY);

                const diffX = mouse.x - playerX;
                const diffY = mouse.y - playerY;

                dashX = diffX * DASH_SPEED / distanceBetween;
                dashY = diffY * DASH_SPEED / distanceBetween;
            }
        },
    };

};