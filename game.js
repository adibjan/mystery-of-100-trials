const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- ذخیره‌سازی آفلاین با LocalStorage ---
let saveData = JSON.parse(localStorage.getItem("saveData")) || {
    player: { x: 100, y: 100, hp: 100 },
    currentLevel: 1
};

let player = saveData.player;
let currentLevel = saveData.currentLevel;

// ذخیره خودکار
function saveGame() {
    localStorage.setItem("saveData", JSON.stringify({
        player: player,
        currentLevel: currentLevel
    }));
}

// وقتی دکمه Start Game زده می‌شود
document.getElementById("loginBtn").onclick = () => {
    document.getElementById("auth-screen").style.display = "none";
    document.querySelector("canvas").style.display = "block";
};

// اجرای بازی
function gameLoop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // کاراکتر سفید ساده
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, 40, 40);

    // ذخیره هر ثانیه
    if (Date.now() % 1000 < 16) saveGame();

    requestAnimationFrame(gameLoop);
}

gameLoop();