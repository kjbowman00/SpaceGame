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

function Tree() {
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

var tree;