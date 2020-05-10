var tree2d = require('./tree2d.js');
var staticWorldObjs = require('./staticWorldObjs').staticWorldObjs;
var staticObjsTree = tree2d.makeTreeFromWorld(staticWorldObjs);

function handleStaticObjsCollision(players) {
	players.forEach((player) => {
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
			if (doesCollisde(bounds, currentBox)) {
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
		//Collision!
		console.log("YEET");
		return true;
	}
	return false;
}


function updateCollisions(players) {
	handleStaticObjsCollision(players);
}