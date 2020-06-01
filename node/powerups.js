const SPAWN_TIME = 15;
const CONTEST_TIME = 5;

const powerups = {
	triShot: 0,
	superSpeed: 1,
	juggernaut: 2,
	overcharge: 3
};

function getRandomPowerup() {
	Math.floor(Math.random() * Object.keys(powerups).length);
}

var powerupObj = function (x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.spawned = false;
	this.playerInside = null;
	this.powerupType = getRandomPowerup();
	this.spawnTimeNeeded = SPAWN_TIME;
	this.spawnTimer = 0;
	this.contestTimeNeeded = CONTEST_TIME;
	this.contestTimer = 0;
	this.playerInside = null;
}

function intersects(rect1, rect2) {
	if (rect1.x < rect2.x + rect2.w &&
		rect1.x + rect1.w > rect2.x &&
		rect1.y < rect2.y + rect2.h &&
		rect1.y + rect1.h > rect2.y) {
		return true;
	}
	return false;
}

function updatePowerup(powerup, players, deltaTime) {
	if (powerup.spawned) {
		//Check collisions
		//More than 2, reset contest time
		//Otherwise add to contest time
		let iterator = players.entries();
		let player = iterator.next();
		let playerCount = 0;
		while (player != null) {
			if (intersects(player, powerup)) {
				playerCount++;
				powerup.playerInside = player;
				if (playerCount > 1) {
					//Reset timer
					powerup.contestTimer = 0;
					powerup.playerInside = null;
					break;
				}
			}
			player = iterator.next();
		}
		//Only one player inside?
		//Increment the timer
		if (powerup.playerInside != null) {
			powerup.contestTimer += deltaTime;
		}

	} else {
		powerup.spawnTime += deltaTime;
		if (powerup.spawnTime >= powerup.spawnTimeNeeded) {
			powerup.spawnTime = 0;
			powerup.spawned = true;
		}
	}
}

exports.updatePowerup = updatePowerup;
exports.powerupObj = powerupObj;
exports.powerups = powerups;