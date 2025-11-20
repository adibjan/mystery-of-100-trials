export class HealthBar {
    constructor(player) {
        this.player = player;
    }

    draw(ctx) {
        const x = 20;
        const y = 20;
        const width = 250;
        const height = 24;

        const ratio = this.player.health / this.player.maxHealth;

        let color = "#00ff44";
        if (ratio < 0.5) color = "#ffe600";
        if (ratio < 0.25) color = "#ff0000";

        ctx.fillStyle = "black";
        ctx.fillRect(x-2, y-2, width+4, height+4);

        ctx.fillStyle = color;
        ctx.fillRect(x, y, width * ratio, height);

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }
}