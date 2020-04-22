
var players = new Map();

var fakePlayer = new Player(0, 0);
players.set(12345, fakePlayer);

var update = function (deltaTime) {
	fakePlayer.x += deltaTime * 10;
};

var addPlayer = function (socketID) {
	players.set(socketID, new Player(0,0));
};

var removePlayer = function (socketID) {
	players.delete(socketID);
};

function Player(x, y) {
	this.x = x;
	this.y = y;
}

var getState = function () {
	return players;
};

exports.getState = getState;