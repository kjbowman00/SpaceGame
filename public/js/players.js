function drawPlayer(player, ctx) {
	//SETTINGS
	const borderThickness = 2;
	const gunBorderThickness = 1;

	//Round player.x and yP
	let xRound = Math.round(player.x);
	let yRound = Math.round(player.y);
	ctx.fillStyle = player.color;
	ctx.fillRect(xRound - camera.x, yRound - camera.y, 50, 50);
	ctx.fillStyle = "#000000";
	ctx.fillRect(xRound - camera.x + borderThickness, yRound - camera.y + borderThickness, 50 - borderThickness * 2, 50 - borderThickness * 2);
	//Draw player gun
	let centerX = xRound - camera.x + player.w / 2;
	let centerY = yRound - camera.y + player.h / 2;
	let xGun = centerX;
	let yGun = centerY - player.gun.h / 2;
	ctx.fillStyle = player.color;
	ctx.translate(centerX, centerY);
	ctx.rotate(player.gun.rotation);
	ctx.translate(-centerX, -centerY);
	ctx.fillRect(xGun, yGun, player.gun.w, player.gun.h);
	ctx.fillStyle = "#000000";
	ctx.fillRect(xGun + gunBorderThickness, yGun + gunBorderThickness, player.gun.w - gunBorderThickness * 2, player.gun.h - gunBorderThickness * 2);
	ctx.resetTransform();

	//Draw player info box
	drawPlayerInfo(player, ctx);
}