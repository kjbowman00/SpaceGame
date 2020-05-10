var tree2d = require('./tree2d.js');
var staticWorldObjs = require('./staticWorldObjs').staticWorldObjs;
var staticObjsTree = tree2d.makeTreeFromWorld(staticWorldObjs);

function handleStaticObjsCollision(players) {
	players.forEach((player) => {
		let bounds = player.bounds;
		let b1 = tree2d.getClosest(bounds.p1, staticObjsTree);
		let b2 = tree2d.getClosest(bounds.p2, staticObjsTree);
		let b3 = tree2d.getClosest(bounds.p3, staticObjsTree);
		let b4 = tree2d.getClosest(bounds.p4, staticObjsTree);
		let boxesToCheck = [b1, b2, b3, b4];
		for (let i = 0; i < 4; i++) {
			let currentBox = boxesToCheck[i];
			//Check for collision with this box
		}
	});
}