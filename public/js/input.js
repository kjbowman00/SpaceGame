//Booleans saying if key is held
var leftHeld = false;
var rightHeld = false;
var upHeld = false;
var downHeld = false;

//Direction to multiply velocity by
var yDir = 0;
var xDir = 0;

function getXDir() {
	if (leftHeld && rightHeld) {
		return 0;
	} else if (leftHeld) {
		return -1;
	} else if (rightHeld) {
		return 1;
	} else {
		return 0;
	}
}
function getYDir() {
	if (upHeld && downHeld) {
		return 0;
	} else if (upHeld) {
		return -1;
	} else if (downHeld) {
		return 1;
	} else {
		return 0;
	}
}

function handleKeyDown(event) {
	if (event.key == "a") {
		leftHeld = true;
	} else if (event.key == "d") {
		rightHeld = true;
	} else if (event.key == "w") {
		upHeld = true;
	} else if (event.key == "s") {
		downHeld = true;
	}
	yDir = getYDir();
	xDir = getXDir();
	player.xVel = playerSpeed * xDir;
	player.yVel = playerSpeed * yDir;
}

function handleKeyUp(event) {
	if (event.key == "a") {
		leftHeld = false;
	} else if (event.key == "d") {
		rightHeld = false;
	} else if (event.key == "w") {
		upHeld = false;
	} else if (event.key == "s") {
		downHeld = false;
	}

	yDir = getYDir();
	xDir = getXDir();
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

