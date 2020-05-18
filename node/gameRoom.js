const gameNum = 1;
const portNum = 2999 + gameNum;

var express = require('express');
var app = express();
var http = require('http').createServer();
var gameLoop = require('./gameLoop.js');
var staticWorldObjs = require('./staticWorldObjs');

var ioPath = '/game' + gameNum + '/socket.io';
const io = require('socket.io')(http, {
  path: ioPath
});



io.on('connection', function(socket) {
    console.log("websocket established");
    socket.on('play_game', function (data) {
        try {
            //Input checking
            let name = data.name.substring(0, 15);
            if (name == undefined) throw "Name not a string";

            //Add to game server
            gameLoop.world.addPlayer(socket.id, name);
            socket.emit('join_game_success', staticWorldObjs.staticWorldObjs);
        }
        catch (error) {
            console.log("PLAYER FAILED TO JOIN SERVER:");
            console.log(error);
        }
    });
    socket.on('player_input', function (data) {
        gameLoop.world.playerInput(socket.id, data);
    });
    socket.on('player_shot', function (data) {
        gameLoop.world.playerShot(socket.id);
    });
    socket.on('disconnect', function () {
        gameLoop.world.removePlayer(socket.id);
    });
});

http.listen(portNum, function() {
    console.log('listening on localhost:3000');
});

gameLoop.getStarted(io);
