var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
camera.w = canvas.width;
camera.h = canvas.height;

var deltaTime = 0; //In milliseconds

var xPrevious = 0;
var yPrevious = 0;
var xPR = 0;
var yPR = 0;
var xP = 0;
var yP = 0;
var velocity = 3;

function inBounds(inner, area) {
	if (inner.x + inner.w >= area.x && inner.x <= area.x + area.w) {
		if (inner.y + inner.h >= area.y && inner.y <= area.y + area.h) {
			return true;
		} else return false;
	} else return false;
}

function update() {
	xPrevious = xP;
	yPrevious = yP;
	xP += deltaTime*xDir*velocity;
	yP += deltaTime*yDir*velocity;
}

function draw() {
	var ctx = canvas.getContext("2d");
	//Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Draw world objects where the camera is
	for (var i in world.things) {
		item = world.things[i];
		if (inBounds(item, camera)) {
			ctx.fillRect(item.x - camera.x, item.y - camera.y, item.w, item.h);
		}
	}

	//Round xP and yP
	xPR = ((0.5 + xP) | 0);
	yPR = ((0.5 + yP) | 0);
	ctx.fillRect(xPR, yPR, 50, 50);
}

function mainLoop(timestamp) {
	deltaTime = performance.now() - timestamp;
	update();
	draw();
	requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);