const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- ذخیره‌سازی آفلاین ---
let saveData = JSON.parse(localStorage.getItem("saveGame")) || {
    x: 100,
    y: 100
};

let playerX = saveData.x;
let playerY = saveData.y;

// دکمه شروع بازی
document.getElementById("startBtn").onclick = () => {
    document.getElementById("start-screen").style.display = "none";
    canvas.style.display = "block";
};

// حرکت بازیکن
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ذخیره اتومات
function saveGame() {
    localStorage.setItem("saveGame", JSON.stringify({
        x: playerX,
        y: playerY
    }));
}

// بازی اصلی
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // حرکت
    if (keys["w"]) playerY -= 3;
    if (keys["s"]) playerY += 3;
    if (keys["a"]) playerX -= 3;
    if (keys["d"]) playerX += 3;

    // رسم بازیکن
    ctx.fillStyle = "white";
    ctx.fillRect(playerX, playerY, 40, 40);

    // ذخیره هر ثانیه
    if (Date.now() % 1000 < 16) saveGame();

    requestAnimationFrame(gameLoop);
}

gameLoop();