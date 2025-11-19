export class AIManager {
    update(entities) {
        entities.forEach(e => {
            if (e.type === "enemy") {
                if (!e.target) return;

                let dx = e.target.x - e.x;
                let dy = e.target.y - e.y;
                let dist = Math.hypot(dx, dy);

                if (dist > 2) {
                    e.x += dx / dist * e.speed;
                    e.y += dy / dist * e.speed;
                }
            }
        });
    }
}