//Assemble tree function

//Search tree
//Searching for collisions

function Node() {
	this.box = null;
	this.x = null;
	this.y = null;
	this.left = null;
	this.right = null;
}

function sortByX(a, b) {
	return a.x - b.x;
}
function sortByY(a, b) {
	return a.y - b.y;
}


function makeTreeFromPoints(points, xSort) {
	if (points.length == 1) {
		return points[0];
	}
	let node = new Node();

	//Sort
	if (xSort) {
		points.sort(sortByX)
	}
	else {
		points.sort(sortByY);
	}

	let i = 0;
	//Find median point
	if (points.length % 2 == 0) {
		i = points.length / 2 - 1;
	} else {
		i = points.length / 2;
	}

	node.x = xSort[i].x;
	node.y = xSort[i].y;
	node.left = makeTreeFromPoints(points.slice(0, i + 1), !xSort);
	node.right = makeTreeFromPoints(points.slice(i + 1, points.length), !xSort);
	return node;
}

function _getClosest(point, tree, checkX) {
	if (tree.box != null) return tree.box;
	if (checkX) {
		if (point.x <= tree.x) {
			return _getClosest(point, tree.left, !checkX);
		} else return _getClosest(point, tree.right, !checkX);
	} else {
		if (point.y <= tree.x) {
			return _getClosest(point, tree.left, !checkX);
		} else return _getClosest(point, tree.right, !checkX);
	}
}

function getClosest(point, tree) {
	return _getClosest(point, tree, true);
}

function makeTreeFromWorld(world) {
	let points = [];
	for (let i = world.length; i >= 0; i--) {
		let item = world[i];
		let p1 = new Node();
		p1.x = item.x;
		p1.y = item.y;
		p1.box = item;
		let p2 = new Node();
		p2.x = item.x + item.w;
		p2.y = item.y;
		p2.box = item;
		let p3 = new Node();
		p3.x = item.x;
		p3.y = item.y + item.h;
		p3.box = item;
		let p4 = new Node();
		p4.x = item.x + item.w;
		p4.y = item.y + item.h;
		p4.box = item;

		//Push a point for each corner
		points.push(p1);
		points.push(p2);
		points.push(p3);
		points.push(p4);
	}
	return makeTreeFromPoints(points, true);
}

exports.getClosest = getClosest;
exports.makeTreeFromWorld = makeTreeFromWorld;