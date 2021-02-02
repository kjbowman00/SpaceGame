/*jshint esversion: 6 */
var deltaTime = 0; //In seconds

var alive = false;

const SERVER_WORLD_UPDATE_TIME = 1 / 20;

var worldObjsOld = {};
worldObjsOld.players = new Map();
worldObjsOld.bullets = new Map();
worldObjsOld.orbs = new Map();
var worldObjsUpdated = {};
worldObjsUpdated.players = new Map();
worldObjsUpdated.bullets = new Map();
worldObjsUpdated.orbs = new Map();

var powerupObjs = [];

const PLAYER_W = 50;

var serverPlayerState = {};
var lastInput = { xVel: 0, yVel: 0 };
var lastInputTime = performance.now();

var lastUpdateTime = 0;

var trailTimer = 0;

var player = {};
var playerSpeed = 150;
var playerFireTimer = 0;
const playerFireTimeNeeded = 0.5;

const fadeTime = 0.5; //Amount in seconds to fade screen on death
var fadeTimer = 0;

var deathAnimations = [];

function initializeWorldObjects() {
	worldObjsOld = {};
	worldObjsOld.players = new Map();
	worldObjsOld.bullets = new Map();
	worldObjsOld.orbs = new Map();
	worldObjsUpdated = {};
	worldObjsUpdated.players = new Map();
	worldObjsUpdated.bullets = new Map();
	worldObjsUpdated.orbs = new Map();
	powerupObjs = [];
	serverPlayerState = {};
	lastInput = { xVel: 0, yVel: 0 };
	lastUpdateTime = performance.now();
	trailTimer = 0;
	player.x = 0;
	player.y = 0;
	player.w = 50;
	player.h = 50;
	player.oldX = 0;
	player.oldY = 0;
	player.xVel = 0;
	player.yVel = 0;
	player.heatlh = 100;
	player.maxHealth = 100;
	player.activePowerups = [];
	player.upgrades = new Array(20).fill(0);
	player.availableUpgrades = [0, 0, 0];
	playerFireTimer = 0;
}

function lerp(n1, n2, amt) {
	if (n2 - n1 == 0) return n1;
	return (n2-n1) * amt + n1;
}

function isPowerupActive(type, player) {
	let activePowerups = player.activePowerups;
	for (let i = activePowerups.length - 1; i >= 0; i--) {
		if (activePowerups[i].type == type) return true;
	}
	return false;
}


function outOfRender(obj) {
	const RENDER_DIST_SQ = 1000 * 1000;
	let dX = player.x - obj.x;
	let dY = player.y - obj.y;
	if (dX * dX + dY * dY >= RENDER_DIST_SQ + 200000) {
		return true;
	}
	return false;
}
function deleteOutOfBoundsItems() {
	let toDelete = [];

	//Orbs
	worldObjsOld.orbs.forEach((obj, id, map) => {
		if (outOfRender(obj)) toDelete.push(id);
	});
	for (let i = toDelete.length - 1; i >= 0; i--) {
		let id = toDelete.pop();
		worldObjsOld.orbs.delete(id);
		worldObjsUpdated.orbs.delete(id);
	}

	//Bulllets
	worldObjsOld.bullets.forEach((obj, id, map) => {
		if (outOfRender(obj)) toDelete.push(id);
	});
	for (let i = toDelete.length - 1; i >= 0; i--) {
		let id = toDelete.pop();
		worldObjsOld.bullets.delete(id);
		worldObjsUpdated.bullets.delete(id);
	}
}

