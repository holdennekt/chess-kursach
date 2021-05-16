'use strict';

const block = document.querySelector('#container');

block.addEventListener('click', clickedOnSquare);

createBoard(block);

const initBoardVars = () => {
    for (const elem of gameBoard.history) {
        elem = {
            move: null,
            fiftyMove: 0,
            posKey: 0,
        }
    }
    for (const elem of gameBoard.pvTable) {
        elem = {
            move: null,
            posKey: 0,
        }
    }
};