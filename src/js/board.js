const gameBoard = {
    'side': colors.white,
    'fiftyMove': 0,
    'hisPly': 0,
    'ply': 0,
    'castlePerm': {
        whiteKSide: true,
        whiteQSide: true,
        blackKSide: true,
        blackQSide: true,
    },
    'enPas': [-1, -1],
    'history': arr(maxGameMoves),
};
gameBoard.score = [0, 0];
gameBoard.figList = arr0(130);
gameBoard.figNum = arr0(13);
gameBoard.moveList = arr0(700);
gameBoard.moveListStart = arr0(7);
gameBoard.moveScores = [];
gameBoard.pvTable = arrOfObj(pvEntries);
gameBoard.pvArr = arr0(maxDepth);
gameBoard.searchHistory = arr0(14 * 64);
gameBoard.searchKillers = arr0(3 * maxDepth);
gameBoard.posKey = 0;

const checkBoard = () => {
    const tFigNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const tScore = [0, 0];
};

const updateListsMaterial = () => {
    gameBoard.score = [0, 0];
    gameBoard.figList = arr0(130);
    gameBoard.figNum = arr0(13);
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const figg = grid[i][j];
            if (figg !== fig.empty) {
                const sq = [i, j];
                const color = figCol[figg];
                gameBoard.score[color] += figValue[figg];
                gameBoard.figList[figIndex(figg, gameBoard.figNum[figg])] = sq;
                gameBoard.figNum[figg]++;
            }
        }
    }
    console.log(
        'white score =', gameBoard.score[0], 'black score =', gameBoard.score[1]
    );
};
