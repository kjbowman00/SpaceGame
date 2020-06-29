var staticWorldObjs = require('./staticWorldObjs').staticWorldObjs;
const UPGRADE_TYPES = require('./upgrades.js').UPGRADE_TYPES;

function handleStaticObjsCollision(players, bullets, deltaTime, botManager, bulletsMarkedForExplosion) {
	players.forEach((player, id, map) => {
		if (player.alive) {
			let bounds = { x: player.x, y: player.y, w: player.w, h: player.h };
			//Naive approach. test each object with each player
			for (let i = staticWorldObjs.length - 1; i >= 0; i--) {
				let currentBox = staticWorldObjs[i];
				if (doesCollide(bounds, currentBox)) {
					//Get the bounds and move the player
					//Check x direction
					let xBounds = { x: player.x, y: player.oldY, w: player.w, h: player.h };
					let yBounds = { x: player.oldX, y: player.y, w: player.w, h: player.h };
					if (doesCollide(xBounds, currentBox)) {
						if (player.x - player.oldX > 0) {
							player.x = currentBox.x - player.w;
							player.oldX = player.x; //Prevents other boxes from handling the same collision
							if (player.bot) botManager.bounceBot(player, botManager.SIDES.LEFT);
						} else if (player.x - player.oldX < 0) {
							player.x = currentBox.x + currentBox.w;
							player.oldX = player.x; //Prevents other boxes from handling the same collision
							if (player.bot) botManager.bounceBot(player, botManager.SIDES.RIGHT);
						}
					}
					if (doesCollide(yBounds, currentBox)) {
						if (player.y - player.oldY > 0) {
							player.y = currentBox.y - player.h;
							player.oldY = player.y; //Prevents other boxes from handling the same collision
							if (player.bot) botManager.bounceBot(player, botManager.SIDES.TOP);
						} else if (player.y - player.oldY < 0) {
							player.y = currentBox.y + currentBox.h;
							player.oldY = player.y; //Prevents other boxes from handling the same collision
							if (player.bot) botManager.bounceBot(player, botManager.SIDES.BOTTOM);
						}
					}
				}
			}
		}
	});

	let bulletDeleteList = [];
	bullets.forEach((bullet, id, map) => {
		let bounds = { x: bullet.x, y: bullet.y, w: bullet.r * 2, h: bullet.r * 2 };
		for (let i = staticWorldObjs.length - 1; i >= 0; i--) {
			if (doesCollide(bounds, staticWorldObjs[i])) {
				bulletDeleteList.push(id);
				bulletsMarkedForExplosion.push({
					id: id,
					x: bounds.x,
					y: bounds.y
				});
				break;
			}
		}
	});
	for (let i = bulletDeleteList.length - 1; i >= 0; i--) {
		bullets.delete(bulletDeleteList[i]);
	}
}

function doesCollide(rect1, rect2) {
	if (rect1.x < rect2.x + rect2.w &&
		rect1.x + rect1.w > rect2.x &&
		rect1.y < rect2.y + rect2.h &&
		rect1.y + rect1.h > rect2.y) {
		return true;
	}
	return false;
}

function bulletCollide(player, bullet) {
	let xsq = (bullet.x - player.x) * (bullet.x - player.x);
	let ysq = (bullet.y - player.y) * (bullet.y - player.y);
	let dist = xsq + ysq;
	if (dist > player.w * player.w + player.h * player.h) return false;

	//TODO: (CHANGE) currently pretending the bullet is a square
	//Deeper check
	return doesCollide(player, { x: bullet.x, y: bullet.y, w: bullet.r * 2, h: bullet.r * 2 });
}

