const startBtn=document.getElementById("start-btn");
const backBtn=document.getElementById("back-btn");
const startScreen=document.getElementById("start-screen");
const gameScreen=document.getElementById("game-screen");
const gameBoard=document.getElementById("game-board");
const levelTitle=document.getElementById("level-title");
const scoreDisplay=document.getElementById("score");
const timerDisplay=document.getElementById("timer");
const lootBox=document.getElementById("loot-box");
const openLoot=document.getElementById("open-loot");
const lootResult=document.getElementById("loot-result");

const matchSound=document.getElementById("match-sound");
const wrongSound=document.getElementById("wrong-sound");
const rewardSound=document.getElementById("reward-sound");
const winSound=document.getElementById("win-sound");

let level=1, score=0, xp=0, playerLevel=1;
let firstCard=null, secondCard=null, lockBoard=false;
let timer=60, timerInterval=null;

// Start Game
startBtn.onclick=()=>{
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    startLevel();
};

// Back
backBtn.onclick=()=>{ location.reload(); };

// Start Level
function startLevel(){
    gameBoard.innerHTML="";
    lootBox.classList.add("hidden");
    levelTitle.textContent="Level "+level;
    timer=60-level*5>15?60-level*5:15;
    timerDisplay.textContent="Time: "+timer+"s";

    clearInterval(timerInterval);
    timerInterval=setInterval(()=>{ 
        timer--; 
        timerDisplay.textContent="Time: "+timer+"s"; 
        if(timer<=0){ clearInterval(timerInterval); failLevel(); }
    },1000);

    const pairCount=level+3;
    const values=[];
    for(let i=1;i<=pairCount;i++) values.push(i,i);
    values.sort(()=>Math.random()-0.5);

    values.forEach(value=>{
        const card=document.createElement("div");
        card.classList.add("card");
        card.dataset.value=value;

        // تعیین کارت نادر
        const rarity=Math.random();
        if(rarity>0.9) card.dataset.rarity="Legendary";
        else if(rarity>0.75) card.dataset.rarity="Rare";
        else card.dataset.rarity="Common";

        card.onclick=()=>flipCard(card);
        gameBoard.appendChild(card);
    });
}

// Flip Card
function flipCard(card){
    if(lockBoard) return;
    if(card===firstCard) return;

    card.classList.add("flipped");
    card.textContent=card.dataset.value;

    if(!firstCard){ firstCard=card; return; }

    secondCard=card;
    lockBoard=true;
    checkMatch();
}

// Check Match
function checkMatch(){
    if(firstCard.dataset.value===secondCard.dataset.value){
        matchSound.play();
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        let scoreGain=10;
        if(firstCard.dataset.rarity==="Rare") scoreGain=20;
        if(firstCard.dataset.rarity==="Legendary") scoreGain=50;

        score+=scoreGain;
        xp+=scoreGain/2;
        if(xp>=50){ playerLevel++; xp=0; }

        updateScore();
        resetTurn();
        checkLevelComplete();
    } else {
        wrongSound.play();
        setTimeout(()=>{
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.textContent="";
            secondCard.textContent="";
            resetTurn();
        },700);
    }
}

function resetTurn(){ firstCard=null; secondCard=null; lockBoard=false; }

function checkLevelComplete(){
    const unmatched=document.querySelectorAll(".card:not(.matched)");
    if(unmatched.length===0){
        clearInterval(timerInterval);
        winSound.play();
        lootBox.classList.remove("hidden");
    }
}

openLoot.onclick=()=>{
    const rewards=["⭐ +20 Score","💎 +30 Score","🔥 +50 Score"];
    const reward=rewards[Math.floor(Math.random()*rewards.length)];
    lootResult.textContent=reward;
    rewardSound.play();

    if(reward.includes("20")) score+=20;
    if(reward.includes("30")) score+=30;
    if(reward.includes("50")) score+=50;

    level++;
    setTimeout(startLevel,1000);
    updateScore();
};

function failLevel(){
    alert("⏰ Time's up! Try again.");
    startLevel();
}

function updateScore(){
    scoreDisplay.textContent=`Score: ${score} | XP: ${xp} | Level: ${playerLevel}`;
}