function getTop10(players) {
	let strippedPlayers = [];
	players.forEach((currentPlayer, id, map) => {
		strippedPlayers.push({ name: currentPlayer.name, kills: currentPlayer.kills });
	});

	strippedPlayers.sort(comparePlayers);
	if (strippedPlayers.length > 10) {
		strippedPlayers.splice(10); //Delete all but 10 elements
	}

	return strippedPlayers;
}

function comparePlayers(a, b) {
	return b.kills - a.kills;
}

exports.getTop10 = getTop10;