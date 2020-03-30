/*jshint esversion: 6 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gameManager = require('./gameManger.js');
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//Get homepage
app.get('/', function(req, res) {
    res.sendfile('index.html');
});
//Get game resources
app.use(express.static('public'));
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
//io connections and messages
io.on('connection', function(socket) {
    socket.on('play_game', function(data) {
        //TODO: Check things

        //Check rooms exist
        //No rooms, make one
        //Otherwise add to that room
    });
});

http.listen(3000, function() {
    console.log('listening on localhost:3000');
});
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

///Add this when creating a game
var nsp = io.of('/my-namespace');
nsp.on('connection', function(socket) {
    console.log('someone connected');
});
nsp.emit('hi', 'everyone!');