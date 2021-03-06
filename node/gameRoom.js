const gameNum = 1;
const portNum = 2999 + gameNum;

if (process.env.NODE_ENV == 'production') {
    console.log("PRODUCTION MODE");
} else console.log("Development mode");

var express = require('express');
var app = express();
var http = require('http').createServer();
var gameLoop = require('./gameLoop.js');

const colorPalette = [
    ["#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#9900ff", "#ff00ff"],
    ["#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
    ["#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
    ["#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
];


var ioPath = '/game' + gameNum + '/socket.io';
const io = require('socket.io')(http, {
  path: ioPath
});



io.on('connection', function (socket) {
    socket.on('play_game', function (data) {
        try {
            //Input checking
            if (data == undefined) throw "Undefined data";

            let name = data.name.substring(0, 15);
            if (name == undefined) throw "Name not a string";

            let color = colorPalette[data.color.i][data.color.j];
            if (color == undefined) throw "Color not known";

            if (gameLoop.world.players.get(socket.id) != undefined) throw "Player already exists";

            if (gameLoop.world.players.size >= gameLoop.world.MAX_PLAYERS) throw "Max Players";

            //Add to game server
            let startPos = gameLoop.world.addPlayer(socket.id, name, color);
            socket.emit('join_game_success', { world: gameLoop.world.worldObj, startPos: startPos });
        }
        catch (error) {
        }
    });
    socket.on('player_input', function (data) {
        try {
            if (data == undefined) throw "Undefined data";
            if (gameLoop.world.players.get(socket.id) == undefined) throw "Not a player";
            gameLoop.world.playerInput(socket.id, data);
        }
        catch (error) {
        }
    });
    socket.on('player_respawn_request', function () {
        let resReq = gameLoop.world.requestRespawn(socket.id);
        if (resReq.success) {
            socket.emit('player_respawn_success', resReq.position);
        }
    });
    socket.on('player_shot', function (data) {
        gameLoop.world.playerShot(socket.id);
    });

    socket.on('upgrade_request', function (data) {
        //Check if integer
        //Check if valid upgrade int
        try {
            if (Number.isInteger(data)) {
                if (data >= 0 && data < 3) {
                    gameLoop.world.upgradePlayer(socket.id, data);
                }
            } else throw "Not a number";
        } catch (error) {
        }
    });

    socket.on('disconnect', function () {
        if (gameLoop.world.players.get(socket.id) != undefined) {
            gameLoop.world.removePlayer(socket.id);
        }
    });
});

http.on("request", function (req, res) {
    if (req.method == "GET") {
        if (req.url == "/game1/playerCount") {
            let thing = {};
            thing.playerCount = gameLoop.world.players.size;
            thing.MAX_PLAYERS = gameLoop.world.MAX_PLAYERS;
            res.write(JSON.stringify(thing));
            res.end();
        }
    }
});
http.listen(portNum, function() {
    console.log('listening on localhost:3000');
});

gameLoop.getStarted(io);
