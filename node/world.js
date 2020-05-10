var collisions = require('./collisionDetection.js');
var players = new Map();

const PLAYER_SPEED = 100;

var update = function (deltaTime) {
	//Update player positions
	players.forEach((currentPlayer, key, map) => {
		currentPlayer.x += currentPlayer.xVel * deltaTime;
		currentPlayer.y += currentPlayer.yVel * deltaTime;
	});

	//Handle collisions
	collisions.updateCollisions(players);
};

var sendUpdates = function(io) {
	players.forEach((value, key, map) => {
		//Key is socketid. //value is player object
		//Need to grab each nearby object to this player
		var objectsToSend = new Map();
		players.forEach((value2, key2, map2) => {
			if (key != key2) {
				var distSq = (value.x - value2.x) * (value.x - value2.x);
				distSq += (value.y - value.y) * (value.y - value2.y);
				if (distSq <= 1000000000) {
					objectsToSend.set(key2 , value2);
				}
			}
		});
		objectsToSend = Array.from(objectsToSend);
		io.to(key).emit('state', { player: value, others: objectsToSend });
	});
}

var addPlayer = function (socketID) {
	players.set(socketID, new Player(0, 0));
	console.log(players);
};

var removePlayer = function (socketID) {
	players.delete(socketID);
};

function Player(x, y) {
	this.x = x;
	this.y = y;
	this.w = 50;
	this.h = 50;
	this.xVel = 0;
	this.yVel = 0;
}

var playerInput = function (socketID, input) {
	var currentPlayer = players.get(socketID);
	if (input.xDir == 1) {
		currentPlayer.xVel = PLAYER_SPEED;
	} else if (input.xDir == -1) {
		currentPlayer.xVel = -PLAYER_SPEED;
	} else {
		currentPlayer.xVel = 0;
	}
	if (input.yDir == 1) {
		currentPlayer.yVel = PLAYER_SPEED;
	} else if (input.yDir == -1) {
		currentPlayer.yVel = -PLAYER_SPEED;
	} else {
		currentPlayer.yVel = 0;
	}
}

exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.update = update;
exports.sendUpdates = sendUpdates;
exports.playerInput = playerInput;