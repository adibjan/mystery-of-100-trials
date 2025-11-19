import { Engine } from "./engine/core/engine.js";
import { Player } from "./engine/player/player.js";
import { Enemy } from "./engine/ai/enemy.js";

const canvas = document.getElementById("gameCanvas");
const engine = new Engine(canvas);

// ساخت بازیکن
const player = new Player(200, 200, null);
engine.addEntity(player);

// ساخت دشمن نمونه
const enemy = new Enemy(500, 300, null);
engine.addEntity(enemy);

function update(dt) {
    player.update(engine.input, dt);
}

engine.updateCallback = update;