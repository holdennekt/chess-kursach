'use strict';

const userMove = {
    from: [-1, -1],
    to: [-1, -1],
    promoted: figs.empty,
};

const chosen = async block => {
    return new Promise(resolve => block.onclick = click => {
        const clickedOn = click.target.id;
        const parent = document.querySelector('#parent');
        parent.removeChild(document.querySelector('.promotion'));
        resolve(figs[clickedOn]);
    });
};

const suggestPromotion = async () => {
    const blockPromotion = document.createElement('div');
    const images = document.createElement('div');
    blockPromotion.className = 'promotion';
    images.className = 'imagesHandler';
    document.querySelector('#parent').appendChild(blockPromotion);
    blockPromotion.appendChild(images);
    let list;
    if (gameBoard.side === colors.white) list = ['wQ', 'wR', 'wB', 'wN'];
    else list = ['bQ', 'bR', 'bB', 'bN'];
    let dark = 1;
    for (const elem of list) {
        const img = new Image();
        img.src = `icons/${figs[elem]}.png`;
        img.id = elem;
        img.className = 'suggestion';
        if (dark === 1) img.classList.add('dark');
        else img.classList.add('light');
        dark ^= 1;
        images.append(img);
    }
    return await chosen(blockPromotion);
};

const newGame = () => {
    const blockGameOver = document.querySelector('.gameOver');
    document.querySelector('#parent').removeChild(blockGameOver);
    resetBoard();
    gameBoard.posKey = genPosKey();
    updateListsMaterial();
    generateMoves();
};

const gameOver = str => {
    const block = document.createElement('div');
    const text = document.createElement('span');
    const btn = document.createElement('button');
    block.className = 'gameOver';
    text.className = 'gameStatus';
    text.innerHTML = str;
    btn.className = 'btnNewGame';
    btn.innerHTML = 'New game';
    btn.onclick = newGame;
    document.querySelector('#parent').appendChild(block);
    block.appendChild(text);
    block.appendChild(btn);
};

const parseMove = async (from, to) => {
    generateMoves();
    const start = gameBoard.moveListStart[gameBoard.ply];
    const end = gameBoard.moveListStart[gameBoard.ply + 1];
    let found = false, move;
    for (let index = start; index < end; index++) {
        move = gameBoard.moveList[index];
        if (checkArrsEqual(move.from, from) &&
            checkArrsEqual(move.to, to)) {
            if (move.promoted !== 0) {
                const promotion = await suggestPromotion();
                move.promoted = promotion;
                found = true;
                break;
            }
            found = true;
            break;
        }
    }
    if (found) {
        if (!makeMove(move)) return emptyMove();
        takeMove();
        return move;
    }    
    return emptyMove();
};

const deselectSquares = () => {
    const selected = document.querySelector('.selected');
    if (selected) selected.classList.remove('selected');
    const suggested = document.querySelectorAll('.suggested');
    const captureLeft = document.querySelectorAll('.suggestedCaptureLeft');
    const captureRight = document.querySelectorAll('.suggestedCaptureRight');
    for (const elem of suggested) elem.classList.remove('suggested');
    for (const elem of captureLeft) elem.classList.remove('suggestedCaptureLeft');
    for (const elem of captureRight) elem.classList.remove('suggestedCaptureRight');
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
            } else if (elem.to[1] < elem.from[1]) {
                block.className += ' suggestedCaptureLeft';
            } else if (elem.to[1] > elem.from[1]) {
                block.className += ' suggestedCaptureRight';
            } else {
                if (Math.floor(Math.random() * 2) === 0) {
                    block.className += ' suggestedCaptureLeft';
                } else block.className += ' suggestedCaptureRight';
            }
        }
    }
};

const toggleCheckKing = (mode = '', side) => {
    const king = gameBoard.figList[figIndex(kings[side], 0)];
    const str = `.figure.rank${king[0]}.file${king[1]}`;
    const kingSq = document.querySelectorAll(str)[0];
    if (mode === 'on') kingSq.classList.add('check');
    else if (mode === 'off') kingSq.classList.remove('check');
    else throw new Error('should be argument either "on" or "off"');
};

