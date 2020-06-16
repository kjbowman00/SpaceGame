function drawPlayer(player, ctx, bCtx) {
	//SETTINGS
	const borderThickness = 2;
	const gunBorderThickness = 1;

	//Round player.x and yP
	let xRound = player.x;
	let yRound = player.y;
	ctx.fillStyle = player.color;
	ctx.fillRect(Math.floor(xRound - camera.x), Math.floor(yRound - camera.y), 50, 50);
	//Draw armor if tank
	if (player.upgrades[UPGRADE_TYPES.tank] > 0) {
		console.log("YUH");
		let offset = 3;
		let coverage = 15;
		let x = Math.floor(xRound - camera.x);
		let y = Math.floor(yRound - camera.y);
		//Top left
		ctx.fillRect(x - offset - borderThickness,
			y - offset - borderThickness,
			coverage, borderThickness);
		ctx.fillRect(x - offset - borderThickness,
			y - offset - borderThickness,
			borderThickness, coverage);

		//Top right
		ctx.fillRect(x + player.w + offset, y - offset - borderThickness,
			borderThickness, coverage);
		ctx.fillRect(x + player.w - coverage + offset, y - offset - borderThickness,
			coverage, borderThickness);

		//Bottom left
		ctx.fillRect(x - offset - borderThickness, y + player.h - coverage + offset,
			borderThickness, coverage);
		ctx.fillRect(x - offset - borderThickness, y + player.h + offset,
			coverage, borderThickness);

		//Bottom right
		ctx.fillRect(x + player.w + offset, y + player.h - coverage + offset + borderThickness, borderThickness, coverage);
		ctx.fillRect(x + player.w - coverage + offset + borderThickness, y + player.h + offset, coverage, borderThickness);
	}
	ctx.fillStyle = "#000000";
	ctx.fillRect(Math.floor(xRound - camera.x + borderThickness), Math.floor(yRound - camera.y + borderThickness), 50 - borderThickness * 2, 50 - borderThickness * 2);

	//Draw player gun
	let centerX = Math.floor(xRound - camera.x + player.w / 2);
	let centerY = Math.floor(yRound - camera.y + player.h / 2);
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

	//Draw trail
	if (player.trail != undefined) {
		player.trail.render(bCtx);
	}
}