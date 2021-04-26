const gameBoard = {
	'side': colors.white,
	'fiftyMove': 0,
	'hisPly': 0,
	'ply': 0,
	'castlePerm': 0,
    'enPas' : 0,
};
gameBoard.score = {
    'white' : 0,
    'black' : 0,
};
gameBoard.figList = [];
gameBoard.figNum = [];
gameBoard.moveList = [];
gameBoard.moveListFirst = [];