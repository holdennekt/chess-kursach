'use strict';

const mvvLvaValue = [
    0, 100, 200, 300, 400, 500, 600,
    100, 200, 300, 400, 500, 600
];

const initMvvLva = () => {
    const res = arr(14 * 14);
    const magNum = 6;
    for (let attacker = figs.wP; attacker <= figs.bK; attacker++) {
        for (let victim = figs.wP; victim <= figs.bK; victim++) {
            const i = victim * 14 + attacker;
            const temp = mvvLvaValue[attacker] / 100;
            res[i] = mvvLvaValue[victim] + magNum - temp;
        }
    }
    return res;
};

const mvvLvaScores = initMvvLva();

const addMove = (from, to, captured = 0, promoted = 0, flag = Flag()) => {
    const move = { from, to, captured, promoted, flag };
    gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply + 1]] = move;
    if (captured !== 0) {
        gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]++] =
            mvvLvaScores[captured * 14 + grid[from[0]][from[1]]] + 1000000;
    } else if (flag.enPas) {
        gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]++] =
            105 + 1000000;
    } else {
        gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]] = 0;
        const moveKiller1 = gameBoard.searchKillers[gameBoard.ply];
        const moveKiller2 = gameBoard.searchKillers[gameBoard.ply + maxDepth];
        if (checkObjectsEqual(move, moveKiller1)) {
            gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]] =
                900000;
        } else if (checkObjectsEqual(move, moveKiller2)) {
            gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]] =
                800000;
        } else {
            const temp = grid[from[0]][from[1]] * 120 + sq120([mirror(to[0]), to[1]]);
            gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]] =
                gameBoard.searchHistory[temp];
        }
        gameBoard.moveListStart[gameBoard.ply + 1]++;
        // осторожно выше могут быть проблемы!!!?
    }
};

const addMove1 = (from, to, captured = 0, promoted = 0, flag = Flag()) => {
    const move = { from, to, captured, promoted, flag };
    gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply + 1]] = move;
    gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]++] = 0;
}

const addCaptureMove = (from, to, captured = 0, promoted = 0, flag = Flag()) => {
    const move = { from, to, captured, promoted, flag };
    gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply + 1]] = move;
    gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]++] =
        mvvLvaScores[captured * 14 + grid[from[0]][from[1]]] + 1000000;
};

const addQuietMove = (from, to, captured = 0, promoted = 0, flag = Flag()) => {
    const move = { from, to, captured, promoted, flag };
    gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply + 1]] = move;
    gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]] = 0;
    const moveKiller1 = gameBoard.searchKillers[gameBoard.ply];
    const moveKiller2 = gameBoard.searchKillers[gameBoard.ply + maxDepth];
    if (checkObjectsEqual(move, moveKiller1)) {
        gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]] =
            900000;
    } else if (checkObjectsEqual(move, moveKiller2)) {
        gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]] =
            800000;
    } else {
        const temp = grid[from[0]][from[1]] * 120 + sq120([mirror(to[0]), to[1]]);
        // console.log('===FIG===FROM===TO===SCORE===', revFigs[grid[from[0]][from[1]]], sq120([mirror(from[0]), from[1]]), sq120([mirror(to[0]), to[1]]), gameBoard.searchHistory[temp]);
        gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]] =
            gameBoard.searchHistory[temp];
    }
    gameBoard.moveListStart[gameBoard.ply + 1]++;
};

const addEnPassantMove = (from, to, captured = 0, promoted = 0, flag = Flag()) => {
    const move = { from, to, captured, promoted, flag };
    gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply + 1]] = move;
    gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply + 1]++] = 105 + 1000000;
}

const addWhitePawnCaptureMove = (from, to, captured) => {
    if (from[0] === 1) {
        addCaptureMove(from, to, captured, figs.wQ);
        addCaptureMove(from, to, captured, figs.wR);
        addCaptureMove(from, to, captured, figs.wB);
        addCaptureMove(from, to, captured, figs.wN);
    } else {
        addCaptureMove(from, to, captured);
    }
};

const addBlackPawnCaptureMove = (from, to, captured = figs.empty) => {
    if (from[0] === 6) {
        addCaptureMove(from, to, captured, figs.bQ);
        addCaptureMove(from, to, captured, figs.bR);
        addCaptureMove(from, to, captured, figs.bB);
        addCaptureMove(from, to, captured, figs.bN);
    } else {
        addCaptureMove(from, to, captured);
    }
};

