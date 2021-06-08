'use strict';

const userMove = {
  from: [-1, -1],
  to: [-1, -1],
  promoted: figs.empty,
};

const chosen = async (block) =>
  new Promise(
    (resolve) =>
      (block.onclick = (click) => {
        const clickedOn = click.target.id;
        const parent = document.querySelector('#parent');
        parent.removeChild(document.querySelector('.promotion'));
        resolve(figs[clickedOn].id);
      })
  );

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
    img.src = `icons/${figs[elem].id}.png`;
    img.id = elem;
    img.className = 'suggestion';
    if (dark === 1) img.classList.add('dark');
    else img.classList.add('light');
    dark ^= 1;
    images.append(img);
  }
  return await chosen(blockPromotion);
};

const parseMove = async (from, to) => {
  generateMoves();
  const start = gameBoard.moveListStart[gameBoard.ply];
  const end = gameBoard.moveListStart[gameBoard.ply + 1];
  let found = false,
    move;
  for (let index = start; index < end; index++) {
    move = gameBoard.moveList[index];
    if (arrsEqual(move.from, from) && arrsEqual(move.to, to)) {
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
    if (!isMoveLegal(move)) return emptyMove();
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
  for (const elem of captureLeft) {
    elem.classList.remove('suggestedCaptureLeft');
  }
  for (const elem of captureRight) {
    elem.classList.remove('suggestedCaptureRight');
  }
};

const selectSquares = (i, j, suggest = []) => {
  deselectSquares();
  const key = getKeyById(figs, grid[i][j]);
  if (figs[key].color === gameBoard.side) {
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
      } else if (Math.floor(Math.random() * 2) === 0) {
        block.className += ' suggestedCaptureLeft';
      } else block.className += ' suggestedCaptureRight';
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

const removeGuiFig = (sq) => {
  const str = `.figure.rank${sq[0]}.file${sq[1]}`;
  const figOnSq = document.querySelectorAll(str)[0];
  document.querySelector('#container').removeChild(figOnSq);
};

const addGuiFig = (sq, fig) => {
  const i = sq[0];
  const j = sq[1];
  const img = new Image();
  img.src = `icons/${fig}.png`;
  img.className = `figure rank${i} file${j}`;
  document.querySelector('#container').append(img);
};

const ifCastling = (move) => {
  const castling = move.flag.castling;
  if (castling === 'whiteKSide') {
    removeGuiFig([7, 7]);
    addGuiFig([7, 5], figs.wR.id);
  } else if (castling === 'whiteQSide') {
    removeGuiFig([7, 0]);
    addGuiFig([7, 3], figs.wR.id);
  } else if (castling === 'blackKSide') {
    removeGuiFig([0, 7]);
    addGuiFig([0, 5], figs.bR.id);
  } else if (castling === 'blackQSide') {
    removeGuiFig([0, 0]);
    addGuiFig([0, 3], figs.bR.id);
  }
};

const moveGuiFig = (move) => {
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
  ifCastling(move);
  if (move.promoted !== figs.empty) {
    removeGuiFig(move.to);
    addGuiFig(move.to, move.promoted);
  }
};

const suggestMoves = (from) => {
  generateMoves();
  const start = gameBoard.moveListStart[gameBoard.ply];
  const end = gameBoard.moveListStart[gameBoard.ply + 1];
  const suggest = [];
  for (let index = start; index < end; index++) {
    const move = gameBoard.moveList[index];
    if (arrsEqual(from, move.from) && isMoveLegal(move)) {
      suggest.push(move);
    }
  }
  selectSquares(from[0], from[1], suggest);
};

const makeUserMove = async () => {
  const from = userMove.from,
    to = userMove.to;
  if (notEmptyMove(from)) suggestMoves(from);
  if (notEmptyMove(from, to)) {
    const parsed = await parseMove(from, to);
    if (notEmptyMove(parsed.from, parsed.to)) {
      makeMove(parsed);
      moveGuiFig(parsed);
      checkAndSet();
      preSearch();
    }
    deselectSquares();
    userMove.from = noSq();
    userMove.to = noSq();
  }
};

const clickedOnSquare = (i, j) => {
  if (notEmptyMove(userMove.from)) {
    (userMove.to[0] = i), (userMove.to[1] = j);
    makeUserMove();
  }
};

const clickedOnFigure = (i, j) => {
  selectSquares(i, j);
  const key = getKeyById(figs, grid[i][j]);
  if (
    arrsEqual(userMove.from, [-1, -1]) &&
    figs[key].color === gameBoard.side
  ) {
    (userMove.from[0] = i), (userMove.from[1] = j);
  } else if (
    arrsEqual(userMove.from, [-1, -1]) &&
    figs[key].color !== gameBoard.side
  )
    return;
  else {
    const figFrom = grid[userMove.from[0]][userMove.from[1]];
    const keyFigFrom = getKeyById(figs, figFrom);
    if (figs[key].color === figs[keyFigFrom].color) {
      (userMove.from[0] = i), (userMove.from[1] = j);
    } else (userMove.to[0] = i), (userMove.to[1] = j);
  }
  makeUserMove();
};

const clicked = (click) => {
  const targetClass = click.target.className;
  const i = parseInt(targetClass[11]);
  const j = parseInt(targetClass[17]);
  if (targetClass.includes('square')) clickedOnSquare(i, j);
  else if (targetClass.includes('figure')) clickedOnFigure(i, j);
};

const newGame = () => {
  const blockGameOver = document.querySelectorAll('.gameOver');
  const btnNewGame = document.querySelectorAll('.btnNewGame');
  for (const el of blockGameOver) {
    document.querySelector('#parent').removeChild(el);
  }
  for (const el of btnNewGame) {
    document.querySelector('#parent').removeChild(el);
  }
  document.querySelector('#container').addEventListener('mousedown', clicked);
  resetBoard();
  gameBoard.posKey = genPosKey();
  updateMaterialAndFigList();
  generateMoves();
};

const gameOver = (str) => {
  const block = document.createElement('div');
  const text = document.createElement('p');
  const btn = document.createElement('button');
  block.className = 'gameOver';
  text.className = 'gameStatus';
  text.innerHTML = str;
  btn.className = 'btnNewGame';
  btn.innerHTML = 'New game';
  btn.onclick = newGame;
  document.querySelector('#parent').appendChild(block);
  block.appendChild(text);
  document.querySelector('#parent').appendChild(btn);
  const container = document.querySelector('#container');
  container.removeEventListener('mousedown', clicked);
};

const isEnoughFigures = () => {
  if (
    gameBoard.figNum[figs.wP.id] !== 0 ||
    gameBoard.figNum[figs.bP.id] !== 0 ||
    gameBoard.figNum[figs.wQ.id] !== 0 ||
    gameBoard.figNum[figs.bQ.id] !== 0 ||
    gameBoard.figNum[figs.wR.id] !== 0 ||
    gameBoard.figNum[figs.bR.id] !== 0 ||
    gameBoard.figNum[figs.wB.id] > 1 ||
    gameBoard.figNum[figs.bB.id] > 1 ||
    gameBoard.figNum[figs.wN.id] > 1 ||
    gameBoard.figNum[figs.bN.id] > 1 ||
    (gameBoard.figNum[figs.wN.id] !== 0 &&
      gameBoard.figNum[figs.wB.id] !== 0) ||
    (gameBoard.figNum[figs.bN.id] !== 0 && gameBoard.figNum[figs.bB.id] !== 0)
  ) {
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

const isDraw = () => {
  let str = '';
  if (gameBoard.fiftyMove >= 100) {
    str = 'Draw, fifty move rule';
  } else if (threeFoldRep() >= 2) {
    str = 'Draw, 3-fold repetition';
  } else if (isEnoughFigures()) {
    str = 'Draw, not enough figures to mate';
  }
  return str;
};

const isAnyLegalMove = () => {
  const start = gameBoard.moveListStart[gameBoard.ply];
  const end = gameBoard.moveListStart[gameBoard.ply + 1];
  for (let index = start; index < end; index++) {
    if (isMoveLegal(gameBoard.moveList[index])) return true;
  }
  return false;
};

const checkResult = () => {
  let str = isDraw();
  if (str !== '') {
    gameOver(str);
    return true;
  }
  generateMoves();
  if (isAnyLegalMove()) return false;
  const king = gameBoard.figList[figIndex(kings[gameBoard.side], 0)];
  if (isSqAttackedBySide(king, gameBoard.side ^ 1)) {
    if (gameBoard.side === colors.white) {
      str = 'Game over, black mates';
    } else {
      str = 'Game over, white mates, black matters';
    }
  } else {
    str = 'Draw, stale mate';
  }
  gameOver(str);
  return true;
};

const checkAndSet = () => {
  if (checkResult()) {
    gameController.gameOver = true;
  } else {
    gameController.gameOver = false;
  }
  toggleCheckKing('off', gameBoard.side);
  toggleCheckKing('off', gameBoard.side ^ 1);
  const king = gameBoard.figList[figIndex(kings[gameBoard.side], 0)];
  if (isSqAttackedBySide(king, gameBoard.side ^ 1)) {
    toggleCheckKing('on', gameBoard.side);
  }
};

const startSearch = () => {
  search.depth = maxDepth;
  search.time = 700;
  searchPosition();
  makeMove(search.best);
  moveGuiFig(search.best);
  checkAndSet();
};

const preSearch = () => {
  if (!gameController.gameOver) {
    search.thinking = true;
    setTimeout(() => {
      startSearch();
    }, 200);
  }
};
