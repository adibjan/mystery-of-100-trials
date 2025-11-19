export class AudioEngine {
    constructor() {
        this.sounds = {};
    }

    load(name, src) {
        this.sounds[name] = new Audio(src);
    }

    play(name, volume = 1) {
        if (this.sounds[name]) {
            this.sounds[name].volume = volume;
            this.sounds[name].play();
        }
    }
}