const moveExists = (move) => {
    generateMoves();
    const start = gameBoard.moveListStart[gameBoard.ply];
    const end = gameBoard.moveListStart[gameBoard.ply + 1];
    for (let index = start; index < end; index++) {
        let moveFound = gameBoard.moveList[index];
        if (!makeMove(moveFound)) continue;
        takeMove();
        if (move === moveFound) return true;
    }
    return false;
};

const flag = (enPas, pawnStart = false, castling = '') =>
    ({ enPas, pawnStart, castling });
const defoltFlag = () => ({ enPas: 0, pawnStart: false, castling: ''});
const addMove = (from, to, captured = 0, promoted = 0, flag = defoltFlag()) => {
    const move = { from, to, captured, promoted, flag };
    gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply + 1]] = move;
    gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]++] = 0;
};

const addWhitePawnMove = (from, to, captured = figs.empty) => {
    if (from[0] === 1) {
        addMove(from, to, captured, figs.wQ);
        addMove(from, to, captured, figs.wR);
        addMove(from, to, captured, figs.wB);
        addMove(from, to, captured, figs.wN);
    } else {
        addMove(from, to, captured);
    }
};

const addBlackPawnMove = (from, to, captured = figs.empty) => {
    if (from[0] === 6) {
        addMove(from, to, captured, figs.bQ);
        addMove(from, to, captured, figs.bR);
        addMove(from, to, captured, figs.bB);
        addMove(from, to, captured, figs.bN);
    } else {
        addMove(from, to, captured);
    }
};

const whitePawns = () => {
    const figType = figs.wP;
    for (let figNum = 0; figNum < gameBoard.figNum[figType]; figNum++) {
        const sq = gameBoard.figList[figIndex(figType, figNum)];
        if (grid[sq[0] - 1][sq[1]] === figs.empty) {
            addWhitePawnMove(sq, [sq[0] - 1, sq[1]]);
            if (sq[0] === 6 && grid[sq[0] - 2][sq[1]] === figs.empty) {
                addMove(sq, [sq[0] - 2, sq[1]], figs.empty,
                    figs.empty, flag(false, true));
            }
        }
        if (grid[sq[0] - 1][sq[1] - 1] > figs.empty &&
            figCol[grid[sq[0] - 1][sq[1] - 1]] === colors.black) {
            addWhitePawnMove(sq, [sq[0] - 1, sq[1] - 1],
                grid[sq[0] - 1][sq[1] - 1]);
        }
        if (grid[sq[0] - 1][sq[1] + 1] > figs.empty &&
            figCol[grid[sq[0] - 1][sq[1] + 1]] === colors.black) {
            addWhitePawnMove(sq, [sq[0] - 1, sq[1] + 1],
                grid[sq[0] - 1][sq[1] + 1]);
        }
        if (gameBoard.enPas[0] !== -1) {
            if (sq[0] - 1 === gameBoard.enPas[0] &&
                sq[1] - 1 === gameBoard.enPas[1]) {
                addMove(sq, [sq[0] - 1, sq[1] - 1],
                    figs.empty, figs.empty, flag(true));
            }
            if (sq[0] - 1 === gameBoard.enPas[0] &&
                sq[1] + 1 === gameBoard.enPas[1]) {
                addMove(sq, [sq[0] - 1, sq[1] + 1],
                    figs.empty, figs.empty, flag(true));
            }
        }
    }
};

const blackPawns = () => {
    const figType = figs.bP;
    for (let figNum = 0; figNum < gameBoard.figNum[figType]; figNum++) {
        const sq = gameBoard.figList[figIndex(figType, figNum)];
        if (grid[sq[0] + 1][sq[1]] === figs.empty) {
            addBlackPawnMove(sq, [sq[0] + 1, sq[1]]);
            if (sq[0] === 1 && grid[sq[0] + 2][sq[1]] === figs.empty) {
                addMove(sq, [sq[0] + 2, sq[1]], figs.empty,
                    figs.empty, flag(false, true));
            }
        }
        if (grid[sq[0] + 1][sq[1] - 1] > figs.empty &&
            figCol[grid[sq[0] + 1][sq[1] - 1]] === colors.white) {
            addBlackPawnMove(sq, [sq[0] + 1, sq[1] - 1],
                grid[sq[0] + 1][sq[1] - 1]);
        }
        if (grid[sq[0] + 1][sq[1] + 1] > figs.empty &&
            figCol[grid[sq[0] + 1][sq[1] + 1]] === colors.white) {
            addBlackPawnMove(sq, [sq[0] + 1, sq[1] + 1],
                grid[sq[0] + 1][sq[1] + 1]);
        }
        if (gameBoard.enPas[0] !== -1) {
            if (sq[0] + 1 === gameBoard.enPas[0] &&
                sq[1] - 1 === gameBoard.enPas[1]) {
                addMove(sq, [sq[0] + 1, sq[1] - 1], figs.empty,
                    figs.empty, flag(true));
            }
            if (sq[0] + 1 === gameBoard.enPas[0] &&
                sq[1] + 1 === gameBoard.enPas[1]) {
                addMove(sq, [sq[0] + 1, sq[1] + 1], figs.empty,
                    figs.empty, flag(true));
            }
        }
    }
};