function update() {
	deleteOutOfBoundsItems();

	if (alive && player.health <= 0) died();
	var deltaServer = (performance.now() - lastInputTime) / 1000;

	if (alive) {
		updateCamera();
		//Get powerup for superspeed
		let velocityMod = 1;
		if (isPowerupActive(powerups.superSpeed, player)) velocityMod += .8;
		velocityMod += player.upgrades[UPGRADE_TYPES.speed] * UPGRADE_EFFECT_AMOUNTS.speed;
		let velMod2 = 1;
		if (player.upgrades[UPGRADE_TYPES.tank] > 0) velMod2 = UPGRADE_EFFECT_AMOUNTS.tank.velocityMod;
		if (player.upgrades[UPGRADE_TYPES.speedster] > 0) velMod2 = UPGRADE_EFFECT_AMOUNTS.speedster.velocityMod;
		if (player.cryoSlowTimer > 0) velocityMod *= UPGRADE_EFFECT_AMOUNTS.cryo_rounds.velocityMod;

		player.oldX = player.x;
		player.oldY = player.y;
		//Update player position
		player.x += deltaTime * xDir * playerSpeed * velocityMod * velMod2;
		player.y += deltaTime * yDir * playerSpeed * velocityMod * velMod2;

		//Lerp to predicted server state
		var predictX = serverPlayerState.x + lastInput.xVel * deltaServer * velocityMod * velMod2;
		var predictY = serverPlayerState.y + lastInput.yVel * deltaServer * velocityMod * velMod2;

		if (Math.abs(player.x - predictX) > 2) player.x = lerp(player.x, predictX, 0.2);
		if (Math.abs(player.y - predictY) > 2) player.y = lerp(player.y, predictY, 0.2);

		//Check collision detection
		updateCollisions()

		//Update gun rotation
		let centerX = Math.round(player.x) - camera.x + PLAYER_W/2;
		let centerY = Math.round(player.y) - camera.y + PLAYER_W / 2;
		let realCanvasScale = realCanvas.height / canvas.height;
		let xDiffFromScale = (realCanvas.width - realCanvasScale * canvas.width) / 2;

		player.gun.rotation = Math.atan2(Mouse.cameraY / realCanvasScale - centerY, (Mouse.cameraX - xDiffFromScale) / realCanvasScale - centerX);

		let fireTimeMod = 1;
		if (isPowerupActive(powerups.overcharge, player)) fireTimeMod *= 2;
		fireTimeMod += UPGRADE_EFFECT_AMOUNTS.fire_rate * player.upgrades[UPGRADE_TYPES.fire_rate];
		if (player.upgrades[UPGRADE_TYPES.sniper] > 0) fireTimeMod *= UPGRADE_EFFECT_AMOUNTS.sniper.fireRateMod;
		if (player.upgrades[UPGRADE_TYPES.bullet_hose] > 0) fireTimeMod *= UPGRADE_EFFECT_AMOUNTS.bullet_hose.fireRateMod;

		//Fire gun
		playerFireTimer += deltaTime;
		if (Mouse.pressed && playerFireTimer >= playerFireTimeNeeded / fireTimeMod) {
			playerFireTimer = 0;
			sendBullet();
			Sounds.playLaser();
		}

		if (player.trail != undefined) {
			player.trail.update(player.x, player.y, PLAYER_W/2, deltaTime);
		} else {
			player.trail = new Trail(player.x, player.y, player.color, 25, 20);
		}
	} //END IF ALIVE

	for (let i = deathAnimations.length - 1; i >= 0; i--) {
		if (deathAnimations.timeAlive > 2) {
			deathAnimations.splice(i, 1);
		} else {
			deathAnimations[i].update(deltaTime);
		}
	}

	//Update other player objects
	var percentageUpdate = deltaServer / SERVER_WORLD_UPDATE_TIME;
	worldObjsOld.players.forEach((obj, id, map) => {
		var objNew = worldObjsUpdated.players.get(id);
		if (objNew != undefined) {
			if (Math.abs(obj.x - objNew.x) > 0.1) obj.x = lerp(obj.x, objNew.x, percentageUpdate);
			if (Math.abs(obj.y - objNew.y) > 0.1) obj.y = lerp(obj.y, objNew.y, percentageUpdate);
			obj.gun.rotation = lerp(obj.gun.rotation, objNew.gun.rotation, percentageUpdate);
		}

		if (obj.trail != undefined) {
			obj.trail.update(obj.x, obj.y, PLAYER_W/2, deltaTime);
		} else {
			obj.trail = new Trail(obj.x, obj.y, obj.color, 25, 20);
		}
	});
	//Update bullets
	let bulletsMarkedForDelete = [];
	worldObjsOld.bullets.forEach((obj, id, map) => {
		/*var objNew = worldObjsUpdated.bullets.get(id);
		if (objNew != undefined) {
			if (Math.abs(obj.x - objNew.x) > 0.1) obj.x = lerp(obj.x, objNew.x, percentageUpdate);
			if (Math.abs(obj.y - objNew.y) > 0.1) obj.y = lerp(obj.y, objNew.y, percentageUpdate);
		}*/
		obj.x += obj.xVel * deltaTime;
		obj.y += obj.yVel * deltaTime;
		if (obj.timeAlive == undefined) obj.timeAlive = 0;
		obj.timeAlive += deltaTime;
		if (obj.timeAlive > 1.5) bulletsMarkedForDelete.push(id);
	});
	//Delete bullets marked
	for (let i = bulletsMarkedForDelete.length - 1; i >= 0; i--) {
		worldObjsOld.bullets.delete(bulletsMarkedForDelete.pop());
	}

	worldObjsOld.orbs.forEach((obj, id, map) => {
		/*var objNew = worldObjsUpdated.orbs.get(id);
		if (objNew != undefined) {
			if (Math.abs(obj.x - objNew.x) > 0.1) obj.x = lerp(obj.x, objNew.x, percentageUpdate);
			if (Math.abs(obj.y - objNew.y) > 0.1) obj.y = lerp(obj.y, objNew.y, percentageUpdate);
		}*/
		obj.x = lerp(obj.x, obj.xToGo, 1.5 * deltaTime);
		obj.y = lerp(obj.y, obj.yToGo, 1.5 * deltaTime);

		if (obj.trail != undefined) {
			obj.trail.update(obj.x, obj.y, 10, deltaTime);
		} else {
			obj.trail = new OrbTrail(obj.x, obj.y, obj.color, 10, 5);
		}
	});

	updateTopInfoBar(deltaTime);
}