const addWhitePawnQuietMove = (from, to, captured = figs.empty) => {
    if (from[0] === 1) {
        addQuietMove(from, to, captured, figs.wQ);
        addQuietMove(from, to, captured, figs.wR);
        addQuietMove(from, to, captured, figs.wB);
        addQuietMove(from, to, captured, figs.wN);
    } else {
        addQuietMove(from, to, captured);
    }
};

const addBlackPawnQuietMove = (from, to, captured = figs.empty) => {
    if (from[0] === 6) {
        addQuietMove(from, to, captured, figs.bQ);
        addQuietMove(from, to, captured, figs.bR);
        addQuietMove(from, to, captured, figs.bB);
        addQuietMove(from, to, captured, figs.bN);
    } else {
        addQuietMove(from, to, captured);
    }
};

const whitePawns = () => {
    const figType = figs.wP;
    for (let figNum = 0; figNum < gameBoard.figNum[figType]; figNum++) {
        const sq = gameBoard.figList[figIndex(figType, figNum)];
        if (grid[sq[0] - 1][sq[1]] === figs.empty) {
            addWhitePawnQuietMove(sq, [sq[0] - 1, sq[1]]);
            if (sq[0] === 6 && grid[sq[0] - 2][sq[1]] === figs.empty) {
                addQuietMove(sq, [sq[0] - 2, sq[1]], figs.empty,
                    figs.empty, Flag(false, true));
            }
        }
        if (grid[sq[0] - 1][sq[1] - 1] > figs.empty &&
            figCol[grid[sq[0] - 1][sq[1] - 1]] === colors.black) {
            addWhitePawnCaptureMove(sq, [sq[0] - 1, sq[1] - 1],
                grid[sq[0] - 1][sq[1] - 1]);
        }
        if (grid[sq[0] - 1][sq[1] + 1] > figs.empty &&
            figCol[grid[sq[0] - 1][sq[1] + 1]] === colors.black) {
            addWhitePawnCaptureMove(sq, [sq[0] - 1, sq[1] + 1],
                grid[sq[0] - 1][sq[1] + 1]);
        }
        if (!checkArrsEqual(gameBoard.enPas, noSq)) {
            if (sq[0] - 1 === gameBoard.enPas[0] &&
                sq[1] - 1 === gameBoard.enPas[1]) {
                addEnPassantMove(sq, [sq[0] - 1, sq[1] - 1],
                    figs.empty, figs.empty, Flag(true));
            }
            if (sq[0] - 1 === gameBoard.enPas[0] &&
                sq[1] + 1 === gameBoard.enPas[1]) {
                addEnPassantMove(sq, [sq[0] - 1, sq[1] + 1],
                    figs.empty, figs.empty, Flag(true));
            }
        }
    }
};

