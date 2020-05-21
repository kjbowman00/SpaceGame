var tree2d = require('./tree2d.js');
var staticWorldObjs = require('./staticWorldObjs').staticWorldObjs;
var staticObjsTree = tree2d.makeTreeFromWorld(staticWorldObjs);

function handleStaticObjsCollision(players, deltaTime) {
	players.forEach((player, id, map) => {
		let bounds = { x: player.x, y: player.y, w: player.w, h: player.h };
		//Check the collision with the following four boxes
		let b1 = tree2d.getClosest({ x:bounds.x, y:bounds.y }, staticObjsTree);
		let b2 = tree2d.getClosest({ x: bounds.x + bounds.w, y: bounds.y }, staticObjsTree);
		let b3 = tree2d.getClosest({ x: bounds.x, y: bounds.y + bounds.h }, staticObjsTree);
		let b4 = tree2d.getClosest({ x: bounds.x + bounds.w, y: bounds.y + bounds.h }, staticObjsTree);
		let boxesToCheck = [b1, b2, b3, b4];
		for (let i = 0; i < 4; i++) {
			let currentBox = boxesToCheck[i];
			//Check for collision with this box
			if (doesCollide(bounds, currentBox)) { //TODO: Can probably remvoe this if
				//Get the bounds and move the player
				//Check x direction
				let xBounds = { x: player.x, y: player.oldY, w: player.w, h: player.h };
				let yBounds = { x: player.oldX, y: player.y, w: player.w, h: player.h };
				if (doesCollide(xBounds, currentBox)) {
					if (player.xVel > 0) {
						player.x = currentBox.x - player.w;
					} else {
						player.x = currentBox.x + currentBox.w;
					}
				}
				if (doesCollide(yBounds, currentBox)) {
					if (player.yVel > 0) {
						player.y = currentBox.y - player.h;
					} else {
						player.y = currentBox.y + currentBox.h;
					}
				}
			}
		}
	});
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
				bulletsMarkedForExplosion.push(bulletId);
			}
		});
	});
	//Remove the bullets from our bullets list
	for (let i = 0; i < bulletsMarkedForExplosion.length; i++) {
		bullets.delete(bulletsMarkedForExplosion[i]);
	}
}

function updateCollisions(players, bullets, bulletsMarkedForExplosion, deltaTime) {
	handleStaticObjsCollision(players, deltaTime);
	handleBulletCollision(players, bullets, bulletsMarkedForExplosion, deltaTime);
}


exports.updateCollisions = updateCollisions;