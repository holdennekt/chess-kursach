const obj = (from, to, captured, promoted, flag) => ({from, to, captured, promoted, flag});
const obj1 = (enPas, pawnStart = false, castling = '') => ({enPas, pawnStart, castling});

const addCaptureMove = move => {
    gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply + 1]] = move;
    gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]++] = 0;
};

const addQuietMove = move => {
    gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply + 1]] = move;
    gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]++] = 0;
};

const addEnPasMove = move => {
    gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply + 1]] = move;
    gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]++] = 0;
};

const addWhitePawnMove = (from, to, captured = fig.empty) => {
    if (from[0] === 1) {
        addCaptureMove(obj(from, to, captured, fig.wQ, null));
        addCaptureMove(obj(from, to, captured, fig.wR, null));
        addCaptureMove(obj(from, to, captured, fig.wB, null));
        addCaptureMove(obj(from, to, captured, fig.wN, null));
    }
    else {
        addCaptureMove(obj(from, to, captured, fig.empty, null));
    }
};

const addBlackPawnMove = (from, to, captured = fig.empty) => {
    if (from[0] === 6) {
        addCaptureMove(obj(from, to, captured, fig.bQ, null));
        addCaptureMove(obj(from, to, captured, fig.bR, null));
        addCaptureMove(obj(from, to, captured, fig.bB, null));
        addCaptureMove(obj(from, to, captured, fig.bN, null));
    }
    else {
        addCaptureMove(obj(from, to, captured, fig.empty, null));
    }
};

