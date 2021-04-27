const gameBoard = {
	'side': colors.white,
	'fiftyMove': 0,
	'hisPly': 0,
	'ply': 0,
	'castlePerm': {
        whiteKSide: true,
        whiteQSide: true,
        blackKSide: true,
        blackQSide: true,
    },
    'enPas': [-1, -1],
    'history' : [],
};
gameBoard.score = {
    'white' : 0,
    'black' : 0,
};
gameBoard.figList = arr(10 * 13);
gameBoard.figNum = arr(13);
gameBoard.moveList = [];
gameBoard.moveListStart = [];
gameBoard.moveScores = [];

const checkBoard = () => {
    let t_figNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let t_score = [0, 0];
}

const updateListsMaterial = () => {
    gameBoard.score.white = 0, gameBoard.score.black = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let fig = grid[i][j];
            if (fig !== fig.empty) {
                let sq = [i, j];
                let color = figCol[fig];
                gameBoard.score[color] += figValue[fig];
                gameBoard.figList[figIndex(fig, gameBoard.figNum[fig])] = sq;
                gameBoard.figNum[fig]++;
            }
        }
    }
    console.log(`white score = ${gameBoard.score.white} black score = ${gameBoard.score.black}`);
}