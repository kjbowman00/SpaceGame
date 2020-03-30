/*jshint esversion: 6 */
var canvas = document.getElementById("canvas");
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	camera.w = canvas.width;
	camera.h = canvas.height;
	draw();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

var deltaTime = 0; //In milliseconds

var xPrevious = 0;
var yPrevious = 0;
var xPR = 0;
var yPR = 0;
var xP = 0;
var yP = 0;
var velocity = 8;

function lerp(n1, n2, amt) {
	return (n2-n1) * amt + n1;
}

function inBounds(inner, area) {
	if (inner.x + inner.w >= area.x && inner.x <= area.x + area.w) {
		if (inner.y + inner.h >= area.y && inner.y <= area.y + area.h) {
			return true;
		} else return false;
	} else return false;
}

var oldX = 0;
var oldY = 0;
function update() {
	camera.x = lerp(camera.x, xP + 50 - camera.w/2, 0.05);
	camera.y = lerp(camera.y, yP + 50 - camera.h/2, 0.05);
	//camera.y = yP + 50 - camera.h/2;

	//Update player position
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
		ctx.fillRect(item.x - camera.x, item.y - camera.y, item.w, item.h);
	}

	//Round xP and yP
	xPR = Math.round(xP);
	yPR = Math.round(yP);
	ctx.fillRect(xPR - camera.x, yPR - camera.y, 50, 50);
}

function mainLoop(timestamp) {
	deltaTime = performance.now() - timestamp;
	update();
	draw();
	requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);