var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var deltaTime = 0; //In milliseconds

var xPrevious = 0;
var yPrevious = 0;
var xPR = 0;
var yPR = 0;
var xP = 0;
var yP = 0;
var velocity = 3;

function update() {
	xPrevious = xP;
	yPrevious = yP;
	xP += deltaTime*xDir*velocity;
	yP += deltaTime*yDir*velocity;
}

function draw() {
	var ctx = canvas.getContext("2d");
	//Round xP and yP
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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