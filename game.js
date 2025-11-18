const startScreen = document.getElementById('start-screen');
const lastLevelSpan = document.getElementById('last-level');
const lastScoreSpan = document.getElementById('last-score');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const levelSpan = document.getElementById('level');
const scoreSpan = document.getElementById('score');
const timerSpan = document.getElementById('timer');
const gameBoard = document.getElementById('game-board');
const lootBoxDiv = document.getElementById('loot-box');
const openLootBtn = document.getElementById('open-loot');
const lootResult = document.getElementById('loot-result');
const livesSpan = document.getElementById('lives-game');

// Sounds
const matchSound = document.getElementById('match-sound');
const wrongSound = document.getElementById('wrong-sound');
const rewardSound = document.getElementById('reward-sound');
const winSound = document.getElementById('win-sound');

let level = 1, score = 0, lives = 3;
let cards = [], firstCard = null, secondCard = null, lockBoard = false;
let timeLeft = 30, timerInterval = null;

// Load last state
if(localStorage.getItem('lastLevel')) level = parseInt(localStorage.getItem('lastLevel'),10);
if(localStorage.getItem('score')) score = parseInt(localStorage.getItem('score'),10);

function startGame(){
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    lootBoxDiv.classList.add('hidden');
    levelSpan.textContent = level;
    scoreSpan.textContent = score;
    livesSpan.textContent = lives;
    setupLevel();
    startTimer();
}

function backToStart(){
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    clearInterval(timerInterval);
}

function startTimer(){
    timeLeft = Math.max(30 - level*2,10);
    timerSpan.textContent = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(()=>{
        timeLeft--;
        timerSpan.textContent = timeLeft;
        if(timeLeft <= 0){
            clearInterval(timerInterval);
            lives--;
            if(lives<=0){ alert("Game Over!"); resetGame(); return; }
            alert("Time's up! You lost 1 life.");
            livesSpan.textContent = lives;
            setupLevel(); startTimer();
        }
    },1000);
}

function resetGame(){
    level=1; score=0; lives=3;
    localStorage.setItem('lastLevel', level);
    localStorage.setItem('score', score);
    startScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
}

function setupLevel(){
    gameBoard.innerHTML = ''; cards=[]; firstCard=null; secondCard=null; lockBoard=false;
    const numPairs = level + 3;
    const values = [];
    for(let i=1;i<=numPairs;i++){ values.push(i); values.push(i); }
    values.sort(()=>Math.random()-0.5);
    values.forEach(val=>{
        const card = document.createElement('div');
        card.classList.add('card'); card.dataset.value=val; card.textContent='';
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card); cards.push(card);
    });
}

function flipCard(){
    if(lockBoard) return;
    if(this===firstCard) return;
    this.classList.add('flipped'); this.textContent=this.dataset.value;
    if(!firstCard){ firstCard=this; return; }
    secondCard=this; lockBoard=true; checkMatch();
}

function checkMatch(){
    if(firstCard.dataset.value===secondCard.dataset.value){
        firstCard.classList.add('matched'); secondCard.classList.add('matched');
        score += 10; scoreSpan.textContent = score;
        matchSound.play();
        resetTurn(); checkLevelComplete();
    } else {
        wrongSound.play();
        setTimeout(()=>{
            firstCard.classList.remove('flipped'); firstCard.textContent='';
            secondCard.classList.remove('flipped'); secondCard.textContent='';
            lives--; livesSpan.textContent = lives;
            if(lives<=0){ alert("Game Over!"); resetGame(); return; }
            resetTurn();
        },800);
    }
}

function resetTurn(){ [firstCard, secondCard, lockBoard] = [null,null,false]; }

function checkLevelComplete(){
    const unmatched = cards.filter(c=>!c.classList.contains('matched'));
    if(unmatched.length===0){
        clearInterval(timerInterval);
        level++; score+=20;
        levelSpan.textContent=level; scoreSpan.textContent=score;
        localStorage.setItem('lastLevel', level); localStorage.setItem('score', score);
        winSound.play();

        // Show Loot Box after every 3 levels
        if((level-1)%3===0){
            lootBoxDiv.classList.remove('hidden');
            rewardSound.play();
        } else {
            setTimeout(()=>{ setupLevel(); startTimer(); },1000);
        }
    }
}

openLootBtn.addEventListener('click', ()=>{
    const rewards = ["⭐ Star +50","⏰ Clock +5s","❤️ Heart +1 Life"];
    const reward = rewards[Math.floor(Math.random()*rewards.length)];
    lootResult.textContent = reward;
    // Apply reward
    if(reward.includes("Star")) score+=50;
    if(reward.includes("Clock")) timeLeft+=5;
    if(reward.includes("Heart")) { lives++; livesSpan.textContent=lives; }
    scoreSpan.textContent = score;
    setTimeout(()=>{ lootBoxDiv.classList.add('hidden'); setupLevel(); startTimer(); },1500);
});

startBtn.addEventListener('click', startGame);
backBtn.addEventListener('click', backToStart);