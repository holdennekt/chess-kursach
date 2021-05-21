const clearFig = sq => {
    const fig = grid[sq[0]][sq[1]];
    const col = figCol[fig];
    let tFigNum = -1;
    grid[sq[0]][sq[1]] = figs.empty;
    gameBoard.score[col] -= figValue[fig];
    for (let i = 0; i < gameBoard.figNum[fig]; i++) {
        if (gameBoard.figList[figIndex(fig, i)][0] === sq[0] &&
			gameBoard.figList[figIndex(fig, i)][1] === sq[1]) {
            tFigNum = i;
            break;
        }
    }
    gameBoard.figNum[fig]--;
    gameBoard.figList[figIndex(fig, tFigNum)] = gameBoard.figList[
        figIndex(fig, gameBoard.figNum[fig])];
};

const addFig = (sq, fig) => {
    const col = figCol[fig];
    grid[sq[0]][sq[1]] = fig;
    gameBoard.score[col] += figValue[fig];
    gameBoard.figList[figIndex(fig, gameBoard.figNum[fig])] = sq;
    gameBoard.figNum[fig]++;
};

const moveFig = (from, to) => {
    const fig = gameBoard.grid[from[0]][from[1]];
    grid[from[0]][from[1]] = figs.empty;
    grid[to[0]][to[1]] = fig;
    for (let i = 0; i < gameBoard.figNum[fig]; i++) {
        if (gameBoard.figList[figIndex(fig, i)] === from) {
            gameBoard.figList[figIndex(fig, i)] = to;
            break;
        }
    }
};

const makeMove = move => {
    const side = gameBoard.side;
    if (move.flag.enPas) {
        if (side === colors.white) {
            clearFig(move.to[0] + 1, move.to[1]);
        } else {
            clearFig(move.to[0] - 1, move.to[1]);
        }
    }
    switch (move.flag.castling) {
    case '': break;
    case 'whiteKSide':
        moveFig([7, 4], [7, 6]);
        moveFig([7, 7], [7, 5]);
        break;
    case 'whiteQSide':
        moveFig([7, 4], [7, 2]);
        moveFig([7, 0], [7, 3]);
        break;
    case 'blackKSide':
        moveFig([0, 4], [0, 6]);
        moveFig([0, 7], [0, 5]);
        break;
    case 'blackQSide':
        moveFig([0, 4], [0, 2]);
        moveFig([0, 0], [0, 3]);
        break;
    }
};
// add some to defs and board for makeMover
//obj move.to/from
