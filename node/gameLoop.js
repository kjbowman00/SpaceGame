const tickLengthMs = 1000 / 60;
var previousTick = Date.now();
var io;

var world = require('./world.js');

var loop = function () {
	var now = Date.now();

	//Has tickLength in ms passed since last update?
	if (previousTick + tickLengthMs <= now) {
		var deltaTime = (now - previousTick) / 1000; // Number of seconds since last update
		previousTick = now;

		//Update
		var state = world.getState();
		io.sockets.emit('state', Array.from(state.values()));
	}

	//Determine whether to immediately loop again or wait a bit
	//16 is the variability in setTimeout in ms
	if (Date.now() - previousTick < tickLengthMs - 16) {
		setTimeout(loop);
	} else {
		setImmediate(loop);
	}
};

var getStarted = function (ioObject) {
	io = ioObject;
	loop();
};
exports.getStarted = getStarted;