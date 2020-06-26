/*jshint esversion: 6 */
var socket;

function onPlay() {
    var form = document.getElementById("name_form");
    console.log('play');
	var formData = new FormData(form);
	socketStuff(formData);
	return false;
}
console.log("kms");
document.getElementById("name_form").onsubmit = onPlay;

function socketStuff(formData) {
    var gameName = formData.get('server');

    let playerColor = "#" + $('#color_picker').spectrum("get").toHex();
    let pColor = playerColor;
    playerColor = getColorIndexFromPalette(playerColor); //For sending to the server in weird form

	var path = '/' + gameName + '/socket.io';
    socket = io('/', {
        secure: true,
        rejectUnauthorized: false,
        path: path
    });

    socket.on('join_game_success', function (data) {
        //Initialize player attributes
        initializeWorldObjects();
        player = {
            x: 0, y: 0, w: 50, h: 50, oldX: 0, oldY: 0, xVel: 0, yVel: 0, name: "None", health: 100, maxHealth: 100,
            gun: { w: 50, h: 10, rotation: 0 },
            activePowerups: [],
            orbs: 0, kills: 0,
            upgrades: [0, 0, 0, 0, 0, 0, 0],
            availableUpgrades: [0, 0, 0],
            color: pColor,
            name : formData.get("username")
        };
        serverPlayerState = { x: 0, y: 0, xVel: 0, yVel: 0, activePowerups: [] };

        world = data.world;
        player.x = data.startPos.x;
        player.y = data.startPos.y;
        console.log(data.startPos);
        player.oldX = player.x;
        player.oldY = player.y;
        serverPlayerState.x = player.x;
        serverPlayerState.y = player.y;
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
                //Move over trail object
                let trail = obj.trail;
                newObj.trail = obj.trail;
            }
        });
        worldObjsOld = worldObjsUpdated;

        worldObjsUpdated = {};
        worldObjsUpdated.players = new Map(data.objects.players);
        worldObjsUpdated.bullets = new Map(data.objects.bullets);
        worldObjsUpdated.orbs = new Map(data.objects.orbs);

        worldObjsUpdated.players.forEach((obj, id, map) => {
            //Grab x and y from binary data
            let array16 = new Int16Array(obj.pos);
            obj.x = array16[0];
            obj.y = array16[1];

            //Gather upgrade data
            if (obj.upgrades != undefined) {
                let array8 = new Int8Array(obj.upgrades);
                obj.upgrades = new Array(array8.length);
                for (let i = 0; i < array8.length; i++) {
                    obj.upgrades[i] = array8[i];
                }
            }
        });

        worldObjsOld.players.forEach((obj, id, map) => {
            let newObj = worldObjsUpdated.players.get(id);
            if (newObj != undefined) {
                //Handle things that got changed
                if (newObj.health == undefined) newObj.health = obj.health;
                if (newObj.maxHealth == undefined) newObj.maxHealth = obj.maxHealth;
                if (newObj.gun == undefined) {
                    newObj.gun = {};
                    newObj.gun.rotation = obj.gun.rotation;
                }
                if (newObj.upgrades == undefined) newObj.upgrades = obj.upgrades;
                if (newObj.name == undefined) newObj.name = obj.name;
                if (newObj.color == undefined) newObj.color = obj.color;
            }
        })

        leaderboard = data.leaderboard;

        powerupObjs = data.objects.powerups;

        /*let bulletsToExplode = data.objects.bulletsMarkedForExplosion;
        for (let i = 0; i < bulletsToExplode.length; i++) {
            console.log("Bullet " + bulletsToExplode[i] + " exploded!");
        }*/

        serverPlayerState = data.player;
        //if (serverPlayerState.health < player.health) Sounds.playDamageSound();
        player.health = serverPlayerState.health;
        player.orbs = serverPlayerState.orbs;
        player.orbsToUpgrade = serverPlayerState.orbsToUpgrade;
        player.kills = serverPlayerState.kills;
        player.maxHealth = serverPlayerState.maxHealth;
        player.levelUpInProgress = serverPlayerState.levelUpInProgress;
        player.availableUpgrades = serverPlayerState.availableUpgrades;
        player.cryoSlowTimer = serverPlayerState.cryoSlowTimer;
        player.upgrades = serverPlayerState.upgrades; //Remove later so we're not constantly sending this same with above

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

function sendUpgradeRequest(upgradeNum) {
    socket.emit('upgrade_request', upgradeNum);
}


//Grab player count of server
window.fetch("/game1/playerCount").then(function (response) {
    return response.json();
}).then(function (data) {
    let playerInfo = document.getElementById("server_selection_input").children[0];
    playerInfo.innerHTML = "Game 1: " + data.playerCount + " / " + data.MAX_PLAYERS + " Players";
}).catch(function () {
});