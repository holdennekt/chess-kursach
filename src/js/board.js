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
    'history': arrOfEmptyObjects(maxGameMoves),
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
            if (figg !== figs.empty) {
                const sq = [i, j];
                const color = figCol[figg];
                gameBoard.score[color] += figValue[figg];
                gameBoard.figList[figIndex(figg, gameBoard.figNum[figg])] = sq;
                gameBoard.figNum[figg]++;
            }
        }
    }
};

const genPosKey = () => {
    let finalKey = 0;
    let fig = figs.empty;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            fig = grid[i][j];
            if (fig !== figs.empty && fig !== figs.offBoard) {
                finalKey ^= figKeys[(fig * 120) + (8 * i + j)];
            }
        }
    }
    if (gameBoard.side === colors.white) {
        finalKey ^= sideKey;
    }
    if (gameBoard.enPas[0] !== -1 && gameBoard.enPas[1] !== -1) {
        finalKey ^= figKeys[gameBoard.enPas];
    }
    finalKey ^= castleKeys[gameBoard.castlePerm];
    return finalKey;
};

