var menuDeltaTime;
var menuLastUpdateTime = 0;
var menuLoopID;
var mainMenuCanvas = document.getElementById("main_menu_canvas");
mainMenuCanvas.width = window.innerWidth;
mainMenuCanvas.height = window.innerHeight;

let backgroundImageRepeater = new Image(150, 150);
backgroundImageRepeater.src = 'images/honeycomb.png';

let colorChoices = ["#ff0000", "#00ff00", "#0000ff", "#ff8800", "#ffff00", "#8800ff"];
let fakeOrbs = [];
let fakePlayers = [];
for (let i = 0; i < 25; i++) {
	let orb = {};
	orb.x = Math.random() * mainMenuCanvas.width;
	orb.y = Math.random() * mainMenuCanvas.height;
	orb.sX = orb.x;
	orb.sY = orb.y;
	orb.tX = orb.sX + (Math.random() * 10 - 5);
	orb.tY = orb.sY + (Math.random() * 10 - 5);
	orb.color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
	orb.trail = null;
	fakeOrbs.push(orb);
}
for (let i = 0; i < 5; i++) {
	let fakeP = {};
	fakeP.x = Math.random() * mainMenuCanvas.width;
	fakeP.y = Math.random() * mainMenuCanvas.height;
	fakeP.tX = Math.random() * (mainMenuCanvas.width + 500) - 250;
	fakeP.tY = Math.random() * (mainMenuCanvas.height + 500) - 250;
	let dir = Math.atan2(fakeP.tY - fakeP.y, fakeP.tX - fakeP.x);
	fakeP.xVel = Math.cos(dir) * 150;
	fakeP.yVel = Math.sin(dir) * 150;
	fakeP.color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
	fakeP.rotation = Math.random() * 2 * Math.PI;
	fakeP.trail = null;
	fakePlayers.push(fakeP);
}

function atPosition(orb) {
	if (Math.abs(orb.x - orb.tX) > 2) return false;
	if (Math.abs(orb.y - orb.tY) > 2) return false;
	return true;
}

function lerp(n1, n2, amt) {
	if (n2 - n1 == 0) return n1;
	return (n2 - n1) * amt + n1;
}

function passedPosition(player) {
	if (player.xVel > 0) {
		if (player.x > player.tX) return true;
		return false;
	} else {
		if (player.x < player.tX) return true;
		return false;
	}
}

function updateFakePlayer(player, delta) {
	if (passedPosition(player)) {
		player.tX = Math.random() * (mainMenuCanvas.width + 500) - 250;
		player.tY = Math.random() * (mainMenuCanvas.height + 500) - 250;
		let dir = Math.atan2(player.tY - player.y, player.tX - player.x);
		player.xVel = Math.cos(dir) * 150;
		player.yVel = Math.sin(dir) * 150;
	} else {
		player.x += player.xVel * delta;
		player.y += player.yVel * delta;
	}
}

function updateOrb(orb, deltaTime) {
	if (atPosition(orb)) { // Get new position for orb
		let xD = Math.random() * 50 - 5;
		let yD = Math.random() * 50 - 5;

		orb.tX = orb.sX + xD;
		orb.tY = orb.sY + yD;
	} else { // Keep moving towards current position
		orb.x = lerp(orb.x, orb.tX, 1.5 * deltaTime);
		orb.y = lerp(orb.y, orb.tY, 1.5 * deltaTime);
	}
}

function menuUpdate() {
	//Move fake players
	for (let i = 0; i < fakePlayers.length; i++) {
		let cP = fakePlayers[i];
		updateFakePlayer(cP, menuDeltaTime);

		if (cP.trail == null && typeof Trail == 'function') {
			cP.trail = new Trail(cP.x, cP.y, cP.color, 25, 15);
		}

		if (cP.trail != null) {
			cP.trail.update(cP.x, cP.y, 25, menuDeltaTime);
		} 
	}

	//Move fake orbs
	for (let i = 0; i < fakeOrbs.length; i++) {
		let orb = fakeOrbs[i];
		if (orb.trail == null && typeof Trail == 'function') {
			orb.trail = new Trail(orb.x, orb.y, orb.color, 10, 4);
		}

		if (orb.trail != null) {
			orb.trail.update(orb.x, orb.y, 10, menuDeltaTime);
		} 

		updateOrb(orb, menuDeltaTime);
	}

}

function menuDraw() {
	let ctx = mainMenuCanvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Draw background
	ctx.globalCompositeOperation = "source-over";
	var ptrn = ctx.createPattern(backgroundImageRepeater, 'repeat'); // Create a pattern with this image, and set it to "repeat".
	ctx.fillStyle = ptrn;

	ctx.fillRect(0, 0, mainMenuCanvas.width, mainMenuCanvas.height);

	//Draw orbs
	for (let i = 0; i < fakeOrbs.length; i++) {
		let elem = fakeOrbs[i];
		//Render trail
		if (OPTIONS.orbTrailQuality > 0 && elem.trail != undefined) {
			elem.trail.render(ctx, OPTIONS.orbTrailQuality);
		}
		var grd = ctx.createRadialGradient(Math.floor(elem.x + 10), Math.floor(elem.y + 10), 3, Math.floor(elem.x + 10), Math.floor(elem.y + 10), 10);
		let c = hexToRGB(elem.color);
		grd.addColorStop(0, 'rgba(255,255,255, 0.8)');
		grd.addColorStop(0.5, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0.5)');
		grd.addColorStop(1, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0.0)');
		ctx.fillStyle = grd;
		ctx.globalCompositeOperation = "lighter";
		ctx.fillRect(Math.floor(elem.x), Math.floor(elem.y), 20, 20);
	}

	//Draw players
	for (let i = 0; i < fakePlayers.length; i++) {
		let fakeP = fakePlayers[i];

		//Render trail
		if (OPTIONS.playerTrailQuality > 0 && fakeP.trail != undefined) {
			fakeP.trail.render(ctx, OPTIONS.playerTrailQuality);
		}

		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = fakeP.color;
		ctx.fillRect(Math.floor(fakeP.x), Math.floor(fakeP.y), 50, 50);
		ctx.fillStyle = "#000000";
		let borderThickness = 2;
		ctx.fillRect(Math.floor(fakeP.x + borderThickness), Math.floor(fakeP.y + borderThickness), 50 - borderThickness * 2, 50 - borderThickness * 2);

		let centerX = Math.floor(fakeP.x +25);
		let centerY = Math.floor(fakeP.y + 25);
		let xGun = centerX;
		let yGun = centerY - 5;
		ctx.fillStyle = fakeP.color;
		ctx.translate(centerX, centerY);
		ctx.rotate(fakeP.rotation);
		ctx.translate(-centerX, -centerY);
		ctx.fillRect(xGun, yGun, 50, 10);
		ctx.fillStyle = "#000000";
		let gunBorderThickness = 2;
		ctx.fillRect(xGun + gunBorderThickness, yGun + gunBorderThickness, 50 - gunBorderThickness * 2, 10 - gunBorderThickness * 2);
		ctx.resetTransform();

	}
}

function menuLoop(timestamp) {
	menuDeltaTime = (timestamp - menuLastUpdateTime) / 1000;
	menuLastUpdateTime = timestamp;
	menuUpdate();
	menuDraw();
	menuLoopID = requestAnimationFrame(menuLoop);
}

menuLoopID = requestAnimationFrame(menuLoop);
