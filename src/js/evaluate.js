const pawnTable = [
    [0,	 0,	 0,	 0,	  0,   0,  0,  0],
    [10, 10, 0,  -10, -10, 0,  10, 10],
    [5,	 0,  0,	 5,	  5,   0,  0,  5],
    [0,	 0,	 10, 20,  20,  10, 0,  0],
    [5,	 5,	 5,  10,  10,  5,  5,  5],
    [10, 10, 10, 20,  20,  10, 10, 10],
    [20, 20, 20, 30,  30,  20, 20, 20],
    [0,	 0,	 0,	 0,	  0,   0,  0,  0]
];

const knightTable = [
    [0, -10, 0,	 0,	 0,  0,  -10, 0],
    [0,	0,	 0,	 5,	 5,  0,  0,   0],
    [0,	0,	 10, 10, 10, 10, 0,	  0],
    [0,	0,	 10, 20, 20, 10, 5,	  0],
    [5,	10,	 15, 20, 20, 15, 10,  5],
    [5,	10,	 10, 20, 20, 10, 10,  5],
    [0,	0,	 5,	 10, 10, 5,	 0,	  0],
    [0,	0,	 0,	 0,	 0,  0,	 0,	  0]
];

const bishopTable = [
    [0,	0,  -10, 0,	 0,  -10, 0,  0],
    [0,	0,	0,	 10, 10, 0,	  0,  0],
    [0,	0,	10,	 15, 15, 10,  0,  0],
    [0,	10,	15,	 20, 20, 15,  10, 0],
    [0,	10,	15,	 20, 20, 15,  10, 0],
    [0,	0,	10,	 15, 15, 10,  0,  0],
    [0,	0,	0,	 10, 10, 0,	  0,  0],
    [0,	0,	0,	 0,	 0,	0,	  0,  0]
];

const rookTable = [
    [0,	 0,	 5,	 10, 10, 5,	 0,	 0],
    [0,	 0,	 5,	 10, 10, 5,	 0,	 0],
    [0,	 0,	 5,	 10, 10, 5,	 0,	 0],
    [0,	 0,	 5,	 10, 10, 5,	 0,	 0],
    [0,	 0,	 5,	 10, 10, 5,	 0,	 0],
    [0,	 0,	 5,	 10, 10, 5,	 0,	 0],
    [25, 25, 25, 25, 25, 25, 25, 25],
    [0,	 0,	 5,	 10, 10, 5,	 0,	 0]
];

const bishopPair = 40;

const evalPosition = () => {
    let score = gameBoard.score[0] - gameBoard.score[1];
	let figure;
    figure = fig.wP;
	for (let figNum = 0; figNum < gameBoard.figNum[figure]; figNum++) {
		let sq = gameBoard.figList[figIndex(figure, figNum)];
		score += pawnTable[sq[0]][sq[1]];
	}
	figure = fig.bP;
	for (let figNum = 0; figNum < gameBoard.figNum[figure]; figNum++) {
		let sq = gameBoard.figList[figIndex(figure, figNum)];
		score -= pawnTable[mirrorTable[sq[0]][sq[1]][0]][mirrorTable[sq[0]][sq[1]][1]];
	}
	figure = fig.wN;	
	for (let figNum = 0; figNum < gameBoard.figNum[figure]; figNum++) {
		let sq = gameBoard.figList[figIndex(figure, figNum)];
		score += knightTable[sq[0]][sq[1]];
	}
	figure = fig.bN;	
	for (let figNum = 0; figNum < gameBoard.figNum[figure]; figNum++) {
		let sq = gameBoard.figList[figIndex(figure, figNum)];
		score -= knightTable[mirrorTable[sq[0]][sq[1]][0]][mirrorTable[sq[0]][sq[1]][1]];
	}
	figure = fig.wB;	
	for (let figNum = 0; figNum < gameBoard.figNum[figure]; figNum++) {
		let sq = gameBoard.figList[figIndex(figure, figNum)];
		score += bishopTable[sq[0]][sq[1]];
	}
	figure = fig.bB;	
	for (let figNum = 0; figNum < gameBoard.figNum[figure]; figNum++) {
		let sq = gameBoard.figList[figIndex(figure, figNum)];
		score -= bishopTable[mirrorTable[sq[0]][sq[1]][0]][mirrorTable[sq[0]][sq[1]][1]];
	}
	figure = fig.wR;	
	for (let figNum = 0; figNum < gameBoard.figNum[figure]; figNum++) {
		let sq = gameBoard.figList[figIndex(figure, figNum)];
		score += rookTable[sq[0]][sq[1]];
	}
	figure = fig.bR;	
	for (let figNum = 0; figNum < gameBoard.figNum[figure]; figNum++) {
		let sq = gameBoard.figList[figIndex(figure, figNum)];
		score -= rookTable[mirrorTable[sq[0]][sq[1]][0]][mirrorTable[sq[0]][sq[1]][1]];
	}
	figure = fig.wQ;	
	for (let figNum = 0; figNum < gameBoard.figNum[figure]; figNum++) {
		let sq = gameBoard.figList[figIndex(figure, figNum)];
		score += rookTable[sq[0]][sq[1]] / 2;
	}
	figure = fig.bQ;	
	for (let figNum = 0; figNum < gameBoard.figNum[figure]; figNum++) {
		let sq = gameBoard.figList[figIndex(figure, figNum)];
		score -= rookTable[mirrorTable[sq[0]][sq[1]][0]][mirrorTable[sq[0]][sq[1]][1]] / 2;
	}
	if (gameBoard.figNum[fig.wB] >= 2) score += bishopPair;
	if (gameBoard.figNum[fig.bB] >= 2) score -= bishopPair;
    if (gameBoard.side = colors.white) return score;
    else return -score;
};
