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

function update() {
	if (alive && player.health <= 0) died();
	var deltaServer = (performance.now() - lastInputTime) / 1000;

	if (alive) {
		updateCamera();
		//Get powerup for superspeed
		let velocityMod = 1;
		if (isPowerupActive(powerups.superSpeed, player)) velocityMod += .8;
		velocityMod += player.upgrades[UPGRADE_TYPES.speed] * 0.1;
		let velMod2 = 1;
		if (player.upgrades[UPGRADE_TYPES.tank] > 0) velMod2 = 0.6;
		if (player.upgrades[UPGRADE_TYPES.speedster] > 0) velMod2 = 2;
		if (player.cryoSlowTimer > 0) velocityMod *= 0.65;

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
		let centerX = Math.round(player.x) - camera.x + player.w / 2;
		let centerY = Math.round(player.y) - camera.y + player.h / 2;
		player.gun.rotation = Math.atan2(Mouse.cameraY - centerY, Mouse.cameraX - centerX);

		let fireTimeMod = 1;
		if (isPowerupActive(powerups.overcharge, player)) fireTimeMod *= 2;
		fireTimeMod += 0.15 * player.upgrades[UPGRADE_TYPES.fire_rate];
		if (player.upgrades[UPGRADE_TYPES.sniper] > 0) fireTimeMod /= 4;
		if (player.upgrades[UPGRADE_TYPES.bullet_hose] > 0) fireTimeMod *= 3;

		//Fire gun
		playerFireTimer += deltaTime;
		if (Mouse.pressed && playerFireTimer >= playerFireTimeNeeded / fireTimeMod) {
			playerFireTimer = 0;
			sendBullet();
			Sounds.playLaser();
		}

		if (player.trail != undefined) {
			player.trail.update(player.x, player.y, player.w/2, deltaTime);
		} else {
			player.trail = new Trail(player.x, player.y, player.color, 25, 20);
		}
	} //END IF ALIVE


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
			obj.trail.update(obj.x, obj.y, obj.w/2, deltaTime);
		} else {
			obj.trail = new Trail(obj.x, obj.y, obj.color, 25, 20);
		}
	});
	//Update bullets
	worldObjsOld.bullets.forEach((obj, id, map) => {
		var objNew = worldObjsUpdated.bullets.get(id);
		if (objNew != undefined) {
			if (Math.abs(obj.x - objNew.x) > 0.1) obj.x = lerp(obj.x, objNew.x, percentageUpdate);
			if (Math.abs(obj.y - objNew.y) > 0.1) obj.y = lerp(obj.y, objNew.y, percentageUpdate);
		}
	});
	worldObjsOld.orbs.forEach((obj, id, map) => {
		var objNew = worldObjsUpdated.orbs.get(id);
		if (objNew != undefined) {
			if (Math.abs(obj.x - objNew.x) > 0.1) obj.x = lerp(obj.x, objNew.x, percentageUpdate);
			if (Math.abs(obj.y - objNew.y) > 0.1) obj.y = lerp(obj.y, objNew.y, percentageUpdate);
		}

		if (obj.trail != undefined) {
			obj.trail.update(obj.x, obj.y, 10, deltaTime);
		} else {
			obj.trail = new Trail(obj.x, obj.y, obj.color, 10, 5);
		}
	});
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
	//This is to avoid drawing accross the entire world and instead just a small portion
	var pattern = bCtx.createPattern(backGroundImage, 'repeat');
	bCtx.fillStyle = pattern;
	bCtx.translate(-amountGoBackX, -amountGoBackY);
	bCtx.fillRect(-backGroundImage.width, -backGroundImage.height,
		canvas.width + 2*backGroundImage.width, canvas.height + 2*backGroundImage.height);
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
		grd.addColorStop(0, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 1.0)');
		grd.addColorStop(1, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0)');
		bCtx.fillStyle = grd;
		bCtx.globalCompositeOperation = "lighter";
		bCtx.fillRect(Math.floor(bullet.x - camera.x), Math.floor(bullet.y - camera.y), 2 * 5, 2 * 5);
	});
	worldObjsOld.orbs.forEach((elem, id, map) => {
		var grd = bCtx.createRadialGradient(Math.floor(elem.x - camera.x + 10), Math.floor(elem.y - camera.y + 10), 3, Math.floor(elem.x - camera.x + 10), Math.floor(elem.y - camera.y + 10), 10);
		let c = hexToRGB(elem.color);
		grd.addColorStop(0, 'rgba(255,255,255, 0.8)');
		grd.addColorStop(0.5, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0.5)');
		grd.addColorStop(1, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0.0)');
		bCtx.fillStyle = grd;
		bCtx.globalCompositeOperation = "lighter";
		bCtx.fillRect(Math.floor(elem.x - camera.x), Math.floor(elem.y - camera.y), 20, 20);

		//Render trail
		if (elem.trail != undefined) {
			elem.trail.render(bCtx);
		}
	});

	//Render powerups
	for (let i = 0; i < powerupObjs.length; i++) {
		displayPowerupObj(powerupObjs[i], bCtx);
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
}

function mainLoop(timestamp) {
	deltaTime = (timestamp - lastUpdateTime) / 1000;
	lastUpdateTime = timestamp;
	update();
	draw();
	requestAnimationFrame(mainLoop);
}

