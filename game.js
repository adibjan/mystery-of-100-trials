// ==============================
// NUMBER QUEST - PRO EDITION
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

// PLAYER
let player = {
    x: canvasWidth/2 -25,
    y: canvasHeight - 100,
    w:50,
    h:50,
    speed:15,
    color:"#00eaff",
    glow:0
};

// ITEMS, ENEMIES, LOOT, CARDS
let items = [];
let enemies = [];
let lootBoxes = [];
let cards = [];

// WORLDS
const worlds = {
    jungle:{bg:"#003300", enemySpeed:2, itemSpeed:2},
    ice:{bg:"#001144", enemySpeed:3, itemSpeed:1.5},
    desert:{bg:"#664400", enemySpeed:2.5, itemSpeed:2},
    tech:{bg:"#111111", enemySpeed:3, itemSpeed:2.5}
};
let currentWorld = worlds.jungle;

// BOSS
let boss = null;

// SOUNDS
const s_collect = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_d15c4190b0.mp3?filename=coin-199953.mp3");
const s_hit = new Audio("https://cdn.pixabay.com/download/audio/2022/03/10/audio_3dc6fd48f4.mp3?filename=hit-204253.mp3");
const s_music = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_d44c2c0da8.mp3?filename=fun-game-loop-206609.mp3");
s_music.loop=true;
s_music.volume=0.35;

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
function startGame(){hideAllScreens();canvas.style.display="block";running=true;score=0;level=1;s_music.play();loop();}
function openLoot(){hideAllScreens();document.getElementById("lootBoxScreen").classList.remove("hidden");}
function openCards(){hideAllScreens();document.getElementById("cardScreen").classList.remove("hidden");renderCards();}
function openWorlds(){hideAllScreens();document.getElementById("worldScreen").classList.remove("hidden");}
function openBoss(){hideAllScreens();document.getElementById("bossScreen").classList.remove("hidden");}

// LOOT BOX
function openLootBox(type){
    const lootNames = {
        epic:["Epic Card 1","Epic Card 2","Epic Card 3"],
        legendary:["Legendary Card 1","Legendary Card 2"],
        mythic:["Mythic Card 1"]
    };
    const lootArray = lootNames[type];
    const reward = lootArray[Math.floor(Math.random()*lootArray.length)];
    cards.push(reward);
    s_collect.play();
    alert("You received: "+reward);
    const cardDiv = document.createElement("div");
    cardDiv.className="card-item";
    cardDiv.innerText=reward;
    document.getElementById("cardList").appendChild(cardDiv);
    cardDiv.animate([{transform:'scale(0)',opacity:0},{transform:'scale(1.2)',opacity:1},{transform:'scale(1)',opacity:1}],{duration:600,easing:'ease-out'});
    saveCards();
}

// CARD COLLECTION
function renderCards(){const cardList=document.getElementById("cardList");cardList.innerHTML="";cards.forEach(c=>{const div=document.createElement("div");div.className="card-item";div.innerText=c;cardList.appendChild(div);});}
function saveCards(){localStorage.setItem("cyberCards",JSON.stringify(cards));}
function loadCards(){const saved=JSON.parse(localStorage.getItem("cyberCards"));if(saved)cards=saved;}

// WORLD SELECT
function selectWorld(world){currentWorld=worlds[world];alert("World selected: "+world);goHome();}

// BOSS
function startBossFight(){
    boss={x:canvasWidth/2-50,y:50,w:100,h:100,hp:100,color:"#ff00ff",dx:3,dy:2};
    hideAllScreens();canvas.style.display="block";running=true;loop();
}

// SPAWN ITEMS & ENEMIES
function spawnItem(){items.push({x:Math.random()*(canvasWidth-30),y:-30,w:30,h:30,speed:currentWorld.itemSpeed+Math.random()*2});}
function spawnEnemy(){enemies.push({x:Math.random()*(canvasWidth-40),y:-40,w:40,h:40,speed:currentWorld.enemySpeed+Math.random()*2});}

// GAME LOOP
function loop(){
    if(!running) return;
    ctx.fillStyle=currentWorld.bg;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);

    // PLAYER
    player.glow=(player.glow+1)%360;
    ctx.shadowColor="#00eaff";
    ctx.shadowBlur=20+10*Math.sin(player.glow*Math.PI/180);
    ctx.fillStyle=player.color;
    ctx.fillRect(player.x,player.y,player.w,player.h);
    ctx.shadowBlur=0;

    // ITEMS
    if(Math.random()<0.03)spawnItem();
    items.forEach((it,i)=>{
        it.y+=it.speed;
        ctx.fillStyle="#00ff00";
        ctx.fillRect(it.x,it.y,it.w,it.h);
        if(it.y+it.h>player.y&&it.x<player.x+player.w&&it.x+it.w>player.x){
            score++; s_collect.play(); items.splice(i,1); player.glow=0;
        }
        if(it.y>canvasHeight) items.splice(i,1);
    });

    // ENEMIES
    if(Math.random()<0.02)spawnEnemy();
    enemies.forEach((en,i)=>{
        en.y+=en.speed;
        ctx.fillStyle="#ff0000";
        ctx.fillRect(en.x,en.y,en.w,en.h);
        if(en.y+en.h>player.y&&en.x<player.x+player.w&&en.x+en.w>player.x){
            running=false; s_hit.play(); s_music.pause();
            setTimeout(()=>{alert("GAME OVER! Score: "+score);location.reload();},200);
        }
        if(en.y>canvasHeight) enemies.splice(i,1);
    });

    // BOSS
    if(boss){
        boss.x+=boss.dx; boss.y+=boss.dy;
        if(boss.x<0||boss.x+boss.w>canvasWidth) boss.dx*=-1;
        if(boss.y<0||boss.y+boss.h>canvasHeight/2) boss.dy*=-1;
        ctx.fillStyle=boss.color; ctx.fillRect(boss.x,boss.y,boss.w,boss.h);
        ctx.fillStyle="#330000"; ctx.fillRect(canvasWidth/2-150,20,300,25);
        ctx.fillStyle="#ff00ff"; ctx.fillRect(canvasWidth/2-150,20,300*(boss.hp/100),25);
        boss.hp-=0.05;
        if(boss.hp<=0){alert("Boss Defeated! You got Mythic Card!"); openLootBox("mythic"); boss=null;}
    }

    // SCORE DISPLAY
    ctx.fillStyle="#00eaff";
    ctx.font="22px Arial";
    ctx.fillText("Score: "+score+" | Level: "+level+" | Cards: "+cards.length,20,30);

    // INCREASE DIFFICULTY
    if(score>level*10){level++;currentWorld.enemySpeed+=0.2;currentWorld.itemSpeed+=0.1;}

    requestAnimationFrame(loop);
}

// LOAD CARDS
loadCards();