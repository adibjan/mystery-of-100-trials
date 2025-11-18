const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const gameBoard = document.getElementById("game-board");
const levelTitle = document.getElementById("level-title");
const scoreDisplay = document.getElementById("score");

const lootBox = document.getElementById("loot-box");
const openLoot = document.getElementById("open-loot");
const lootResult = document.getElementById("loot-result");

const matchSound = document.getElementById("match-sound");
const wrongSound = document.getElementById("wrong-sound");
const rewardSound = document.getElementById("reward-sound");
const winSound = document.getElementById("win-sound");

let level = 1;
let score = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

// Start Game
startBtn.onclick = () => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    startLevel();
};

// Back
backBtn.onclick = () => {
    gameScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    resetAll();
};

// Start Level
function startLevel() {
    gameBoard.innerHTML = "";
    lootBox.classList.add("hidden");

    levelTitle.textContent = "Level " + level;

    const pairCount = level + 2;
    const values = [];

    for (let i = 1; i <= pairCount; i++) {
        values.push(i, i);
    }

    values.sort(() => Math.random() - 0.5);

    values.forEach(value => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = value;

        card.onclick = () => flipCard(card);

        gameBoard.appendChild(card);
    });
}

// Flip Card
function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;

    card.classList.add("flipped");
    card.textContent = card.dataset.value;

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockBoard = true;

    checkMatch();
}

// Check Match
function checkMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        matchSound.play();

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        score += 10;
        scoreDisplay.textContent = "Score: " + score;

        resetTurn();
        checkLevelComplete();
    } else {
        wrongSound.play();
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.textContent = "";
            secondCard.textContent = "";
            resetTurn();
        }, 700);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function checkLevelComplete() {
    const unmatched = document.querySelectorAll(".card:not(.matched)");
    if (unmatched.length === 0) {
        winSound.play();
        lootBox.classList.remove("hidden");
    }
}

// Open Loot Box
openLoot.onclick = () => {
    const rewards = [
        "⭐ +20 Score",
        "💎 +30 Score",
        "🔥 +50 Score"
    ];

    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    lootResult.textContent = reward;

    rewardSound.play();

    if (reward.includes("20")) score += 20;
    if (reward.includes("30")) score += 30;
    if (reward.includes("50")) score += 50;

    scoreDisplay.textContent = "Score: " + score;

    level++;
    setTimeout(startLevel, 1000);
};

function resetAll() {
    score = 0;
    level = 1;
    scoreDisplay.textContent = "Score: 0";
    lootResult.textContent = "";
}