function draw() {
	var ctx = canvas.getContext('2d');
	var uiCtx = UICanvas.getContext('2d');
	uiCtx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#000000";
	//Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Draw background
	var bCtx = backgroundCanvas.getContext('2d');
	bCtx.clearRect(0, 0, canvas.width, canvas.height);
	var amountGoBackX = Math.floor(camera.x) % backGroundImage.width;
	var amountGoBackY = Math.floor(camera.y) % backGroundImage.height;
	bCtx.globalCompositeOperation = "source-over";
	//bCtx.drawImage(offscreenBackgroundCanvas, -backGroundImage.width+amountGoBackX, -backGroundImage.height+amountGoBackY, canvas.width + 2*backGroundImage.width, canvas.height + 2*backGroundImage.height);
	bCtx.translate(-amountGoBackX, -amountGoBackY);
	bCtx.drawImage(offscreenBackgroundCanvas, -backGroundImage.width, -backGroundImage.height);
	bCtx.resetTransform();


	//Draw black over anything beyond world borders
	ctx.fillStyle = "#000000";
	if (camera.x < -world.width / 2) { // Fill left
		ctx.fillRect(0, 0, Math.floor(-camera.x) - world.width/2, canvas.height);
	}
	if (camera.y < -world.height / 2) { // Fill top
		ctx.fillRect(0, 0, canvas.width, Math.floor(-camera.y) - world.height / 2);
	}
	if (camera.x + canvas.width > world.width / 2) { // Fill right
		ctx.fillRect(world.width/2 - Math.floor(camera.x), 0, -Math.floor(camera.x) + world.width / 2, canvas.height);
	}
	if (camera.y + canvas.height > world.height / 2) { // Fill bottom
		ctx.fillRect(0, world.height / 2 - Math.floor(camera.y), canvas.width, -Math.floor(camera.y) + world.height);
	}
	

	//Draw world objects where the camera is
	for (var i in world.staticWorldObjs) {
		item = world.staticWorldObjs[i];
		if (doesCollide(item, camera)) {
			let dx = Math.floor(item.x - camera.x);
			let dy = Math.floor(item.y - camera.y);
			ctx.fillRect(dx, dy, item.w, item.h);

			//Fill sides with color
			bCtx.fillStyle = "red";
			bCtx.fillRect(dx - 1, dy - 1, item.w + 2, 1);
			bCtx.fillRect(dx - 1, dy - 1, 1, item.h + 2);
			bCtx.fillRect(dx + item.w, dy, 1, item.h + 1);
			bCtx.fillRect(dx - 1, dy + item.h, item.w + 2, 1);
		}
	}

	if (alive) {
		drawPlayer(player, ctx, bCtx);
		displayActivePowerups(player.activePowerups, ctx);
	}

	//Draw world objects (other players, bullets)
	ctx.fillStyle = "#FF0000";
	worldObjsOld.players.forEach((elem, id, map) => {
		drawPlayer(elem, ctx, bCtx);
	});
	ctx.fillStyle = "#FF0000";
	worldObjsOld.bullets.forEach((bullet, id, map) => {
		var grd = bCtx.createRadialGradient(Math.floor(bullet.x - camera.x + 5), Math.floor(bullet.y - camera.y + 5), 1, Math.floor(bullet.x - camera.x + 5), Math.floor(bullet.y - camera.y + 5), 7);
		let c = hexToRGB(bullet.color);
		grd.addColorStop(0, 'rgba(' + Math.floor(lerp(c.r, 255, 0.5)) +
			', ' + Math.floor(lerp(c.g, 255, 0.5)) +
			', ' + Math.floor(lerp(c.b, 255, 0.5)) + ', 1.0)');
		grd.addColorStop(1, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0)');
		bCtx.fillStyle = grd;
		bCtx.globalCompositeOperation = "lighter";
		bCtx.fillRect(Math.floor(bullet.x - camera.x), Math.floor(bullet.y - camera.y), 2 * 5, 2 * 5);
	});
	worldObjsOld.orbs.forEach((elem, id, map) => {
		//Render trail
		if (OPTIONS.orbTrailQuality > 0 && elem.trail != undefined) {
			elem.trail.render(bCtx, OPTIONS.orbTrailQuality);
		}
		if (elem.grdCanvas == undefined) {
			let r = 10;
			elem.grdCanvas = document.createElement("canvas", 2*r, 2*r);
			let tempCtx = elem.grdCanvas.getContext("2d");
			let c = hexToRGB(elem.color);
			let grd = bCtx.createRadialGradient(r, r, 3, r, r, 10);
			grd.addColorStop(0, 'rgba(255,255,255, 0.8)');
			grd.addColorStop(0.5, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0.5)');
			grd.addColorStop(1, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0.0)');
			tempCtx.fillStyle = grd;
			tempCtx.fillRect(0, 0, r * 2, r * 2);
		}
		bCtx.drawImage(elem.grdCanvas, Math.floor(elem.x - camera.x), Math.floor(elem.y - camera.y));

	});

	//Render powerups
	for (let i = 0; i < powerupObjs.length; i++) {
		displayPowerupObj(powerupObjs[i], bCtx);
	}

	//Death animations
	for (let i = deathAnimations.length - 1; i >= 0; i--) {
		deathAnimations[i].draw(ctx);
	}

	displayLeaderboard(uiCtx);
	drawTopInfoBar(uiCtx);
	drawUpgrades(uiCtx);

	//Draw gray overlay if dead
	if (!alive) {
		if (fadeTimer < fadeTime) fadeTimer += deltaTime;
		if (fadeTimer > fadeTime) fadeTimer = fadeTime;
		ctx.fillStyle = 'rgba(255, 255, 255, ' + lerp(0,0.2,(fadeTimer / fadeTime)) + ')';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	var realCtx = realCanvas.getContext('2d');
	let bW = canvas.width;
	let bH = canvas.height;
	let nH = realCanvas.height;
	let nW = (nH / bH) * bW;

	let nX = Math.floor((realCanvas.width - nW)/ 2);

	realCtx.drawImage(backgroundCanvas, 0, 0, bW, bH, nX, 0, nW, nH);
	realCtx.drawImage(canvas, 0, 0, bW, bH, nX, 0, nW, nH);
	realCtx.drawImage(UICanvas, 0, 0, bW, bH, nX, 0, nW, nH);
	realCtx.fillStyle = "black";
	realCtx.fillRect(0, 0, nX, nH);
	realCtx.fillRect(realCanvas.width - nX, 0, nX, nH);
}

function mainLoop(timestamp) {
	deltaTime = (timestamp - lastUpdateTime) / 1000;
	lastUpdateTime = timestamp;
	update();
	draw();
	loopID = requestAnimationFrame(mainLoop);
}

