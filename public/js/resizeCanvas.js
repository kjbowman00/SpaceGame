var canvas_container = document.getElementById('canvas_holder');
var canvas = document.getElementById('canvas');
var backgroundCanvas = document.getElementById('background_canvas');
var UICanvas = document.getElementById('UI_canvas');
function resizeCanvas() {
	if (gameRunning) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		camera.w = canvas.width;
		camera.h = canvas.height;
		backgroundCanvas.width = canvas.width;
		backgroundCanvas.height = canvas.height;
		UICanvas.width = canvas.width;
		UICanvas.height = canvas.height;
	}
}
window.addEventListener('resize', resizeCanvas);