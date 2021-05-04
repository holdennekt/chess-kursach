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
    '0' : 0,
    '1' : 0,
};
gameBoard.figList = arr0(10 * 13);
gameBoard.figNum = arr0(13);
gameBoard.moveList = arr0(700);
gameBoard.moveListStart = arr0(7);
gameBoard.moveScores = [];

const checkBoard = () => {
    let t_figNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let t_score = [0, 0];
}

const updateListsMaterial = () => {
    gameBoard.score.white = 0, gameBoard.score.black = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let figg = grid[i][j];
            if (figg !== fig.empty) {
                let sq = [i, j];
                let color = figCol[figg];
                console.log(color);
                gameBoard.score[color] += figValue[figg];
                gameBoard.figList[figIndex(figg, gameBoard.figNum[figg])] = sq;
                gameBoard.figNum[figg]++;
            }
        }
    }
    console.log(`white score = ${gameBoard.score.white} black score = ${gameBoard.score.black}`);
}