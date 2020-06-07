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

    let playerColor = "#" + $('#color_picker').spectrum("get").toHex();
    player.color = playerColor;
    playerColor = getColorIndexFromPalette(playerColor);

	var path = '/' + gameName + '/socket.io';
    socket = io('/', {
        secure: true,
        rejectUnauthorized: false,
        path: path
    });

    socket.on('join_game_success', function (data) {
        world = data.world;
        player.x = data.startPos.x;
        player.y = data.startPos.y;
        player.name = formData.get("username");
        gameStart();
    });
    socket.on('state', function (data) {
        worldObjsOld.orbs.forEach((obj, id, map) => {
            let newObj = worldObjsUpdated.orbs.get(id);
            if (newObj != undefined) {
                let trail = obj.trail;
                newObj.trail = obj.trail;
            }
        });
        worldObjsOld.players.forEach((obj, id, map) => {
            let newObj = worldObjsUpdated.players.get(id);
            if (newObj != undefined) {
                let trail = obj.trail;
                newObj.trail = obj.trail;
            }
        });
        worldObjsOld = worldObjsUpdated;

        worldObjsUpdated = {};
        worldObjsUpdated.players = new Map(data.objects.players);
        worldObjsUpdated.bullets = new Map(data.objects.bullets);
        worldObjsUpdated.orbs = new Map(data.objects.orbs);

        powerupObjs = data.objects.powerups;

        /*let bulletsToExplode = data.objects.bulletsMarkedForExplosion;
        for (let i = 0; i < bulletsToExplode.length; i++) {
            console.log("Bullet " + bulletsToExplode[i] + " exploded!");
        }*/

        serverPlayerState = data.player;
        player.health = serverPlayerState.health;

        handleInitialPowerup(serverPlayerState);
        player.activePowerups = serverPlayerState.activePowerups;

        lastInput.xVel = playerSpeed * xDir;
        lastInput.yVel = playerSpeed * yDir;
        //Send current input
        lastInputTime = performance.now();
        socket.emit('player_input', { xDir: xDir, yDir: yDir, rotation: player.gun.rotation });
    });
    socket.on('player_respawn_success', function (data) {
        respawnSuccess(data);
    });

    socket.emit('play_game', {
        name: formData.get('username'),
        color: playerColor
    });

}

function sendBullet() {
    socket.emit('player_shot');
}