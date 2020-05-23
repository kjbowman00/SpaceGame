var staticWorldObjs = [
	{ x: -3100, y: -3000, w: 100, h: 6000 }, //BORDER PIECES - left
	{ x: -3000 , y: -3100, w: 6000, h: 100 }, // top
	{ x: 3000, y: -3000, w: 100, h: 6000 }, //right
	{ x: -3000, y: 3000, w: 6000, h: 100 }, // bottom

	//Middle area boxes
	{ x: -1500, y: -1500, w: 750, h: 100 }, //Top left section
	{ x: -1500, y: -1500, w: 100, h: 750 },
	{ x: 750, y: -1500, w: 750, h: 100 }, //Top right section
	{ x: 1400, y: -1500, w: 100, h: 750 },
	{ x: -1500, y: 750, w: 100, h: 750 }, //bottom left section
	{ x: -1500, y: 1400, w: 750, h: 100 },
	{ x: 750, y: 1400, w: 750, h: 100 }, //Bottom right
	{ x: 1400, y: 750, w: 100, h: 750 },

	//Middle area crosshair
	{ x: -1500, y: -50, w: 1000, h: 100 }, //left
	{ x: -50, y: -1500, w: 100, h: 1000 }, // top
	{ x: 500, y: -50, w: 1000, h: 100 }, //right
	{ x: -50, y: 500, w: 100, h: 1000 }, //bottom
];

/*function generateRandomBoxes() {
	const topStart = 
	for (let i = 0; i < 50; i++) {
		let side = Math.floor(Math.random() * 4);
		if (side == 0) {
			//Top side
		}
		if (side == 1) {
			//RIght side
		}
		if (side == 2) {
			//Bottom side
		}
		if (side == 3) {
			//Left Side
		}
	}
}*/

exports.staticWorldObjs = staticWorldObjs;