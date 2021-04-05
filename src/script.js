const block = $('#container')[0];

const grid = createGrid();

$('#container').on('click', clickedOnCell);

fillDivs(block);