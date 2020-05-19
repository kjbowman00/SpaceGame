/*jshint esversion: 6 */
var deltaTime = 0; //In seconds

var alive = false;

const SERVER_WORLD_UPDATE_TIME = 1 / 20;

var worldObjsOld = {};
worldObjsOld.players = new Map();
worldObjsOld.bullets = new Map();
var worldObjsUpdated = {};
worldObjsUpdated.players = new Map();
worldObjsUpdated.bullets = new Map();

var serverPlayerState = { x: 0, y: 0, xVel: 0, yVel: 0 };
var lastInput = { xVel: 0, yVel: 0 };
var lastInputTime = performance.now();

var lastUpdateTime = 0;

var trailTimer = 0;

var playerGun = { w: 50, h: 10, rotation: 0 };
var player = { x: 0, y: 0, w: 50, h: 50, oldX: 0, oldY: 0, xVel: 0, yVel: 0, name:"None", health:100};
var playerSpeed = 100;
var playerFireTimer = 0;
const playerFireTimeNeeded = 0.3;

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
		//Update player position
		player.x += deltaTime * xDir * playerSpeed;
		player.y += deltaTime * yDir * playerSpeed;

		//Check collision detection
		updateCollisions()

		//Lerp to predicted server state
		var predictX = serverPlayerState.x + lastInput.xVel * deltaServer;
		var predictY = serverPlayerState.y + lastInput.yVel * deltaServer;

		if (Math.abs(player.x - predictX) > 5) player.x = lerp(player.x, predictX, 0.2);
		if (Math.abs(player.y - predictY) > 5) player.y = lerp(player.y, predictY, 0.2);
		player.oldX = player.x;
		player.oldY = player.y;

		//Update gun rotation

		//Fire gun
		playerFireTimer += deltaTime;
		if (Mouse.pressed && playerFireTimer >= playerFireTimeNeeded) {
			playerFireTimer = 0;
			sendBullet();
		}
	} //END IF ALIVE


	//Update other player objects
	var percentageUpdate = deltaServer / SERVER_WORLD_UPDATE_TIME;
	worldObjsOld.players.forEach((obj, id, map) => {
		var objNew = worldObjsUpdated.players.get(id);
		if (objNew != undefined) {
			if (Math.abs(obj.x - objNew.x) > 0.1) obj.x = lerp(obj.x, objNew.x, percentageUpdate);
			if (Math.abs(obj.y - objNew.y) > 0.1) obj.y = lerp(obj.y, objNew.y, percentageUpdate);
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
	

	//Draw world objects where the camera is
	for (var i in world.staticWorldObjs) {
		item = world.staticWorldObjs[i];
		ctx.fillRect(item.x - camera.x, item.y - camera.y, item.w, item.h);
	}

	if (alive) {
		//Round player.x and yP
		let xRound = Math.round(player.x);
		let yRound = Math.round(player.y);
		ctx.fillRect(xRound - camera.x, yRound - camera.y, 50, 50);
		//Draw player gun
		let centerX = xRound - camera.x + player.w / 2;
		let centerY = yRound - camera.y + player.h / 2;
		let xGun = centerX;
		let yGun = centerY - playerGun.h / 2;
		playerGun.rotation = Math.atan2(Mouse.cameraY - centerY, Mouse.cameraX - centerX);
		ctx.fillStyle = "red";
		ctx.translate(centerX, centerY);
		ctx.rotate(playerGun.rotation);
		ctx.translate(-centerX, -centerY);
		ctx.fillRect(xGun, yGun, playerGun.w, playerGun.h);
		ctx.resetTransform();

		//Draw player info box
		drawPlayerInfo(player, ctx);
	}


	//Draw world objects (other players, bullets)
	ctx.fillStyle = "#FF0000";
	worldObjsOld.players.forEach((elem, id, map) => {
		let drawX = elem.x - camera.x;
		let drawY = elem.y - camera.y;
		ctx.fillRect(drawX, drawY, elem.w, elem.h);
		drawPlayerInfo(elem, ctx);
	});
	ctx.fillStyle = "#FF0000";
	worldObjsOld.bullets.forEach((bullet, id, map) => {
		ctx.fillRect(bullet.x - camera.x, bullet.y - camera.y, 10, 10);
	});

	//Add trail objects
	trailTimer += deltaTime;
	if (trailTimer > 0.05) {
		trailTimer = 0;
		worldObjsOld.players.forEach((item, id, map) => {
			Trails.addTrail(item.x + 50 / 2, item.y + 50 / 2, { r: 84, g: 68, b: 255, a: 100 }, 50 / 2);
		});
		if (alive) Trails.addTrail(player.x + 50 / 2, player.y + 50 / 2, { r: 84, g: 68, b: 255, a: 100 }, 50 / 2);
	}
	//Render trails
	Trails.updateAndRender(deltaTime, bCtx);

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

