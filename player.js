export class Player {
    constructor(x, y, spriteSheet) {
        this.x = x;
        this.y = y;

        this.width = 48;
        this.height = 48;

        // فیزیک پیشرفته
        this.vx = 0;
        this.vy = 0;
        this.speed = 240;
        this.acceleration = 800;
        this.friction = 700;

        // سلامت
        this.maxHealth = 100;
        this.health = 100;
        this.invincible = false;

        // حمله
        this.attackCooldown = false;
        this.attackRange = 50;
        this.damage = 25;

        // انیمیشن
        this.spriteSheet = spriteSheet;
        this.frame = 0;
        this.frameTimer = 0;

        this.type = "player";
    }

    takeDamage(amount) {
        if (this.invincible) return;

        this.health -= amount;
        this.invincible = true;

        setTimeout(() => (this.invincible = false), 500);

        if (this.health <= 0) {
            console.log("Player died!");
        }
    }

    attack(entities) {
        if (this.attackCooldown) return;

        this.attackCooldown = true;

        setTimeout(() => (this.attackCooldown = false), 600);

        entities.forEach(e => {
            if (e.type === "enemy") {
                let dx = e.x - this.x;
                let dy = e.y - this.y;
                let dist = Math.hypot(dx, dy);

                if (dist < this.attackRange) {
                    e.health -= this.damage;
                }
            }
        });
    }

    update(input, dt) {
        // حرکت
        if (input.keys["w"] || input.keys["ArrowUp"]) {
            this.vy -= this.acceleration * dt;
        }
        if (input.keys["s"] || input.keys["ArrowDown"]) {
            this.vy += this.acceleration * dt;
        }
        if (input.keys["a"] || input.keys["ArrowLeft"]) {
            this.vx -= this.acceleration * dt;
        }
        if (input.keys["d"] || input.keys["ArrowRight"]) {
            this.vx += this.acceleration * dt;
        }

        // کم کردن سرعت (اصطکاک)
        if (!input.keys["w"] && !input.keys["s"]) {
            this.vy -= Math.sign(this.vy) * this.friction * dt;
        }
        if (!input.keys["a"] && !input.keys["d"]) {
            this.vx -= Math.sign(this.vx) * this.friction * dt;
        }

        // محدود کردن سرعت
        const maxVel = this.speed;
        this.vx = Math.max(-maxVel, Math.min(this.vx, maxVel));
        this.vy = Math.max(-maxVel, Math.min(this.vy, maxVel));

        // حرکت نهایی
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // محدودیت داخل صفحه
        this.x = Math.max(0, Math.min(this.x, 1232));
        this.y = Math.max(0, Math.min(this.y, 672));

        // انیمیشن ساده
        this.frameTimer += dt;
        if (this.frameTimer > 0.15) {
            this.frame = (this.frame + 1) % 4;
            this.frameTimer = 0;
        }
    }
}