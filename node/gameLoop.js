const tickLengthMs = 1000 / 20;
const outputTickLengthMs = 1000 / 20;
var previousTick = Date.now();
var previousOutputTick = Date.now();
var io;

var world = require('./world.js');

var start = Date.now();

var loop = function () {
	var now = Date.now();

	//Has tickLength in ms passed since last update?
	if (previousTick + tickLengthMs <= now) {
		var deltaTime = (now - previousTick) / 1000; // Number of seconds since last update
		previousTick = now;

		//Update
		world.update(deltaTime, io);
	}

	if (previousOutputTick + outputTickLengthMs <= now) {
		previousOutputTick = now;
		world.sendUpdates(io);
	}

	//Determine whether to immediately loop again or wait a bit
	//16 is the variability in setTimeout in ms
	if (now - previousTick < tickLengthMs - 16) {
		setTimeout(loop);
	} else {
		setImmediate(loop);
	}
};

var getStarted = function (ioObject) {
	io = ioObject;
	loop();
};
exports.world = world;
exports.getStarted = getStarted;