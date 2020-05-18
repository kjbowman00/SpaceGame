var collisions = require('./collisionDetection.js');
var players = new Map();
var bullets = new Map();
var bulletNum = 0; //Used to communicate to player what bullet to delete when it hits
var bulletsMarkedForExplosion = [];

const PLAYER_SPEED = 100;

var update = function (deltaTime) {
	//Update player positions
	players.forEach((currentPlayer, key, map) => {
		//Update old positions
		currentPlayer.oldX = currentPlayer.x;
		currentPlayer.oldY = currentPlayer.y;

		currentPlayer.x += currentPlayer.xVel * deltaTime;
		currentPlayer.y += currentPlayer.yVel * deltaTime;

		//Handle player shooting
		if (currentPlayer.gun.shotsRequested > 0 && currentPlayer.gun.shotTimer >= currentPlayer.gun.shotTimeNeeded - 0.1) {
			bullets.set(bulletNum, {
				x: currentPlayer.x + currentPlayer.w / 2 - 5, y: currentPlayer.y + currentPlayer.h / 2 - 5,
				r: 5,
				rotation: currentPlayer.gun.rotation,
				damage: 10,
				timeAlive: 0,
				playerEmitId: key
			});
			bulletNum++;
			currentPlayer.gun.shotTimer = 0;
			currentPlayer.gun.shotsRequested--;
		} else currentPlayer.gun.shotTimer += deltaTime;
	}); //END update player positions

	let bulletsMarkedForDelete = [];
	//Move bullets
	bullets.forEach((bullet, id, map) => {
		bullet.timeAlive += deltaTime;
		if (bullet.timeAlive >= 5) bulletsMarkedForDelete.push(id);
		bullet.x += 200 * deltaTime * Math.cos(bullet.rotation);
		bullet.y += 200 * deltaTime * Math.sin(bullet.rotation);
	});

	//Handle collisions
	collisions.updateCollisions(players, bullets, bulletsMarkedForExplosion, deltaTime);

	//Delete old bullets
	for (let i = bulletsMarkedForDelete.length - 1; i >= 0; i--) {
		bullets.delete(bulletsMarkedForDelete[i]);
	}
};

var sendUpdates = function(io) {
	players.forEach((value, key, map) => {
		//Key is socketid. //value is player object
		//Need to grab each nearby object to this player
		var objectsToSend = {};
		objectsToSend.players = new Map();
		players.forEach((value2, key2, map2) => {
			if (key != key2) {
				var distSq = (value.x - value2.x) * (value.x - value2.x);
				distSq += (value.y - value.y) * (value.y - value2.y);
				if (distSq <= 1000000000) {
					objectsToSend.players.set(key2 , value2);
				}
			}
		});
		objectsToSend.players = Array.from(objectsToSend.players);

		objectsToSend.bullets = new Map();
		//Gather bullets
		bullets.forEach((bullet, id, map) => {
			let distSq = (value.x - bullet.x) * (value.x - bullet.x);
			distSq += (value.y - bullet.y) * (value.y - bullet.y);
			if (distSq <= 1000000000) {
				objectsToSend.bullets.set(id,bullet);
			}
		});
		objectsToSend.bullets = Array.from(objectsToSend.bullets);

		//Exploded bullets
		objectsToSend.bulletExplosions = bulletsMarkedForExplosion;

		io.to(key).emit('state', { player: value, objects: objectsToSend });

		bulletsMarkedForExplosion.length = 0; //Delete contents of explosion array
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
	this.oldX = x;
	this.oldY = y;
	this.x = x;
	this.y = y;
	this.w = 50;
	this.h = 50;
	this.xVel = 0;
	this.yVel = 0;

	this.gun = {};
	this.gun.rotation = 0;
	this.gun.shotsRequested = 0;
	this.gun.shotTimer = 0;
	this.gun.shotTimeNeeded = 0.3; //Default fire rate
}

var playerInput = function (socketID, input) {
	var currentPlayer = players.get(socketID);
	if (currentPlayer == undefined) return;

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

	currentPlayer.gun.rotation = input.rotation;
}

var playerShot = function (socketID) {
	let player = players.get(socketID);
	if (player != undefined) {
		player.gun.shotsRequested += 1;
	}
}

exports.playerShot = playerShot;
exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.update = update;
exports.sendUpdates = sendUpdates;
exports.playerInput = playerInput;