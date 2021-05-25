const userMove = {
    from: [-1, -1],
    to: [-1, -1],
    promoted: figs.empty,
};

const chosen = (click) => {
    const clikedOn = click.target.id;
    userMove.promoted = figs[clickedOn];
    document.removeChild(document.querySelector('.promotion'));
};

const suggestPromotion = () => {
    let blockPromotion = document.createElement('div');
    blockPromotion.className = 'promotion';
    document.append(blockPromotion);
    let list;
    if (gameBoard.side === colors.white) list = ['wQ', 'wR', 'wB', 'wK'];
    else list = ['bQ', 'bR', 'bB', 'bK'];
    for (const elem of list) {
        let img = new Image();
        img.src = `icons/${figs[elem]}.png`;
        img.id = elem;
        img.className = `suggestion`;
        blockPromotion.append(img);
    }
    blockPromotion.addEventListener('click', chosen);
};

const parseMove = (from, to, promoted = figs.empty) => {
    generateMoves();
    const start = gameBoard.moveListStart[gameBoard.ply];
    const end = gameBoard.moveListStart[gameBoard.ply + 1];
    let found = false, move;
    for (let index = start; index < end; index++) {
        move = gameBoard.moveList[index];
        // console.log(move);
        const fromI = move.from[0], fromJ = move.from[1];
        const toI = move.to[0], toJ = move.to[1];
        if (from[0] === fromI && from[1] === fromJ &&
            to[0] === toI && to[1] === toJ) {
            if (promoted !== figs.empty) {
                if (move.promoted === promoted) {
                    found = true;
                    break;
                }
                continue;
            }
            found = true;
            break;
        }
    }
    if (found) {
        if (!makeMove(move)) {
            return noMove();
        }
        takeMove();
        return move;
    }
    return noMove();
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
    selectSquares(i, j);
    console.log(`clicked on figure ${grid[i][j]} at square_${i}${j}`);
    if (userMove.from[0] === -1 && userMove.from[1] === -1) {
        userMove.from[0] = i, userMove.from[1] = j;
    } else {
        userMove.to[0] = i, userMove.to[1] = j;
    }
    makeUserMove();
}

const removeGuiFig = sq => {
    const str = `.figure.rank${sq[0]}.file${sq[1]}`;
    const figOnSq = document.querySelectorAll(str)[0];
    document.querySelector('#container').removeChild(figOnSq);
};

const addGuiFig = (sq, fig) => {
    const i = sq[0], j = sq[1];
    let img = new Image();
    img.src = `icons/${fig}.png`;
    img.className = `figure rank${i} file${j}`;
    document.querySelector('#container').append(img);
};

const moveGuiFig = move => {
    if (move.flag.enPas) {
        let epRemove;
        if (gameBoard.side === colors.white) {
            epRemove = [move.to[0] + 1, move.to[1]];
        }
        else epRemove = [move.to[0] - 1, move.to[1]];
        removeGuiFig(epRemove);
    } else if (move.captured !== figs.empty) {
        removeGuiFig(move.to);
    }
    const str = `.figure.rank${move.from[0]}.file${move.from[1]}`;
    const figOnSq = document.querySelectorAll(str)[0];
    figOnSq.classList.remove(`rank${move.from[0]}`, `file${move.from[1]}`);
    figOnSq.classList.add(`rank${move.to[0]}`, `file${move.to[1]}`);
    switch (move.flag.castling) {
        case '': break;
        case 'whiteKSide':
            removeGuiFig([7, 7]);
            addGuiFig([7, 5], figs.wR);
            break;
        case 'whiteQSide':
            removeGuiFig([7, 0]);
            addGuiFig([7, 3], figs.wR);
            break;
        case 'blackKSide':
            removeGuiFig([0, 7]);
            addGuiFig([0, 5], figs.bR);
            break;
        case 'blackQSide':
            removeGuiFig([0, 0]);
            addGuiFig([0, 5], figs.bR);
            break;
    }
    if (move.promoted !== figs.empty) {
        removeGuiFig(move.to);
        addGuiFig(move.to, move.promoted);
    }
};

const makeUserMove = () => {
    const from = userMove.from, to = userMove.to;
    if (from[0] !== -1 && from[1] !== -1 &&
        to[0] !== -1 && to[1] !== -1) {
        if (grid[from[0]][from[1]] === 1 && from[0] === 1 ||
            grid[from[0]][from[1]] === 7 && from[0] === 6) {
            suggestPromotion();
        }
        const parsed = parseMove(from, to, userMove.promoted);
        console.log(parsed);
        if (parsed.from[0] !== -1 && parsed.from[1] !== -1 &&
            parsed.to[0] !== -1 && parsed.to[1] !== -1) {
            makeMove(parsed);
            logGrid();
            moveGuiFig(parsed);
        }
        deselectSquares();
        console.log('user move' + from[0] + from[1] + ' -> ' + to[0] + to[1]);
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
    updateListsMaterial();
};