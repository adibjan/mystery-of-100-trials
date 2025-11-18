const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let rooms = {};
let globalLeaderboard = {};

io.on("connection", socket => {
    console.log("Player connected:", socket.id);

    socket.on("joinGame", () => {
        // Room خودکار
        let roomId = Object.keys(rooms).find(r => rooms[r].players.length < 4);
        if(!roomId){
            roomId = "room" + Math.floor(Math.random()*10000);
            rooms[roomId] = { players: [], scores: {}, ready:{}, tournament:false, level:1 };
        }
        socket.join(roomId);
        rooms[roomId].players.push(socket.id);
        rooms[roomId].scores[socket.id] = 0;
        rooms[roomId].ready[socket.id] = false;

        socket.emit("joinedRoom", {roomId, players: rooms[roomId].players});
        io.to(roomId).emit("roomUpdate", rooms[roomId]);
    });

    socket.on("playerReady", roomId => {
        if(rooms[roomId]){
            rooms[roomId].ready[socket.id] = true;
            io.to(roomId).emit("roomUpdate", rooms[roomId]);
            const allReady = Object.values(rooms[roomId].ready).every(v=>v===true);
            if(allReady){
                io.to(roomId).emit("startGame", rooms[roomId]);
            }
        }
    });

    socket.on("matchAttempt", ({roomId, rarity}) => {
        if(!rooms[roomId]) return;
        let gain = 10;
        if(rarity==="Rare") gain=20;
        if(rarity==="Legendary") gain=50;
        rooms[roomId].scores[socket.id] += gain;
        globalLeaderboard[socket.id] = (globalLeaderboard[socket.id]||0)+gain;
        io.to(roomId).emit("scoreUpdate", rooms[roomId]);
    });

    socket.on("lootReward", ({roomId, reward}) => {
        if(!rooms[roomId]) return;
        if(reward==="Star") rooms[roomId].scores[socket.id] += 50;
        globalLeaderboard[socket.id] = (globalLeaderboard[socket.id]||0)+50;
        io.to(roomId).emit("scoreUpdate", rooms[roomId]);
    });

    socket.on("startTournament", roomId => {
        if(rooms[roomId]){
            rooms[roomId].tournament = true;
            io.to(roomId).emit("tournamentStarted", rooms[roomId]);
        }
    });

    socket.on("sendMessage", ({roomId,msg})=>{
        io.to(roomId).emit("receiveMessage",{id:socket.id, msg});
    });

    socket.on("getGlobalLeaderboard", ()=>{
        socket.emit("updateGlobalLeaderboard", globalLeaderboard);
    });

    socket.on("disconnect", () => {
        for(let roomId in rooms){
            rooms[roomId].players = rooms[roomId].players.filter(p=>p!==socket.id);
            delete rooms[roomId].ready[socket.id];
            delete rooms[roomId].scores[socket.id];
        }
    });
});

server.listen(3000, ()=>console.log("Ultra Pro Pro Server Running on port 3000"));