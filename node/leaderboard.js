let stateNum = 0;
let currentBoard = null;

function getTop10(players) {
	let strippedPlayers = [];
	players.forEach((currentPlayer, id, map) => {
		if (currentPlayer.alive) {
			strippedPlayers.push({ name: currentPlayer.name, kills: currentPlayer.kills });
		}
	});

	strippedPlayers.sort(comparePlayers);
	if (strippedPlayers.length > 10) {
		strippedPlayers.splice(10); //Delete all but 10 elements
	}

	//Handle our leaderboard changing from last time
	if (currentBoard == null) {
		currentBoard = strippedPlayers;
	} else {
		if (currentBoard.length != strippedPlayers.length) {
			stateNum++;
			currentBoard = strippedPlayers;
		} else {
			for (let i = 0; i < strippedPlayers.length; i++) {
				if (strippedPlayers[i].name.valueOf() != currentBoard[i].name.valueOf() ||
					strippedPlayers[i].kills != currentBoard[i].kills) {
					stateNum++;
					currentBoard = strippedPlayers;
					break;
				}
			}
		}
	}

	return strippedPlayers;
}

function comparePlayers(a, b) {
	return b.kills - a.kills;
}

function getStateNum() {
	return stateNum;
}

exports.getTop10 = getTop10;
exports.getStateNum = getStateNum;