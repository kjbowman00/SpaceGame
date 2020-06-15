const UPGRADE_TEXT = [
	"+20% Health (Common)",
	"+20% Speed (Common)",
	"+20% Fire-Rate (Common)",
	"+5% Armor (Common)",
	"+5% Health Regen (Common)",
	"+ X Damage (IDK YET)",

	//Rare
	"+5% Armor Piercing (Rare)",
	"+5% Life Steal (Rare)",

	//LEGENDARY
	"Pet Bot (LEGENDARY)",
	"Repulser Shield (LEGENDARY)",
	"Cryo Rounds (LEGENDARY)",
	"Acidic Rounds (LEGENDARY)",

	//Specializations
	"Tank",
	"Speedster",
	"Sniper",
	"Bullet Hose"
];

const UPGRADE_LEVELS = {
	rare: 6,
	legendary: 8,
	specialized: 12
};

function drawTopInfoBar(ctx) {
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	ctx.font = "12px Arial";
	ctx.fillText("Kills: " + player.kills, canvas.width / 3, 25);

	ctx.fillText("Orbs: " + player.orbs, canvas.width * 1.5 / 3, 25);
	ctx.fillText("Orbs for upgrade: " + player.orbsToUpgrade, canvas.width * 2 / 3, 25);
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
			let upgradeNum = player.availableUpgrades[i];
			let x = upgradeButtons[i].x;
			let y = upgradeButtons[i].y;

			//Draw button
			ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
			ctx.fillRect(x, y, width, height);

			if (upgradeNum >= UPGRADE_LEVELS.specialized) {
				ctx.fillStyle = "yellow";
			} else if (upgradeNum >= UPGRADE_LEVELS.legendary) {
				ctx.fillStyle = "red";
			} else if (upgradeNum >= UPGRADE_LEVELS.rare) {
				drawShimmer(upgradeButtons[i], ctx);
				ctx.fillStyle = "purple";
			} else {
				ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Common gray color
			}

			//Draw text
			ctx.font = "15px Arial";
			ctx.textAlign = "center";
			ctx.fillText(UPGRADE_TEXT[upgradeNum], x + width / 2, y - textVertOffset);
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


//let shimmerStart = -2 * (upgradeButtons[0].width / 4) - 12.5 * 6;
let shimmerWidth = 150; //How wide i want my gradient
//let shimmerJump = (-2 * shimmerStart + upgradeButtons[0].width) / 4;
let shimmerOffset = -shimmerWidth + upgradeButtons[0].width;

let iMTEST = false;
function drawShimmer(button, ctx) {
	// Create gradient
	let x = button.x + shimmerOffset;
	let y = button.y + shimmerOffset;
	var grd = ctx.createLinearGradient(x, y, x + shimmerWidth, y + shimmerWidth);
	let col1 = "rgba(80, 25, 250, 0.6)";
	let col2 = "rgba(150, 100, 250, 0.3)";
	grd.addColorStop(0, col1);
	grd.addColorStop(0.25, col2);
	grd.addColorStop(0.5, col1);
	grd.addColorStop(0.75, col2);
	grd.addColorStop(1, col1);

	// Fill with gradient
	ctx.fillStyle = grd;
	ctx.globalCompositeOperation = 'lighter';
	ctx.fillRect(button.x, button.y, button.width, button.height);
	ctx.globalCompositeOperation = 'source-over';

	shimmerOffset += 0.17 * 1;
	if (shimmerOffset >= 0) {
		shimmerOffset -= shimmerWidth/2;
	}
}