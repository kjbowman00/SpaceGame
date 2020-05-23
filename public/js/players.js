function drawPlayer(player, ctx) {
	//Round player.x and yP
	let xRound = Math.round(player.x);
	let yRound = Math.round(player.y);
	ctx.fillRect(xRound - camera.x, yRound - camera.y, 50, 50);
	//Draw player gun
	let centerX = xRound - camera.x + player.w / 2;
	let centerY = yRound - camera.y + player.h / 2;
	let xGun = centerX;
	let yGun = centerY - player.gun.h / 2;
	ctx.fillStyle = "red";
	ctx.translate(centerX, centerY);
	ctx.rotate(player.gun.rotation);
	ctx.translate(-centerX, -centerY);
	ctx.fillRect(xGun, yGun, player.gun.w, player.gun.h);
	ctx.resetTransform();

	//Draw player info box
	drawPlayerInfo(player, ctx);
}