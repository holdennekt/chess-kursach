const userMove = {
    'from': [-1, -1],
    'to': [-1, -1],
};

const parseMove = (from, to) => {
    generateMoves();
    const start = gameBoard.moveListStart[gameBoard.ply];
    const end = gameBoard.moveListStart[gameBoard.ply + 1];
    for (let index = start; index < end; index++) {
        let move = gameBoard.moveList[index];
        
    }
};

const deselectSquares = () => {
    const selected = document.querySelector('.selected');
    if (selected) selected.classList.remove('selected');
};

const selectSquares = (i, j) => {
    deselectSquares();
    const suggested = document.querySelectorAll('.suggested');
    for (const elem of suggested) elem.classList.remove('suggested');
    if (grid[i][j] > figs.empty && grid[i][j] < figs.bP) {
        document.querySelector(`#sq_${i}${j}`).className += ' selected';
    }
};

const clickedOnSquare = (i, j) => {
    console.log(`clicked on square_${i}${j}`);
    if (userMove.from[0] !== -1 && userMove.from[1] !== -1) {
        userMove.to[0] = i, userMove.to[1] = j;
        makeUserMove();
    }
}

const clickedOnFigure = (i, j) => {
    console.log(`clicked on figure ${grid[i][j]} at square_${i}${j}`);
    if (userMove.from[0] === -1 && userMove.from[1] === -1) {
        userMove.from[0] = i, userMove.from[1] = j;
    } else {
        userMove.to[0] = i, userMove.to[1] = j;
    }
    makeUserMove();
}

const makeUserMove = () => {
    if (userMove.from[0] !== -1 && userMove.from[1] !== -1 &&
        userMove.to[0] !== -1 && userMove.to[1] !== -1) {
        deselectSquares();
        console.log('user move' + userMove.from[0] + userMove.from[1] + ' -> ' + userMove.to[0] + userMove.to[1]);
        userMove.from = [-1, -1];
        userMove.to = [-1, -1];
    }
};

const clicked = click => {
    const x = click.pageX - click.path[1].getBoundingClientRect().left;
    const y = click.pageY - click.path[1].getBoundingClientRect().top;
    const i = Math.floor(y/100);
    const j = Math.floor(x/100);
    const targetClass = click.target.className;
    if (targetClass.includes('square')) clickedOnSquare(i, j);
    else if (targetClass.includes('figure')) clickedOnFigure(i, j);
    selectSquares(i, j);
    updateListsMaterial();
    generateMoves();

};