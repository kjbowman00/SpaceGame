//This tells the amount the upgrade should increase the trait per level
const UPGRADE_EFFECT_AMOUNTS = {
	health: 0.05,
	speed: 0.05,
	fire_rate: 0.05,
	armor: 0.05,
	health_regen: 0.05,
	damage: 0.05,
	armor_piercing: 0.05,
	life_steal: 0.05,
	pet: 0,
	repulser: 0.25,
	cryo_rounds: {
		slowAmount: 0.65,
		slowTime: 1,
	},
	acidic_rounds: {
		baseDamage: 5,
		damageSpeed: 15
	},
	tank: {
		speedMod: 0.8,
		healthMod: 2,
		armorMod: 2
	},
	speedster: {
		speedMod: 2,
		healthMod: 0.5,
		damageMod: 0.7
	},
	sniper: {
		damageMod: 2.5,
		fireRateMod: 0.6,
		bulletSpeedMod: 3
	},
	bullet_hose: {
		damageMod: 0.25,
		fireRateMod: 3
	}
}

exports.UPGRADE_EFFECT_AMOUNTS = UPGRADE_EFFECT_AMOUNTS;