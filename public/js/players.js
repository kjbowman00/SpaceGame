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

	//Draw repulsion shield
	if (player.upgrades[UPGRADE_TYPES.repulser] > 0) {
		let x = Math.floor(xRound - camera.x + player.w / 2);
		let y = Math.floor(yRound - camera.y + player.h / 2);
		let grd = ctx.createRadialGradient(x, y, player.w / 2 + 10, x, y, 45);
		grd.addColorStop(0, "rgba(255, 255, 255, 0.1)");
		grd.addColorStop(1, player.color);

		ctx.beginPath();
		ctx.arc(x, y, Math.floor(player.w / 2) + 20, 0, 2 * Math.PI);

		ctx.fillStyle = grd;
		ctx.fill();
		ctx.closePath();
	}

	ctx.fillStyle = "#000000";
	ctx.fillRect(Math.floor(xRound - camera.x + borderThickness), Math.floor(yRound - camera.y + borderThickness), 50 - borderThickness * 2, 50 - borderThickness * 2);

	//Draw player gun
	//Draw fat gun if bullet hose
	if (player.upgrades[UPGRADE_TYPES.bullet_hose] > 0) {
		player.gun.w = 50;
		player.gun.h = 20;
	} else if (player.upgrades[UPGRADE_TYPES.sniper] > 0) {
		player.gun.w = 80;
		player.gun.h = 10;
	} else {
		player.gun.w = 50;
		player.gun.h = 10;
	}
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
	if (OPTIONS.playerTrailQuality > 0 && player.trail != undefined) {
		player.trail.render(bCtx, OPTIONS.playerTrailQuality);
	}
}