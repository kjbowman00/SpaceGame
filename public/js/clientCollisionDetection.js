function handleStaticObjsCollision(players, deltaTime) {
	let bounds = { x: player.x, y: player.y, w: player.w, h: player.h };
	//Naive approach. test each object with each player
	for (let i = world.staticWorldObjs.length - 1; i >= 0; i--) {
		let currentBox = world.staticWorldObjs[i];
		if (doesCollide(bounds, currentBox)) {
			//Get the bounds and move the player
			//Check x direction
			let xBounds = { x: player.x, y: player.oldY, w: player.w, h: player.h };
			let yBounds = { x: player.oldX, y: player.y, w: player.w, h: player.h };
			if (doesCollide(xBounds, currentBox)) {
				if (player.x - player.oldX > 0) {
					player.x = currentBox.x - player.w;
					player.oldX = player.x;
				} else if (player.x - player.oldX < 0) {
					player.x = currentBox.x + currentBox.w;
					player.oldX = player.x;
				}
			}
			if (doesCollide(yBounds, currentBox)) {
				if (player.y - player.oldY > 0) {
					player.y = currentBox.y - player.h;
					player.oldY = player.y;
				} else if (player.y - player.oldY < 0) {
					player.y = currentBox.y + currentBox.h;
					player.oldY = player.y;
				}
			}
		}
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


function updateCollisions() {
	handleStaticObjsCollision();
}