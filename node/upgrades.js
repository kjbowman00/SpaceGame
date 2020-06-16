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

/*const AMOUNT_TO_UPGRADE = [
	5, 10, 20, 25, 50, 50, 50, 50, 75, 75, 75, 75, 75, 100, 100, 100,
	500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500
];*/
const AMOUNT_TO_UPGRADE = new Array(50).fill(1);

const UPGRADE_PROBABILITIES = [
	0.155833333, 0.155833333, 0.155833333, 0.155833333, 0.155833333, 0.155833333, //Common
	0.025, 0.025, //Rare
	0.00375, 0.00375, 0.00375, 1 //Legendary. 1 at the end to ensure an upgrade happens from rounding errors
];

//Get what types of upgrades are available to the player on levelup
function getUpgradeSet(player) {
	let set = [];
	if (player.level == 5) {
		set.push(UPGRADE_TYPES.tank);
		set.push(UPGRADE_TYPES.speedster);
		set.push(-1);
		return set;
	}
	if (player.level == 10) {
		set.push(UPGRADE_TYPES.sniper);
		set.push(UPGRADE_TYPES.bullet_hose);
		set.push(-1);
		return set;
	}

	for (let i = 0; i < 3; i++) {
		let randomNum = Math.random();
		let currentProb = 0;
		for (let j = 0; j < UPGRADE_PROBABILITIES.length; j++) {
			currentProb += UPGRADE_PROBABILITIES[j];
			if (randomNum <= currentProb) {
				set.push(j);
				if (player.bot == false) {
					console.log(set);
				}
				break;
			}
		}
	}
	return set;
}

function upgradePlayer(player, selection) {
	player.orbs -= AMOUNT_TO_UPGRADE[player.level];
	player.levelUpInProgress = false;
	player.level += 1;
	player.orbsToUpgrade = AMOUNT_TO_UPGRADE[player.level];

	//Add to their upgrades
	let upgradeType = player.availableUpgrades[selection];

	//Handle things that need to be changed once
	if (upgradeType == UPGRADE_TYPES.health) player.maxHealth += 20;

	player.upgrades[upgradeType] += 1;
}



exports.UPGRADE_TYPES = UPGRADE_TYPES;
exports.AMOUNT_TO_UPGRADE = AMOUNT_TO_UPGRADE;
exports.getUpgradeSet = getUpgradeSet;
exports.upgradePlayer = upgradePlayer;