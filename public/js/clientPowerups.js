var SUPER_TEST = {};
const powerups = {
	triShot: 0,
	superSpeed: 1,
	juggernaut: 2,
	overcharge: 3
};

const basePowerupImage = new Image(100, 100);
basePowerupImage.src = '/images/powerups/basePowerup.png';
const powerupImages = [
	new Image(100, 100),
	new Image(100, 100),
	new Image(100, 100),
	new Image(100, 100)
];
powerupImages[0].src = '/images/powerups/triShot.png';
powerupImages[1].src = '/images/powerups/superSpeed.png';
powerupImages[2].src = '/images/powerups/juggernaut.png';
powerupImages[3].src = '/images/powerups/overcharge.png';

function displayPowerupObj(powerup, ctx) {
	if (powerup.spawned) {
		let image = powerupImages[powerup.powerupType];
		ctx.globalCompositeOperation = "lighter";
		ctx.drawImage(image, Math.floor(powerup.x - camera.x), Math.floor(powerup.y - camera.y), powerup.w, powerup.h);

		//draw box behind text
		let drawX = Math.floor(powerup.x - camera.x + powerup.w / 2);
		let drawY = Math.floor(powerup.y - camera.y - 25);
		let tW = 8; //Text width
		let tH = 12; //Text Height
		let vertOffset = 20;
		ctx.fillStyle = 'rgba(124, 124, 124, 0.5)';
		let text = (powerup.contestTimeNeeded - powerup.contestTimer).toFixed(1) + "s";
		ctx.fillRect(drawX - tW * text.length / 2 - 3, drawY - tH / 2 - 3, tW * text.length + 6, tH + 6);
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		ctx.font = "15px Arial Bold";
		ctx.textAlign = "center";
		ctx.fillText(text, drawX, drawY + tH / 2);

		//Draw tint if contested or only one on it
		if (powerup.playerInside !== undefined) {
			if (powerup.playerInside == null) {
				//Contested
				ctx.fillStyle = 'rgba(100, 0, 0, 0.5)';
				ctx.fillRect(Math.floor(powerup.x - camera.x), Math.floor(powerup.y - camera.y), powerup.w, powerup.h);
			} else {
				ctx.fillStyle = 'rgba(0, 100, 0, 0.5)';
				ctx.fillRect(Math.floor(powerup.x - camera.x), Math.floor(powerup.y - camera.y), powerup.w, powerup.h);
			}
		}
	} else {
		let image = basePowerupImage;
		ctx.drawImage(image, Math.floor(powerup.x - camera.x), Math.floor(powerup.y - camera.y), powerup.w, powerup.h);

		//Display spawn text above
		let drawX = Math.floor(powerup.x - camera.x + powerup.w / 2);
		let drawY = Math.floor(powerup.y - camera.y - 25);

		//draw box behind text
		let tW = 8; //Text width
		let tH = 12; //Text Height
		let vertOffset = 20;
		ctx.fillStyle = 'rgba(124, 124, 124, 0.5)';
		let text = (powerup.spawnTimeNeeded - powerup.spawnTimer).toFixed(1) + "s";
		ctx.fillRect(drawX - tW * text.length / 2 - 3, drawY - tH / 2 - 3, tW * text.length + 6, tH + 6);
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		ctx.font = "15px Arial Bold";
		ctx.textAlign = "center";
		ctx.fillText(text, drawX, drawY + tH/2);
	}
}

function handleInitialPowerup(playerState) {
	//Goes through new player state and old player state to determine if new powerups are active
	//If they are, play a sound and animation
	let newPowerups = playerState.activePowerups;
	let oldPowerups = player.activePowerups;
	SUPER_TEST = { n: newPowerups, o: oldPowerups };
	for (let i = 0; i < newPowerups.length; i++) {
		let newPowerup = newPowerups[i];
		let previousPowerup = null;

		//Check if we already had this powerup active
		for (let j = 0; j < oldPowerups.length; j++) {
			if (newPowerup.powerupType == oldPowerups[j].powerupType) {
				previousPowerup = oldPowerups[j];
			}
		}
		if (previousPowerup != null) {
			if (newPowerup.timeLeft > previousPowerup.timeLeft) {
				//Powerup was RE-activated
				console.log("POWERUP REACTIVATED");
				console.log(newPowerup);
			}
		} else {
			//Powerup activated
			//Play sound, animation
			console.log("POWERUP ACTIVATED");
			console.log(newPowerup);
			Sounds.playPowerup(newPowerup.type);
		}
	}
}