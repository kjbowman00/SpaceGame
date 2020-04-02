/*jshint esversion: 6 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
exports.io = io;

var gameManager = require('./gameManager.js');

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//Get homepage
app.get('/', function(req, res) {
	console.log("heeehEEEOOO");
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
        console.log('user hit play');
        var roomID = gameManager.joinRequest(socket.id);
        socket.emit('join_room_success', roomID);
    });
});

http.listen(3000, function() {
    console.log('listening on localhost:3000');
});
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////