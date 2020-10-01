let startVol = 0.5;

function _Sounds() {
    var laserSound = new Howl({
        src: ['sounds/laser.mp3'],
        buffer: true,
        volume: 0.2
    });

    var powerupSounds = [
        new Howl({
            src: ['sounds/powerups/trishot.mp3'],
            buffer: true,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/powerups/superspeed.mp3'],
            buffer: true,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/powerups/juggernaut.mp3'],
            buffer: true,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/powerups/overcharge.mp3'],
            buffer: true,
            volume: 0.8
        })
    ];

    var killstreakSounds = [
        new Howl({
            src: ['sounds/killstreaks/finisher.mp3'],
            buffer: true,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/killstreaks/punisher.mp3'],
            buffer: true,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/killstreaks/maniac.mp3'],
            buffer: false,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/killstreaks/destroyer.mp3'],
            buffer: false,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/killstreaks/tormentor.mp3'],
            buffer: false,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/killstreaks/extinguisher.mp3'],
            buffer: false,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/killstreaks/terminator.mp3'],
            buffer: false,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/killstreaks/obliterator.mp3'],
            buffer: false,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/killstreaks/executioner.mp3'],
            buffer: false,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/killstreaks/annihilator.mp3'],
            buffer: false,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/killstreaks/exterminator.mp3'],
            buffer: false,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/killstreaks/bearer_of_death.mp3'],
            buffer: false,
            volume: 0.8
        }),
        new Howl({
            src: ['sounds/killstreaks/unstoppable.mp3'],
            buffer: false,
            volume: 0.8
        }),
    ];

    var damageSounds = new Howl({
        src: ['sounds/hitSounds.mp3'],
        sprite: {
            0: [100, 250],
            1: [500, 650],
            2: [1000, 1150],
            3: [1500, 1650],
            4: [2050, 2200],
            5: [2550, 2700],
            6: [3125, 3300],
            7: [3525, 3700]
        }
    });

    this.playDamageSound = function () {
        //let rand = Math.floor(Math.random() * 8);
        //damageSounds.play("1");
    }

    this.playLaser = function () {
        laserSound.play();
    }

    this.playPowerup = function (powerupType) {
        powerupSounds[powerupType].play();
    }

    this.playKillStreak = function (num) {
        killstreakSounds[num].play();
    }

    this.changeVolume = function (vol) {
        laserSound.volume(vol * 0.4);
        for (let i = 0; i < powerupSounds.length; i++) {
            powerupSounds[i].volume(vol * 1.6);
        }
        for (let i = 0; i < killstreakSounds.length; i++) {
            killstreakSounds[i].volume(vol * 1.6);
        }
    }
    this.changeMusicVolume = function (vol) {
    }
}

const Sounds = new _Sounds();