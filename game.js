import { distance } from "../utils/math.js";
import { ui } from "../ui/ui.js";  // دسترسی به سیستم UI

export class Enemy {
    constructor(x, y, type = "wolf") {
        this.x = x;
        this.y = y;

        this.type = type;

        this.speed = 1.2;
        this.damage = 15;
        this.health = 60;

        this.size = 40;

        this.state = "idle"; // idle / chase / attack / dead

        this.attackRange = 45;
        this.attackCooldown = 0;
    }

    update(player, dt) {
        if (this.health <= 0) {
            this.state = "dead";
            return;
        }

        const d = distance(this.x, this.y, player.x, player.y);

        // حالت 1: اگر مرده
        if (this.state === "dead") return;

        // حالت 2: تعقیب بازیکن
        if (d < 250 && d > this.attackRange) {
            this.state = "chase";

            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const len = Math.sqrt(dx * dx + dy * dy);

            this.x += (dx / len) * this.speed * dt;
            this.y += (dy / len) * this.speed * dt;
        }

        // حالت 3: حمله
        if (d <= this.attackRange && this.attackCooldown <= 0) {
            this.state = "attack";

            player.takeDamage(this.damage);
            ui.damagePopup(player.x, player.y, this.damage);

            this.attackCooldown = 1.2; // 1.2 ثانیه بین هر ضربه
        }

        // کاهش کول‌داون حمله
        if (this.attackCooldown > 0) {
            this.attackCooldown -= dt;
        }
    }

    draw(ctx) {
        if (this.health <= 0) {
            // انیمیشن مرگ ساده
            ctx.fillStyle = "gray";
            ctx.globalAlpha = 0.5;
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.globalAlpha = 1;
            return;
        }

        // دشمن ساده – بعداً مدل واقعی اضافه می‌کنیم
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.size, this.size);

        // نوار جان دشمن
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y - 10, this.size, 6);

        ctx.fillStyle = "lime";
        ctx.fillRect(this.x, this.y - 10, (this.health / 60) * this.size, 6);
    }

    takeDamage(amount) {
        this.health -= amount;
        ui.damagePopup(this.x, this.y, amount);
    }
}