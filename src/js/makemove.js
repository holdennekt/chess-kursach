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
    const fig = grid[from[0]][from[1]];
    console.log('figure moving ', fig, 'from ', from, to);
    grid[from[0]][from[1]] = figs.empty;
    grid[to[0]][to[1]] = fig;
    for (let i = 0; i < gameBoard.figNum[fig]; i++) {
        if (gameBoard.figList[figIndex(fig, i)] === from) {
            gameBoard.figList[figIndex(fig, i)] = to;
            break;
        }
    }
};

const updateCastlePerm = (from, to) => {
    if (from[0] === 0 && from[1] === 0) {
        gameBoard.castlePerm.blackQSide = false; 
    }
    if (from[0] === 0 && from[1] === 4) {
        gameBoard.castlePerm.blackQSide = false;
        gameBoard.castlePerm.blackKSide = false;
    }
    if (from[0] === 0 && from[1] === 7) {
        gameBoard.castlePerm.blackKSide = false; 
    }
    if (from[0] === 7 && from[1] === 0) {
        gameBoard.castlePerm.whiteQSide = false; 
    }
    if (from[0] === 7 && from[1] === 4) {
        gameBoard.castlePerm.whiteQSide = false;
        gameBoard.castlePerm.whiteKSide = false; 
    }
    if (from[0] === 7 && from[1] === 7) {
        gameBoard.castlePerm.whiteKSide = false; 
    }
    if (to[0] === 0 && to[1] === 0) {
        gameBoard.castlePerm.blackQSide = false; 
    }
    if (to[0] === 0 && to[1] === 4) {
        gameBoard.castlePerm.blackQSide = false;
        gameBoard.castlePerm.blackKSide = false;
    }
    if (to[0] === 0 && to[1] === 7) {
        gameBoard.castlePerm.blackKSide = false; 
    }
    if (to[0] === 7 && to[1] === 0) {
        gameBoard.castlePerm.whiteQSide = false; 
    }
    if (to[0] === 7 && to[1] === 4) {
        gameBoard.castlePerm.whiteQSide = false;
        gameBoard.castlePerm.whiteKSide = false; 
    }
    if (to[0] === 7 && to[1] === 7) {
        gameBoard.castlePerm.whiteKSide = false; 
    }
}

const makeMove = move => {
    const side = gameBoard.side;
    let temp;
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
        if (move.pawnStart) {
            if (side === colors.white) {
                gameBoard.enPas[0] = from[0] - 1;
                gameBoard.enPas[1] = from[0];
            } else {
                gameBoard.enPas[0] = from[0] + 1;
                gameBoard.enPas[1] = from[0];
            }
            hashEmpersant();
        }
    }
    console.log(move.from, move.to, grid[move.from[0]][move.from[1]]);
    moveFig(move.from, move.to);
    if (move.promoted !== figs.empty) {
        clearFig(to);
        addFig(to, move.promoted);
    }
    gameBoard.side ^= 1;
    console.log('SIDE IS', gameBoard.side);
    hashSide();
    temp = gameBoard.figList[figIndex(kings[side], 0)];
    if (isSqAttackedBySide(temp, gameBoard.side)) {
        takeMove();
        return false;
    }
    return true;
};

const takeMove = () => {
    gameBoard.hisPly--;
    gameBoard.ply--;

    let move = gameBoard.history[gameBoard.hisPly].move;

    if (gameBoard.enPas[0] !== -1 &&
        gameBoard.enPas[1] !== -1) hashEmpersant();
    hashCastling();

    gameBoard.castlePerm = gameBoard.history[gameBoard.hisPly].castlePerm;
    gameBoard.fiftyMove = gameBoard.history[gameBoard.hisPly].fiftyMove;
    gameBoard.enPas = gameBoard.history[gameBoard.hisPly].enPas;

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
        addFig(move.from, (figCol[move.promoted] === colors.white ? figs.wP : figs.bP));
    }
};