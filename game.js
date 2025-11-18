// المان‌ها
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const levelSpan = document.getElementById('level');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let level = 1;

// بارگذاری آخرین مرحله از LocalStorage
if (localStorage.getItem('lastLevel')) {
    level = parseInt(localStorage.getItem('lastLevel'), 10);
    levelSpan.textContent = level;
}

// نمایش صفحه بازی
function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    drawSquare();
}

// بازگشت به صفحه آغاز
function backToStart() {
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

// رسم مربع ساده (نسخه تست)
function drawSquare() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(50 + (level-1)*10, 50 + (level-1)*10, 50, 50);
}

// دکمه‌ها
startBtn.addEventListener('click', startGame);
backBtn.addEventListener('click', backToStart);

// شبیه‌سازی پیشرفت مرحله برای تست ذخیره‌سازی
canvas.addEventListener('click', () => {
    level++;
    levelSpan.textContent = level;
    localStorage.setItem('lastLevel', level);
    drawSquare();
});