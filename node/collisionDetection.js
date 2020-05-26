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
						player.oldX = player.x;
					} else if (player.x - player.oldX < 0){
						player.x = currentBox.x + currentBox.w;
						player.oldX = player.x;
					}
				}
				if (doesCollide(yBounds, currentBox)) {
					if (player.y - player.oldY > 0) {
						player.y = currentBox.y - player.h;
						player.oldY = player.y;
					} else if (player.y - player.oldY < 0){
						player.y = currentBox.y + currentBox.h;
						player.oldY = player.y;
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
				//Blow up and damage player
				player.health -= bullet.damage;
				bulletsMarkedForExplosion.push(bulletId); //used so the player can make animation
			}
		});
	});
	//Remove the bullets from our bullets list
	for (let i = 0; i < bulletsMarkedForExplosion.length; i++) {
		bullets.delete(bulletsMarkedForExplosion[i]);
	}
}

function updateCollisions(players, bullets, bulletsMarkedForExplosion, deltaTime) {
	handleStaticObjsCollision(players, bullets, deltaTime);
	handleBulletCollision(players, bullets, bulletsMarkedForExplosion, deltaTime);
}

exports.updateCollisions = updateCollisions;