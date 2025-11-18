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

const matchSound = document.getElementById('match-sound');
const wrongSound = document.getElementById('wrong-sound');
const rewardSound = document.getElementById('reward-sound');
const winSound = document.getElementById('win-sound');

let level = 1;
let score = 0;
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timeLeft = 30;
let timerInterval = null;

// Load last level and score
if(localStorage.getItem('lastLevel')){
    level = parseInt(localStorage.getItem('lastLevel'),10);
    lastLevelSpan.textContent = level;
}
if(localStorage.getItem('score')){
    score = parseInt(localStorage.getItem('score'),10);
    lastScoreSpan.textContent = score;
}

function startGame(){
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    levelSpan.textContent = level;
    scoreSpan.textContent = score;
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
            alert("Time's up! Try again.");
            setupLevel();
            startTimer();
        }
    },1000);
}

function setupLevel(){
    gameBoard.innerHTML = '';
    cards = [];
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    const numPairs = level + 3;
    const values = [];
    for(let i=1;i<=numPairs;i++){
        values.push(i);
        values.push(i);
    }
    values.sort(()=>Math.random()-0.5);

    // Add one reward card randomly
    const rewardIndex = Math.floor(Math.random()*values.length);
    values[rewardIndex] = "⭐";

    values.forEach(val=>{
        const card = document.createElement('div');
        card.classList.add('card');
        if(val === "⭐") card.classList.add('reward');
        card.dataset.value = val;
        card.textContent = '';
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

function flipCard(){
    if(lockBoard) return;
    if(this === firstCard) return;
    this.classList.add('flipped');
    this.textContent = this.dataset.value;
    if(!firstCard){
        firstCard = this;
        return;
    }
    secondCard = this;
    lockBoard = true;
    checkMatch();
}

function checkMatch(){
    if(firstCard.dataset.value === secondCard.dataset.value){
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        if(firstCard.dataset.value === "⭐"){
            score += 50; // reward bonus
            rewardSound.play();
        } else {
            score += 10;
            matchSound.play();
        }
        scoreSpan.textContent = score;
        resetTurn();
        checkLevelComplete();
    } else {
        wrongSound.play();
        setTimeout(()=>{
            firstCard.classList.remove('flipped');
            firstCard.textContent = '';
            secondCard.classList.remove('flipped');
            secondCard.textContent = '';
            resetTurn();
        },800);
    }
}

function resetTurn(){
    [firstCard, secondCard, lockBoard] = [null,null,false];
}

function checkLevelComplete(){
    const unmatched = cards.filter(c=>!c.classList.contains('matched'));
    if(unmatched.length===0){
        clearInterval(timerInterval);
        level++;
        score += 20;
        levelSpan.textContent = level;
        scoreSpan.textContent = score;
        localStorage.setItem('lastLevel',level);
        localStorage.setItem('score',score);
        winSound.play();
        setTimeout(()=>{
            setupLevel();
            startTimer();
        },1000);
    }
}

startBtn.addEventListener('click',startGame);
backBtn.addEventListener('click',backToStart);