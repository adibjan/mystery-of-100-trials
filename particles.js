export class ParticleSystem {
    constructor(ctx) {
        this.ctx = ctx;
        this.particles = [];
    }

    spawn(x, y) {
        this.particles.push({
            x, y,
            size: Math.random() * 4 + 2,
            life: 1
        });
    }

    update(dt) {
        this.particles = this.particles.filter(p => p.life > 0);

        this.particles.forEach(p => {
            p.life -= dt;

            this.ctx.fillStyle = "orange";
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}