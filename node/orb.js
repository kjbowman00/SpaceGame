var orbs = new Map();
var orbCounter = 0;
var worldObj;
var staticWorldObjs;

const ORB_WIDTH = 5;
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
		w: ORB_WIDTH, h: ORB_WIDTH
	};
	orbs.set(orbCounter, orb);
	orbCounter++;
}

function atPosition(orb) {
	if (orb.x - orb.xToGo > 4) return false;
	if (orb.y - orb.yToGo > 4) return false;
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

	for (let i = 0; i < 300; i++) {
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


exports.initializeOrbs = initializeOrbs;
exports.update = update;
exports.gather = gather;