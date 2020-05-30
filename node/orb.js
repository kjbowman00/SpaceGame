var orbs = new Map();
var orbCounter = 0;
var worldObj;
var staticWorldObjs;

const ORB_WIDTH = 6;
const ORB_CAPACITY = 1000;

function update(deltaTime) {
	//Add new orbs if not at capacity

	//Update orbs positions
	orbs.forEach((orb, id, map) => {
		updateOrb(orb, deltaTime);
	});
	//Gravitate towards nearby players (Sounds expensive, maybe don't do this)
}

function addOrb() {
	//Get random position
	let position = getRandomSpawn();
	//Add the orb to the list
	let orb = {
		x: position.x, y: position.y,
		startX: position.x, startY: position.y,
		xToGo: position.x, yToGo: position.y,
		w: ORB_WIDTH, h: ORB_WIDTH,
		color: getColor()
	};
	orbs.set(orbCounter, orb);
	orbCounter++;
}

function atPosition(orb) {
	if (Math.abs(orb.x - orb.xToGo) > 2) return false;
	if (Math.abs(orb.y - orb.yToGo) > 2) return false;
	return true;
}

function lerp(n1, n2, amt) {
	if (n2 - n1 == 0) return n1;
	return (n2 - n1) * amt + n1;
}

function updateOrb(orb, deltaTime) {
	if (atPosition(orb)) { // Get new position for orb
		let xD = Math.random() * 50 - 5;
		let yD = Math.random() * 50 - 5;

		orb.xToGo = orb.startX + xD;
		orb.yToGo = orb.startY + yD;
	} else { // Keep moving towards current position
		orb.x = lerp(orb.x, orb.xToGo, 1.5 * deltaTime);
		orb.y = lerp(orb.y, orb.yToGo, 1.5 * deltaTime);
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

function getRandomSpawn() {
	let position = { x: 0, y: 0, w: ORB_WIDTH, h: ORB_WIDTH };
	position.x = Math.random() * worldObj.width - worldObj.width/2;
	position.y = Math.random() * worldObj.height - worldObj.height/2;

	for (let i = 0; i < staticWorldObjs.length; i++) {
		let obj = staticWorldObjs[i];
		if (doesCollide(obj, position)) {
			return getRandomSpawn();
		}
	}
	return position;
}

function initializeOrbs(worldObj2, staticWorldObjs2) {
	worldObj = worldObj2;
	staticWorldObjs = staticWorldObjs2;

	for (let i = 0; i < 500; i++) {
		addOrb();
	}
}

function gather(player, DIST_NEEDED) {
	let orbsToSend = new Map();
	orbs.forEach((orb, id, map) => {
		let distSq = (player.x - orb.x) * (player.x - orb.x);
		distSq += (player.y - orb.y) * (player.y - orb.y);
		if (distSq <= DIST_NEEDED) {
			orbsToSend.set(id, orb);
		}
	});
	return orbsToSend;
}

const colorPalette = [
	["#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#9900ff", "#ff00ff"],
	["#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
	["#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
	["#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
];
function getColor() {
	let j = Math.floor(Math.random() * 8);
	let i = Math.floor(Math.random() * 4);
	return colorPalette[i][j];
}

function moveToNewState(oldState, newState) {

}


exports.initializeOrbs = initializeOrbs;
exports.update = update;
exports.gather = gather;
orbs.moveToNewState = moveToNewState;