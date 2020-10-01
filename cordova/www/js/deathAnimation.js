function deathAnimator(x, y, w, h, color) {
	this.timeAlive = 0;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = color;
	this.a = 1;

	this.left = Math.floor(Math.random() * h);
	this.top = Math.floor(Math.random() * w);
	this.right = Math.floor(Math.random() * h);
	this.bottom = Math.floor(Math.random() * w);
	this.middleX = Math.floor(Math.random() * w/2 + w/4);
	this.middleY = Math.floor(Math.random() * h/2 + h/4);

	this.dist = 0;
	this.update = function (deltaTime) {
		this.timeAlive += deltaTime;
		this.dist += deltaTime * 100;
		this.a -= deltaTime * 0.5;
		if (this.a < 0) this.a = 0;
	}
	this.draw = function (ctx) {
		let cX = Math.floor(this.x - camera.x);
		let cY = Math.floor(this.y - camera.y);

		//Top left
		let x = cX - this.dist;
		let y = cY - this.dist;
		ctx.beginPath();
		ctx.fillStyle = "rgba(0, 0, 0, " + this.a + " )";
		ctx.strokeStyle = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + this.a + ")";
		ctx.moveTo(x, y);
		ctx.lineTo(x + this.top, y);
		ctx.lineTo(x + this.middleX, y + this.middleY);
		ctx.lineTo(x, y + this.left);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		//Top right
		x = cX + this.w + this.dist;
		y = cY - this.dist;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + this.right);
		ctx.lineTo(x - (this.w - this.middleX), y + this.middleY);
		ctx.lineTo(x - (this.w - this.top), y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		//Bottom right
		x = cX + this.w + this.dist;
		y = cY + this.h + this.dist;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x - (this.w - this.bottom), y);
		ctx.lineTo(x - (this.w - this.middleX), y - (this.h - this.middleY));
		ctx.lineTo(x, y - (this.h - this.right));
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		//Bottom left
		x = cX - this.dist;
		y = cY + this.h + this.dist;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y - (this.h - this.left));
		ctx.lineTo(x + this.middleX, y - (this.h - this.middleY));
		ctx.lineTo(x + this.bottom, y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}