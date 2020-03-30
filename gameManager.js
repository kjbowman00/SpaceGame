/*jshint esversion: 6 */
const MAX_PLAYERS = 30;

var games = new Map();
var players = new Map();

function _newGame(gameID, gameProcess) {
	games.set(gameID, {gameProcess:gameProcess, nPlayers:0});

	//Let the child process handle
	//With its own namespace
	var gameIO = io.of(concat("/G_", gameID.toString()));
    gameIO.on('connection', function(socket){
    	child.send('socket', socket);
        console.log('someone connected');
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

function _createRoom() {

}

function joinRequest(playerID) {
	//Check if player is a dipshit and already in room etc...
	//if players.get(playerID) somethin

	//Try to find a room
	var roomID = _findRoom();

	//No room? create one
	if (roomID == null) {
		roomID = _createRoom();
	}

	//failed? return false
	if (roomID == null) {
		return false;
	} else {

	}
}