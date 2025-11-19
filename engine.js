// ULTRA ENGINE v2 - CORE ENGINE

import { Renderer } from "./renderer.js";
import { Physics } from "./physics.js";
import { AIManager } from "./ai.js";
import { Input } from "./input.js";
import { SaveSystem } from "./save.js";
import { AudioEngine } from "./audio.js";
import { Lighting } from "./lighting.js";
import { ParticleSystem } from "./particles.js";

export class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.renderer = new Renderer(this.ctx);
        this.physics = new Physics();
        this.ai = new AIManager();
        this.input = new Input();
        this.save = new SaveSystem();
        this.audio = new AudioEngine();
        this.lighting = new Lighting(this.ctx);
        this.particles = new ParticleSystem(this.ctx);

        this.entities = [];
        this.lastFrame = performance.now();

        requestAnimationFrame(this.loop.bind(this));
    }

    addEntity(e) {
        this.entities.push(e);
    }

    loop(timestamp) {
        const delta = (timestamp - this.lastFrame) / 1000;
        this.lastFrame = timestamp;

        this.physics.update(this.entities, delta);
        this.ai.update(this.entities);
        this.renderer.draw(this.entities);
        this.lighting.apply();
        this.particles.update(delta);

        requestAnimationFrame(this.loop.bind(this));
    }
}