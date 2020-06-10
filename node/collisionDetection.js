var staticWorldObjs = require('./staticWorldObjs').staticWorldObjs;

function handleStaticObjsCollision(players, bullets, deltaTime) {
	players.forEach((player, id, map) => {
		let bounds = { x: player.x, y: player.y, w: player.w, h: player.h };
		//Naive approach. test each object with each player
		for (let i = staticWorldObjs.length - 1; i >= 0; i--) {
			let currentBox = staticWorldObjs[i];
			if (doesCollide(bounds, currentBox)) {
				//Get the bounds and move the player
				//Check x direction
				let xBounds = { x: player.x, y: player.oldY, w: player.w, h: player.h };
				let yBounds = { x: player.oldX, y: player.y, w: player.w, h: player.h };
				if (doesCollide(xBounds, currentBox)) {
					if (player.x - player.oldX > 0) {
						player.x = currentBox.x - player.w;
						player.oldX = player.x; //Prevents other boxes from handling the same collision
					} else if (player.x - player.oldX < 0){
						player.x = currentBox.x + currentBox.w;
						player.oldX = player.x; //Prevents other boxes from handling the same collision
					}
				}
				if (doesCollide(yBounds, currentBox)) {
					if (player.y - player.oldY > 0) {
						player.y = currentBox.y - player.h;
						player.oldY = player.y; //Prevents other boxes from handling the same collision
					} else if (player.y - player.oldY < 0){
						player.y = currentBox.y + currentBox.h;
						player.oldY = player.y; //Prevents other boxes from handling the same collision
					}
				}
			}
		}
	});

	let bulletDeleteList = [];
	bullets.forEach((bullet, id, map) => {
		let bounds = { x: bullet.x, y: bullet.y, w: bullet.r * 2, h: bullet.r * 2 };
		for (let i = staticWorldObjs.length - 1; i >= 0; i--) {
			if (doesCollide(bounds, staticWorldObjs[i])) {
				bulletDeleteList.push(id);
				break;
			}
		}
	});
	for (let i = bulletDeleteList.length - 1; i >= 0; i--) {
		bullets.delete(bulletDeleteList[i]);
	}
}

function doesCollide(rect1, rect2) {
	if (rect1.x < rect2.x + rect2.w &&
		rect1.x + rect1.w > rect2.x &&
		rect1.y < rect2.y + rect2.h &&
		rect1.y + rect1.h > rect2.y) {
		return true;
	}
	return false;
}

function bulletCollide(player, bullet) {
	let xsq = (bullet.x - player.x) * (bullet.x - player.x);
	let ysq = (bullet.y - player.y) * (bullet.y - player.y);
	let dist = xsq + ysq;
	if (dist > player.w * player.w + player.h * player.h) return false;

	//TODO: (CHANGE) currently pretending the bullet is a square
	//Deeper check
	return doesCollide(player, { x: bullet.x, y: bullet.y, w: bullet.r * 2, h: bullet.r * 2 });
}

function handleBulletCollision(players, bullets, bulletsMarkedForExplosion, deltaTime) {
	//Naive solution for now
	//TODO: Make this not a naive solution if it's too slow (sweep and prune probably)
	players.forEach((player, playerId, playerMap) => {
		bullets.forEach((bullet, bulletId, bulletMap) => {
			if (bulletCollide(player, bullet) && bullet.playerEmitId != playerId) {
				if (isPowerupActive(2, player)) { //CHECK if juggernaut enabled
					player.health -= bullet.damage / 4; // Cut damage in 4ths if juggernaut enabled
				} else {
					player.health -= bullet.damage;
				}
				player.lastDamagedBy = bullet.playerEmitId;
				player.regenStartTimer = 0;
				//Blow up and damage player
				bulletsMarkedForExplosion.push(bulletId); //used so the player can make animation
			}
		});
	});
	//Remove the bullets from our bullets list
	for (let i = 0; i < bulletsMarkedForExplosion.length; i++) {
		bullets.delete(bulletsMarkedForExplosion[i]);
	}
}

function isPowerupActive(type, player) {
	let activePowerups = player.activePowerups;
	for (let i = activePowerups.length - 1; i >= 0; i--) {
		if (activePowerups[i].type == type) return true;
	}
	return false;
}

function handleOrbCollision(players, orbs) {
	//Naive solution temporairly
	let orbsToRemove = [];
	players.forEach((player, playerId, map) => {
		orbs.forEach((orb, orbId, map) => {
			if (doesCollide(player, orb)) {
				//Mark orb for deletion
				orbsToRemove.push(orbId);

				//Add to player energy/cash points
				player.orbs += 1;
			}
		});
	});
	//Remove the orbs that are marked
	for (let i = orbsToRemove.length - 1; i >= 0; i--) {
		orbs.delete(orbsToRemove.pop());
	}
}

function updateCollisions(players, bullets, bulletsMarkedForExplosion, orbs, deltaTime) {
	handleStaticObjsCollision(players, bullets, deltaTime);
	handleBulletCollision(players, bullets, bulletsMarkedForExplosion, deltaTime);
	handleOrbCollision(players, orbs);
}

exports.updateCollisions = updateCollisions;