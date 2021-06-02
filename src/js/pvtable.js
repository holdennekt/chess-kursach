'use strict';

const probePvTable = () => {
    const index = gameBoard.posKey % pvEntries;
    if (gameBoard.pvTable[index].posKey === gameBoard.posKey) {
        // console.log('probing pvMove', gameBoard.pvTable[index].move);
        return gameBoard.pvTable[index].move;
    }
    // console.log('probing pvMove', emptyMove());
    return emptyMove();
};

const getPvNum = depth => {
    let move = probePvTable();
    let count = 0;
    while (!checkObjectsEqual(move, emptyMove()) && count < depth) {
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

const storePvMove = move => {
    // console.log('storing pvMove', move);
    const index = gameBoard.posKey % pvEntries;
    gameBoard.pvTable[index].posKey = gameBoard.posKey;
    gameBoard.pvTable[index].move = move;
};