const generateMoves = () => {
    gameBoard.moveListStart[gameBoard.ply + 1] = gameBoard.moveListStart[gameBoard.ply];
    let startIndex1, startIndex2;
    if (gameBoard.side === colors.white) {
        let figType = fig.wP;
        for (let figNum = 0; figNum < gameBoard.figNum[figType]; figNum++) {
            let sq = gameBoard.figList[figIndex(figType, figNum)];
            if (grid[sq[0] - 1][sq[1]] === fig.empty) {
                addWhitePawnMove(sq, [sq[0] - 1, sq[1]]);
                if (sq[0] === 6 && grid[sq[0] - 2][sq[1]] === fig.empty) {
                    addQuietMove(obj(sq, [sq[0] - 2, sq[1]], fig.empty, fig.empty, obj1(false, true)));
                }
            }
            if (grid[sq[0] - 1][sq[1] - 1] > fig.empty &&
                figCol[grid[sq[0] - 1][sq[1] - 1]] === colors.black) {
                    addWhitePawnMove(sq, [sq[0] - 1, sq[1] - 1], grid[sq[0] - 1][sq[1] - 1]);
            }
            if (grid[sq[0] - 1][sq[1] + 1] > fig.empty &&
                figCol[grid[sq[0] - 1][sq[1] + 1]] === colors.black) {
                    addWhitePawnMove(sq, [sq[0] - 1, sq[1] + 1], grid[sq[0] - 1][sq[1] + 1]);
            }
            if (gameBoard.enPas[0] !== -1) {
                if (sq[0] - 1 === gameBoard.enPas[0] && sq[1] - 1 === gameBoard.enPas[1]) {
                    addEnPasMove(obj(sq, [sq[0] - 1, sq[1] - 1], fig.empty, fig.empty, obj1(true)));
                }
                if (sq[0] - 1 === gameBoard.enPas[0] && sq[1] + 1 === gameBoard.enPas[1]) {
                    addEnPasMove(obj(sq, [sq[0] - 1, sq[1] + 1], fig.empty, fig.empty, obj1(true)));
                }
            }
        }
        if (gameBoard.castlePerm[whiteKSide]) {
            if (grid[7][5] === fig.empty && grid[7][6] === fig.empty) {
                if (!isSqAttackedBySide(7, 4, colors.black) && 
                    !isSqAttackedBySide(7, 5, colors.black) && 
                    !isSqAttackedBySide(7, 6, colors.black)) {
                    addQuietMove(obj([7, 4], [7, 6], fig.empty, fig.empty, obj1(false, false, 'whiteKSide')));
                }
            }
        }
        if (gameBoard.castlePerm[whiteQSide]) {
            if (grid[7][1] === fig.empty && grid[7][2] === fig.empty && grid[7][3] === fig.empty) {
                if (!isSqAttackedBySide(7, 2, colors.black) && 
                    !isSqAttackedBySide(7, 3, colors.black) && 
                    !isSqAttackedBySide(7, 4, colors.black)) {
                    addQuietMove(obj([7, 4], [7, 2], fig.empty, fig.empty, obj1(false, false, 'whiteQSide')));
                }
            }
        }
        startIndex1 = 0;
        startIndex2 = 0;
    }
    else {
        let figType = fig.bP;
        for (let figNum = 0; figNum < gameBoard.figNum[figType]; figNum++) {
            let sq = gameBoard.figList[figIndex(figType, figNum)];
            if (grid[sq[0] + 1][sq[1]] === fig.empty) {
                addBlackPawnMove(sq, [sq[0] + 1, sq[1]]);
                if (sq[0] === 1 && grid[sq[0] + 2][sq[1]] === fig.empty) {
                    addQuietMove(obj(sq, [sq[0] + 2, sq[1]], fig.empty, fig.empty, obj1(false, true)));
                }
            }
            if (grid[sq[0] + 1][sq[1] - 1] > fig.empty &&
                figCol[grid[sq[0] + 1][sq[1] - 1]] === colors.white) {
                    addBlackPawnMove(sq, [sq[0] + 1, sq[1] - 1], grid[sq[0] + 1][sq[1] - 1]);
            }
            if (grid[sq[0] + 1][sq[1] + 1] > fig.empty &&
                figCol[grid[sq[0] + 1][sq[1] + 1]] === colors.white) {
                    addBlackPawnMove(sq, [sq[0] + 1, sq[1] + 1], grid[sq[0] + 1][sq[1] + 1]);
            }
            if (gameBoard.enPas[0] !== -1) {
                if (sq[0] + 1 === gameBoard.enPas[0] && sq[1] - 1 === gameBoard.enPas[1]) {
                    addEnPasMove(obj(sq, [sq[0] + 1, sq[1] - 1], fig.empty, fig.empty, obj1(true)));
                }
                if (sq[0] + 1 === gameBoard.enPas[0] && sq[1] + 1 === gameBoard.enPas[1]) {
                    addEnPasMove(obj(sq, [sq[0] + 1, sq[1] + 1], fig.empty, fig.empty, obj1(true)));
                }
            }
        }
        if (gameBoard.castlePerm[blackKSide]) {
            if (grid[0][5] === fig.empty && grid[0][6] === fig.empty) {
                if (!isSqAttackedBySide(0, 4, colors.white) && 
                    !isSqAttackedBySide(0, 5, colors.white) && 
                    !isSqAttackedBySide(0, 6, colors.white)) {
                    addQuietMove(obj([0, 4], [0, 6], fig.empty, fig.empty, obj1(false, false, 'blackKSide')));
                }
            }
        }
        if (gameBoard.castlePerm[blackQSide]) {
            if (grid[0][1] === fig.empty && grid[0][2] === fig.empty && grid[0][3] === fig.empty) {
                if (!isSqAttackedBySide(0, 2, colors.white) && 
                    !isSqAttackedBySide(0, 3, colors.white) && 
                    !isSqAttackedBySide(0, 4, colors.white)) {
                    addQuietMove(obj([0, 4], [0, 2], fig.empty, fig.empty, obj1(false, false, 'blackQSide')));
                }
            }
        }
        startIndex1 = 2;
        startIndex2 = 3;
    }
    //nonSlidesFigures
    for (let i = startIndex1; i < startIndex1 + 2; i++) {
        let fig = noSlideFigs[i];
        for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
            const sq = gameBoard.figList[figIndex(fig, figNum)];
            const dirs = figDir[fig];
            for (const dir of dirs) {
                let tempI = sq[0] + dir[0];
                let tempJ = sq[1] + dir[1];
                if (grid[tempI][tempJ] === -1) continue;
                else if (grid[tempI][tempJ] !== 0) {
                    if (figCol[grid[tempI][tempJ]] !== gameBoard.side) {
                        addCaptureMove(obj(sq, [tempI, tempJ], grid[tempI][tempJ], fig.empty, null));
                    }
                }
                else {
                    addQuietMove(obj(sq, [tempI, tempJ], fig.empty, fig.empty, null));
                }
            }
        }
    }
    //slideFigures
    for (let i = startIndex2; i < startIndex2 + 3; i++) {
        let fig = slideFigs[i];
        for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
            let sq = gameBoard.figList[figIndex(fig, figNum)];
            const dirs = figDir[fig];
            for (const dir of dirs) {
                let tempI = sq[0] + dir[0];
                let tempJ = sq[1] + dir[1];
                while (grid[tempI][tempJ] !== -1) {
                    if (grid[tempI][tempJ] !== 0) {
                        if (figCol[grid[tempI][tempJ]] !== gameBoard.side) {
                            addCaptureMove(obj(sq, [tempI, tempJ], grid[tempI][tempJ], fig.empty, null));
                        }
                        break;
                    }
                    addQuietMove(obj(sq, [tempI, tempJ], fig.empty, fig.empty, null));
                    tempI += dir[0];
                    tempJ += dir[1];
                }
            }
        }
    }
};