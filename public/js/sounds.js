function _Sounds() {
    var laserSound = new Howl({
        src: ['sounds/laser.mp3'],
        buffer: true,
        volume:0.2
    });

    var powerupSounds = new Howl({
        src: ['sounds/powerups/overcharge.mp3'
        ],
        buffer: true,
        volume: 0.8
    });

    this.playLaser = function () {
        laserSound.play();
    }

    this.playPowerup = function (powerupType) {
        console.log(powerupType);
        powerupSounds.play();
    }
}

const Sounds = new _Sounds();