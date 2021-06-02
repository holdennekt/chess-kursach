'use strict';

const clearFig = (sq, obj = gameBoard, board = grid) => {
    const fig = board[sq[0]][sq[1]];
    const col = figCol[fig];
    let tFigNum = -1;
    board[sq[0]][sq[1]] = figs.empty;
    obj.material[col] -= figValue[fig];
    for (let i = 0; i < obj.figNum[fig]; i++) {
        if (obj.figList[figIndex(fig, i)][0] === sq[0] &&
			obj.figList[figIndex(fig, i)][1] === sq[1]) {
            tFigNum = i;
            break;
        }
    }
    obj.figNum[fig]--;
    obj.figList[figIndex(fig, tFigNum)] = obj.figList[
        figIndex(fig, obj.figNum[fig])];
};

const addFig = (sq, fig, obj = gameBoard, board = grid) => {
    const col = figCol[fig];
    board[sq[0]][sq[1]] = fig;
    obj.material[col] += figValue[fig];
    obj.figList[figIndex(fig, obj.figNum[fig])] = sq;
    obj.figNum[fig]++;
};

const moveFig = (from, to, obj = gameBoard, board = grid) => {
    const fig = board[from[0]][from[1]];
    hashFig(fig, from);
    board[from[0]][from[1]] = figs.empty;
    hashFig(fig, to);
    board[to[0]][to[1]] = fig;
    for (let i = 0; i < obj.figNum[fig]; i++) {
        if (obj.figList[figIndex(fig, i)][0] === from[0] &&
            obj.figList[figIndex(fig, i)][1] === from[1]) {
            obj.figList[figIndex(fig, i)] = to;
            break;
        }
    }
};

const updateCastlePerm = (from, to, obj = gameBoard) => {
    if (from[0] === 0 && from[1] === 0) {
        obj.castlePerm.blackQSide = false;
        // console.log('blackQSide = false');
    }
    if (from[0] === 0 && from[1] === 4) {
        obj.castlePerm.blackQSide = false;
        obj.castlePerm.blackKSide = false;
        // console.log('blackQSide = false');
        // console.log('blackKSide = false');
    }
    if (from[0] === 0 && from[1] === 7) {
        obj.castlePerm.blackKSide = false;
        // console.log('blackKSide = false');
    }
    if (from[0] === 7 && from[1] === 0) {
        obj.castlePerm.whiteQSide = false;
        // console.log('whiteQSide = false');
    }
    if (from[0] === 7 && from[1] === 4) {
        obj.castlePerm.whiteQSide = false;
        obj.castlePerm.whiteKSide = false;
        // console.log('whiteKSide = false');
        // console.log('whiteQSide = false');
    }
    if (from[0] === 7 && from[1] === 7) {
        obj.castlePerm.whiteKSide = false;
        // console.log('whiteKSide = false');
    }
    if (to[0] === 0 && to[1] === 0) {
        obj.castlePerm.blackQSide = false;
        // console.log('blackQSide = false');
    }
    if (to[0] === 0 && to[1] === 4) {
        obj.castlePerm.blackQSide = false;
        obj.castlePerm.blackKSide = false;
        // console.log('blackQSide = false');
        // console.log('blackKSide = false');
    }
    if (to[0] === 0 && to[1] === 7) {
        obj.castlePerm.blackKSide = false;
        // console.log('blackKSide = false');
    }
    if (to[0] === 7 && to[1] === 0) {
        obj.castlePerm.whiteQSide = false;
        // console.log('whiteQSide = false');
    }
    if (to[0] === 7 && to[1] === 4) {
        obj.castlePerm.whiteQSide = false;
        obj.castlePerm.whiteKSide = false;
        // console.log('whiteQSide = false');
        // console.log('whiteKSide = false');
    }
    if (to[0] === 7 && to[1] === 7) {
        obj.castlePerm.whiteKSide = false;
        // console.log('whiteKSide = false');
    }
};

