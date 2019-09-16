import clock from './clock.js';
import { HP_BAR_HEIGHT, VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';
import { drawRect, drawSlot, drawText, SLOT_BORDER_WIDTH, SLOT_WIDTH } from '../utility/draw-utility.js';

const SPELL_SLOT_WIDTH = 80;
const COOLDOWN_BAR_HEIGHT = 10;
const COOLDOWN_BAR_MARGIN = 20;

const drawSpell = (ctx, options) => {
    const {
        spell,
        x,
        y
    } = options;

    drawSlot(ctx, {
        x,
        y: y + 10,
        width: SPELL_SLOT_WIDTH - SLOT_BORDER_WIDTH,
    });

    if (spell) {
        const cooldown = spell.getCooldownComplete() || 1;

        drawRect(
            ctx,
            {
                width: SPELL_SLOT_WIDTH * cooldown,
                height: COOLDOWN_BAR_HEIGHT,
            },
            x,
            y,
            cooldown === 1 ? '#aaffcc' : '#aaccee',
        );
    }
};

export default {
    draw: (ctx, player) => {
        // player health bar
        ctx.fillStyle = '#909090';
        ctx.fillRect(0, 0, VIEW_WIDTH, HP_BAR_HEIGHT);

        ctx.fillStyle = 'green';
        ctx.fillRect(3, 3, player.health / 1000 * (VIEW_WIDTH - 6), 15);

        drawText(ctx, `${player.health}/1000`, VIEW_WIDTH / 2, 6, {
            fontSize: '12px',
            textAlign: 'center',
        });

        clock.draw(ctx);

        const spellsWidth = SPELL_SLOT_WIDTH + (COOLDOWN_BAR_HEIGHT + COOLDOWN_BAR_MARGIN) * (player.spells.length - 1);
        const spellsX = VIEW_WIDTH / 2 - spellsWidth / 2;

        player.spells.forEach((spell, index) => {
            drawSpell(ctx, {
                spell: spell.spell,
                x: spellsX + index * (SPELL_SLOT_WIDTH + COOLDOWN_BAR_MARGIN),
                y: VIEW_HEIGHT - 120,
            })
        });
    },
    update: (elapsedTime) => {
        clock.update(elapsedTime);
    },
};