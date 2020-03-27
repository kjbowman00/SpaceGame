var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var deltaTime = 0; //In milliseconds

var xP = 0;
var yP = 0;

function update() {
	xP += deltaTime;
	yP += deltaTime;
}

function draw() {
	var ctx = canvas.getContext("2d");
	//Round xP and yP
	var rxP = (0.5 + xP) | 0;
	var ryP = (0.5 + yP) | 0;
	ctx.fillRect(rxP, ryP, 50, 50);
}

function mainLoop(timestamp) {
	deltaTime = performance.now() - timestamp;
	update();
	draw();
	requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);