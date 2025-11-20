export class Menu {
    constructor() {
        this.active = true;
        this.pause = false;
    }

    showMain(ctx) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, 1280, 720);

        ctx.fillStyle = "white";
        ctx.font = "64px Arial";
        ctx.fillText("Mystery Of 100 Trials", 300, 200);

        ctx.font = "36px Arial";
        ctx.fillText("Press ENTER to Start", 430, 350);
        ctx.fillText("Press S for Settings", 460, 420);
    }

    showPause(ctx) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, 1280, 720);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.fillText("Paused", 560, 250);

        ctx.font = "32px Arial";
        ctx.fillText("Press ESC to Resume", 480, 340);
    }
}