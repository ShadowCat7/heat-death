export const drawRect = (ctx, rect, x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, rect.width, rect.height);
};