const levelSpan = document.getElementById('level');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let level = 1;

// بارگذاری آخرین مرحله از LocalStorage
if (localStorage.getItem('lastLevel')) {
    level = parseInt(localStorage.getItem('lastLevel'), 10);
    levelSpan.textContent = level;
}

// رسم مربع ساده روی کانواس
function drawSquare() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(50 + (level-1)*10, 50 + (level-1)*10, 50, 50);
}

// نمایش اولیه مربع
drawSquare();

// کلیک روی کانواس برای افزایش مرحله و ذخیره‌سازی
canvas.addEventListener('click', () => {
    level++;
    levelSpan.textContent = level;
    localStorage.setItem('lastLevel', level);
    drawSquare();
});