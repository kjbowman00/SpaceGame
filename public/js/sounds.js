function _Sounds() {
    var laserSound = new Howl({
        src: ['sounds/laser.mp3'],
        buffer: true,
        volume:0.2
    });

    this.playLaser = function () {
        laserSound.play();
    }
}

const Sounds = new _Sounds();