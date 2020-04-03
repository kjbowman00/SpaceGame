/*jshint esversion: 6 */
var express = require('express');
var app = express();
var http = require('http').createServer();
const io = require('socket.io')(http, {
  path: '/game1/socket.io'
});

io.on('connection', function(socket) {
    console.log("websocket established");
    socket.on('play_game', function(data) {
        console.log("yee hooo play_game");
        console.log(data);
    });
    socket.emit('test1', "heyyy");
});

http.listen(3000, function() {
    console.log('listening on localhost:3000');
});