const removeGuiFig = sq => {
    const str = `.figure.rank${sq[0]}.file${sq[1]}`;
    console.log(str);
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
    if (move.promoted  !== figs.empty) {
        removeGuiFig(move.to);
        addGuiFig(move.to, move.promoted);
    }
};

const suggestMoves = from => {
    generateMoves();
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

const makeUserMove = async () => {
    const from = userMove.from, to = userMove.to;
    if (notEmptyMove(from)) suggestMoves(from);
    if (notEmptyMove(from, to)) {
        const parsed = await parseMove(from, to);
        if (notEmptyMove(parsed.from, parsed.to)) {
            makeMove(parsed);
            moveGuiFig(parsed);
            logGrid();
            checkAndSet();
            preSearch();
        }
        deselectSquares();
        userMove.from = [-1, -1];
        userMove.to = [-1, -1];
    }
};

const clickedOnSquare = (i, j) => {
    if (notEmptyMove(userMove.from)) {
        userMove.to[0] = i, userMove.to[1] = j;
        makeUserMove();
    }
};

const clickedOnFigure = (i, j) => {
    selectSquares(i, j);
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
};

const isDraw = () => {
    if (gameBoard.figNum[figs.wP] !== 0 || gameBoard.figNum[figs.bP] !== 0 ||
	    gameBoard.figNum[figs.wQ] !== 0 || gameBoard.figNum[figs.bQ] !== 0 ||
    	gameBoard.figNum[figs.wR] !== 0 || gameBoard.figNum[figs.bR] !== 0 ||
	    gameBoard.figNum[figs.wB] > 1 || gameBoard.figNum[figs.bB] > 1 ||
        gameBoard.figNum[figs.wN] > 1 || gameBoard.figNum[figs.bN] > 1 ||
	    gameBoard.figNum[figs.wN] !== 0 && gameBoard.figNum[figs.wB] !== 0 ||
        gameBoard.figNum[figs.bN] !== 0 && gameBoard.figNum[figs.bB] !== 0) {
            return false;
    }
    return true;
};

const threeFoldRep = () => {
    let r = 0;
    for (let i = 0; i < gameBoard.hisPly; i++) {
        if (gameBoard.history[i].posKey === gameBoard.posKey) r++;
    }
    return r;
};

const checkResult = () => {
    let str, draw = false;
    if (gameBoard.fiftyMove >= 100) {
        str = 'Draw, fifty move rule';
        draw = true;
    } else if (threeFoldRep() >= 2) {
        str = 'Draw, 3-fold repetition';
        draw = true;
    } else if (isDraw()) {
        str = 'Draw, not enough figures to mate';
        draw = true;
    }
    if (draw) {
        gameOver(str);
        return true;
    }
    generateMoves();
    let found = false;
    const start = gameBoard.moveListStart[gameBoard.ply];
    const end = gameBoard.moveListStart[gameBoard.ply + 1];
    for (let index = start; index < end; index++) {
        if (isMoveLegal(gameBoard.moveList[index])) {
            found = true;
            break;
        }
    }
    if (found) return false;
    const king = gameBoard.figList[figIndex(kings[gameBoard.side], 0)];
    if (isSqAttackedBySide(king, gameBoard.side ^ 1)) {
        if (gameBoard.side === colors.white) {
            str = 'Game Over, black mates';
        }
        else {
            str = 'Game Over, white mates';
        }
    }
    else {
        str = 'Draw, stale mate';
    }
    gameOver(str);
    return true;
};

const checkAndSet = () => {
    if (checkResult()) {
        gameController.gameOver = true;
    }
    else {
        gameController.gameOver = false;
    }
    toggleCheckKing('off', gameBoard.side);
    toggleCheckKing('off', gameBoard.side ^ 1);
    const king = gameBoard.figList[figIndex(kings[gameBoard.side], 0)];
    if (isSqAttackedBySide(king, gameBoard.side ^ 1)) {
        toggleCheckKing('on', gameBoard.side);
    }
};

const preSearch = () => {
    if (!gameController.gameOver) {
        search.thinking = true;
        setTimeout(() => { startSearch(); }, 200);
    }
};

const startSearch = () => {
    search.depth = maxDepth;
    search.time = 2500;
    searchPosition();
    makeMove(search.best);
    moveGuiFig(search.best);
    checkAndSet();
};