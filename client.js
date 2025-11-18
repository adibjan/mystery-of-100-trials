const socket = io();

const start=document.getElementById("start");
const startBtn=document.getElementById("startBtn");
const game=document.getElementById("game");
const roomLabel=document.getElementById("roomLabel");
const playersList=document.getElementById("playersList");
const readyBtn=document.getElementById("readyBtn");
const scoreboardDiv=document.getElementById("scoreboard");
const gameBoard=document.getElementById("game-board");
const startTournamentBtn=document.getElementById("startTournamentBtn");
const showLeaderboardBtn=document.getElementById("showLeaderboardBtn");

const chatInput=document.getElementById("chatInput");
const sendChat=document.getElementById("sendChat");
const chatMessages=document.getElementById("chatMessages");

const globalLeaderboardDiv=document.getElementById("globalLeaderboard");
const leaderboardList=document.getElementById("leaderboardList");

let roomId="solo", level=1; // Room خودکار تک نفره

// Sounds
const bgMusic=new Audio('sounds/background.mp3'); bgMusic.loop=true; bgMusic.volume=0.3; bgMusic.play();
const matchSound=new Audio('sounds/match.mp3');
const wrongSound=new Audio('sounds/wrong.mp3');
const rewardSound=new Audio('sounds/reward.mp3');
function playSound(type){ if(type==="match") matchSound.play(); if(type==="wrong") wrongSound.play(); if(type==="reward") rewardSound.play(); }

// شروع بازی با کلیک Start
startBtn.onclick=()=>{
    start.classList.add("hidden");
    game.classList.remove("hidden");
    roomLabel.textContent="Room: "+roomId;
    playersList.textContent="Players in room: You";
    socket.emit("joinGame"); // فقط برای ثبت در سرور و leaderboard
    loadLevel();
}

// Player Ready
readyBtn.onclick=()=>{ socket.emit("playerReady",roomId); }

// Chat
sendChat.onclick=()=>{
  const msg=chatInput.value.trim(); if(!msg)return;
  socket.emit("sendMessage",{roomId,msg});
  chatInput.value="";
}
socket.on("receiveMessage",({id,msg})=>{
  const div=document.createElement("div");
  div.textContent=id+": "+msg;
  chatMessages.appendChild(div);
  chatMessages.scrollTop=chatMessages.scrollHeight;
});

// Tournament
startTournamentBtn.onclick=()=>{ socket.emit("startTournament",roomId); }
socket.on("tournamentStarted",data=>{document.getElementById("tournament").classList.remove("hidden");});

// Show Global Leaderboard
showLeaderboardBtn.onclick=()=>{ socket.emit("getGlobalLeaderboard"); }
socket.on("updateGlobalLeaderboard",data=>{
  globalLeaderboardDiv.classList.remove("hidden");
  leaderboardList.innerHTML="";
  const sorted=Object.entries(data).sort((a,b)=>b[1]-a[1]);
  sorted.forEach(([id,score])=>{
    const div=document.createElement("div"); div.textContent=id+": "+score;
    leaderboardList.appendChild(div);
  });
});

// Room Update
socket.on("roomUpdate", data=>{
  // فقط برای تک‌نفره خودمون
});

// Start Game
socket.on("startGame", data=>{
  loadLevel();
});

// Load Level
function loadLevel(){
  gameBoard.innerHTML="";
  const values=[]; const pairCount=level+3;
  for(let i=1;i<=pairCount;i++) values.push(i,i);
  values.sort(()=>Math.random()-0.5);
  values.forEach(val=>{
    const card=document.createElement("div");
    card.classList.add("card"); card.dataset.value=val;
    let r=Math.random();
    if(r>0.9) card.dataset.rarity="Legendary";
    else if(r>0.75) card.dataset.rarity="Rare";
    else card.dataset.rarity="Common";
    card.onclick=()=>flipCard(card);
    gameBoard.appendChild(card);
  });
}

let flipped=[];
function flipCard(card){
  if(card.classList.contains("flipped") || flipped.length===2) return;
  card.classList.add("flipped");
  card.style.transform="rotateY(180deg) scale(1.1)"; card.textContent=card.dataset.value;
  flipped.push(card);
  if(flipped.length===2){
    if(flipped[0].dataset.value===flipped[1].dataset.value){
      socket.emit("matchAttempt",{roomId, rarity:flipped[0].dataset.rarity});
      playSound("match");
      flipped.forEach(c=>{
        if(c.dataset.rarity==="Rare") c.style.boxShadow="0 0 20px blue";
        if(c.dataset.rarity==="Legendary") c.style.boxShadow="0 0 30px gold";
      });
      flipped=[];
    } else {
      playSound("wrong");
      setTimeout(()=>{
        flipped.forEach(c=>{ c.classList.remove("flipped"); c.textContent=""; c.style.transform="rotateY(0deg) scale(1)"; c.style.boxShadow="none"; });
        flipped=[];
      },800);
    }
  }
}

// Score updates
socket.on("scoreUpdate", data=>{
  scoreboardDiv.innerHTML="";
  Object.keys(data.scores).forEach(id=>{
    const p=document.createElement("div"); p.textContent=id+": "+data.scores[id];
    scoreboardDiv.appendChild(p);
  });
});