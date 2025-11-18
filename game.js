// المان‌ها
const startScreen = document.getElementById('start-screen');
const lastLevelSpan = document.getElementById('last-level');
const lastScoreSpan = document.getElementById('last-score');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const levelSpan = document.getElementById('level');
const scoreSpan = document.getElementById('score');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const goalSound = document.getElementById('goal-sound');
const hitSound = document.getElementById('hit-sound');

// داده‌ها
let level = 1;
let score = 0;
let player = {x:50, y:50, size:30, color:'red'};
let obstacles = [];
let enemies = [];
let keys = {};
let goal = {x:canvas.width-50, y:canvas.height-50, size:40};

// بارگذاری آخرین مرحله و امتیاز
if(localStorage.getItem('lastLevel')){
    level = parseInt(localStorage.getItem('lastLevel'),10);
    lastLevelSpan.textContent = level;
}
if(localStorage.getItem('score')){
    score = parseInt(localStorage.getItem('score'),10);
    lastScoreSpan.textContent = score;
}

// شروع بازی
function startGame(){
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    initLevel();
    requestAnimationFrame(gameLoop);
}

// بازگشت به صفحه آغاز
function backToStart(){
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

// ایجاد موانع و دشمنان برای مرحله
function initLevel(){
    player.x=50; player.y=50;
    goal.x = canvas.width-50; goal.y = canvas.height-50;
    obstacles = [];
    enemies = [];
    for(let i=0;i<level+3;i++){
        obstacles.push({x:Math.random()*600, y:Math.random()*400, w:30, h:30});
    }
    for(let i=0;i<level;i++){
        enemies.push({x:Math.random()*600, y:Math.random()*400, w:30, h:30, dx:(Math.random()*2+1)*(Math.random()<0.5?-1:1), dy:(Math.random()*2+1)*(Math.random()<0.5?-1:1)});
    }
}

// رسم کل صحنه
function drawGame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // بازیکن
    ctx.fillStyle=player.color;
    ctx.fillRect(player.x,player.y,player.size,player.size);
    // موانع
    ctx.fillStyle='black';
    obstacles.forEach(ob=>ctx.fillRect(ob.x,ob.y,ob.w,ob.h));
    // دشمنان
    ctx.fillStyle='purple';
    enemies.forEach(en=>ctx.fillRect(en.x,en.y,en.w,en.h));
    // هدف
    ctx.fillStyle='gold';
    ctx.fillRect(goal.x,goal.y,goal.size,goal.size);
}

// بررسی برخورد با موانع
function checkCollision(nx,ny){
    for(let ob of obstacles){
        if(nx < ob.x+ob.w && nx+player.size > ob.x &&
           ny < ob.y+ob.h && ny+player.size > ob.y){
            return true;
        }
    }
    return false;
}

// برخورد با دشمن
function checkEnemyCollision(){
    for(let en of enemies){
        if(player.x < en.x+en.w && player.x+player.size > en.x &&
           player.y < en.y+en.h && player.y+player.size > en.y){
            score = Math.max(0,score-10);
            scoreSpan.textContent = score;
            hitSound.play();
            player.x=50; player.y=50;
        }
    }
}

// بروزرسانی دشمنان
function updateEnemies(){
    enemies.forEach(en=>{
        en.x += en.dx;
        en.y += en.dy;
        if(en.x<0 || en.x+en.w>canvas.width) en.dx*=-1;
        if(en.y<0 || en.y+en.h>canvas.height) en.dy*=-1;
    });
}

// حرکت بازیکن
document.addEventListener('keydown',(e)=>{ keys[e.key]=true; });
document.addEventListener('keyup',(e)=>{ keys[e.key]=false; });

function movePlayer(){
    let nx=player.x, ny=player.y;
    const step = 5;
    if(keys['ArrowUp']) ny-=step;
    if(keys['ArrowDown']) ny+=step;
    if(keys['ArrowLeft']) nx-=step;
    if(keys['ArrowRight']) nx+=step;
    if(nx>=0 && nx<=canvas.width-player.size && ny>=0 && ny<=canvas.height-player.size){
        if(!checkCollision(nx,ny)){
            player.x=nx;
            player.y=ny;
        }
    }
}

// رسیدن به هدف
function checkGoal(){
    if(player.x+player.size >= goal.x && player.y+player.size >= goal.y){
        level++;
        score += 20;
        levelSpan.textContent=level;
        scoreSpan.textContent=score;
        goalSound.play();
        localStorage.setItem('lastLevel',level);
        localStorage.setItem('score',score);
        initLevel();
    }
}

// حلقه بازی
function gameLoop(){
    movePlayer();
    updateEnemies();
    checkEnemyCollision();
    drawGame();
    checkGoal();
    requestAnimationFrame(gameLoop);
}

// دکمه‌ها
startBtn.addEventListener('click',startGame);
backBtn.addEventListener('click',backToStart);