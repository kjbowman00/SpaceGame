//This tells the amount the upgrade should increase the trait per level
const UPGRADE_EFFECT_AMOUNTS = {
	health: 0.25,
	speed: 0.075,
	fire_rate: 0.05,
	armor: 0.075,
	health_regen: 0.25,
	damage: 0.05,
	bullet_speed: 0.10,
	armor_piercing: 0.05,
	life_steal: 0.15,
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
		velocityMod: 0.9,
		healthMod: 2,
		armorAdd: 0.3
	},
	speedster: {
		velocityMod: 1.25,
		healthMod: 0.5,
		damageMod: 0.9
	},
	sniper: {
		damageMod: 2.5,
		fireRateMod: 0.65,
		bulletSpeedMod: 1.5
	},
	bullet_hose: {
		damageMod: 0.4,
		fireRateMod: 3
	}
}

if (typeof exports === 'undefined') {
	//Do nothing on client side
} else {
	exports.UPGRADE_EFFECT_AMOUNTS = UPGRADE_EFFECT_AMOUNTS;
}