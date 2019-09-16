import { GRID_SIZE, VIEW_HEIGHT, VIEW_WIDTH } from '../constants.js';

export const drawRect = (ctx, rect, x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, rect.width, rect.height);
};

export const fillScreen = (ctx, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
};

export const drawLine = (ctx, startX, startY, endX, endY, color) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.stroke();
};

export const rotateDrawRect = (ctx, options) => {
    const {
        rect,
        x,
        y,
        color,
        rotateX,
        rotateY,
        rotation,
    } = options;

    const translateX = rotateX + x;
    const translateY = rotateY + y;

    ctx.translate(translateX, translateY);
    ctx.rotate(rotation);
    ctx.translate(-translateX, -translateY);

    ctx.fillStyle = color;
    ctx.fillRect(x, y, rect.width, rect.height);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
};

const setupTextContext = (ctx, options = {}) => {
    const {
        fontSize = DEFAULT_FONT_SIZE,
        font = DEFAULT_FONT,
        textColor = DEFAULT_TEXT_COLOR,
        textAlign = DEFAULT_TEXT_ALIGN,
        textBaseline = DEFAULT_TEXT_BASELINE,
    } = options;

    ctx.font = `${fontSize} ${font}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
};

const DEFAULT_FONT = 'Arial';
const DEFAULT_FONT_SIZE = '30px';
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

export const getTextWidth = (ctx, text, options) => {
    const {
        borderWidth = DEFAULT_BORDER_WIDTH,
        leftPadding = DEFAULT_PADDING,
        rightPadding = DEFAULT_PADDING,
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

    calculatedWidth += leftPadding + rightPadding + borderWidth * 2;

    return calculatedWidth;
};

export const LEFT_BOX_ALIGN = 'left';
export const CENTER_BOX_ALIGN = 'center';
export const RIGHT_BOX_ALIGN = 'right';
export const TOP_BOX_ALIGN = 'top';
export const MIDDLE_BOX_ALIGN = 'middle';
export const BOTTOM_BOX_ALIGN = 'bottom';
export const getDimensions = (ctx, text, options) => {
    const {
        borderWidth = DEFAULT_BORDER_WIDTH,
        lineHeight = DEFAULT_LINE_HEIGHT,
        verticalPadding = DEFAULT_PADDING,
        horizontalBoxAlign = LEFT_BOX_ALIGN,
        verticalBoxAlign = TOP_BOX_ALIGN,
    } = options;

    let { x = 0, y = 0 } = options;

    const textLineCount = (typeof text) === 'string' ? 1 : text.length;

    const width = getTextWidth(ctx, text, options);
    const height = borderWidth * 2 + verticalPadding + textLineCount * (lineHeight + verticalPadding);

    if (horizontalBoxAlign === CENTER_BOX_ALIGN) {
        x += VIEW_WIDTH / 2 - width / 2;
    } else if (horizontalBoxAlign === RIGHT_BOX_ALIGN) {
        x += VIEW_WIDTH - width;
    }

    if (verticalBoxAlign === MIDDLE_BOX_ALIGN) {
        y += VIEW_HEIGHT / 2 - height / 2;
    } else if (verticalBoxAlign === BOTTOM_BOX_ALIGN) {
        y += VIEW_HEIGHT - height;
    }

    return {
        ...options,
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
        leftPadding = DEFAULT_PADDING,
        lineHeight = DEFAULT_LINE_HEIGHT,
        verticalPadding = DEFAULT_PADDING,
    } = options;

     if (!width) {
        options.width = getTextWidth(ctx, text, options);
    }

    let calculatedHeight = height;
    if (!height) {
        let textLineCount = (typeof text) === 'string' ? 1 : text.length;

        calculatedHeight = borderWidth * 2 + verticalPadding + textLineCount * (lineHeight + verticalPadding);
    }
    options.height = calculatedHeight;

    drawBorder(ctx,  options);

    drawText(
        ctx,
        text,
        options.x + borderWidth + leftPadding,
        options.y + borderWidth + verticalPadding,
        options
    );
};

export const drawInteractText = (ctx, viewX, viewY, action, entity) => {
    const x = entity.x - viewX;
    const y = entity.y - viewY;

    drawText(ctx, action, x + entity.rect.width / 2, y, {
        fontSize: '22px',
        textAlign: 'center',
        textBaseline: 'bottom',
    });
};

const SLOT_WIDTH = 55;
export const SLOT_BORDER_WIDTH = 5;
const SLOT_COLOR = '#e0e0e0';
export const drawSlot = (ctx, {
    x,
    y,
    width = SLOT_WIDTH,
    borderWidth = SLOT_BORDER_WIDTH,
    color = SLOT_COLOR,
}) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth;
    ctx.rect(x + borderWidth / 2, y + borderWidth / 2, width, width);
    ctx.stroke();
};

export const drawItemInSlot = (ctx, options = {}) => {
    const {
        x,
        y,
        itemColor = 'green',
        width = SLOT_WIDTH,
        borderWidth = SLOT_BORDER_WIDTH,
    } = options;

    const diff = borderWidth + (width - borderWidth - GRID_SIZE) / 2;

    ctx.fillStyle = itemColor;
    ctx.fillRect(x + diff, y + diff, GRID_SIZE, GRID_SIZE);
};