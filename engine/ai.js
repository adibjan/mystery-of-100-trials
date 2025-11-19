export class AIManager {
    update(entities) {
        const players = entities.filter(e => e.type === "player");
        const enemies = entities.filter(e => e.type === "enemy");

        enemies.forEach(enemy => {
            let closest = null;
            let closestDist = Infinity;

            players.forEach(player => {
                let dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
                if (dist < closestDist) {
                    closest = player;
                    closestDist = dist;
                }
            });

            if (closest && closestDist < enemy.detectRange) {
                enemy.target = closest;

                if (closestDist < enemy.attackRange) {
                    enemy.setBehavior("attack");
                } else {
                    enemy.setBehavior("chase");
                }
            } else {
                enemy.target = null;
                enemy.setBehavior("patrol");
            }

            enemy.update();
        });
    }
}