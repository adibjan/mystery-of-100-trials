export class Lighting {
    constructor(ctx) {
        this.ctx = ctx;
        this.darkness = 0.5;
    }

    apply() {
        this.ctx.fillStyle = `rgba(0,0,0,${this.darkness})`;
        this.ctx.fillRect(0, 0, 1280, 720);
    }
}