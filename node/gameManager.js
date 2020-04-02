/*jshint esversion: 6 */
exports.joinRequest = joinRequest;

var appjs = require('./app.js');
var io = appjs.io;

const MAX_PLAYERS = 30;
const MAX_GAMES = 10;

var nodeChildProcess = require('child_process');

var games = new Map();
var numGames = 0;
var players = new Map();

function _newGame(gameID) {
	//Spawn a child process to run the room code
	var child = nodeChildProcess.fork('./gameRoom.js');

	games.set(gameID, {gameProcess:child, nPlayers:0});
	numGames++;
	//Let the child process handle
	//With its own namespace
	console.log(gameID);
	var gameIO = io.of("/G_" + gameID.toString());
    gameIO.on('connection', function(socket){
    	console.log('someone connected');
    	child.send('socket', socket);
    });
}

function _joinGame(gameID, playerID) {
	var game = games.get(gameID);
	game.nPlayers++;

	players.set(playerID, gameID);
}

function _findRoom() {
	for (let [gameID, game] of games) {
		if (game.nPlayers < MAX_PLAYERS) return gameID;
	}
	return null;
}

function joinRequest(playerID) {
	//Check if player is a dipshit and already in room etc...
	//if players.get(playerID) somethin

	//Try to find a room
	var roomID = _findRoom();

	//Create a room if didn't find one
	if (roomID == null && numGames < MAX_GAMES) {
		_newGame(playerID);
		roomID = playerID;
		_joinGame(roomID, playerID);
		return roomID;
	} else {
		//We did find a room, join it
		_joinGame(roomID, playerID);
		return roomID;
	}
	return null; //Failed to join a game
}