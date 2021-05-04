const clearFig = sq => {
	let fig = grid[sq[0]][sq[1]];
	let col = figCol[fig];
	let t_figNum = -1;
	gameBoard.grid[sq[0]][sq[1]] = fig.empty;
	gameBoard.score[col] -= figValue[fig];

	for (let i = 0; i < gameBoard.figNum[fig]; i++) {
		if (gameBoard.figList[figIndex(fig, i)][0] === sq[0] &&
			gameBoard.figList[figIndex(fig, i)][1] === sq[1] ) {
				t_figNum = i;
				break;
		}
	}

	gameBoard.figNum[fig]--;
	gameBoard.figList[figIndex(fig, t_figNum)] = gameBoard.figList[figIndex(fig, gameBoard.figNum[fig])]

}

const addFig = (sq, fig) => {
	let col = figCol[fig];
	gameBoard.grid[sq[0]][sq[1]] = fig;
	gameBoard.score[col] += figValue[fig];
	gameBoard.figList[figIndex(fig, gameBoard.figNum[fig])] = sq;
	gameBoard.figNum[fig]++;

}

const moveFig = (from, to) => {
	let i = 0;
	let fig = gameBoard.grid[from[0]][from[1]];
	gameBoard.grid[from[0]][from[1]] = fig.empty;
	gameBoard.grid[to[0]][to[1]] = fig;
	for (let i = 0; i < gameBoard.figNum[fig]; i++) {
		if (gameBoard.figList[figIndex(fig, i)] == from) {
			gameBoard.figList[figIndex(fig, i)] = to;
			break;
		}
	}
}

const makeMove = move => {
	let side = gameBoard.side;
	if (move.flag.enPas) {
		if (side == colors.white) {
			clearFig(move.to[0] + 1, move.to[1]);
		}
		else {
			clearFig(move.to[0] - 1, move.to[1]);
		}
	}
	else if (move.flag.castling === 'whiteKSide') {
		moveFig([7, 4], [7, 6]); 
		moveFig([7, 7], [7, 5]);                                                                     
	}
	else if (move.flag.castling === 'whiteQSide') {
		moveFig([7, 4], [7, 2]); 
		moveFig([7, 0], [7, 3]);                                                                     
	}
	else if (move.flag.castling === 'blackKSide') {
		moveFig([0, 4], [0, 6]); 
		moveFig([0, 7], [0, 5]);                                                                     
	}
	else if (move.flag.castling === 'blackQSide') {
		moveFig([0, 4], [0, 2]); 
		moveFig([0, 0], [0, 3]);                                                                     
	}

}
// add some to defs and board for makeMover
//obj move.to/from