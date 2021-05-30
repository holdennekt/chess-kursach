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

    // get principle variation move
    // order pv move

    let legal = 0;
    let oldAlpha = alpha, bestMove = emptyMove();
    const start = gameBoard.moveListStart[gameBoard.ply];
    const end = gameBoard.moveListStart[gameBoard.ply + 1];
    for (let index = start; index < end; index++) {
        const move = gameBoard.moveList[index];
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
                // update killer moves
                return beta;
            }
            alpha = score;
            bestMove = move;
            // update histoty table
        }
    }

    if (alpha !== oldAlpha) {
        storePvMove(bestMove);
    }
    return alpha;

}

const alphaBeta = (alpha, beta, depth) => {
    if (depth <= 0) {
        return quiescence(alpha, beta);
    }
    if (search.nodes % 2048 === 0) checkTime();
    search.nodes++;


    //check if repeats or fiftymove

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

    // get principle variation move
    // order pv move

    let legal = 0;
    let oldAlpha = alpha, bestMove = emptyMove();
    const start = gameBoard.moveListStart[gameBoard.ply];
    const end = gameBoard.moveListStart[gameBoard.ply + 1];
    for (let index = start; index < end; index++) {
        const move = gameBoard.moveList[index];
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
                // update killer moves
                return beta;
            }
            alpha = score;
            bestMove = move;
            // update histoty table
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
    console.log(lineInfo);
    search.best = bestMove;
    search.thinking = false;
};
