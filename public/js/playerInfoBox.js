function drawPlayerInfo(player, ctx) {
	let drawX = Math.floor(player.x - camera.x);
	let drawY = Math.floor(player.y - camera.y);

	//Draw player name box
	let tW = 8; //Text width
	let tH = 12; //Text Height
	let vertOffset = 20;
	ctx.fillStyle = 'rgba(124, 124, 124, 0.5)';
	let nameLength = player.name.length;
	ctx.fillRect(drawX + (player.w / 2) - (tW * nameLength / 2), drawY - vertOffset - tH, nameLength * tW, tH + 5);
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	ctx.font = "12px Arial";
	ctx.textAlign = "center";
	ctx.fillText(player.name, drawX + player.w / 2, drawY - vertOffset);

	//Health bar
	ctx.fillStyle = 'rgba(124, 124, 124, 0.7)';
	ctx.fillRect(drawX, drawY - vertOffset + 6, player.w, 8);
	ctx.fillStyle = 'rgba(0, 200, 0, 0.7)';
	ctx.fillRect(drawX, drawY - vertOffset + 6, player.w * (player.health / player.maxHealth), 8);
}