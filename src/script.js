'use strict';

const block = document.querySelector('#container');

block.addEventListener('click', clicked);

createBoard(block);

const initHashKeys = () => {
    for (let i = 0; i < 14 * 120; i++) {
        figKeys[i] = rand32();
    }
    sideKey = rand32();
    for (let i = 0; i < 16; i++) {
        castleKeys[i] = rand32();
    }
};

const init = () => {
    initHashKeys();
    updateListsMaterial();
    gameBoard.posKey = genPosKey();
    generateMoves();
};

window.onload = init;