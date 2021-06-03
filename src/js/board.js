'use strict';

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
    'enPas': noSq,
    'history': arrHistory(maxGameMoves),
};
gameBoard.material = [0, 0];
gameBoard.figList = arr0(14 * 10);
gameBoard.figNum = arr0(13);
gameBoard.moveList = arr0(maxPositionMoves * maxDepth);
gameBoard.moveListStart = arr0(maxDepth);
gameBoard.moveScores = [];
gameBoard.pvTable = arrPvTable(pvEntries);
gameBoard.pvArr = arr0(maxDepth);
gameBoard.searchHistory = arr0(14 * 120);
gameBoard.searchKillers = arrSearchKillers(3 * maxDepth);
gameBoard.posKey = 0;

const updateListsMaterial = () => {
    gameBoard.material = [0, 0];
    gameBoard.figList = arr0(14 * 10);
    gameBoard.figNum = arr0(13);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const fig = grid[i][j];
            if (fig !== figs.empty) {
                const sq = [i, j];
                const color = figCol[fig];
                gameBoard.material[color] += figValue[fig];
                gameBoard.figList[figIndex(fig, gameBoard.figNum[fig])] = sq;
                gameBoard.figNum[fig]++;
            }
        }
    }
};

const genPosKey = () => {
    let finalKey = 0;
    let fig = figs.empty;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            fig = grid[i][j];
            if (fig !== figs.empty && fig !== figs.offBoard) {
                finalKey ^= figKeys[(fig * 120) + (8 * i + j)];
            }
        }
    }
    if (gameBoard.side === colors.white) {
        finalKey ^= sideKey;
    }
    if (!checkArrsEqual(gameBoard.enPas, noSq)) {
        console.log(transformEnPas(gameBoard.enPas));
        finalKey ^= figKeys[transformEnPas(gameBoard.enPas)];
    }
    finalKey ^= castleKeys[transformCastlePerm(gameBoard.castlePerm)];
    return finalKey;
};

const knBiRkKi = (sq, side, obj) => {
    let knight, bishop, rook, queen, king;
    const i = sq[0], j = sq[1];
    if (side === colors.white) {
        knight = figs.wN;
        bishop = figs.wB;
        rook = figs.wR;
        queen = figs.wQ;
        king = figs.wK;
    } else {
        knight = figs.bN;
        bishop = figs.bB;
        rook = figs.bR;
        queen = figs.bQ;
        king = figs.bK;
    }
    for (const dir of KnDir) {
        if (obj[i + dir[0]][j + dir[1]] === knight) {
            return true;
        }
    }
    for (const dir of BiDir) {
        let tempI = i + dir[0], tempJ = j + dir[1];
        while (obj[tempI][tempJ] !== figs.offBoard) {
            if (obj[tempI][tempJ] !== figs.empty) {
                if (obj[tempI][tempJ] === bishop ||
                    obj[tempI][tempJ] === queen) {
                    return true;
                }
                break;
            }
            tempI += dir[0], tempJ += dir[1];
        }
    }
    for (const dir of RkDir) {
        let tempI = i + dir[0], tempJ = j + dir[1];
        while (obj[tempI][tempJ] !== figs.offBoard) {
            if (obj[tempI][tempJ] !== figs.empty) {
                if (obj[tempI][tempJ] === rook ||
                    obj[tempI][tempJ] === queen) {
                    return true;
                }
                break;
            }
            tempI += dir[0], tempJ += dir[1];
        }
    }
    for (const dir of KiDir) {
        if (obj[i + dir[0]][j + dir[1]] === king) {
            return true;
        }
    }
    return false;
};
const isSqAttackedBySide = (sq, side, obj = grid) => {
    const i = sq[0], j = sq[1];
    if (side === colors.white) {
        if (obj[i + 1][j - 1] === figs.wP || obj[i + 1][j + 1] === figs.wP) {
            return true;
        }
    } else if (obj[i - 1][j - 1] === figs.bP || obj[i - 1][j + 1] === figs.bP) {
        return true;
    }
    return knBiRkKi([i, j], side, obj);
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
        '-2': figs.offBoard,
        '-1': figs.offBoard,
        0: figs.bR,
        1: figs.bN,
        2: figs.bB,
        3: figs.bQ,
        4: figs.bK,
        5: figs.bB,
        6: figs.bN,
        7: figs.bR,
        8: figs.offBoard,
        9: figs.offBoard,
    };
    grid[1] = {
        '-2': figs.offBoard,
        '-1': figs.offBoard,
        0: figs.bP,
        1: figs.bP,
        2: figs.bP,
        3: figs.bP,
        4: figs.bP,
        5: figs.bP,
        6: figs.bP,
        7: figs.bP,
        8: figs.offBoard,
        9: figs.offBoard,
    };
    grid[6] = {
        '-2': figs.offBoard,
        '-1': figs.offBoard,
        0: figs.wP,
        1: figs.wP,
        2: figs.wP,
        3: figs.wP,
        4: figs.wP,
        5: figs.wP,
        6: figs.wP,
        7: figs.wP,
        8: figs.offBoard,
        9: figs.offBoard,
    };
    grid[7] = {
        '-2': figs.offBoard,
        '-1': figs.offBoard,
        0: figs.wR,
        1: figs.wN,
        2: figs.wB,
        3: figs.wQ,
        4: figs.wK,
        5: figs.wB,
        6: figs.wN,
        7: figs.wR,
        8: figs.offBoard,
        9: figs.offBoard,
    };
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
    fillFigures(document.querySelector('#container'));
};
