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

export const drawInteractText = (ctx, viewX, viewY, action, entity) => {
    const x = entity.x - viewX;
    const y = entity.y - viewY;

    ctx.font = '22px Arial';
    ctx.fillStyle = '#eee';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(action, x + entity.rect.width / 2, y);
};