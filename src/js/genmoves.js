const generateMoves = () => {
    gameBoard.moveListStart[gameBoard.ply + 1] = gameBoard.moveListStart[gameBoard.ply];
    if (gameBoard.side === colors.white) {
        let figType = fig.wP;
        for (let figNum = 0; figNum < gameBoard.figNum[figType]; figNum++) {
            let sq = gameBoard.figList[figIndex(figType, figNum)];
            if (grid[sq[0] - 1][sq[1]] === fig.empty) {
                //hod na 1
                if (sq[0] === 6 && grid[sq[0] - 2][sq[1]] === fig.empty) {
                    //hod na 2
                }
            }
            if (grid[sq[0] - 1][sq[1] - 1] > fig.empty &&
                figCol[grid[sq[0] - 1][sq[1] - 1]] === colors.black) {
                    //bit`
            }
            if (grid[sq[0] - 1][sq[1] + 1] > fig.empty &&
                figCol[grid[sq[0] - 1][sq[1] + 1]] === colors.black) {
                    //bit`
            }
            //if (gameBoard.enPas)
        }
    }
};