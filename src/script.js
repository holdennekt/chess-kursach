'use strict';

const block = document.querySelector('#container');

block.addEventListener('click', clicked);

createBoard(block);

window.onload = onLoad;


function onLoad() {
    init();
    updateListsMaterial();
    // generateMoves();
    // makeMove(gameBoard.moveList[9]);
    // logGrid();
    console.log(grid[-1][0]);
}

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

const initHashKeys = () => {
    for (let i = 0; i < 14 * 120; i++) {
        figKeys[i] = rand32();
    }
    sideKey = rand32();
    for (let i = 0; i < 16; i++) {
        castleKeys[i] = rand32();
    }
}

const init = () => {
    initHashKeys();
}