const blackPawns = () => {
    const figType = figs.bP;
    for (let figNum = 0; figNum < gameBoard.figNum[figType]; figNum++) {
        const sq = gameBoard.figList[figIndex(figType, figNum)];
        if (grid[sq[0] + 1][sq[1]] === figs.empty) {
            addBlackPawnQuietMove(sq, [sq[0] + 1, sq[1]]);
            if (sq[0] === 1 && grid[sq[0] + 2][sq[1]] === figs.empty) {
                addQuietMove(sq, [sq[0] + 2, sq[1]], figs.empty,
                    figs.empty, Flag(false, true));
            }
        }
        if (grid[sq[0] + 1][sq[1] - 1] > figs.empty &&
            figCol[grid[sq[0] + 1][sq[1] - 1]] === colors.white) {
            addBlackPawnCaptureMove(sq, [sq[0] + 1, sq[1] - 1],
                grid[sq[0] + 1][sq[1] - 1]);
        }
        if (grid[sq[0] + 1][sq[1] + 1] > figs.empty &&
            figCol[grid[sq[0] + 1][sq[1] + 1]] === colors.white) {
            addBlackPawnCaptureMove(sq, [sq[0] + 1, sq[1] + 1],
                grid[sq[0] + 1][sq[1] + 1]);
        }
        if (gameBoard.enPas[0] !== -1) {
            if (sq[0] + 1 === gameBoard.enPas[0] &&
                sq[1] - 1 === gameBoard.enPas[1]) {
                addEnPassantMove(sq, [sq[0] + 1, sq[1] - 1], figs.empty,
                    figs.empty, Flag(true));
            }
            if (sq[0] + 1 === gameBoard.enPas[0] &&
                sq[1] + 1 === gameBoard.enPas[1]) {
                addEnPassantMove(sq, [sq[0] + 1, sq[1] + 1], figs.empty,
                    figs.empty, Flag(true));
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
            if (!isSqAttackedBySide([i, 4], colors[str] ^ 1) &&
                !isSqAttackedBySide([i, 5], colors[str] ^ 1) &&
                !isSqAttackedBySide([i, 6], colors[str] ^ 1)) {
                addQuietMove([i, 4], [i, 6], figs.empty,
                    figs.empty, Flag(false, false, str + 'KSide'));
            }
        }
    }
    if (gameBoard.castlePerm[str + 'QSide']) {
        if (grid[i][1] === figs.empty &&
            grid[i][2] === figs.empty &&
            grid[i][3] === figs.empty) {
            if (!isSqAttackedBySide([i, 2], colors[str] ^ 1) &&
                !isSqAttackedBySide([i, 3], colors[str] ^ 1) &&
                !isSqAttackedBySide([i, 4], colors[str] ^ 1)) {
                addQuietMove([i, 4], [i, 2], figs.empty,
                    figs.empty, Flag(false, false, str + 'QSide'));
            }
        }
    }
};

const noSlide = index => {
    for (let i = index; i < index + 2; i++) {
        const fig = noSlideFigs[i];
        for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
            const sq = gameBoard.figList[figIndex(fig, figNum)];
            const dirs = figDir[fig];
            for (const dir of dirs) {
                const tempI = sq[0] + dir[0];
                const tempJ = sq[1] + dir[1];
                if (grid[tempI][tempJ] === figs.offBoard) continue;
                else if (grid[tempI][tempJ] !== figs.empty) {
                    if (figCol[grid[tempI][tempJ]] !== gameBoard.side) {
                        addCaptureMove(sq, [tempI, tempJ], grid[tempI][tempJ]);
                    }
                } else if (grid[tempI][tempJ] === figs.empty) {
                    addQuietMove(sq, [tempI, tempJ]);
                }
            }
        }
    }
};

const slide = index => {
    for (let i = index; i < index + 3; i++) {
        const fig = slideFigs[i];
        for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
            const sq = gameBoard.figList[figIndex(fig, figNum)];
            const dirs = figDir[fig];
            for (const dir of dirs) {
                let tempI = sq[0] + dir[0];
                let tempJ = sq[1] + dir[1];
                while (grid[tempI][tempJ] !== -1) {
                    if (grid[tempI][tempJ] !== 0) {
                        if (figCol[grid[tempI][tempJ]] !== gameBoard.side) {
                            addCaptureMove(sq, [tempI, tempJ],
                                grid[tempI][tempJ]);
                        }
                        break;
                    }
                    addQuietMove(sq, [tempI, tempJ]);
                    tempI += dir[0];
                    tempJ += dir[1];
                }
            }
        }
    }
};

const generateMoves = () => {
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
    noSlide(startIndex1);
    slide(startIndex2);
    // console.log('\nend of generateMoves\n');
};

