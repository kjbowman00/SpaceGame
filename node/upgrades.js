const UPGRADE_TYPES = {
	//Common
	health: 0,
	speed: 1,
	fire_rate: 2,
	armor: 3,
	health_regen: 4,
	damage: 5,
	bullet_speed: 6,

	//Rare
	armor_piercing: 7,
	life_steal: 8,


	//Legendary
	pet: 9,
	repulser: 10,
	cryo_rounds: 11,
	acidic_rounds: 12,

	//Specializations
	//Lvl 5
	tank: 13,
	speedster: 14,
	//Level 10
	sniper: 15,
	bullet_hose: 16
};

//This tells the amount the upgrade should increase the trait per level
const UPGRADE_EFFECT_AMOUNTS = require('../public/js/upgradeEffectAmounts.js').UPGRADE_EFFECT_AMOUNTS;

const AMOUNT_TO_UPGRADE = [
	25, 25, 25, 25, 50, 50, 50, 50, 75, 75, 75, 75, 75, 100, 100, 100,
	100, 100, 100, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 500, 500, "N/A"
];
//const AMOUNT_TO_UPGRADE = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

const UPGRADE_PROBABILITIES = [
	0.1142857, 0.1142857, 0.1142857, 0.1142857, 0.1142857, 0.1142857, 0.1142857, //Common (80%)
	0.075, 0.075, //Rare (15%)
	0, 0.0166666, 0.0166666, 1 //Legendary (5%). 1 at the end to ensure an upgrade happens from rounding errors
];
const MAX_UPGRADE_LEVELS = [
	10, 5, 6, 7, 6, 10, 5,
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
	if (upgradeType >= 0) {
		player.upgrades[upgradeType] += 1;
	}

	//Handle things that need to be changed once
	if (upgradeType == UPGRADE_TYPES.health) {
		player.maxHealth = 100 * (1 + UPGRADE_EFFECT_AMOUNTS.health * player.upgrades[upgradeType]);
		if (player.upgrades[UPGRADE_TYPES.tank] > 0) player.maxHealth *= UPGRADE_EFFECT_AMOUNTS.tank.healthMod;
		if (player.upgrades[UPGRADE_TYPES.speedster] > 0) {
			player.maxHealth *= UPGRADE_EFFECT_AMOUNTS.speedster.healthMod;
			if (player.health > player.maxHealth) player.health = player.maxHealth;
		}
	}
	if (upgradeType == UPGRADE_TYPES.tank) player.maxHealth *= UPGRADE_EFFECT_AMOUNTS.tank.healthMod;
	if (upgradeType == UPGRADE_TYPES.speedster) {
		player.maxHealth *= UPGRADE_EFFECT_AMOUNTS.speedster.healthMod;
		if (player.health > player.maxHealth) player.health = player.maxHealth;
	}
}



exports.UPGRADE_TYPES = UPGRADE_TYPES;
exports.AMOUNT_TO_UPGRADE = AMOUNT_TO_UPGRADE;
exports.UPGRADE_EFFECT_AMOUNTS = UPGRADE_EFFECT_AMOUNTS;
exports.getUpgradeSet = getUpgradeSet;
exports.upgradePlayer = upgradePlayer;