const takeMove = () => {
    gameBoard.hisPly--;
    gameBoard.ply--;

    const move = gameBoard.history[gameBoard.hisPly].move;

    if (gameBoard.enPas[0] !== -1 &&
        gameBoard.enPas[1] !== -1) hashEmpersant();
    hashCastling();

    gameBoard.castlePerm = gameBoard.history[gameBoard.hisPly].castlePerm;
    gameBoard.fiftyMove = gameBoard.history[gameBoard.hisPly].fiftyMove;
    gameBoard.enPas = gameBoard.history[gameBoard.hisPly].enPas;
    // console.log(gameBoard.castlePerm);
    if (gameBoard.enPas[0] !== -1 &&
        gameBoard.enPas[1] !== -1) hashEmpersant();
    hashCastling();

    gameBoard.side ^= 1;
    hashSide();

    if (move.flag.enPas) {
        if (gameBoard.side === colors.white) {
            addFig([move.to[0] + 1, move.to[1]], figs.bP);
        } else {
            addFig([move.to[0] - 1, move.to[1]], figs.wP);
        }
    }
    switch (move.flag.castling) {
    case '': break;
    case 'whiteKSide':
        moveFig([7, 5], [7, 7]);
        break;
    case 'whiteQSide':
        moveFig([7, 3], [7, 0]);
        break;
    case 'blackKSide':
        moveFig([0, 5], [0, 7]);
        break;
    case 'blackQSide':
        moveFig([0, 3], [0, 0]);
        break;
    }

    moveFig(move.to, move.from);

    if (move.captured !== figs.empty) {
        addFig(move.to, move.captured);
    }

    if (move.promoted !== figs.empty) {
        clearFig(move.from);
        const statement = figCol[move.promoted] === colors.white;
        addFig(move.from, (statement ? figs.wP : figs.bP));
    }
};

const makeMove = move => {
    const side = gameBoard.side;
    let temp;
    // console.log(move);
    if (move.flag.enPas) {
        if (side === colors.white) {
            clearFig([move.to[0] + 1, move.to[1]]);
        } else {
            clearFig([move.to[0] - 1, move.to[1]]);
        }
    }
    switch (move.flag.castling) {
    case '': break;
    case 'whiteKSide':
        moveFig([7, 7], [7, 5]);
        break;
    case 'whiteQSide':
        moveFig([7, 0], [7, 3]);
        break;
    case 'blackKSide':
        moveFig([0, 7], [0, 5]);
        break;
    case 'blackQSide':
        moveFig([0, 0], [0, 3]);
        break;
    }
    if (gameBoard.enPas[0] !== -1 &&
        gameBoard.enPas[1] !== -1) hashEmpersant();
    hashCastling();
    gameBoard.history[gameBoard.hisPly].move = move;
    gameBoard.history[gameBoard.hisPly].fiftyMove = gameBoard.fiftyMove;
    gameBoard.history[gameBoard.hisPly].enPas = gameBoard.enPas;
    gameBoard.history[gameBoard.hisPly].castlePerm = gameBoard.castlePerm;
    updateCastlePerm(move.from, move.to);
    gameBoard.enPas = [-1, -1];
    hashCastling();
    gameBoard.fiftyMove++;
    if (move.captured !== 0) {
        clearFig(move.to);
        gameBoard.fiftyMove = 0;
    }
    gameBoard.hisPly++;
    gameBoard.ply++;
    temp = grid[move.from[0]][move.from[1]] === 1 ||
            grid[move.from[0]][move.from[1]] === 7;
    if (temp) {
        gameBoard.fiftyMove = 0;
        if (move.flag.pawnStart) {
            if (side === colors.white) {
                gameBoard.enPas[0] = move.from[0] - 1;
                gameBoard.enPas[1] = move.from[1];
            } else {
                gameBoard.enPas[0] = move.from[0] + 1;
                gameBoard.enPas[1] = move.from[1];
            }
            hashEmpersant();
        }
    }
    moveFig(move.from, move.to);
    if (move.promoted !== figs.empty) {
        clearFig(move.to);
        addFig(move.to, move.promoted);
    }
    gameBoard.side ^= 1;
    hashSide();
    temp = gameBoard.figList[figIndex(kings[side], 0)];
    if (isSqAttackedBySide(temp, gameBoard.side)) {
        takeMove();
        return false;
    }
    return true;
};

const isMoveLegal = move => {
    const res = makeMove(move);
    // console.log(res);
    if (res) takeMove();
    return res;
};
