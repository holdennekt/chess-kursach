'use strict';

const block = document.querySelector('#container');

const grid = createGrid();

block.addEventListener('click', clickedOnCell);

createBoard(block);
