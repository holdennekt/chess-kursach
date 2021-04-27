const clearFig = (sq) => {
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

const makeMove = (move) => {

}
// add some to defs and board for makeMover