'use strict';
const search = {};
search.nodes;
search.failHigh;
search.failHighFirst;
search.depth;
search.time;
search.start;
search.stop;
search.best;
search.thinking;

const pickNextMove = moveNum => {
    let bestScore = -1;
    let bestNum = moveNum;

    for (let i = moveNum; i < gameBoard.moveListStart[gameBoard.ply + 1]; i++) {
        if (gameBoard.moveScores[i] > bestScore) {
            bestScore = gameBoard.moveScores[i];
            bestNum = i;
        }
    }
    if (bestNum !== moveNum) {
        let temp = 0;
        temp = gameBoard.moveScores[moveNum];
        gameBoard.moveScores[moveNum] = gameBoard.moveScores[bestNum];
        gameBoard.moveScores[bestNum] = temp;

        temp = gameBoard.moveList[moveNum];
        gameBoard.moveList[moveNum] = gameBoard.moveList[bestNum];
        gameBoard.moveList[bestNum] = temp;


    }
};

const clearPvTable = () => {
    for (const elem of gameBoard.pvTable) {
        elem.move = null;
        elem.posKey = 0;
    }
};
const checkTime = () => {
    if ((Date.now() - search.start) > search.time) search.stop = true;
};

const isRepetition = () => {
    const start = gameBoard.hisPly - gameBoard.fiftymove;
    for (let i = start; i < gameBoard.hisPly - 1; i++) {
        if (gameBoard.posKey === gameBoard.history[i].posKey) {
            return true;
        }
    }
    return false;
};

const quiescence = (alpha, beta) => {
    if (search.nodes % 2048 === 0) checkTime();
    search.nodes++;
    const statement = (isRepetition() || gameBoard.fiftymove >= 100);
    if (statement && gameBoard.ply !== 0) {
        return 0;
    }
    if (gameBoard.ply > maxDepth - 1) {
        return evalPosition();
    }
    let score = evalPosition();
    if (score >= beta) {
        return beta;
    }
    if (score > alpha) {
        alpha = score;
    }
    generateMoves();

    let legal = 0, bestMove = emptyMove();
    const oldAlpha = alpha;
    const start = gameBoard.moveListStart[gameBoard.ply];
    const end = gameBoard.moveListStart[gameBoard.ply + 1];
    for (let i = start; i < end; i++) {
        pickNextMove(i);
        const move = gameBoard.moveList[i];
        if (!isMoveLegal(move) || move.captured === 0) continue;
        legal++;
        score = -quiescence(-alpha, -beta);
        if (search.stop === true) return 0;
        if (score > alpha) {
            if (score >= beta) {
                if (legal === 1) {
                    search.failHighFirst++;
                }
                search.failHigh++;
                return beta;
            }
            alpha = score;
            bestMove = move;
        }
    }

    if (alpha !== oldAlpha) {
        storePvMove(bestMove);
    }
    return alpha;

};

const alphaBeta = (alpha, beta, depth) => {
    if (depth <= 0) {
        return quiescence(alpha, beta);
    }
    if (search.nodes % 2048 === 0) checkTime();
    search.nodes++;


    const statement = (isRepetition() || gameBoard.fiftymove >= 100);
    if (statement && gameBoard.ply !== 0) {
        return 0;
    }
    if (gameBoard.ply > maxDepth - 1) {
        return evalPosition();
    }
    const inCheck = isSqAttackedBySide(
        gameBoard.figList[figIndex(kings[gameBoard.side], 0)],
        gameBoard.side ^ 1
    );
    if (inCheck) depth++;
    let score = -inf;
    generateMoves();
    let legal = 0, bestMove = emptyMove();
    const oldAlpha = alpha;
    const start = gameBoard.moveListStart[gameBoard.ply];
    const end = gameBoard.moveListStart[gameBoard.ply + 1];
    const pvMove = probePvTable();
    if (checkObjectsEqual(pvMove, noMove())) {
        for (let i = start; i < end; i++) {
            if (gameBoard.moveList[moveNum] === pvMove) {
                gameBoard.moveScores[moveNum] = 2000000;
                break;
            }
        }
    }
    for (let i = start; i < end; i++) {
        pickNextMove(i);
        const move = gameBoard.moveList[i];
        if (!isMoveLegal(move)) continue;
        legal++;
        score = -alphaBeta(-alpha, -beta, depth - 1);
        if (search.stop === true) return 0;
        if (score > alpha) {
            if (score >= beta) {
                if (legal === 1) {
                    search.failHighFirst++;
                }
                search.failHigh++;
                if (move.captured === 0) {
                    gameBoard.searchKillers[maxDepth + gameBoard.ply] =
                        gameBoard.searchKillers[gameBoard.ply];
                    gameBoard.searchKillers[gameBoard.ply] = move;
                }
                return beta;
            }
            if (move.captured === 0) {
                const index = grid[from[0]][from[1]] * 120 + sq120(move.to);
                gameBoard.searchHistory[index] += depth * depth;
            }
            alpha = score;
            bestMove = move;
        }
    }
    if (legal === 0) {
        if (inCheck) return -mate + gameBoard.ply;
        return 0;
    }
    if (alpha !== oldAlpha) {
        storePvMove(bestMove);
    }
    return alpha;
};

const clearForSearch = () => {
    for (let elem of gameBoard.searchHistory) {
        elem = 0;
    }
    for (let elem of gameBoard.searchKillers) {
        elem = 0;
    }
    gameBoard.ply = 0;
    search.nodes = 0;
    search.failHigh = 0;
    search.failHighFirst = 0;
    search.start = Date.now();
    search.stop = false;
    clearPvTable();
};

const searchPosition = () => {
    let bestScore = -inf, curDepth = 1;
    clearForSearch();
    for (curDepth = 1; curDepth <= /*search.depth*/5; curDepth++) {
        bestScore = alphaBeta(-inf, inf, curDepth);
        if (search.stop === true) break;
    }
    const bestMove = probePvTable();
    let lineInfo =
        `depth: ${curDepth} best: ${bestMove.from} -> ${bestMove.to}
        score: ${bestScore} nodes: ${search.nodes}`;
    const pvNum = getPvNum(curDepth);
    for (let i = 0; i < pvNum; i++) {
        lineInfo += ` ${gameBoard.pvArr[i].from} -> ${gameBoard.pvArr[i].to}`;
    }
    if (curDepth !== 1) {
        const temp = search.failHighFirst / search.failHigh * 100;
        lineInfo +=  ` Ordering: ${temp.toFixed(2)}%`;
    }
    console.log(lineInfo);
    search.best = bestMove;
    search.thinking = false;
};
