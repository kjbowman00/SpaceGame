let loopID;
var gameRunning = false;
function gameStart() {
	alive = true;
	//Turn on canvas
	document.getElementById('canvas_holder').style.display = 'block';
	document.getElementById('main_menu').style.display = 'none';

	gameRunning = true;
	resizeCanvas();
	camera.x = player.x + 25 - camera.w / 2;
	camera.y = player.y + 25 - camera.h / 2;

	//Enable animation frame updating
	loopID = requestAnimationFrame(mainLoop);
}

function toMenu() {
	//Disable animation frame updating
	cancelAnimationFrame(loopID);
	//Turn off canvas
	gameRunning = false;
	document.getElementById('canvas_holder').style.display = 'none';
	document.getElementById('main_menu').style.display = 'block';
}

function died() {
	alive = false; //This will change the game loop to draw a gray overlay and stop allowing player updates

	//Pop up with play again and back to menu buttons
	document.getElementById("respawn_form_box").style.display = "block";
}

function respawnRequest() {
	socket.emit('player_respawn_request');
	console.log("Respawn request");
}

function respawnSuccess(pos) {
	//Reset player attributes
	player.x = pos.x;
	player.y = pos.y;
	player.oldX = pos.x;
	player.oldY = pos.y;
	player.health = 100;
	serverPlayerState.x = pos.x;
	serverPlayerState.y = pos.y;
	serverPlayerState.oldX = pos.x;
	serverPlayerState.oldY = pos.y;
	camera.x = player.x - camera.w / 2 + 25;
	camera.y = player.y - camera.h / 2 + 25;
	alive = true;

	//Hide respawn box
	document.getElementById("respawn_form_box").style.display = "none";
}

document.getElementById("respawn_form_box").children[0].onclick = respawnRequest;
document.getElementById("respawn_form_box").children[1].onclick = toMenu;