const generateCaptures = () => {
    gameBoard.moveListStart[gameBoard.ply + 1] =
        gameBoard.moveListStart[gameBoard.ply];
    let startIndex1, startIndex2;
    if (gameBoard.side === colors.white) {
        const figType = figs.wP;
        for (let figNum = 0; figNum < gameBoard.figNum[figType]; figNum++) {
            const sq = gameBoard.figList[figIndex(figType, figNum)];
            if (grid[sq[0] - 1][sq[1] - 1] > figs.empty &&
                figCol[grid[sq[0] - 1][sq[1] - 1]] === colors.black) {
                addWhitePawnCaptureMove(sq, [sq[0] - 1, sq[1] - 1],
                    grid[sq[0] - 1][sq[1] - 1]);
            }
            if (grid[sq[0] - 1][sq[1] + 1] > figs.empty &&
                figCol[grid[sq[0] - 1][sq[1] + 1]] === colors.black) {
                addWhitePawnCaptureMove(sq, [sq[0] - 1, sq[1] + 1],
                    grid[sq[0] - 1][sq[1] + 1]);
            }
            if (gameBoard.enPas[0] !== -1) {
                if (sq[0] - 1 === gameBoard.enPas[0] &&
                    sq[1] - 1 === gameBoard.enPas[1]) {
                    addEnPassantMove(sq, [sq[0] - 1, sq[1] - 1],
                        figs.empty, figs.empty, Flag(true));
                }
                if (sq[0] - 1 === gameBoard.enPas[0] &&
                    sq[1] + 1 === gameBoard.enPas[1]) {
                    addEnPassantMove(sq, [sq[0] - 1, sq[1] + 1],
                        figs.empty, figs.empty, Flag(true));
                }
            }
        }
        startIndex1 = 0, startIndex2 = 0;
    } else {
        const figType = figs.bP;
        for (let figNum = 0; figNum < gameBoard.figNum[figType]; figNum++) {
            const sq = gameBoard.figList[figIndex(figType, figNum)];
            if (grid[sq[0] + 1][sq[1] - 1] > figs.empty &&
                figCol[grid[sq[0] + 1][sq[1] - 1]] === colors.white) {
                addBlackPawnCaptureMove(sq, [sq[0] + 1, sq[1] - 1],
                    grid[sq[0] + 1][sq[1] - 1]);
            }
            if (grid[sq[0] + 1][sq[1] + 1] > figs.empty &&
                figCol[grid[sq[0] + 1][sq[1] + 1]] === colors.white) {
                addBlackPawnCaptureMove(sq, [sq[0] + 1, sq[1] + 1],
                    grid[sq[0] + 1][sq[1] + 1]);
            }
            if (gameBoard.enPas[0] !== -1) {
                if (sq[0] + 1 === gameBoard.enPas[0] &&
                    sq[1] - 1 === gameBoard.enPas[1]) {
                    addEnPassantMove(sq, [sq[0] + 1, sq[1] - 1], figs.empty,
                        figs.empty, Flag(true));
                }
                if (sq[0] + 1 === gameBoard.enPas[0] &&
                    sq[1] + 1 === gameBoard.enPas[1]) {
                    addEnPassantMove(sq, [sq[0] + 1, sq[1] + 1], figs.empty,
                        figs.empty, Flag(true));
                }
            }
        }
        startIndex1 = 2, startIndex2 = 3;
    }
    for (let i = startIndex1; i < startIndex1 + 2; i++) {
        const fig = noSlideFigs[i];
        for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
            const sq = gameBoard.figList[figIndex(fig, figNum)];
            const dirs = figDir[fig];
            for (const dir of dirs) {
                const tempI = sq[0] + dir[0];
                const tempJ = sq[1] + dir[1];
                if (grid[tempI][tempJ] === figs.offBoard) continue;
                else if (grid[tempI][tempJ] !== figs.empty) {
                    if (figCol[grid[tempI][tempJ]] !== gameBoard.side) {
                        addCaptureMove(sq, [tempI, tempJ], grid[tempI][tempJ]);
                    }
                }
            }
        }
    }
    for (let i = startIndex2; i < startIndex2 + 3; i++) {
        const fig = slideFigs[i];
        for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
            const sq = gameBoard.figList[figIndex(fig, figNum)];
            const dirs = figDir[fig];
            for (const dir of dirs) {
                let tempI = sq[0] + dir[0];
                let tempJ = sq[1] + dir[1];
                while (grid[tempI][tempJ] !== -1) {
                    if (grid[tempI][tempJ] !== 0) {
                        if (figCol[grid[tempI][tempJ]] !== gameBoard.side) {
                            addCaptureMove(sq, [tempI, tempJ],
                                grid[tempI][tempJ]);
                        }
                        break;
                    }
                    tempI += dir[0];
                    tempJ += dir[1];
                }
            }
        }
    }
}

const moveExists = move => {
    generateMoves();
    const start = gameBoard.moveListStart[gameBoard.ply];
    const end = gameBoard.moveListStart[gameBoard.ply + 1];
    for (let index = start; index < end; index++) {
        let moveFound = gameBoard.moveList[index];
        if (!makeMove(moveFound)) {
            continue;
        }
        takeMove();
        if (checkObjectsEqual(move, moveFound)) {
            return true;
        }
    }
    return false;
};
