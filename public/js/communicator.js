/*jshint esversion: 6 */
var socket;

function onPlay() {
    var form = document.getElementById("name_form");
    console.log('play');
    document.getElementById('form_box').style.display = 'none';
	var formData = new FormData(form);
	socketStuff(formData);
	return false;
}

document.getElementById("name_form").onsubmit = onPlay;

function socketStuff(formData) {
	var gameName = formData.get('server');
	var path = '/' + gameName + '/socket.io';
    socket = io('/', {
        secure: true,
        rejectUnauthorized: false,
        path: path
    });

    socket.on('join_game_success', function (data) {
        //Data is static world objects
        world.staticWorldObjs = data;
        staticObjsTree = makeTreeFromWorld(world.staticWorldObjs);

        gameStart();
    });
    socket.on('state', function (data) {
        worldObjsOld = worldObjsUpdated;

        worldObjsUpdated = {};
        worldObjsUpdated.players = new Map(data.objects.players);
        worldObjsUpdated.bullets = new Map(data.objects.bullets);

        serverPlayerState = data.player;
        lastInput.xVel = 10 * xDir;
        lastInput.yVel = 10 * yDir;
        //Send current input
        lastInputTime = performance.now();
        socket.emit('player_input', { xDir: xDir, yDir: yDir, rotation: playerGun.rotation });
    });

    socket.emit('play_game', formData.get('username'));

}

function sendBullet() {
    socket.emit('player_shot');
}