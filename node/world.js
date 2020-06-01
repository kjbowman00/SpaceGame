var collisions = require('./collisionDetection.js');

var staticWorldObjs = require('./staticWorldObjs.js').staticWorldObjs;
var worldObj = {
	width: 6000,
	height: 6000,
	staticWorldObjs: staticWorldObjs
};

var orbs = require('./orb.js');
orbs.initializeOrbs(worldObj, staticWorldObjs);

var powerups = require('./powerups.js');
var middlePowerup = new powerups.powerupObj(-50, -50, 100, 100);

var players = new Map();
var bullets = new Map();
var bulletNum = 0; //Used to communicate to player what bullet to delete when it hits
var bulletsMarkedForExplosion = [];

const PLAYER_SPEED = 250;

var update = function (deltaTime) {
	//Update player positions
	players.forEach((currentPlayer, key, map) => {
		if (currentPlayer.alive) {
			//Update old positions
			currentPlayer.oldX = currentPlayer.x;
			currentPlayer.oldY = currentPlayer.y;

			currentPlayer.x += currentPlayer.xVel * deltaTime;
			currentPlayer.y += currentPlayer.yVel * deltaTime;

			//Handle player shooting
			if (currentPlayer.gun.shotsRequested > 0 && currentPlayer.gun.shotTimer >= currentPlayer.gun.shotTimeNeeded - 0.03) {
				bullets.set(bulletNum, {
					x: currentPlayer.x + currentPlayer.w / 2 - 5, y: currentPlayer.y + (currentPlayer.h / 2) - 5,
					r: 5,
					xVel: Math.cos(currentPlayer.gun.rotation) * 500 + currentPlayer.xVel/2,
					yVel: Math.sin(currentPlayer.gun.rotation) * 500 + currentPlayer.yVel/2,
					damage: 10,
					color: currentPlayer.color,
					timeAlive: 0,
					playerEmitId: key
				});
				bulletNum++;
				currentPlayer.gun.shotTimer = 0;
				currentPlayer.gun.shotsRequested--;
			} else currentPlayer.gun.shotTimer += deltaTime;

			if (currentPlayer.health <= 0) currentPlayer.alive = false;
		}
	}); //END update player positions

	let bulletsMarkedForDelete = [];
	//Move bullets
	bullets.forEach((bullet, id, map) => {
		bullet.timeAlive += deltaTime;
		if (bullet.timeAlive >= 5) bulletsMarkedForDelete.push(id);
		bullet.x += bullet.xVel * deltaTime;
		bullet.y += bullet.yVel * deltaTime;
	});

	orbs.update(deltaTime);

	//Handle collisions
	collisions.updateCollisions(players, bullets, bulletsMarkedForExplosion, orbs.orbs, deltaTime);

	//Handle powerup obj
	powerups.updatePowerup(middlePowerup, players, deltaTime);

	//Delete old bullets
	for (let i = bulletsMarkedForDelete.length - 1; i >= 0; i--) {
		bullets.delete(bulletsMarkedForDelete[i]);
	}
};

var sendUpdates = function (io) {
	const DIST_NEEDED = 1000000;
	players.forEach((value, key, map) => {
		//Key is socketid. //value is player object
		//Need to grab each nearby object to this player
		var objectsToSend = {};
		objectsToSend.players = new Map();
		players.forEach((value2, key2, map2) => {
			if (key != key2 && value2.alive) {
				var distSq = (value.x - value2.x) * (value.x - value2.x);
				distSq += (value.y - value.y) * (value.y - value2.y);
				if (distSq <= DIST_NEEDED) {
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
			if (distSq <= DIST_NEEDED) {
				objectsToSend.bullets.set(id,bullet);
			}
		});
		objectsToSend.bullets = Array.from(objectsToSend.bullets);

		//Gather Orbs
		objectsToSend.orbs = Array.from(orbs.gather(value, DIST_NEEDED));

		//Exploded bullets
		objectsToSend.bulletsMarkedForExplosion = bulletsMarkedForExplosion;

		//Powerups
		objectsToSend.powerups = [middlePowerup];

		io.to(key).emit('state', { player: value, objects: objectsToSend });

		bulletsMarkedForExplosion.length = 0; //Delete contents of explosion array
	});
}

function getRandomSpawn() {
	const smallW = worldObj.width / 4;
	const smallH = worldObj.height / 4;
	const halfW = worldObj.width / 2;
	const halfH = worldObj.height / 2;
	const w = worldObj.width;
	const h = worldObj.height;
	let side = Math.floor(Math.random() * 4);

	let position = { x: 0, y: 0 };
	if (side == 0) { // top
		position.x = Math.random() * (w - 50) - halfW;
		position.y = Math.random() * (smallH - 50) - halfH;
		console.log(position);
	} else if (side == 1) { // right
		position.x = halfW - smallW + (Math.random() * (smallW - 50));
		position.y = Math.random() * (h - 50) - halfH;
	} else if (side == 2) { // Bottom
		position.x = Math.random() * (w - 50) - halfW;
		position.y = halfH - smallH + (Math.random() * (smallH - 50));
	} else { // left
		position.x = Math.random() * (smallW - 50) - halfW;
		position.y = Math.random() * (h - 50) - halfH;
	}
	position.x = Math.floor(position.x);
	position.y = Math.floor(position.y);

	return position;
}

var addPlayer = function (socketID, name, color) {
	let position = getRandomSpawn();
	players.set(socketID, new Player(name, position.x, position.y, color));
	return position;
};

var requestRespawn = function (socketID) {
	let req = { position: null, success: false };
	let player = players.get(socketID);
	if (player == undefined) return req;
	if (player.alive) return req;

	req.success = true;
	let position = getRandomSpawn();
	player.x = position.x;
	player.y = position.y;
	req.position = position;
	player.alive = true;
	player.health = 100;
	return req;
}

var removePlayer = function (socketID) {
	players.delete(socketID);
};

function Player(name, x, y, color) {
	this.name = name;
	this.oldX = x;
	this.oldY = y;
	this.x = x;
	this.y = y;
	this.w = 50;
	this.h = 50;
	this.color = color;
	this.xVel = 0;
	this.yVel = 0;
	this.health = 100;
	this.alive = true;
	this.gun = {};
	this.gun.rotation = 0;
	this.gun.w = 50;
	this.gun.h = 10;
	this.gun.shotsRequested = 0;
	this.gun.shotTimer = 0;
	this.gun.shotTimeNeeded = 0.1; //Default fire rate
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

exports.requestRespawn = requestRespawn;
exports.playerShot = playerShot;
exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.update = update;
exports.sendUpdates = sendUpdates;
exports.playerInput = playerInput;
exports.worldObj = worldObj;