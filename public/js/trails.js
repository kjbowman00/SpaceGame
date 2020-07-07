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

	this.render = function (ctx, quality) {
		let x = this.x;
		let y = this.y;
		let r = this.radius;
		let c = this.color;
		if (quality == 1) {
			ctx.fillStyle = 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0.2)';
			ctx.beginPath();
			ctx.arc(Math.floor(x - camera.x), Math.floor(y - camera.y), Math.floor(r), 0, 2 * Math.PI);
			ctx.fill();
		} else {
			var grd = ctx.createRadialGradient(Math.floor(x - camera.x), Math.floor(y - camera.y), Math.floor(r / 25), Math.floor(x - camera.x), Math.floor(y - camera.y), Math.floor(r));
			let colorStr = makeStringyBoy(c);
			grd.addColorStop(0, colorStr);
			grd.addColorStop(1, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0)');
			ctx.fillStyle = grd;
			ctx.globalCompositeOperation = "lighter";
			ctx.fillRect(Math.floor(x - r - camera.x), Math.floor(y - r - camera.y), Math.floor(2 * r), Math.floor(2 * r));
		}
	}
}

function makeStringyBoy(c) {
	return 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + c.a + ')';
}

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

	this.render = function (ctx, quality) {
		for (let i = this.nodes.length - 1; i >= 0; i--) {
			let currentNode = this.nodes[i];
			currentNode.render(ctx, quality);
		}
	}

}





//ORB TRAILS
function _OrbTrailNode(x, y, startColor, startR) { // Each individual circle object
	this.x = x;
	this.y = y;
	this.startColor = startColor;
	this.color = startColor;
	this.startR = startR;
	this.radius = startR;
	this.timeAlive = 0.6;

	//Each trail object slowly decreases in size and opacity
	this.update = function (deltaTime) {
		this.timeAlive -= deltaTime;
	}

	this.render = function (ctx, quality, gradientCanvas) {
		let x = this.x;
		let y = this.y;
		let r = this.radius;
		let c = this.color;
		if (quality == 1) {
			ctx.fillStyle = 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0.2)';
			ctx.beginPath();
			ctx.arc(Math.floor(x - camera.x), Math.floor(y - camera.y), Math.floor(r), 0, 2 * Math.PI);
			ctx.fill();
		} else {
			ctx.drawImage(gradientCanvas, Math.floor(x - r - camera.x), Math.floor(y - r - camera.y));
		}
	}
}

function OrbTrail(x, y, color, maxRadius, spawnRate) {
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

	//Setup the gradient for drawing
	this.grdCanvas = document.createElement("canvas", Math.floor(maxRadius * 2), Math.floor(maxRadius * 2));
	let tempCtx = this.grdCanvas.getContext('2d');
	let grd = tempCtx.createRadialGradient(Math.floor(maxRadius), Math.floor(maxRadius), Math.floor(maxRadius / 25), Math.floor(maxRadius), Math.floor(maxRadius), Math.floor(maxRadius));
	this.color.a = 0.75;
	let c = this.color;
	let colorStr = makeStringyBoy(c);
	grd.addColorStop(0, colorStr);
	grd.addColorStop(1, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0)');
	tempCtx.fillStyle = grd;
	tempCtx.fillRect(0, 0, Math.floor(maxRadius * 2), Math.floor(maxRadius * 2));

	this.update = function (x, y, r, deltaTime) {
		this.x = x + r;
		this.y = y + r;
		this.spawnTimer += deltaTime;
		if (this.spawnTimer >= this.spawnTimeNeeded) { //Add new nodes if space exists
			this.spawnTimer = 0;
			let color = this.color;
			color.a = 0.8;
			let node = new _OrbTrailNode(this.x, this.y, { r: color.r, g: color.g, b: color.b, a: 0.8 }, this.maxRadius);
			this.nodes.push(node);
			NUM_NODDES++;
		}
		for (let i = this.nodes.length - 1; i >= 0; i--) {
			let currentNode = this.nodes[i];
			currentNode.update(deltaTime);
			if (currentNode.timeAlive <= 0) { //Remove when alpha gets too low
				this.nodes.splice(i, 1);
				NUM_NODDES--;
			}
		}
	}

	this.render = function (ctx, quality) {
		if (this.grd == null) {
		}
		for (let i = this.nodes.length - 1; i >= 0; i--) {
			let currentNode = this.nodes[i];
			currentNode.render(ctx, quality, this.grdCanvas);
		}
	}

}