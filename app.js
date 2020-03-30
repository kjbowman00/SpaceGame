/*jshint esversion: 6 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gameManager = require('./gameManager.js');
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
        //Call up gameManager
        console.log("user hit play");
        gameManager.joinRequest(socket.id);
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