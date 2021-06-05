'use strict';

const boardBlock = document.querySelector('#container');

boardBlock.addEventListener('mousedown', clicked);

createBoard(boardBlock);

const init = () => {
  updateMaterialAndFigList();
  gameBoard.posKey = genPosKey();
  generateMoves();
};

window.onload = init;
