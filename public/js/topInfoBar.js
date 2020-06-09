function drawTopInfoBar(ctx) {
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	ctx.font = "12px Arial";
	ctx.fillText("Kills: " + player.kills, canvas.width / 3, 25);

	ctx.fillText("Orbs: " + player.orbs, canvas.width * 1.5 / 3, 25);
	ctx.fillText("Orbs for upgrade: 50", canvas.width * 2 / 3, 25);
}

function drawUpgrades(ctx) {
	if (player.levelUpInProgress) {
		let width = 50;
		let height = 50;
		let x = canvas.width / 3 - width/2;
		let y = canvas.height - height - 10;
		let textVertOffset = 7;
		ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
		ctx.fillRect(x, y, width, height);

		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.font = "15px Arial";
		ctx.textAlign = "center";
		ctx.fillText("+25% Speed", x + width/2, y - textVertOffset);

		x += canvas.width / 6;
		ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
		ctx.fillRect(x, y, width, height);

		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.fillText("Choose an upgrade:",x + width / 2, y - textVertOffset - 30);

		x += canvas.width / 6;
		ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
		ctx.fillRect(x, y, width, height);
	}
}

function checkUpgradeClick(pos) {
	if (player.levelUpInProgress) {
		//Check if inside the buttons
		let width = 50;
		let height = 50;
		let x = canvas.width / 3 - width / 2;
		let y = canvas.height - height - 10;
		let textVertOffset = 7;

		if (pos.x >= x && pos.x <= x + width) {
			if (pos.y >= y && pos.y <= y + height) {
				//Clicked first button
				console.log("UPGRADE 1");
			}
		}
		x += canvas.width / 6;
		if (pos.x >= x && pos.x <= x + width) {
			if (pos.y >= y && pos.y <= y + height) {
				//Clicked second button
				console.log("UPGRADE 2");
			}
		}
		x += canvas.width / 6;
		if (pos.x >= x && pos.x <= x + width) {
			if (pos.y >= y && pos.y <= y + height) {
				//Clicked third button
				console.log("UPGRADE 3");
			}
		}
	}
}