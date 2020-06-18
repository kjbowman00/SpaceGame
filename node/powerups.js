const SPAWN_TIME = 15;
const CONTEST_TIME = 5;

const powerups = {
	triShot: 0,
	superSpeed: 1,
	juggernaut: 2,
	overcharge: 3
};

function getRandomPowerup() {
	return Math.floor(Math.random() * Object.keys(powerups).length);
}

var powerupObj = function (x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.spawned = false;
	this.playerInside = undefined;
	this.powerupType = getRandomPowerup();
	this.spawnTimeNeeded = SPAWN_TIME;
	this.spawnTimer = 0;
	this.contestTimeNeeded = CONTEST_TIME;
	this.contestTimer = 0;
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
		while (player.value != undefined) {
			if (player.value.alive && intersects(player.value[1], powerup)) {
				playerCount++;
				powerup.playerInside = player.value[0];
				if (playerCount > 1) {
					//Reset timer
					powerup.contestTimer = 0;
					powerup.playerInside = null;
					break;
				}
			}
			player = iterator.next();
		}
		if (playerCount == 0) {
			powerup.playerInside = undefined;
			powerup.contestTimer = 0;
		}
		//Only one player inside?
		//Increment the timer
		if (powerup.playerInside != null && powerup.playerInside != undefined) {
			powerup.contestTimer += deltaTime;
		}

		//Handle player getting the powerup
		if (powerup.contestTimer >= powerup.contestTimeNeeded && powerup.playerInside != undefined) {
			powerup.spawned = false;
			powerup.contestTimer = 0;
			powerup.spawnTimer = 0;
			let powerupList = players.get(powerup.playerInside).activePowerups;

			//Handle if player already has the powerup active (just reset the timer)
			let alreadyHas = false;
			console.log(powerup.powerupType);
			for (let i = 0; i < powerupList.length; i++) {
				console.log(powerupList[i]);
				if (powerupList[i].type == powerup.powerupType) {
					alreadyHas = true;
					powerupList[i].timeLeft = 15;
					console.log("already had it!");
				}
			}
			if (!alreadyHas) {
				//Add the powerup if the player doesn't have it
				console.log("They didn't have it");
				powerupList.push({ type: powerup.powerupType, timeLeft: 15 });
			}

			powerup.powerupType = getRandomPowerup();
			powerup.playerInside = undefined;
		}
	} else {
		powerup.spawnTimer += deltaTime;
		if (powerup.spawnTimer >= powerup.spawnTimeNeeded) {
			powerup.spawnTimer = 0;
			powerup.spawned = true;
		}
	}
}

exports.updatePowerup = updatePowerup;
exports.powerupObj = powerupObj;
exports.powerups = powerups;