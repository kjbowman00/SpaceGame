let loopID;
var gameRunning = false;
function gameStart() {
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