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
		world.update(deltaTime);

		//Update
		var state = world.getState();
		state.forEach((value, key, map) => {
			//Key is socketid. //value is player object
			//Need to grab each nearby object to this player
			var objectsToSend = [];
			state.forEach((value2, key2, map2) => {
				if (key != key2) {
					var distSq = (value.x - value2.x) * (value.x - value2.x);
					distSq += (value.y - value.y) * (value.y - value2.y);
					if (distSq <= 1000000) {
						objectsToSend.push(value2);
					}
				}
			});
			io.to(key).emit('state', { player: value, others: objectsToSend });
		});
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
exports.world = world;
exports.getStarted = getStarted;