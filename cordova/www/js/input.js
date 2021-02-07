
function getXDir() {
	if (firstTouch == null) return 0;

	let dx = firstTouch.currentX - firstTouch.startX;
	let maxDx = window.innerHeight / 5; //1/4th of the screen height
	let percentage = dx / maxDx;
	if (percentage > 1) percentage = 1;
	if (percentage < -1) percentage = -1;
	return percentage;
}
function getYDir() {
	if (firstTouch == null) return 0;

	let dy = firstTouch.currentY - firstTouch.startY;
	let maxDy = window.innerHeight / 5; //1/4th of the screen height
	let percentage = dy / maxDy;
	if (percentage > 1) percentage = 1;
	if (percentage < -1) percentage = -1;
	return percentage;
}

//EX: {identifier: 0, startX, startY, currentX, currentY}
var firstTouch = null;
var secondTouch = null;

function handleStart(e) {
	let touchList = e.changedTouches;
	for (let i = 0; i < touchList.length; i++) {
		let touch = touchList.item(i);

		//Check buttons
		//   if in button, kill the current touch

		//If first touch null, make this first touch
		//Store the position as the center of the joystick
		if (firstTouch == null) {
			let touch = e.changedTouches.item(0);
			firstTouch = {
				identifier: touch.identifier, startX: touch.screenX, startY: touch.screenY,
				currentX: touch.screenX, currentY: touch.screenY
			};
		}
		//Else, if second touch null, make this second touch
		//Store the center of this joystick too
		//Begin firing
		else if (secondTouch == null) {
			let touch = e.changedTouches.item(0);
			secondTouch = {
				identifier: touch.identifier, startX: touch.screenX, startY: touch.screenY,
				currentX: touch.screenX, currentY: touch.screenY
			};
		}
	}
}

function handleEnd(e) {
	let touchList = e.changedTouches;
	//Remove any matching touches
	for (let i = 0; i < touchList.length; i++) {
		let touch = touchList.item(i);
		if (firstTouch != null && firstTouch.identifier == touch.identifier) {
			firstTouch = null;
		}
		else if (secondTouch != null && secondTouch.identifier == touch.identifier) {
			secondTouch = null;
		}
	}
}

function handleCancel(e) {
	//Remove any matching touches
	let touchList = e.changedTouches;
	for (let i = 0; i < touchList.length; i++) {
		let touch = touchList.item(i);
		if (firstTouch != null && firstTouch.identifier == touch.identifier) {
			firstTouch = null;
		}
		else if (secondTouch != null && secondTouch.identifier == touch.identifier) {
			secondTouch = null;
		}
	}
}

function handleMove(e) {
	let touchList = e.changedTouches;
	for (let i = 0; i < touchList.length; i++) {
		let touch = touchList.item(i);
		//If first touch
		//   determine the xDir and yDir from this position relative to joystick center
		if (firstTouch != null && firstTouch.identifier == touch.identifier) {
			firstTouch.currentX = touch.screenX;
			firstTouch.currentY = touch.screenY;
		}

		//If second touch
		//   determine gun direction
		else if (secondTouch != null && secondTouch.identifier == touch.identifier) {
			secondTouch.currentX = touch.screenX;
			secondTouch.currentY = touch.screenY;
		}
	}
}

window.addEventListener("touchstart", handleStart, false);
window.addEventListener("touchend", handleEnd, false);
window.addEventListener("touchcancel", handleCancel, false);
window.addEventListener("touchmove", handleMove, false);

