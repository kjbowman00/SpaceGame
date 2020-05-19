let loopID;
var gameRunning = false;
function gameStart() {
	alive = true;
	//Turn on canvas
	document.getElementById('canvas_holder').style.display = 'block';
	//Enable animation frame updating
	gameRunning = true;
	loopID = requestAnimationFrame(mainLoop);
	resizeCanvas();
}

function toMenu() {
	//Disable animation frame updating
	cancelAnimationFrame(loopID);
	//Turn off canvas
	gameRunning = false;
	document.getElementById('canvas_holder').style.display = 'none';
}

function died() {
	alive = false; //This will change the game loop to draw a gray overlay and stop allowing player updates

	//Pop up with play again and back to menu buttons
}