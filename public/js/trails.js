function _Trails() {
	let trails = [];

	//Each trail object slowly decreases in size and opacity
	function updateTrail(trail, deltaTime) {
		let p = deltaTime / 1; // Divide by num seconds to get rid of thing
		trail.radius = lerp(trail.radius, trail.startR / 4, p);
		trail.color.a = lerp(trail.color.a, 0, p);
	}

	function renderTrail(trail, ctx) {
		let x = trail.x;
		let y = trail.y;
		let r = trail.radius;
		let c = trail.color;
		var grd = ctx.createRadialGradient(x-camera.x, y-camera.y, trail.radius/25, x-camera.x, y-camera.y, trail.radius);
		grd.addColorStop(0, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + c.a + ')');
		grd.addColorStop(1, 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 0)');
		ctx.fillStyle = grd;
		ctx.globalCompositeOperation = "lighter";
		ctx.fillRect(x - r - camera.x, y - r - camera.y, 2 * r, 2 * r);
	}

	function Trail(x, y, startColor, startR) {
		this.x = x;
		this.y = y;
		this.startColor = startColor;
		this.color = startColor;
		this.startR = startR;
		this.radius = startR;
	}

	this.addTrail = function (x, y, color, radius) {
		let trail = new Trail(x, y, color, radius);
		trails.push(trail);
	}

	this.updateAndRender = function (deltaTime, ctx) {
		//Update and
		//Remove elements after a certain alpha value
		//Render if not
		for (var i = trails.length - 1; i >= 0; i--) {
			updateTrail(trails[i], deltaTime);
			if (trails[i].color.a < 40) {
				trails.splice(i, 1);
			} else {
				renderTrail(trails[i], ctx);
			}
		}
	}
}
const Trails = new _Trails();