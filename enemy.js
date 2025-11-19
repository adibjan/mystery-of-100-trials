import { PatrolBehavior, ChaseBehavior, AttackBehavior } from "./behaviors.js";

export class Enemy {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 48;

        this.vx = 0;
        this.vy = 0;
        this.speed = 60;

        this.sprite = sprite;

        this.target = null; 

        this.detectRange = 200;
        this.attackRange = 40;
        this.damage = 10;

        this.behaviors = {
            patrol: new PatrolBehavior(this, [
                { x: x, y: y },
                { x: x + 120, y: y + 40 },
                { x: x - 80, y: y - 60 }
            ]),
            chase: new ChaseBehavior(this),
            attack: new AttackBehavior(this),
        };

        this.currentBehavior = "patrol";
    }

    setBehavior(name) {
        this.currentBehavior = name;
    }

    update() {
        this.behaviors[this.currentBehavior].update();
    }
}