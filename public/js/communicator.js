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
        world = data;
        gameStart();
    });
    socket.on('state', function (data) {
        worldObjsOld = worldObjsUpdated;

        worldObjsUpdated = {};
        worldObjsUpdated.players = new Map(data.objects.players);
        worldObjsUpdated.bullets = new Map(data.objects.bullets);

        let bulletsToExplode = data.objects.bulletsMarkedForExplosion;
        for (let i = 0; i < bulletsToExplode.length; i++) {
            console.log("Bullet " + bulletsToExplode[i] + " exploded!");
        }

        serverPlayerState = data.player;
        player.health = serverPlayerState.health;
        lastInput.xVel = 10 * xDir;
        lastInput.yVel = 10 * yDir;
        //Send current input
        lastInputTime = performance.now();
        socket.emit('player_input', { xDir: xDir, yDir: yDir, rotation: playerGun.rotation });
    });
    socket.on('player_respawn_success', function (data) {
        respawnSuccess(data);
    });

    socket.emit('play_game', { name: formData.get('username') });

}

function sendBullet() {
    socket.emit('player_shot');
}