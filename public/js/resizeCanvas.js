var canvas = document.getElementById('canvas');
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	camera.w = canvas.width;
	camera.h = canvas.height;
	draw();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();