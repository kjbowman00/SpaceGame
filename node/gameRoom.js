/*jshint esversion: 6 */
const gameNum = 1;
const portNum = 2999 + gameNum;

var express = require('express');
var app = express();
var http = require('http').createServer();

var ioPath = '/game' + gameNum + '/socket.io';
const io = require('socket.io')(http, {
  path: ioPath
});



io.on('connection', function(socket) {
    console.log("websocket established");
    socket.on('play_game', function(data) {
        console.log("yee hooo play_game");
        console.log(data);
    });
    socket.emit('test1', "heyyy");
});

http.listen(portNum, function() {
    console.log('listening on localhost:3000');
});
