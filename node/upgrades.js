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
	25, 50, 50, 75, 75, "N/A"
];

const UPGRADE_PROBABILITIES = [ //Should add to 1
	0.3, 0.2, 0.2, 0.1, 0.1, 0.1
];

//Get what types of upgrades are available to the player on levelup
function getUpgradeSet() {
	return [0, 1];
}



exports.UPGRADE_TYPES = UPGRADE_TYPES;