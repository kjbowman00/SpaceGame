var canvas_container = document.getElementById('canvas_holder');
var canvas = document.getElementById('canvas');
var backgroundCanvas = document.getElementById('background_canvas');
var UICanvas = document.getElementById('UI_canvas');
let actualResX = 1280;
let actualResY = 720;
canvas.width = actualResX;
canvas.height = actualResY;
backgroundCanvas.width = actualResX;
backgroundCanvas.height = actualResY;
UICanvas.width = actualResX;
UICanvas.height = actualResY;

/*var offscreenBackgroundCanvas = new OffscreenCanvas(window.innerWidth + backGroundImage.width * 2,
	window.innerHeight + backGroundImage.height *2);*/
var offscreenBackgroundCanvas = document.getElementById('invisible_background_canvas');
offscreenBackgroundCanvas.width = canvas.width + backGroundImage.width * 2;
offscreenBackgroundCanvas.height = canvas.height + backGroundImage.height * 2;

var realCanvas = document.getElementById("real_canvas");

function resizeCanvas() {
	//mainMenuCanvas.width = window.innerWidth;
	//mainMenuCanvas.height = window.innerHeight;
	if (gameRunning) {
		/*canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		camera.w = canvas.width;
		camera.h = canvas.height;
		backgroundCanvas.width = canvas.width;
		backgroundCanvas.height = canvas.height;
		UICanvas.width = canvas.width;
		UICanvas.height = canvas.height;
		offscreenBackgroundCanvas.width = canvas.width + backGroundImage.width*2;
		offscreenBackgroundCanvas.height = canvas.height + backGroundImage.height * 2;*/
		realCanvas.width = window.innerWidth;
		realCanvas.height = window.innerHeight;
		drawBackground();
	}


}

function drawBackground() {
	//Draw background
	var bCtx = offscreenBackgroundCanvas.getContext('2d');
	bCtx.clearRect(0, 0, canvas.width, canvas.height);
	//var amountGoBackX = Math.floor(camera.x) % backGroundImage.width;
	//var amountGoBackY = Math.floor(camera.y) % backGroundImage.height;
	//This is to avoid drawing accross the entire world and instead just a small portion
	var pattern = bCtx.createPattern(backGroundImage, 'repeat');
	bCtx.fillStyle = pattern;
	//bCtx.translate(-amountGoBackX, -amountGoBackY);
	//bCtx.fillRect(-backGroundImage.width, -backGroundImage.height,
	//	canvas.width + 2 * backGroundImage.width, canvas.height + 2 * backGroundImage.height);
	//bCtx.resetTransform();
	bCtx.fillRect(0, 0, canvas.width + backGroundImage.width*2, canvas.height + backGroundImage.height * 2);
}

window.addEventListener('resize', resizeCanvas);