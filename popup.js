export class Popup {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.life = 1;
        this.opacity = 1;
    }

    update(dt) {
        this.y -= 30 * dt;
        this.life -= dt;
        this.opacity = this.life;
    }

    draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "yellow";
        ctx.font = "24px Arial";
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}