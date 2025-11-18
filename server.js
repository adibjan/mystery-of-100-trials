const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let rooms = {}; // هر Room = players + scores + tournament

// Leaderboard جهانی
let globalLeaderboard = {};

io.on("connection", socket => {
    console.log("Player connected:", socket.id);

    socket.on("joinRoom", roomId => {
        socket.join(roomId);
        if(!rooms[roomId]){
            rooms[roomId] = { players: [], scores: {}, level: 1, tournament: false };
        }
        rooms[roomId].players.push(socket.id);
        rooms[roomId].scores[socket.id] = 0;

        io.to(roomId).emit("roomUpdate", rooms[roomId]);
    });

    socket.on("matchAttempt", ({roomId, rarity}) => {
        let gain = 10;
        if(rarity==="Rare") gain=20;
        if(rarity==="Legendary") gain=50;

        rooms[roomId].scores[socket.id] += gain;

        // آپدیت Leaderboard جهانی
        globalLeaderboard[socket.id] = (globalLeaderboard[socket.id] || 0) + gain;

        io.to(roomId).emit("scoreUpdate", rooms[roomId]);
    });

    socket.on("lootReward", ({roomId, reward}) => {
        if(reward==="Star") rooms[roomId].scores[socket.id] += 50;

        globalLeaderboard[socket.id] = (globalLeaderboard[socket.id] || 0) + 50;

        io.to(roomId).emit("scoreUpdate", rooms[roomId]);
    });

    // اختیاری Tournament
    socket.on("startTournament", roomId => {
        if(rooms[roomId]){
            rooms[roomId].tournament = true;
            io.to(roomId).emit("tournamentStarted", rooms[roomId]);
        }
    });

    // Chat
    socket.on("sendMessage", ({roomId, msg})=>{
        io.to(roomId).emit("receiveMessage",{id:socket.id, msg});
    });

    // درخواست Leaderboard جهانی
    socket.on("getGlobalLeaderboard", ()=>{
        socket.emit("updateGlobalLeaderboard", globalLeaderboard);
    });

    // Disconnect
    socket.on("disconnect", () => {
        for(let roomId in rooms){
            rooms[roomId].players = rooms[roomId].players.filter(p=>p!==socket.id);
        }
    });
});

server.listen(3000, () => console.log("Secure Tournament Server Running on port 3000"));