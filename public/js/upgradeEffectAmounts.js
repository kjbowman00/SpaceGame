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
	repulser: 0.25, //chance to bounce
	cryo_rounds: {
		velocityMod: 0.65,
		slowTime: 1,
		chance: 0.25
	},
	acidic_rounds: {
		baseDamage: 5, //How much damage each round stacks up
		damageSpeed: 15, //Damage per second the acid rounds do
		maxDamage: 25
	},
	tank: {
		velocityMod: 0.8,
		healthMod: 2,
		armorMod: 2
	},
	speedster: {
		velocityMod: 2,
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

if (typeof exports === 'undefined') {
	//Do nothing on client side
} else {
	exports.UPGRADE_EFFECT_AMOUNTS = UPGRADE_EFFECT_AMOUNTS;
}