export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    draw(entities) {
        this.ctx.clearRect(0, 0, 1280, 720);

        entities.forEach(e => {
            if (!e.sprite) return;

            this.ctx.drawImage(
                e.sprite,
                e.x,
                e.y,
                e.width,
                e.height
            );
        });
    }
}