export const drawRect = (ctx, rect, x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, rect.width, rect.height);
};

export const drawLine = (ctx, startX, startY, endX, endY, color) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.stroke();
};

const DEFAULT_FONT = '30px Arial';
const DEFAULT_COLOR = '#e0e0e0';
const DEFAULT_TEXT_ALIGN = 'left';
const DEFAULT_TEXT_BASELINE = 'top';
const DEFAULT_LINE_HEIGHT = 30;
export const DEFAULT_PADDING = 10;
export const drawText = (ctx, text, x, y, options = {}) => {
    const {
        font = DEFAULT_FONT,
        textColor = DEFAULT_COLOR,
        textAlign = DEFAULT_TEXT_ALIGN,
        textBaseline = DEFAULT_TEXT_BASELINE,
        lineHeight = DEFAULT_LINE_HEIGHT,
        verticalPadding = DEFAULT_PADDING,
    } = options;

    ctx.font = font;
    ctx.fillStyle = textColor;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;

    if (typeof text === 'string') {
        ctx.fillText(text, x, y);
    } else {
        for (let i = 0; i < text.length; i++) {
            ctx.fillText(text[i], x, y + (lineHeight + verticalPadding) * i);
        }
    }
};

export const DEFAULT_BORDER_COLOR = '#e0e0e0';
const DEFAULT_BORDER_WIDTH = 5;
const DEFAULT_BACKGROUND_COLOR = '#000';
export const drawBorder = (ctx, options = {}) => {
    const {
        x,
        y,
        width,
        height,
        borderColor = DEFAULT_BORDER_COLOR,
        borderWidth = DEFAULT_BORDER_WIDTH,
        backgroundColor = DEFAULT_BACKGROUND_COLOR,
        textLineCount,
        lineHeight = DEFAULT_LINE_HEIGHT,
        verticalPadding = DEFAULT_PADDING,
    } = options;

    let calculatedHeight = height;
    if (!height) {
        calculatedHeight = borderWidth * 2 + verticalPadding + textLineCount * (lineHeight + verticalPadding);
    }

    ctx.fillStyle = borderColor;
    ctx.fillRect(x, y, width, calculatedHeight);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x + borderWidth, y + borderWidth, width - borderWidth * 2, calculatedHeight - borderWidth * 2);
};

export const drawBorderedText = (ctx, text, options = {}) => {
    const {
        x,
        y,
        borderWidth = DEFAULT_BORDER_WIDTH,
        horizontalPadding = DEFAULT_PADDING,
        verticalPadding = DEFAULT_PADDING,
    } = options;

    drawBorder(ctx,  {
        textLineCount: (typeof text) === 'string' ? 1 : text.length,
        ...options
    });
    drawText(ctx, text, x + borderWidth + horizontalPadding, y + borderWidth + verticalPadding, options);
};

export const drawInteractText = (ctx, viewX, viewY, action, entity) => {
    const x = entity.x - viewX;
    const y = entity.y - viewY;

    drawText(ctx, action, x + entity.rect.width / 2, y, {
        font: '22px Arial',
        textAlign: 'center',
        textBaseline: 'bottom',
    });
};