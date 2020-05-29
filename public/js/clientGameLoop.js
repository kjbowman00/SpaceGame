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

var serverPlayerState = { x: 0, y: 0, xVel: 0, yVel: 0 };
var lastInput = { xVel: 0, yVel: 0 };
var lastInputTime = performance.now();

var lastUpdateTime = 0;

var trailTimer = 0;

var player = {
	x: 0, y: 0, w: 50, h: 50, oldX: 0, oldY: 0, xVel: 0, yVel: 0, name: "None", health: 100,
	gun: { w: 50, h: 10, rotation: 0 }
};
var playerSpeed = 250;
var playerFireTimer = 0;
const playerFireTimeNeeded = 0.1;

const fadeTime = 0.5; //Amount in seconds to fade screen on death
var fadeTimer = 0;

function lerp(n1, n2, amt) {
	if (n2 - n1 == 0) return n1;
	return (n2-n1) * amt + n1;
}

function update() {
	if (alive && player.health <= 0) died();
	updateCamera();
	var deltaServer = (performance.now() - lastInputTime) / 1000;

	if (alive) {
		player.oldX = player.x;
		player.oldY = player.y;
		//Update player position
		player.x += deltaTime * xDir * playerSpeed;
		player.y += deltaTime * yDir * playerSpeed;

		//Lerp to predicted server state
		var predictX = serverPlayerState.x + lastInput.xVel * deltaServer;
		var predictY = serverPlayerState.y + lastInput.yVel * deltaServer;

		if (Math.abs(player.x - predictX) > 2) player.x = lerp(player.x, predictX, 0.2);
		if (Math.abs(player.y - predictY) > 2) player.y = lerp(player.y, predictY, 0.2);

		//Check collision detection
		updateCollisions()

		//Update gun rotation
		let centerX = Math.round(player.x) - camera.x + player.w / 2;
		let centerY = Math.round(player.y) - camera.y + player.h / 2;
		player.gun.rotation = Math.atan2(Mouse.cameraY - centerY, Mouse.cameraX - centerX);

		//Fire gun
		playerFireTimer += deltaTime;
		if (Mouse.pressed && playerFireTimer >= playerFireTimeNeeded) {
			playerFireTimer = 0;
			sendBullet();
			Sounds.playLaser();
		}

		if (player.trail != undefined) {
			player.trail.update(player.x, player.y, player.w/2, deltaTime);
		} else {
			player.trail = new Trail(player.x, player.y, player.color, 25, 30);
			console.log("WAHOOO!");
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
			obj.trail.update(obj.x, obj.y, deltaTime);
		} else {
			obj.trail = new Trail(obj.x, obj.y, obj.color, 5, 20);
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
	});
}

function draw() {
	var ctx = canvas.getContext('2d');
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
		ctx.fillRect(0, 0, -camera.x - world.width/2, canvas.height);
	}
	if (camera.y < -world.height / 2) { // Fill top
		ctx.fillRect(0, 0, canvas.width, -camera.y - world.height / 2);
	}
	if (camera.x + canvas.width > world.width / 2) { // Fill right
		ctx.fillRect(world.width/2 - camera.x, 0, -camera.x + world.width / 2, canvas.height);
	}
	if (camera.y + canvas.height > world.height / 2) { // Fill bottom
		ctx.fillRect(0, world.height / 2 - camera.y, canvas.width, -camera.y + world.height);
	}
	

	//Draw world objects where the camera is
	for (var i in world.staticWorldObjs) {
		item = world.staticWorldObjs[i];
		ctx.fillRect(item.x - camera.x, item.y - camera.y, item.w, item.h);
	}

	if (alive) {
		drawPlayer(player, ctx, bCtx);
	}

	//Draw world objects (other players, bullets)
	ctx.fillStyle = "#FF0000";
	worldObjsOld.players.forEach((elem, id, map) => {
		drawPlayer(elem, ctx, bCtx);
	});
	ctx.fillStyle = "#FF0000";
	worldObjsOld.bullets.forEach((bullet, id, map) => {
		var grd = bCtx.createRadialGradient(bullet.x - camera.x + 5, bullet.y - camera.y + 5, 1, bullet.x - camera.x + 5, bullet.y - camera.y + 5, 7);
		let c = hexToRGB(bullet.color);
		grd.addColorStop(0, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 1.0)');
		grd.addColorStop(1, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0)');
		bCtx.fillStyle = grd;
		bCtx.globalCompositeOperation = "lighter";
		bCtx.fillRect(bullet.x - camera.x, bullet.y - camera.y, 2 * 5, 2 * 5);
	});
	worldObjsOld.orbs.forEach((elem, id, map) => {
		var grd = bCtx.createRadialGradient(elem.x - camera.x + 5, elem.y - camera.y + 5, 2, elem.x - camera.x + 5, elem.y - camera.y + 5, 5);
		let c = hexToRGB(elem.color);
		grd.addColorStop(0, 'rgba(255,255,255, 0.8)');
		grd.addColorStop(0.5, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0.5)');
		grd.addColorStop(1, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0.0)');
		bCtx.fillStyle = grd;
		bCtx.globalCompositeOperation = "lighter";
		bCtx.fillRect(elem.x - camera.x, elem.y - camera.y, 10, 10);

		//Render trail
		if (elem.trail != undefined) {
			elem.trail.render(bCtx);
		}
	});

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

