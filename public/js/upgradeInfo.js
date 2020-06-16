const UPGRADE_TYPES = {
	//Common
	health: 0,
	speed: 1,
	fire_rate: 2,
	armor: 3,
	health_regen: 4,
	damage: 5,

	//Rare
	armor_piercing: 6,
	life_steal: 7,


	//Legendary
	pet: 8,
	repulser: 9,
	cryo_rounds: 10,
	acidic_rounds: 11,

	//Specializations
	//Lvl 5
	tank: 12,
	speedster: 13,
	//Level 10
	sniper: 14,
	bullet_hose: 15
};

const UPGRADE_TEXT = [
	["+20% Health (Common)"],
	["+20% Speed (Common)"],
	["+20% Fire-Rate (Common)"],
	["+5% Armor (Common)"],
	["+5% Health Regen (Common)"],
	["+ X Damage (IDK YET)"],

	//Rare
	["+5% Armor Piercing (Rare)"],
	["+5% Life Steal (Rare)"],

	//LEGENDARY
	["Pet Bot (LEGENDARY)", "Pet bot follows and helps you"],
	["Repulser Shield (LEGENDARY)", "Bounce bullets sometimes"],
	["Cryo Rounds (LEGENDARY)", "Sometimes bullets slow enemies"],
	["Acidic Rounds (LEGENDARY)", "Bullets hurt even after hit"],

	//Specializations
	["Tank (Specialization)", "+X Health", "+X Armor", "-X Speed"],
	["Speedster", "-X Health", "+X Speed", "-X Damage"],
	["Sniper", "+X Damage", "-X Fire-Rate"],
	["Bullet Hose", "+X Fire-Rate", "-X Damage"]
];

const UPGRADE_IMAGES = new Array(16);
for (let i = 0; i < UPGRADE_IMAGES.length; i++) {
	UPGRADE_IMAGES[i] = new Image(100, 100);
}
UPGRADE_IMAGES[0].src = "/images/upgrades/health.png";
UPGRADE_IMAGES[1].src = "/images/upgrades/speed.png";
UPGRADE_IMAGES[2].src = "/images/upgrades/fire_rate.png";
UPGRADE_IMAGES[3].src = "/images/upgrades/armor.png";
UPGRADE_IMAGES[4].src = "/images/upgrades/health_regen.png";
UPGRADE_IMAGES[5].src = "/images/upgrades/damage.png";
UPGRADE_IMAGES[6].src = "/images/upgrades/armor_piercing.png";
UPGRADE_IMAGES[7].src = "/images/upgrades/life_steal.png";
UPGRADE_IMAGES[8].src = "/images/upgrades/NOT_DONE.png";
UPGRADE_IMAGES[9].src = "/images/upgrades/repulser_shield.png";
UPGRADE_IMAGES[10].src = "/images/upgrades/cryo_rounds.png";
UPGRADE_IMAGES[11].src = "/images/upgrades/acidic_rounds.png";
UPGRADE_IMAGES[12].src = "/images/upgrades/tank.png";
UPGRADE_IMAGES[13].src = "/images/upgrades/NOT_DONE.png";
UPGRADE_IMAGES[14].src = "/images/upgrades/NOT_DONE.png";
UPGRADE_IMAGES[15].src = "/images/upgrades/NOT_DONE.png";


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
	{ x: 0, y: 0, width: 50, height: 50, image: null },
	{ x: 0, y: 0, width: 50, height: 50, image: null },
	{ x: 0, y: 0, width: 50, height: 50, image: null }];


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
		let largestOffset = 0;
		let textVertOffset = 7;
		for (let i = 0; i < upgradeButtons.length; i++) {
			let upgradeNum = player.availableUpgrades[i];
			let x = upgradeButtons[i].x;
			let y = upgradeButtons[i].y;

			//Draw button
			ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
			if (upgradeNum == -1) {
			} else {
				ctx.drawImage(UPGRADE_IMAGES[upgradeNum], x, y, width, height);
			}

			//Lighten if mouse hover
			if (Mouse.cameraX >= x && Mouse.cameraX <= x + width) {
				if (Mouse.cameraY >= y && Mouse.cameraY <= y + height) {
					ctx.fillStyle = "rgba(150, 150, 150, 0.4)";
					ctx.fillRect(x, y, width, height);
				}
			}

			if (upgradeNum >= UPGRADE_LEVELS.specialized) {
				drawShimmer(upgradeButtons[i], ctx, "rgba(150, 150, 0, 0.5)", "rgba(100, 100, 0, 0.5)");
				ctx.fillStyle = "yellow";
			} else if (upgradeNum >= UPGRADE_LEVELS.legendary) {
				drawShimmer(upgradeButtons[i], ctx, "rgba(200, 00, 0, 0.6)", "rgba(200, 50, 0, 0.6)");
				ctx.fillStyle = "orange";
			} else if (upgradeNum >= UPGRADE_LEVELS.rare) {
				drawShimmer(upgradeButtons[i], ctx, "rgba(80, 25, 250, 0.3)", "rgba(120, 80, 250, 0.3)");
				ctx.fillStyle = "purple";
			} else {
				ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Common gray color
			}

			//Draw text
			ctx.font = "15px Arial";
			ctx.textAlign = "center";
			let textArray;
			if (upgradeNum == -1) {
				textArray = ["Don't Specialize", "(Boooorrrrinnggg)"];
			} else {
				textArray = UPGRADE_TEXT[upgradeNum];
			}
			let movingOffset = 0;
			for (let j = textArray.length - 1; j >= 0; j--) {
				if (movingOffset > largestOffset) largestOffset = movingOffset;
				ctx.fillText(textArray[j], x + width / 2, y - textVertOffset - movingOffset);
				movingOffset += 25;
			}
		}

		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.fillText("Choose an upgrade:", upgradeButtons[1].x + width / 2, upgradeButtons[1].y - textVertOffset - 30 - largestOffset);
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
function drawShimmer(button, ctx, col1, col2) {
	// Create gradient
	let x = button.x + shimmerOffset;
	let y = button.y + shimmerOffset;
	var grd = ctx.createLinearGradient(x, y, x + shimmerWidth, y + shimmerWidth);
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

	shimmerOffset += 0.17 * 2;
	if (shimmerOffset >= 0) {
		shimmerOffset -= shimmerWidth/2;
	}
}