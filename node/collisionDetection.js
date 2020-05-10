var tree2d = require('./tree2d.js');
var staticWorldObjs = require('./staticWorldObjs').staticWorldObjs;
console.log(staticWorldObjs);
var staticObjsTree = tree2d.makeTreeFromWorld(staticWorldObjs);

function handleStaticObjsCollision(players, deltaTime) {
	players.forEach((player, id, map) => {
		let bounds = { x: player.x, y: player.y, w: player.w, h: player.h };
		console.log(bounds);
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


function updateCollisions(players, deltaTime) {
	handleStaticObjsCollision(players, deltaTime);
}


exports.updateCollisions = updateCollisions;