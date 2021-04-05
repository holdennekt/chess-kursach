const block = document.querySelector('#container');

const grid = createGrid();

block.addEventListener('click', clickedOnCell);

fillDivs(block);