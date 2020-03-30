/*jshint esversion: 6 */
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	camera.w = canvas.width;
	camera.h = canvas.height;
}
window.addEventListener("resize", resizeCanvas);