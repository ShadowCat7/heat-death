import { VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';

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

const setupTextContext = (ctx, options = {}) => {
    const {
        font = DEFAULT_FONT,
        textColor = DEFAULT_TEXT_COLOR,
        textAlign = DEFAULT_TEXT_ALIGN,
        textBaseline = DEFAULT_TEXT_BASELINE,
    } = options;

    ctx.font = font;
    ctx.fillStyle = textColor;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
};

const DEFAULT_FONT = '30px Arial';
export const DEFAULT_TEXT_COLOR = '#e0e0e0';
const DEFAULT_TEXT_ALIGN = 'left';
const DEFAULT_TEXT_BASELINE = 'top';
export const DEFAULT_LINE_HEIGHT = 30;
export const DEFAULT_PADDING = 10;
export const drawText = (ctx, text, x, y, options = {}) => {
    const {
        lineHeight = DEFAULT_LINE_HEIGHT,
        verticalPadding = DEFAULT_PADDING,
    } = options;

    setupTextContext(ctx, options);

    if (typeof text === 'string') {
        ctx.fillText(text, x, y);
    } else {
        for (let i = 0; i < text.length; i++) {
            ctx.fillText(text[i], x, y + (lineHeight + verticalPadding) * i);
        }
    }
};

export const DEFAULT_BORDER_COLOR = '#e0e0e0';
export const DEFAULT_BORDER_WIDTH = 5;
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
    } = options;

    ctx.fillStyle = borderColor;
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x + borderWidth, y + borderWidth, width - borderWidth * 2, height - borderWidth * 2);
};

const getTextWidth = (ctx, text, options) => {
    const {
        borderWidth = DEFAULT_BORDER_WIDTH,
        horizontalPadding = DEFAULT_PADDING,
    } = options;

    let calculatedWidth = 0;

    setupTextContext(ctx, options);

    if ((typeof text) === 'string') {
        calculatedWidth = ctx.measureText(text).width;
    } else {
        for (let i = 0; i < text.length; i++) {
            calculatedWidth = Math.max(calculatedWidth, ctx.measureText(text[i]).width)
        }
    }

    calculatedWidth += horizontalPadding * 2 + borderWidth * 2;

    return calculatedWidth;
};

export const getDimensions = (ctx, text, options) => {
    const {
        borderWidth = DEFAULT_BORDER_WIDTH,
        lineHeight = DEFAULT_LINE_HEIGHT,
        verticalPadding = DEFAULT_PADDING,
        isBoxCentered = false,
    } = options;

    let { x, y } = options;

    const textLineCount = (typeof text) === 'string' ? 1 : text.length;

    const width = getTextWidth(ctx, text, options);
    const height = borderWidth * 2 + verticalPadding + textLineCount * (lineHeight + verticalPadding);

    if (isBoxCentered) {
        x = VIEW_WIDTH / 2 - width / 2;
        y = VIEW_HEIGHT / 2 - height / 2;
    }

    return {
        width,
        height,
        x,
        y,
    };
};

export const drawBorderedText = (ctx, text, options = {}) => {
    const {
        width,
        height,
        borderWidth = DEFAULT_BORDER_WIDTH,
        horizontalPadding = DEFAULT_PADDING,
        lineHeight = DEFAULT_LINE_HEIGHT,
        verticalPadding = DEFAULT_PADDING,
    } = options;

     if (!width) {
        options.width = getTextWidth(ctx, text, options);
    }

    let calculatedHeight = height;
    if (!height) {
        calculatedHeight = borderWidth * 2 + verticalPadding + textLineCount * (lineHeight + verticalPadding);
    }
    options.height = calculatedHeight;

    drawBorder(ctx,  options);

    drawText(
        ctx,
        text,
        options.x + borderWidth + horizontalPadding,
        options.y + borderWidth + verticalPadding,
        options
    );
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