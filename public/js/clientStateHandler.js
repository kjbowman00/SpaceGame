let loopID;
function gameStart() {
	//Turn on canvas
	document.getElementById('canvas_holder').style.display = 'block';
	//Enable animation frame updating
	loopID = requestAnimationFrame(mainLoop);
}

function toMenu() {
	//Disable animation frame updating
	cancelAnimationFrame(loopID);
	//Turn off canvas
	document.getElementById('canvas_holder').style.display = 'none';
}