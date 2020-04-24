var canvas = document.getElementById('canvas');
var backgroundCanvas = document.getElementById('background_canvas');
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	camera.w = canvas.width;
	camera.h = canvas.height;
	backgroundCanvas.width = canvas.width;
	backgroundCanvas.height = canvas.height;

	draw();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();