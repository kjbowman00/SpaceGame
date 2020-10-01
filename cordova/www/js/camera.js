var camera = {
	x: 0,
	y: 0,
	w: 0,
	h: 0
};

function updateCamera() {
	let nCameraX = player.x + 25 - camera.w / 2;
	let nCameraY = player.y + 25 - camera.h / 2;
	if (Math.abs(camera.x - nCameraX) > 4) camera.x = lerp(camera.x, nCameraX, 0.08);
	if (Math.abs(camera.y - nCameraY) > 4) camera.y = lerp(camera.y, nCameraY, 0.08);
}
