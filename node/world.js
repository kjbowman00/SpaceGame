var collisions = require('./collisionDetection.js');

var staticWorldObjs = require('./staticWorldObjs.js').staticWorldObjs;
var worldObj = {
	width: 6000,
	height: 6000,
	staticWorldObjs: staticWorldObjs
};

var orbs = require('./orb.js');
orbs.initializeOrbs(worldObj, staticWorldObjs);

var leaderboard = require('./leaderboard.js');

var upgrades = require('./upgrades.js');
const UPGRADE_TYPES = upgrades.UPGRADE_TYPES;

var powerups = require('./powerups.js');
var middlePowerup = new powerups.powerupObj(-50, -50, 100, 100);

var players = new Map();
var bullets = new Map();
var bulletNum = 0; //Used to communicate to player what bullet to delete when it hits
var bulletsMarkedForExplosion = [];

var botManager = require('./botManager.js');

const REGEN_START_TIME = 5; //5 seconds of not being hit

const PLAYER_SPEED = 150;

var update = function (deltaTime) {
	botManager.updateBotNumbers();
	let botsToRemove = [];
	let playersToReset = [];
	//Update player positions
	players.forEach((currentPlayer, key, map) => {
		if (currentPlayer.alive) {
			currentPlayer.regenStartTimer += deltaTime;
			if (currentPlayer.regenStartTimer > REGEN_START_TIME) {
				currentPlayer.health += deltaTime * 5 * (1 + 0.25 * currentPlayer.upgrades[UPGRADE_TYPES.health_regen]); //5 health per second
				if (currentPlayer.health > currentPlayer.maxHealth) currentPlayer.health = currentPlayer.maxHealth;
			}

			//Get powerup mods
			let velocityMod = 1;
			if (isPowerupActive(powerups.powerups.superSpeed, currentPlayer)) velocityMod += 0.8;
			velocityMod += currentPlayer.upgrades[UPGRADE_TYPES.speed] * 0.1;
			let velMod2 = 1;
			if (currentPlayer.upgrades[UPGRADE_TYPES.tank] > 0) velMod2 = 0.60;

			//Update old positions
			if (currentPlayer.bot) {
				botManager.updateBot(key, currentPlayer, deltaTime);
			} else {
				currentPlayer.oldX = currentPlayer.x;
				currentPlayer.oldY = currentPlayer.y;

				currentPlayer.x += currentPlayer.xVel * deltaTime * velocityMod * velMod2;
				currentPlayer.y += currentPlayer.yVel * deltaTime * velocityMod * velMod2;
			}

			let shotTimeMod = 1;
			if (isPowerupActive(powerups.powerups.overcharge, currentPlayer)) {
				shotTimeMod *= 2;
			}
			shotTimeMod += 0.15 * currentPlayer.upgrades[UPGRADE_TYPES.fire_rate];

			//Handle player shooting
			let bulletDmg = 10 * (1 + 0.05 * currentPlayer.upgrades[UPGRADE_TYPES.damage]);
			let armorPiercing = 0.05 * currentPlayer.upgrades[UPGRADE_TYPES.armor_piercing];
			if (currentPlayer.gun.shotsRequested > 0 && currentPlayer.gun.shotTimer >= currentPlayer.gun.shotTimeNeeded / shotTimeMod - 0.03) {
				if (isPowerupActive(powerups.powerups.triShot, currentPlayer)) {
					//TRI shot powerup is active
					let spreadAngle = 0.44; //radians
					bullets.set(bulletNum, {
						x: currentPlayer.x + currentPlayer.w / 2 - 5, y: currentPlayer.y + (currentPlayer.h / 2) - 5,
						r: 5,
						baseSpeed: 500,
						xVel: Math.cos(currentPlayer.gun.rotation) * 500 + currentPlayer.xVel / 2,
						yVel: Math.sin(currentPlayer.gun.rotation) * 500 + currentPlayer.yVel / 2,
						damage: bulletDmg,
						color: currentPlayer.color,
						timeAlive: 0,
						armorPiercing: armorPiercing,
						playerEmitId: key
					});
					bulletNum++;
					bullets.set(bulletNum, {
						x: currentPlayer.x + currentPlayer.w / 2 - 5, y: currentPlayer.y + (currentPlayer.h / 2) - 5,
						r: 5,
						baseSpeed: 500,
						xVel: Math.cos(currentPlayer.gun.rotation + spreadAngle) * 500 + currentPlayer.xVel / 2,
						yVel: Math.sin(currentPlayer.gun.rotation + spreadAngle) * 500 + currentPlayer.yVel / 2,
						damage: bulletDmg,
						color: currentPlayer.color,
						timeAlive: 0,
						armorPiercing: armorPiercing,
						playerEmitId: key
					});
					bulletNum++;
					bullets.set(bulletNum, {
						x: currentPlayer.x + currentPlayer.w / 2 - 5, y: currentPlayer.y + (currentPlayer.h / 2) - 5,
						r: 5,
						baseSpeed:500,
						xVel: Math.cos(currentPlayer.gun.rotation - spreadAngle) * 500 + currentPlayer.xVel / 2,
						yVel: Math.sin(currentPlayer.gun.rotation - spreadAngle) * 500 + currentPlayer.yVel / 2,
						damage: bulletDmg,
						color: currentPlayer.color,
						timeAlive: 0,
						armorPiercing: armorPiercing,
						playerEmitId: key
					});
					bulletNum++;
					currentPlayer.gun.shotTimer = 0;
					currentPlayer.gun.shotsRequested--;
				} else {
					//NO trishot
					bullets.set(bulletNum, {
						x: currentPlayer.x + currentPlayer.w / 2 - 5, y: currentPlayer.y + (currentPlayer.h / 2) - 5,
						r: 5,
						baseSpeed: 500,
						xVel: Math.cos(currentPlayer.gun.rotation) * 500 + currentPlayer.xVel / 2,
						yVel: Math.sin(currentPlayer.gun.rotation) * 500 + currentPlayer.yVel / 2,
						damage: bulletDmg,
						color: currentPlayer.color,
						timeAlive: 0,
						armorPiercing: armorPiercing,
						playerEmitId: key
					});
					bulletNum++;
					currentPlayer.gun.shotTimer = 0;
					currentPlayer.gun.shotsRequested--;
				}
			} else currentPlayer.gun.shotTimer += deltaTime;

			//Remove old powerups
			for (let i = currentPlayer.activePowerups.length - 1; i >= 0; i--) {
				let currentPowerup = currentPlayer.activePowerups[i];
				currentPowerup.timeLeft -= deltaTime;
				if (currentPowerup.timeLeft <= 0) {
					currentPlayer.activePowerups.splice(i, 1);
				}
			}

			if (currentPlayer.health <= 0) {
				currentPlayer.alive = false;

				//Reward killing player
				let killingPlayer = players.get(currentPlayer.lastDamagedBy);
				if (killingPlayer != undefined) {
					killingPlayer.kills++;
					killingPlayer.orbs += 15 * currentPlayer.level;
				}
			}

			if (currentPlayer.bot) {
				if (!currentPlayer.alive) {
					botsToRemove.push(key);
				}
			}
		}

		//Determine if player should be leveled up
		if (!currentPlayer.levelUpInProgress) {
			if (currentPlayer.orbs >= upgrades.AMOUNT_TO_UPGRADE[currentPlayer.level]) {
				//Level up!
				currentPlayer.levelUpInProgress = true;
				currentPlayer.availableUpgrades = upgrades.getUpgradeSet(currentPlayer);
			}
		}
	}); //END update player positions

	//Delete dead bots and bots who have stayed too long
	for (let i = botsToRemove.length - 1; i >= 0; i--) {
		let removeID = botsToRemove.pop();
		players.delete(removeID);
	}

	let bulletsMarkedForDelete = [];
	//Move bullets
	bullets.forEach((bullet, id, map) => {
		bullet.timeAlive += deltaTime;
		if (bullet.timeAlive >= 1.5) bulletsMarkedForDelete.push(id);
		bullet.x += bullet.xVel * deltaTime;
		bullet.y += bullet.yVel * deltaTime;
	});

	orbs.update(deltaTime);

	//Handle collisions
	collisions.updateCollisions(players, bullets, bulletsMarkedForExplosion, orbs.orbs, deltaTime, botManager);

	//Handle powerup obj
	powerups.updatePowerup(middlePowerup, players, deltaTime);

	//Delete old bullets
	for (let i = bulletsMarkedForDelete.length - 1; i >= 0; i--) {
		bullets.delete(bulletsMarkedForDelete[i]);
	}
};

