function drawTopInfoBar(ctx) {
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	ctx.font = "12px Arial";
	ctx.fillText("Kills: " + player.kills, canvas.width / 3, 25);

	ctx.fillText("Orbs: " + player.orbs, canvas.width * 1.5 / 3, 25);
	ctx.fillText("Orbs for upgrade: 50", canvas.width * 2 / 3, 25);
}


var upgradeButtons = [
	{ x: 0, y: 0, width: 50, height: 50 },
	{ x: 0, y: 0, width: 50, height: 50 },
	{ x: 0, y: 0, width: 50, height: 50 }];


function drawUpgrades(ctx) {
	let width = 50;
	let height = 50;
	//Update button positions
	for (let i = 0; i < upgradeButtons.length; i++) {
		//Update buttons position
		upgradeButtons[i].x = canvas.width / 3 - width / 2 + i * canvas.width / 6;
		upgradeButtons[i].y = canvas.height - height - 10;
	}

	if (player.levelUpInProgress) {
		let textVertOffset = 7;
		for (let i = 0; i < upgradeButtons.length; i++) {
			let x = upgradeButtons[i].x;
			let y = upgradeButtons[i].y;

			//Draw button
			ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
			ctx.fillRect(x, y, width, height);

			//Draw text
			ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
			ctx.font = "15px Arial";
			ctx.textAlign = "center";
			ctx.fillText("+25% Speed", x + width / 2, y - textVertOffset);
		}

		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.fillText("Choose an upgrade:", upgradeButtons[1].x + width / 2, upgradeButtons[1].y - textVertOffset - 30);
	}
}

function checkUpgradeClick(pos) {
	if (player.levelUpInProgress) {
		for (let i = 0; i < upgradeButtons.length; i++) {
			let x = upgradeButtons[i].x;
			let y = upgradeButtons[i].y;
			let width = upgradeButtons[i].width;
			let height = upgradeButtons[i].height;

			if (pos.x >= x && pos.x <= x + width) {
				if (pos.y >= y && pos.y <= y + height) {
					console.log("UPGRADE " + i);
					//Notify server of choice
					sendUpgradeRequest(i);
				}
			}
		} //END FOR
	} //END IF LEVEL UP
}