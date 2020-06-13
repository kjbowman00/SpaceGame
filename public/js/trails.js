var TEST = true;
var NUM_TRAILS = 0;
var NUM_NODDES = 0;

function _TrailNode(x, y, startColor, startR) { // Each individual circle object
	this.x = x;
	this.y = y;
	this.startColor = startColor;
	this.color = startColor;
	this.startR = startR;
	this.radius = startR;

	//Each trail object slowly decreases in size and opacity
	this.update = function(deltaTime) {
		let p = deltaTime / 1; // Divide by num seconds to get rid of thing
		this.radius = lerp(this.radius, this.startR / 2, p);
		this.color.a = lerp(this.color.a, 0, p);
	}

	this.render = function(ctx) {
		let x = this.x;
		let y = this.y;
		let r = this.radius;
		let c = this.color;
		var grd = ctx.createRadialGradient(Math.floor(x - camera.x), Math.floor(y - camera.y), Math.floor(r / 25), Math.floor(x - camera.x), Math.floor(y - camera.y), Math.floor(r));
		let colorStr = makeStringyBoy(c);
		grd.addColorStop(0, colorStr);
		grd.addColorStop(1, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0)');
		ctx.fillStyle = grd;
		ctx.globalCompositeOperation = "lighter";
		ctx.fillRect(Math.floor(x - r - camera.x), Math.floor(y - r - camera.y), Math.floor(2 * r), Math.floor(2 * r));
	}
}

function makeStringyBoy(c) {
	return 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + c.a + ')';
}

/*function _BasicTrailNode(x, y, startColor, startR) { // Each individual circle object
	this.x = x;
	this.y = y;
	this.startColor = startColor;
	this.color = startColor;
	this.startR = startR;
	this.radius = startR;

	function clamp(num, min, max) {
		if (num < min) return min;
		if (num > max) return max;
		else return num;
	}

	//Each trail object slowly decreases in size and opacity
	this.update = function (deltaTime) {
		let p = deltaTime / 1; // Divide by num seconds to get rid of thing
		this.radius = lerp(this.radius, this.startR / 2, p);
		this.radius = clamp(this.radius, 0, this.startR);
		this.color.a = lerp(this.color.a, 0, p);
		this.color.a = clamp(this.color.a, 0, 1.0);
	}

	this.render = function (ctx) {
		let x = this.x;
		let y = this.y;
		let r = this.radius;
		let c = this.color;
		ctx.fillStyle = 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + c.a + ')';
		ctx.globalCompositeOperation = "lighter";
		ctx.fillRect(x - camera.x, y - camera.y, r*2, r*2);
	}
}*/

function Trail(x, y, color, maxRadius, spawnRate) {
	NUM_TRAILS++;
	this.nodes = [];
	this.spawnTimeNeeded = 1 / spawnRate;
	this.spawnTimer = 0;
	this.x = x;
	this.y = y;
	this.maxRadius = maxRadius;
	if (typeof color === 'string' || color instanceof String) {
		this.color = hexToRGB(color);
	}
	else {
		this.color = { r: color.r, g: color.g, b: color.b, a: 0.8 };
	}

	this.update = function (x, y, r, deltaTime) {
		this.x = x + r;
		this.y = y + r;
		this.spawnTimer += deltaTime;
		if (this.spawnTimer >= this.spawnTimeNeeded) { //Add new nodes if space exists
			this.spawnTimer = 0;
			let color = this.color;
			color.a = 0.8;
			let node = new _TrailNode(this.x, this.y, { r: color.r, g: color.g, b: color.b, a: 0.8 }, this.maxRadius);
			this.nodes.push(node);
			NUM_NODDES++;
		}
		for (let i = this.nodes.length - 1; i >= 0; i--) {
			let currentNode = this.nodes[i];
			currentNode.update(deltaTime);
			if (currentNode.color.a <= 0.4) { //Remove when alpha gets too low
				this.nodes.splice(i, 1);
				NUM_NODDES--;
			}
		}
	}

	this.render = function (ctx) {
		for (let i = this.nodes.length - 1; i >= 0; i--) {
			let currentNode = this.nodes[i];
			currentNode.render(ctx);
		}
	}

}