function isPowerupActive(type, player) {
	let activePowerups = player.activePowerups;
	for (let i = activePowerups.length - 1; i >= 0; i--) {
		if (activePowerups[i].type == type) return true;
	}
	return false;
}

function getStrippedPlayer(player) {
	let stripped = {};
	stripped.x = player.x;
	stripped.y = player.y;
	stripped.w = player.w;
	stripped.h = player.h;
	stripped.health = player.health;
	stripped.maxHealth = player.maxHealth;
	stripped.gun = player.gun;
	stripped.color = player.color;
	stripped.name = player.name;
	stripped.upgrades = player.upgrades;
	return stripped;
}

var sendUpdates = function (io) {
	let leaderboardToSend = leaderboard.getTop10(players);

	const DIST_NEEDED = 1000000;
	players.forEach((value, key, map) => {
		if (!value.bot) {
			//Key is socketid. //value is player object
			//Need to grab each nearby object to this player
			var objectsToSend = {};
			objectsToSend.players = new Map();
			players.forEach((value2, key2, map2) => {
				if (key != key2 && value2.alive) {
					var distSq = (value.x - value2.x) * (value.x - value2.x);
					distSq += (value.y - value.y) * (value.y - value2.y);
					if (distSq <= DIST_NEEDED) {
						objectsToSend.players.set(key2, getStrippedPlayer(value2));
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
					objectsToSend.bullets.set(id, bullet);
				}
			});
			objectsToSend.bullets = Array.from(objectsToSend.bullets);

			//Gather Orbs
			objectsToSend.orbs = Array.from(orbs.gather(value, DIST_NEEDED));

			//Exploded bullets
			objectsToSend.bulletsMarkedForExplosion = bulletsMarkedForExplosion;

			//Powerups
			objectsToSend.powerups = [middlePowerup];

			io.to(key).emit('state', { player: value, objects: objectsToSend, leaderboard: leaderboardToSend });

			bulletsMarkedForExplosion.length = 0; //Delete contents of explosion array
		}
	});
}

function getRandomSpawn() {
	return { x: 0, y: 0 };
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
	addPlayer(socketID, player.name, player.color);
	req.position = { x: player.x, y: player.y };
	return req;
}

var removePlayer = function (socketID) {
	players.delete(socketID);
};

function Player(name, x, y, color) {
	this.bot = false;
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
	this.maxHealth = 100;
	this.alive = true;
	this.gun = {};
	this.gun.rotation = 0;
	this.gun.w = 50;
	this.gun.h = 10;
	this.gun.shotsRequested = 0;
	this.gun.shotTimer = 0;
	this.gun.shotTimeNeeded = 0.5; //Default fire rate
	this.activePowerups = [];
	this.kills = 0;
	this.orbs = 0;
	this.lastDamagedBy = undefined;
	this.upgrades = new Array(Object.keys(UPGRADE_TYPES).length).fill(0); //[0, 0, 0, ...]
	this.levelUpInProgress = false;
	this.level = 0;
	this.availableUpgrades = [];
	this.regenStartTimer = 0;
	this.orbsToUpgrade = upgrades.AMOUNT_TO_UPGRADE[0];
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

var upgradePlayer = function (socketID, upgradeNum) {
	let player = players.get(socketID);
	if (player !== undefined && player.alive && player.levelUpInProgress) {
		upgrades.upgradePlayer(player, upgradeNum);
	}
}

botManager.generateStartingBots(addPlayer, players, staticWorldObjs, upgrades);

exports.requestRespawn = requestRespawn;
exports.playerShot = playerShot;
exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.update = update;
exports.sendUpdates = sendUpdates;
exports.playerInput = playerInput;
exports.worldObj = worldObj;
exports.upgradePlayer = upgradePlayer;