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

const resetBoard = () => {
    for (let i = -2; i < 10; i++) {
        for (let j = -2; j < 10; j++) {
            if (i === -2 || i === -1 || i === 8 || i === 9 ||
                j === -2 || j === -1 || j === 8 || j === 9) {
                grid[i][j] = figs.offBoard;
            } else {
                grid[i][j] = figs.empty;
            }
        }
    }
    grid[0] = {
        0: figs.bR,
        1: figs.bN,
        2: figs.bB,
        3: figs.bQ,
        4: figs.bK,
        5: figs.bB,
        6: figs.bN,
        7: figs.bR,
     }
    grid[1] = {
        0: figs.bP,
        1: figs.bP,
        2: figs.bP,
        3: figs.bP,
        4: figs.bP,
        5: figs.bP,
        6: figs.bP,
        7: figs.bP,
    }
    grid[6] = {
        0: figs.wP,
        1: figs.wP,
        2: figs.wP,
        3: figs.wP,
        4: figs.wP,
        5: figs.wP,
        6: figs.wP,
        7: figs.wP,
    }
    grid[7] = {
        0: figs.wR,
        1: figs.wN,
        2: figs.wB,
        3: figs.wQ,
        4: figs.wK,
        5: figs.wB,
        6: figs.wN,
        7: figs.wR,
    }
    gameBoard.side = colors.white;
    gameBoard.enPas = [-1, -1];
    gameBoard.fiftyMove = 0;
    gameBoard.ply = 0;
    gameBoard.hisPly = 0;
    gameBoard.castlePerm = {
        whiteKSide: true,
        whiteQSide: true,
        blackKSide: true,
        blackQSide: true,
    };
    gameBoard.posKey = 0;
    gameBoard.moveListStart[gameBoard.ply] = 0;
}

