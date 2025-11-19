export class Physics {
    update(entities, dt) {
        entities.forEach(e => {

            if (e.vx) e.x += e.vx * dt;
            if (e.vy) e.y += e.vy * dt;

            // برخورد ساده
            e.x = Math.max(0, Math.min(e.x, 1240));
            e.y = Math.max(0, Math.min(e.y, 680));
        });
    }
}