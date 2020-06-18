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

/*const UPGRADE_PROBABILITIES = [
	0.155833333, 0.155833333, 0.155833333, 0.155833333, 0.155833333, 0.155833333, //Common (93.5%)
	0.025, 0.025, //Rare (5%)
	0, 0.005, 0.005, 1 //Legendary (1.5%). 1 at the end to ensure an upgrade happens from rounding errors
];*/
const UPGRADE_PROBABILITIES = [
	0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 1
];

const MAX_UPGRADE_LEVELS = [
	10, 5, 6, 7, 6, 10,
	6, 6,
	1,1,1,1
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
		let randomNum;
		let currentProb = 0;

		let selectedUpgrade;
		let MAX_ITER = 5;
		let iter = 0;
		do { // Iterates a few times if we hit a max upgrade by random chance
			randomNum = Math.random();
			iter++;
			for (let j = 0; j < UPGRADE_PROBABILITIES.length; j++) {
				currentProb += UPGRADE_PROBABILITIES[j];
				if (randomNum <= currentProb) {
					selectedUpgrade = j;
					break;
				}
			}
		} while (iter < MAX_ITER && player.upgrades[selectedUpgrade] >= MAX_UPGRADE_LEVELS[selectedUpgrade]);
		if (player.upgrades[selectedUpgrade] >= MAX_UPGRADE_LEVELS[selectedUpgrade]) {
			//If the player still hasn't gotten an upgrade from random, just apply the next available upgrade
			let noUpgradeAvailable = true;
			for (let j = 0; j < UPGRADE_PROBABILITIES.length; j++) {
				if (player.upgrades[j] < MAX_UPGRADE_LEVELS[j]) {
					noUpgradeAvailable = false;
					selectedUpgrade = j;
				}
			}
			//No upgrades available? notify the player with -2
			if (noUpgradeAvailable) {
				selectedUpgrade = -2;
			}
		}
		set.push(selectedUpgrade);
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
	player.upgrades[upgradeType] += 1;

	//Handle things that need to be changed once
	if (upgradeType == UPGRADE_TYPES.health) {
		player.maxHealth = 100 + 25 * (player.upgrades[upgradeType]);
		if (player.upgrades[UPGRADE_TYPES.tank] > 0) player.maxHealth *= 2;
		if (player.upgrades[UPGRADE_TYPES.speedster] > 0) {
			player.maxHealth /= 2;
			if (player.health > player.maxHealth) player.health = player.maxHealth;
		}
	}
	if (upgradeType == UPGRADE_TYPES.tank) player.maxHealth *= 2;
	if (upgradeType == UPGRADE_TYPES.speedster) {
		player.maxHealth /= 2;
		if (player.health > player.maxHealth) player.health = player.maxHealth;
	}
}



exports.UPGRADE_TYPES = UPGRADE_TYPES;
exports.AMOUNT_TO_UPGRADE = AMOUNT_TO_UPGRADE;
exports.getUpgradeSet = getUpgradeSet;
exports.upgradePlayer = upgradePlayer;