const probePvTable = () => {
    const index = gameBoard.posKey % pvEntries;
    if (gameBoard.pvTable[index].posKey === gameBoard.posKey) {
        return gameBoard.pvTable[index].move;
    }
    return emptyMove();
};

const findMove = move => {
    const start = gameBoard.moveListStart[gameBoard.ply];
    const end = gameBoard.moveListStart[gameBoard.ply + 1];
    for (let index = start; index < end; index++) {
        let moveFound = gameBoard.moveList[index];
        if (!isMoveLegal(moveFound)) continue;
        if (checkArrsEqual(moveFound.from, move.from) &&
            checkArrsEqual(moveFound.to, move.to)) return moveFound;
    }
    return noMove();
};

const getPvNum = depth => {
    let move = probePvTable();
    let count = 0;
    while (move.from !== 0 && move.to !== 0 && count < depth) {
        if (!checkObjectsEqual(findMove(move), noMove())) {
            makeMove(move);
            gameBoard.pvArr[count++] = move;
        } else break;
        move = probePvTable();
    }
    while (gameBoard.ply > 0) {
        takeMove();
    }
    return count;
};

const storePvMove = move => {
    const index = gameBoard.posKey % pvEntries;
    gameBoard.pvTable[index].posKey = gameBoard.posKey;
    gameBoard.pvTable[index].move = move;
};
