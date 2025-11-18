// ==============================
// NUMBER PUZZLE QUEST - PRO EDITION
// ==============================

// GLOBAL
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let running = false;
let score = 0;
let level = 1;

// PLAYER (cursor for selecting numbers)
let player = {
    x: canvasWidth/2 - 25,
    y: canvasHeight - 100,
    w: 50,
    h: 50,
    speed: 15,
    color: "#00eaff",
    glow: 0
};

// PUZZLE NUMBERS
let numbers = []; // array of {x, y, value, collected}

// ITEMS & CARDS
let lootBoxes = [];
let cards = [];

// WORLDS
const worlds = {
    jungle:{bg:"#003300"},
    ice:{bg:"#001144"},
    desert:{bg:"#664400"},
    tech:{bg:"#111111"}
};
let currentWorld = worlds.jungle;

// BOSS
let boss = null;

// SOUNDS
const s_collect = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_d15c4190b0.mp3?filename=coin-199953.mp3");
const s_hit = new Audio("https://cdn.pixabay.com/download/audio/2022/03/10/audio_3dc6fd48f4.mp3?filename=hit-204253.mp3");
const s_music = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_d44c2c0da8.mp3?filename=fun-game-loop-206609.mp3");
s_music.loop = true; s_music.volume = 0.35;

// KEYBOARD
document.addEventListener("keydown", e=>{
    if(e.key==="ArrowLeft"&&player.x>0) player.x-=player.speed;
    if(e.key==="ArrowRight"&&player.x<canvasWidth-player.w) player.x+=player.speed;
});
window.addEventListener("resize", ()=>{
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
});

// MENU FUNCTIONS
function hideAllScreens(){document.querySelectorAll(".menu-screen").forEach(el=>el.classList.add("hidden"));}
function goHome(){hideAllScreens();document.getElementById("mainMenu").classList.remove("hidden");}
function startGame(){hideAllScreens();canvas.style.display="block";running=true;score=0;level=1;s_music.play();spawnNumbers();loop();}
function openLoot(){hideAllScreens();document.getElementById("lootBoxScreen").classList.remove("hidden");}
function openCards(){hideAllScreens();document.getElementById("cardScreen").classList.remove("hidden");renderCards();}
function openWorlds(){hideAllScreens();document.getElementById("worldScreen").classList.remove("hidden");}
function openBoss(){hideAllScreens();document.getElementById("bossScreen").classList.remove("hidden");}

// LOOT BOX
function openLootBox(type){
    const lootNames = { epic:["Epic Card 1","Epic Card 2"], legendary:["Legendary Card 1"], mythic:["Mythic Card 1"] };
    const lootArray = lootNames[type];
    const reward = lootArray[Math.floor(Math.random()*lootArray.length)];
    cards.push(reward); s_collect.play();
    alert("You received: "+reward);
    const cardDiv=document.createElement("div"); cardDiv.className="card-item"; cardDiv.innerText=reward;
    document.getElementById("cardList").appendChild(cardDiv);
    cardDiv.animate([{transform:'scale(0)',opacity:0},{transform:'scale(1.2)',opacity:1},{transform:'scale(1)',opacity:1}],{duration:600,easing:'ease-out'});
    saveCards();
}

// CARD COLLECTION
function renderCards(){const cardList=document.getElementById("cardList");cardList.innerHTML="";cards.forEach(c=>{const div=document.createElement("div");div.className="card-item";div.innerText=c;cardList.appendChild(div);});}
function saveCards(){localStorage.setItem("numberPuzzleCards",JSON.stringify(cards));}
function loadCards(){const saved=JSON.parse(localStorage.getItem("numberPuzzleCards")); if(saved)cards=saved;}

// SPAWN PUZZLE NUMBERS
function spawnNumbers(){
    numbers = [];
    for(let i=1;i<=10;i++){
        numbers.push({x:Math.random()*(canvasWidth-50),y:Math.random()*canvasHeight/2,value:i,collected:false});
    }
}

// GAME LOOP
function loop(){
    if(!running) return;
    ctx.fillStyle=currentWorld.bg;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);

    // PLAYER
    player.glow=(player.glow+1)%360;
    ctx.shadowColor="#00eaff"; ctx.shadowBlur=20+10*Math.sin(player.glow*Math.PI/180);
    ctx.fillStyle=player.color; ctx.fillRect(player.x,player.y,player.w,player.h);
    ctx.shadowBlur=0;

    // NUMBERS
    numbers.forEach(n=>{
        if(!n.collected){
            ctx.fillStyle="#ffcc00";
            ctx.font="30px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle";
            ctx.fillText(n.value,n.x+25,n.y+25);
            // collision
            if(player.x< n.x+50 && player.x+player.w>n.x && player.y< n.y+50 && player.y+player.h>n.y){
                n.collected=true; score++; s_collect.play();
            }
        }
    });

    // SCORE DISPLAY
    ctx.fillStyle="#00eaff"; ctx.font="22px Arial";
    ctx.fillText("Score: "+score+" | Level: "+level+" | Cards: "+cards.length,20,30);

    requestAnimationFrame(loop);
}

// LOAD CARDS
loadCards();