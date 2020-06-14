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
			drawShimmer(upgradeButtons[i], ctx);

			//Draw text
			ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
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


let shimmerStart = -2 * (upgradeButtons[0].width / 4);
let shimmerPos = shimmerStart;

let iMTEST = false;
function drawShimmer(button, ctx) {
	// Create gradient
	let x = button.x + shimmerPos;
	let y = button.y + shimmerPos;
	var grd = ctx.createLinearGradient(x, y, x + button.width - 2*shimmerStart, y + button.height - 2*shimmerStart);
	grd.addColorStop(0, "purple");
	grd.addColorStop(0.125, "white");
	grd.addColorStop(0.25, "purple");
	grd.addColorStop(0.375, "white");
	grd.addColorStop(0.5, "purple");
	grd.addColorStop(0.625, "white");
	grd.addColorStop(0.75, "purple");
	grd.addColorStop(0.875, "white");
	grd.addColorStop(1, "purple");

	// Fill with gradient
	ctx.fillStyle = grd;
	ctx.globalCompositeoperation = "lighter";
	ctx.fillRect(button.x, button.y, button.width, button.height);


	shimmerPos += 0.17 * 1;
	if (shimmerPos >= 0) {
		console.log(shimmerPos);
		shimmerPos += shimmerStart;
		console.log(shimmerPos);
	}
}