const getPvNum = (depth) => {
    const move = probePvTable();
    let count = 0;
    while (move.from !== 0 && move.to !== 0 && count < depth) {
        if (moveExists(move)) {
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

const probePvTable = () => {
    const index = gameBoard.posKey % pvEntries;
    if (gameBoard.pvTable[index].posKey === gameBoard.posKey) {
        return gameBoard.pvTable[index].move;
    }
    return emptyMove();
};

const storePvMove = (move) => {
    const index = gameBoard.posKey % pvEntries;
    gameBoard.pvTable[index].posKey = gameBoard.posKey;
    gameBoard.pvTable[index].move = move;
};