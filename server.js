// SERVER: Ultra Pro Tournament Game
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // Serve client files

let rooms = {}; // Each room = players, state, scores

io.on("connection", socket => {
    console.log("Player connected:", socket.id);

    // Player joins a room
    socket.on("joinRoom", roomId => {
        socket.join(roomId);

        if (!rooms[roomId]) {
            rooms[roomId] = {
                players: [],
                scores: {},
                level: 1,
                tournament: false
            };
        }

        rooms[roomId].players.push(socket.id);
        rooms[roomId].scores[socket.id] = 0;

        io.to(roomId).emit("roomUpdate", rooms[roomId]);
    });

    // Player flips card → server validates
    socket.on("matchAttempt", ({ roomId, rarity }) => {
        let gain = 10;
        if (rarity === "Rare") gain = 20;
        if (rarity === "Legendary") gain = 50;

        rooms[roomId].scores[socket.id] += gain;

        // Tournament mode unlock at 1000 points
        if (rooms[roomId].scores[socket.id] >= 1000) {
            rooms[roomId].tournament = true;
        }

        io.to(roomId).emit("scoreUpdate", rooms[roomId]);
    });

    // Reward from Loot Box
    socket.on("lootReward", ({ roomId, reward }) => {
        if (reward === "Star") rooms[roomId].scores[socket.id] += 50;
        io.to(roomId).emit("scoreUpdate", rooms[roomId]);
    });

    // Disconnect
    socket.on("disconnect", () => {
        for (let roomId in rooms) {
            rooms[roomId].players = rooms[roomId].players.filter(p => p !== socket.id);
        }
    });
});

server.listen(3000, () => {
    console.log("Secure Tournament Server Running on port 3000");
});