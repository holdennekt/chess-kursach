'use strict';

const block = document.querySelector('#container');

block.addEventListener('click', clicked);

createBoard(block);

const init = () => {
  updateMaterialAndFigList();
  gameBoard.posKey = genPosKey();
  generateMoves();
};

window.onload = init;