function handleBulletCollision(players, bullets, bulletsMarkedForExplosion, deltaTime) {
	//Naive solution for now
	//TODO: Make this not a naive solution if it's too slow (sweep and prune probably)
	let bulletsToDelete = [];
	players.forEach((player, playerId, playerMap) => {
		if (player.alive) {
			let repulser = false;
			if (player.upgrades[UPGRADE_TYPES.repulser] > 0) repulser = true;
			bullets.forEach((bullet, bulletId, bulletMap) => {
				if (repulser && bullet.repulseChecked != true && bullet.playerEmitId != playerId) {
					let xsq = (bullet.x - (player.x + player.w / 2)) * (bullet.x - (player.x + player.w / 2));
					let ysq = (bullet.y - (player.y + player.h / 2)) * (bullet.y - (player.y + player.h / 2));
					let dist = xsq + ysq;
					let repulseRadius = 50 * 50;
					if (dist <= repulseRadius) {
						bullet.repulseChecked = true;
						//Repulse the bullet
						let shouldRepulseRand = Math.random();
						if (shouldRepulseRand < 0.25) { // 1/4 chance to repulse
							let rotation = Math.atan2(bullet.y - (player.y + player.h / 2), bullet.x - (player.x + player.h / 2));
							bullet.xVel = Math.cos(rotation) * (bullet.baseSpeed * 1.4); //the 1.4 gives a stronger repulse effect
							bullet.yVel = Math.sin(rotation) * (bullet.baseSpeed * 1.4);
							bullet.playersSeen = [];
						}
					}
				}
				if (bulletCollide(player, bullet) && bullet.playerEmitId != playerId) {
					let armor = 0;
					if (isPowerupActive(2, player)) { //CHECK if juggernaut enabled
						armor += 0.5;
					}
					armor += 0.05 * player.upgrades[UPGRADE_TYPES.armor]; //Armor
					armor += 0.30 * player.upgrades[UPGRADE_TYPES.tank];
					armor -= (0.05 * player.upgrades[UPGRADE_TYPES.armor_piercing]);
					if (armor < 0) armor = 0;
					if (armor > 1) armor = 1;

					let damage = bullet.damage - bullet.damage * armor;
					player.health -= damage;

					let damagingPlayer = players.get(bullet.playerEmitId);
					if (damagingPlayer != undefined) {
						if (damagingPlayer.health > 0) { //This ensures they aren't already dead
							let lifeSteal = damagingPlayer.upgrades[UPGRADE_TYPES.life_steal] * 0.05;
							let lifeStolen = lifeSteal * damage;
							damagingPlayer.health += lifeStolen;
							if (damagingPlayer.health > damagingPlayer.maxHealth) damagingPlayer.health = damagingPlayer.maxHealth;
						}

						if (damagingPlayer.upgrades[UPGRADE_TYPES.cryo_rounds] > 0) {
							let rand = Math.random();
							if (rand < 1) {
								//Slow effect
								player.cryoSlowedTimer = 0.5;
							}
						}
						if (damagingPlayer.upgrades[UPGRADE_TYPES.acidic_rounds] > 0) {
							player.acidDamage += 1 + 0.05 * damagingPlayer.upgrades[UPGRADE_TYPES.damage];
							if (player.acidDamage > 5) player.acidDamage = 5;
						}
					}

					player.lastDamagedBy = bullet.playerEmitId;
					player.regenStartTimer = 0;
					//Blow up and damage player
					bulletsToDelete.push(bulletId); //used so the player can make animation
				}
			});
		}
	});
	//Remove the bullets from our bullets list
	for (let i = 0; i < bulletsToDelete.length; i++) {
		let id = bulletsToDelete[i];
		let bullet = bullets.get(id);
		if (bullet != undefined) {
			bulletsMarkedForExplosion.push({
				id: id,
				x: bullet.x,
				y: bullet.y
			});
			bullets.delete(id);
		}
	}
}

function isPowerupActive(type, player) {
	let activePowerups = player.activePowerups;
	for (let i = activePowerups.length - 1; i >= 0; i--) {
		if (activePowerups[i].type == type) return true;
	}
	return false;
}

function handleOrbCollision(players, orbs, deletedOrbs) {
	let orbsToRemove = [];
	//Naive solution temporairly
	players.forEach((player, playerId, map) => {
		if (player.alive) {
			orbs.forEach((orb, orbId, map) => {
				if (doesCollide(player, orb)) {
					//Mark orb for deletion
					orbsToRemove.push(orbId);

					//Add to player energy/cash points
					player.orbs += 1;
				}
			});
		}
	});

	//Remove the orbs that are marked
	for (let i = orbsToRemove.length - 1; i >= 0; i--) {
		let id = orbsToRemove.pop();
		let orb = orbs.get(id);
		if (orb != undefined) {
			deletedOrbs.push({
				id: id,
				x: orb.x,
				y: orb.y
			});
			orbs.delete(id);
		}
	}
}

function updateCollisions(players, bullets, bulletsMarkedForExplosion, orbs, deltaTime, botManager, deletedOrbs) {
	handleStaticObjsCollision(players, bullets, deltaTime, botManager, bulletsMarkedForExplosion);
	handleBulletCollision(players, bullets, bulletsMarkedForExplosion, deltaTime);
	handleOrbCollision(players, orbs, deletedOrbs);
}

exports.updateCollisions = updateCollisions;