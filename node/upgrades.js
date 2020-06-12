const UPGRADE_TYPES = {
	health: 0,
	speed: 1,
	fire_rate: 2,
	armor: 3,
	health_regen: 4,
	armor_piercing: 5,
	bleed: 6,
	splash_damage: 7,

};

const AMOUNT_TO_UPGRADE = [
	5, 10, 20, 25, 50, 50, 50, 50, 75, 75, 75, 75, 75, 100, 100, 100,
	500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500
];

const UPGRADE_PROBABILITIES = [ //Should add to 1
	0.3, 0.2, 0.2, 0.1, 0.2
];

//Get what types of upgrades are available to the player on levelup
function getUpgradeSet(player) {
	let set = [];
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