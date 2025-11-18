const socket = io();

const start = document.getElementById("start");
const joinBtn = document.getElementById("joinBtn");
const roomInput = document.getElementById("roomId");

const game = document.getElementById("game");
const scoreboardDiv = document.getElementById("scoreboard");
const roomLabel = document.getElementById("roomLabel");
const tournamentDiv = document.getElementById("tournament");
const gameBoard = document.getElementById("game-board");

let roomId = "";
let level = 1;

joinBtn.onclick = () => {
    roomId = roomInput.value.trim();
    if (roomId === "") return;

    socket.emit("joinRoom", roomId);

    start.classList.add("hidden");
    game.classList.remove("hidden");
    roomLabel.textContent = "Room: " + roomId;

    loadLevel();
};

function loadLevel() {
    gameBoard.innerHTML = "";
    const values = [];
    const pairCount = level + 3;

    for (let i=1; i<=pairCount; i++) {
        values.push(i, i);
    }

    values.sort(() => Math.random() - 0.5);

    values.forEach(val => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = val;

        let r = Math.random();
        if (r > 0.9) card.dataset.rarity = "Legendary";
        else if (r > 0.75) card.dataset.rarity = "Rare";
        else card.dataset.rarity = "Common";

        card.onclick = () => flipCard(card);

        gameBoard.appendChild(card);
    });
}

let flipped = [];

function flipCard(card) {
    if (card.classList.contains("flipped") || flipped.length === 2) return;

    card.classList.add("flipped");
    card.textContent = card.dataset.value;
    flipped.push(card);

    if (flipped.length === 2) {
        if (flipped[0].dataset.value === flipped[1].dataset.value) {
            socket.emit("matchAttempt", {
                roomId,
                rarity: flipped[0].dataset.rarity
            });

            flipped = [];
        } else {
            setTimeout(() => {
                flipped.forEach(c => {
                    c.classList.remove("flipped");
                    c.textContent = "";
                });
                flipped = [];
            }, 800);
        }
    }
}

// Server updates scoreboard
socket.on("scoreUpdate", data => {
    scoreboardDiv.innerHTML = "";

    Object.keys(data.scores).forEach(id => {
        const p = document.createElement("div");
        p.textContent = id + ": " + data.scores[id];
        scoreboardDiv.appendChild(p);
    });

    if (data.tournament) {
        tournamentDiv.classList.remove("hidden");
    }
});