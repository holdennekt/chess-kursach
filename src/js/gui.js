const userMove = {
    from: [-1, -1],
    to: [-1, -1],
    promoted: figs.empty,
};

const chosen = async block => {
    return new Promise(resolve => block.onclick = click => {
        const clickedOn = click.target.id;
        document.body.removeChild(document.querySelector('.promotion'));
        resolve(figs[clickedOn]);
    });
};

const suggestPromotion = async () => {
    const blockPromotion = document.createElement('div');
    blockPromotion.className = 'promotion';
    document.body.appendChild(blockPromotion);
    let list;
    if (gameBoard.side === colors.white) list = ['wQ', 'wR', 'wB', 'wN'];
    else list = ['bQ', 'bR', 'bB', 'bN'];
    for (const elem of list) {
        const img = new Image();
        img.src = `icons/${figs[elem]}.png`;
        img.id = elem;
        img.className = 'suggestion';
        blockPromotion.append(img);
    }
    return await chosen(blockPromotion);
};

const parseMove = async (from, to) => {
    const move = findMove({ from, to });
    if (!checkObjectsEqual(move, noMove())) {
        if (grid[from[0]][from[1]] === 1 && from[0] === 1 ||
            grid[from[0]][from[1]] === 7 && from[0] === 6) {
            const promotion = await suggestPromotion();
            move.promoted = promotion;
        }
        return move;
    }
    return noMove();
};

const deselectSquares = () => {
    const selected = document.querySelector('.selected');
    if (selected) selected.classList.remove('selected');
    const suggested = document.querySelectorAll('.suggested');
    const capture = document.querySelectorAll('.suggestedCapture');
    for (const elem of suggested) elem.classList.remove('suggested');
    for (const elem of capture) elem.classList.remove('suggestedCapture');
};

const selectSquares = (i, j, suggest = []) => {
    deselectSquares();
    if (figCol[grid[i][j]] === gameBoard.side) {
        let str = `.rank${i}.file${j}`;
        document.querySelectorAll(str)[0].className += ' selected';
        for (const elem of suggest) {
            str = `.rank${elem.to[0]}.file${elem.to[1]}`;
            const block = document.querySelectorAll(str)[0];
            if (elem.captured === figs.empty) {
                block.className += ' suggested';
            } else block.className += ' suggestedCapture';
        }
    }
};

const toggleCheckKing = (mode = '') => {
    console.log('TOGGLE CALLED');
    const king = gameBoard.figList[figIndex(kings[gameBoard.side], 0)];
    const str = `.figure.rank${king[0]}.file${king[1]}`;
    const kingSq = document.querySelectorAll(str)[0];
    if (mode === 'on') kingSq.classList.add('check');
    else if (mode === 'off') kingSq.classList.remove('check');
    else throw new Error('should be argument either "on" or "off"');
};

const removeGuiFig = sq => {
    const str = `.figure.rank${sq[0]}.file${sq[1]}`;
    const figOnSq = document.querySelectorAll(str)[0];
    document.querySelector('#container').removeChild(figOnSq);
};

const addGuiFig = (sq, fig) => {
    const i = sq[0], j = sq[1];
    const img = new Image();
    img.src = `icons/${fig}.png`;
    img.className = `figure rank${i} file${j}`;
    document.querySelector('#container').append(img);
};

const moveGuiFig = move => {
    if (move.flag.enPas) {
        let epRemove;
        if (gameBoard.side === colors.white) {
            epRemove = [move.to[0] - 1, move.to[1]];
        } else epRemove = [move.to[0] + 1, move.to[1]];
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
            addGuiFig([0, 3], figs.bR);
            break;
    }
    if (move.promoted !== figs.empty) {
        removeGuiFig(move.to);
        addGuiFig(move.to, move.promoted);
    }
};

const makeUserMove = async () => {
    const from = userMove.from, to = userMove.to;
    if (notEmptyMove(from[0], from[1])) {
        const start = gameBoard.moveListStart[gameBoard.ply];
        const end = gameBoard.moveListStart[gameBoard.ply + 1];
        const suggest = [];
        for (let index = start; index < end; index++) {
            const move = gameBoard.moveList[index];
            if (checkArrsEqual(from, move.from) && isMoveLegal(move)) {
                suggest.push(move);
            }
        }
        selectSquares(from[0], from[1], suggest);
    }
    if (notEmptyMove(from[0], from[1], to[0], to[1])) {
        const parsed = await parseMove(from, to);
        // console.log(parsed);
        const t = [parsed.from[0], parsed.from[1], parsed.to[0], parsed.to[1]];
        if (notEmptyMove(t)) {
            toggleCheckKing('off');
            makeMove(parsed);
            logGrid();
            moveGuiFig(parsed);
            king = gameBoard.figList[figIndex(kings[gameBoard.side], 0)];
            if (isSqAttackedBySide(king, gameBoard.side ^ 1)) {
                toggleCheckKing('on');
            }
        }
        deselectSquares();
        // console.log('user move' + from[0] + from[1] + '->' + to[0] + to[1]);
        userMove.from = [-1, -1];
        userMove.to = [-1, -1];
        generateMoves();
    }
};

const clickedOnSquare = (i, j) => {
    // console.log(`clicked on square_${i}${j}`);
    if (notEmptyMove(userMove.from[0], userMove.from[1])) {
        userMove.to[0] = i, userMove.to[1] = j;
        makeUserMove();
    }
};

const clickedOnFigure = (i, j) => {
    selectSquares(i, j);
    // console.log(`clicked on figure ${grid[i][j]} at square_${i}${j}`);
    if (userMove.from[0] === -1 && userMove.from[1] === -1 &&
        figCol[grid[i][j]] === gameBoard.side) {
        userMove.from[0] = i, userMove.from[1] = j;
    } else if (userMove.from[0] === -1 && userMove.from[1] === -1 &&
                figCol[grid[i][j]] !== gameBoard.side) {
        return;
    } else {
        const figFrom = grid[userMove.from[0]][userMove.from[1]];
        if (figCol[grid[i][j]] === figCol[figFrom]) {
            userMove.from[0] = i, userMove.from[1] = j;
        } else userMove.to[0] = i, userMove.to[1] = j;
    }
    makeUserMove();
};

const clicked = click => {
    const x = click.pageX - click.path[1].getBoundingClientRect().left;
    const y = click.pageY - click.path[1].getBoundingClientRect().top;
    const i = Math.floor(y / 100);
    const j = Math.floor(x / 100);
    const targetClass = click.target.className;
    if (targetClass.includes('square')) clickedOnSquare(i, j);
    else if (targetClass.includes('figure')) clickedOnFigure(i, j);
    updateListsMaterial();
};
