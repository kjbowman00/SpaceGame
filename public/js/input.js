//Mouse information
var Mouse = {cameraX:0, cameraY:0, pressed: false};

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
	let code = event.keyCode;

	if (code == "27") flipOptions();

	if (code=="65" || code == "37") {
		leftHeld = true;
	} else if (code=="68" || code =="39") {
		rightHeld = true;
	} else if (code=="87" || code =="38") {
		upHeld = true;
	} else if (code=="83" || code =="40") {
		downHeld = true;
	}
	yDir = getYDir();
	xDir = getXDir();
	player.xVel = playerSpeed * xDir;
	player.yVel = playerSpeed * yDir;
}

function handleKeyUp(event) {
	let code = event.keyCode
	if (code == "65" || code == "37") {
		leftHeld = false;
	} else if (code == "68" || code == "39") {
		rightHeld = false;
	} else if (code == "87" || code == "38") {
		upHeld = false;
	} else if (code == "83" || code == "40") {
		downHeld = false;
	}

	yDir = getYDir();
	xDir = getXDir();
}

function mouseMove(event) {
	Mouse.cameraX = event.clientX;
	Mouse.cameraY = event.clientY;
}

function mouseDown(event) {
	Mouse.pressed = true;
	try {
		checkUpgradeClick({ x: event.clientX, y: event.clientY });
	} catch {
		//Not all scripts loaded yet
	}
}
function mouseUp(event) {
	Mouse.pressed = false;
}

window.addEventListener("mousedown", mouseDown);
window.addEventListener("mouseup", mouseUp);
window.addEventListener("mousemove", mouseMove);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

