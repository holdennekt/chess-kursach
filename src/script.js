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

init();