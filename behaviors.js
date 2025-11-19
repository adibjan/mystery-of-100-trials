export class Behavior {
    constructor(enemy) {
        this.enemy = enemy;
    }
    update() {}
}

export class PatrolBehavior extends Behavior {
    constructor(enemy, points) {
        super(enemy);
        this.points = points; 
        this.currentPoint = 0;
    }

    update() {
        const target = this.points[this.currentPoint];
        let dx = target.x - this.enemy.x;
        let dy = target.y - this.enemy.y;
        let dist = Math.hypot(dx, dy);

        if (dist < 5) {
            this.currentPoint = (this.currentPoint + 1) % this.points.length;
            return;
        }

        this.enemy.x += (dx / dist) * this.enemy.speed;
        this.enemy.y += (dy / dist) * this.enemy.speed;
    }
}

export class ChaseBehavior extends Behavior {
    update() {
        let target = this.enemy.target;
        if (!target) return;

        let dx = target.x - this.enemy.x;
        let dy = target.y - this.enemy.y;
        let dist = Math.hypot(dx, dy);

        if (dist > this.enemy.detectRange) {
            this.enemy.setBehavior("patrol");
            return;
        }

        this.enemy.x += (dx / dist) * this.enemy.speed * 1.5;
        this.enemy.y += (dy / dist) * this.enemy.speed * 1.5;
    }
}

export class AttackBehavior extends Behavior {
    update() {
        if (!this.enemy.target) return;

        let dx = this.enemy.target.x - this.enemy.x;
        let dy = this.enemy.target.y - this.enemy.y;
        let dist = Math.hypot(dx, dy);

        if (dist > this.enemy.attackRange) {
            this.enemy.setBehavior("chase");
            return;
        }

        if (!this.enemy.attackCooldown) {
            this.enemy.target.takeDamage(this.enemy.damage);
            this.enemy.attackCooldown = 1;

            setTimeout(() => {
                this.enemy.attackCooldown = 0;
            }, 1000);
        }
    }
}