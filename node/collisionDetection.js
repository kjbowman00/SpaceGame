var tree2d = require('./tree2d.js');
var staticWorldObjs = require('./staticWorldObjs').staticWorldObjs;
console.log(staticWorldObjs);
var staticObjsTree = tree2d.makeTreeFromWorld(staticWorldObjs);

function handleStaticObjsCollision(players) {
	players.forEach((player, id, map) => {
		console.log(player);
		let bounds = { x: Math.floor(player.x), y: Math.floor(player.y), w: player.w, h: player.h };
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
			if (doesCollide(bounds, currentBox)) {
				//Get the bounds and move the player
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


function updateCollisions(players) {
	handleStaticObjsCollision(players);
}


exports.updateCollisions = updateCollisions;