const castle = side => {
    let i, str;
    if (side === colors.white) i = 7, str = 'white';
    else i = 0, str = 'black';
    if (gameBoard.castlePerm[str + 'KSide']) {
        if (grid[i][5] === figs.empty && grid[i][6] === figs.empty) {
            if (!isSqAttackedBySide(i, 4, colors[str]) &&
                !isSqAttackedBySide(i, 5, colors[str]) &&
                !isSqAttackedBySide(i, 6, colors[str])) {
                addMove([i, 4], [i, 6], figs.empty,
                    figs.empty, flag(false, false, str + 'KSide'));
            }
        }
    }
    if (gameBoard.castlePerm[str + 'QSide']) {
        if (grid[i][1] === figs.empty &&
            grid[i][2] === figs.empty &&
            grid[i][3] === figs.empty) {
            if (!isSqAttackedBySide(i, 2, colors[str]) &&
                !isSqAttackedBySide(i, 3, colors[str]) &&
                !isSqAttackedBySide(i, 4, colors[str])) {
                addMove([i, 4], [i, 2], figs.empty,
                    figs.empty, flag(false, false, str + 'QSide'));
            }
        }
    }
};

const nonslide = index => {
    for (let i = index; i < index + 2; i++) {
        const figg = noSlideFigs[i];
        for (let figNum = 0; figNum < gameBoard.figNum[figg]; figNum++) {
            const sq = gameBoard.figList[figIndex(figg, figNum)];
            const dirs = figDir[figg];
            for (const dir of dirs) {
                const tempI = sq[0] + dir[0];
                const tempJ = sq[1] + dir[1];
                if (grid[tempI][tempJ] === figs.offBoard) continue;
                else if (grid[tempI][tempJ] !== figs.empty) {
                    if (figCol[grid[tempI][tempJ]] !== gameBoard.side) {
                        addMove(sq, [tempI, tempJ], grid[tempI][tempJ]);
                    }
                } else if (grid[tempI][tempJ] === figs.empty) {
                    addMove(sq, [tempI, tempJ]);
                }
            }
        }
    }
};

const slide = index => {
    for (let i = index; i < index + 3; i++) {
        const figg = slideFigs[i];
        for (let figNum = 0; figNum < gameBoard.figNum[figg]; figNum++) {
            const sq = gameBoard.figList[figIndex(figg, figNum)];
            const dirs = figDir[figg];
            for (const dir of dirs) {
                let tempI = sq[0] + dir[0];
                let tempJ = sq[1] + dir[1];
                while (grid[tempI][tempJ] !== -1) {
                    if (grid[tempI][tempJ] !== 0) {
                        if (figCol[grid[tempI][tempJ]] !== gameBoard.side) {
                            addMove(sq, [tempI, tempJ],
                                grid[tempI][tempJ]);
                        }
                        break;
                    }
                    addMove(sq, [tempI, tempJ]);
                    tempI += dir[0];
                    tempJ += dir[1];
                }
            }
        }
    }
};

const generateMoves = () => {
    gameBoard.moveList = arr0(700);
    gameBoard.moveListStart[gameBoard.ply + 1] =
        gameBoard.moveListStart[gameBoard.ply];
    let startIndex1, startIndex2;
    if (gameBoard.side === colors.white) {
        whitePawns();
        castle(colors.white);
        startIndex1 = 0, startIndex2 = 0;
    } else {
        blackPawns();
        castle(colors.black);
        startIndex1 = 2, startIndex2 = 3;
    }
    nonslide(startIndex1);
    slide(startIndex2);
};
