var leaderboard = [{ name: "Penis man", kills: 30 }, { name: "pumpernickle", kills: 7 }, { name: "TEEHEE", kills: 0 },
	{ name: "Penis man", kills: 30 }, { name: "pumpernickle", kills: 7 }, { name: "TEEHEE", kills: 0 },
	{ name: "Penis man", kills: 30 }, { name: "pumpernickle", kills: 7 }, { name: "TEEHEE", kills: 0 },
	{ name: "TEEEHEEE", kills: 11111 }];
function displayLeaderboard(ctx) {
	const WIDTH = 200;
	const HEIGHT = 300;
	let topLeftX = canvas.width - WIDTH - 10;
	let topLeftY = 10;
	//display gray box for background
	ctx.fillStyle = 'rgba(124, 124, 124, 0.2)';
	ctx.fillRect(topLeftX, topLeftY, WIDTH, HEIGHT);

	//Display TOP KILLS text
	let estimatedTextHeight = 17 * 2;
	ctx.font = "20px Arial Bold";
	ctx.textAlign = "center";
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	ctx.fillText("Top Kills", topLeftX + WIDTH / 2, topLeftY + estimatedTextHeight / 2 + 5);

	topLeftY += estimatedTextHeight;
	let restOfBoxHeight = (HEIGHT - estimatedTextHeight) / 10;

	//display each players text
	let darken = true; //Alternates background color
	for (let i = 0; i < leaderboard.length; i++) {
		if (darken) {
			ctx.fillStyle = 'rgba(124, 124, 124, 0.2)';
			ctx.fillRect(topLeftX, topLeftY, WIDTH, restOfBoxHeight);
		}

		//Fill player name
		ctx.textAlign = "left";
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		let name = leaderboard[i].name;
		ctx.fillText(name, topLeftX + 3, topLeftY + estimatedTextHeight/2 + 2);

		let kills = leaderboard[i].kills;
		ctx.textAlign = "right";
		ctx.fillText(kills.toString(), topLeftX + WIDTH - 3, topLeftY + estimatedTextHeight / 2 + 2);

		topLeftY += restOfBoxHeight;
		darken = !darken;
	}
}