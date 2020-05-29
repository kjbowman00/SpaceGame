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
		this.radius = lerp(this.radius, this.startR / 4, p);
		this.color.a = lerp(this.color.a, 0, p);
	}

	this.render = function(ctx) {
		let x = this.x;
		let y = this.y;
		let r = this.radius;
		let c = this.color;
		var grd = ctx.createRadialGradient(x-camera.x, y-camera.y, r/25, x-camera.x, y-camera.y, r);
		grd.addColorStop(0, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + c.a + ')');
		grd.addColorStop(1, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0)');
		ctx.fillStyle = grd;
		ctx.globalCompositeOperation = "lighter";
		ctx.fillRect(x - r - camera.x, y - r - camera.y, 2 * r, 2 * r);
	}
}

function Trail(x, y, color, maxRadius, spawnRate) {
	this.nodes = [];
	this.spawnTimeNeeded = 1 / spawnRate;
	this.spawnTimer = 0;
	this.x = x;
	this.y = y;
	this.maxRadius = maxRadius;
	this.color = hexToRGB(color);

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
		}
		for (let i = this.nodes.length - 1; i >= 0; i--) {
			let currentNode = this.nodes[i];
			currentNode.update(deltaTime);
			if (currentNode.color.a <= 0.25) { //Remove when alpha gets too low
				this.nodes.splice(i, 1);
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