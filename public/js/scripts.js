/*jshint esversion: 6 */
var deltaTime = 0; //In seconds

const SERVER_WORLD_UPDATE_TIME = 1 / 60;

var worldObjsOld = new Map();
var worldObjsUpdated = new Map();

var serverPlayerState = { x: 0, y: 0, xVel: 0, yVel: 0 };
var lastInput = { xVel: 0, yVel: 0 };
var lastInputTime = performance.now();

var lastUpdateTime = 0;

var xPrevious = 0;
var yPrevious = 0;
var xPR = 0;
var yPR = 0;
var xP = 0;
var yP = 0;
var velocity = 100;

function lerp(n1, n2, amt) {
	return (n2-n1) * amt + n1;
}

function inBounds(inner, area) {
	if (inner.x + inner.w >= area.x && inner.x <= area.x + area.w) {
		if (inner.y + inner.h >= area.y && inner.y <= area.y + area.h) {
			return true;
		} else return false;
	} else return false;
}

var oldX = 0;
var oldY = 0;
function update() {
	camera.x = lerp(camera.x, xP + 50 - camera.w/2, 0.05);
	camera.y = lerp(camera.y, yP + 50 - camera.h/2, 0.05);
	//camera.y = yP + 50 - camera.h/2;

	//Lerp to predicted server state
	var deltaServer = (performance.now() - lastInputTime) / 1000;
	var predictX = serverPlayerState.x + lastInput.xVel * deltaServer;
	var predictY = serverPlayerState.y + lastInput.yVel * deltaServer;

	xP = lerp(xP, predictX, 0.1);
	yP = lerp(yP, predictY, 0.1);

	//Update player position
	xPrevious = xP;
	yPrevious = yP;
	xP += deltaTime*xDir*velocity;
	yP += deltaTime * yDir * velocity;

	//Update other player objects
	var percentageUpdate = deltaServer / SERVER_WORLD_UPDATE_TIME;
	worldObjsOld.forEach((obj, id, map) => {
		var objNew = worldObjsUpdated.get(id);
		if (objNew != undefined) {
			obj.x = lerp(obj.x, objNew.x, percentageUpdate);
			obj.y = lerp(obj.y, objNew.y, percentageUpdate);
		}
	});
}

function draw() {
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = "#000000";
	//Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//Draw world objects where the camera is
	for (var i in world.things) {
		item = world.things[i];
		ctx.fillRect(item.x - camera.x, item.y - camera.y, item.w, item.h);
	}

	//Round xP and yP
	xPR = Math.round(xP);
	yPR = Math.round(yP);
	ctx.fillRect(xPR - camera.x, yPR - camera.y, 50, 50);


	//Draw world objects
	ctx.fillStyle = "#FF0000";
	worldObjsOld.forEach((elem, id, map) => {
		ctx.fillRect(elem.x - camera.x, elem.y - camera.y, 50, 50);
	});
}

function mainLoop(timestamp) {
	deltaTime = (timestamp - lastUpdateTime) / 1000;
	lastUpdateTime = timestamp;
	update();
	draw();
	requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);

