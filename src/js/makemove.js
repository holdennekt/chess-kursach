'use strict';

const clearFig = (sq) => {
  const fig = grid[sq[0]][sq[1]];
  const key = getKeyById(figs, fig);
  const col = figs[key].color;
  let tFigNum = -1;
  grid[sq[0]][sq[1]] = figs.empty;
  gameBoard.material[col] -= figs[key].value;
  for (let i = 0; i < gameBoard.figNum[fig]; i++) {
    if (
      gameBoard.figList[figIndex(fig, i)][0] === sq[0] &&
      gameBoard.figList[figIndex(fig, i)][1] === sq[1]
    ) {
      tFigNum = i;
      break;
    }
  }
  gameBoard.figNum[fig]--;
  gameBoard.figList[figIndex(fig, tFigNum)] =
    gameBoard.figList[figIndex(fig, gameBoard.figNum[fig])];
};

const addFig = (sq, fig) => {
  const key = getKeyById(figs, fig);
  const col = figs[key].color;
  grid[sq[0]][sq[1]] = fig;
  gameBoard.material[col] += figs[key].value;
  gameBoard.figList[figIndex(fig, gameBoard.figNum[fig])] = sq;
  gameBoard.figNum[fig]++;
};

const moveFig = (from, to) => {
  const fig = grid[from[0]][from[1]];
  hashFig(fig, from);
  grid[from[0]][from[1]] = figs.empty;
  hashFig(fig, to);
  grid[to[0]][to[1]] = fig;
  for (let i = 0; i < gameBoard.figNum[fig]; i++) {
    if (
      gameBoard.figList[figIndex(fig, i)][0] === from[0] &&
      gameBoard.figList[figIndex(fig, i)][1] === from[1]
    ) {
      gameBoard.figList[figIndex(fig, i)] = to;
      break;
    }
  }
};

const checkEnPas = (move, mode = 'makeMove') => {
  if (move.flag.enPas) {
    const to = move.to;
    if (mode === 'makeMove') {
      if (gameBoard.side === colors.white) {
        clearFig([to[0] + 1, to[1]]);
      } else {
        clearFig([to[0] - 1, to[1]]);
      }
    } else if (mode === 'takeMove') {
      if (gameBoard.side === colors.white) {
        addFig([to[0] + 1, to[1]], figs.bP.id);
      } else {
        addFig([to[0] - 1, to[1]], figs.wP.id);
      }
    }
  }
};

const checkPawnStart = (move) => {
  const from = move.from;
  const isPawn =
    grid[from[0]][from[1]] === figs.wP.id ||
    grid[from[0]][from[1]] === figs.bP.id;
  if (isPawn) {
    gameBoard.fiftyMove = 0;
    if (move.flag.pawnStart) {
      if (gameBoard.side === colors.white) {
        gameBoard.enPas[0] = from[0] - 1;
        gameBoard.enPas[1] = from[1];
      } else {
        gameBoard.enPas[0] = from[0] + 1;
        gameBoard.enPas[1] = from[1];
      }
      hashEnPassant();
    }
  }
};

const updateCastlePerm = (from, to) => {
  if (arrsEqual(from, [0, 0]) || arrsEqual(to, [0, 0])) {
    gameBoard.castlePerm.blackQSide = false;
  }
  if (arrsEqual(from, [0, 4]) || arrsEqual(to, [0, 4])) {
    gameBoard.castlePerm.blackQSide = false;
    gameBoard.castlePerm.blackKSide = false;
  }
  if (arrsEqual(from, [0, 7]) || arrsEqual(to, [0, 7])) {
    gameBoard.castlePerm.blackKSide = false;
  }
  if (arrsEqual(from, [7, 0]) || arrsEqual(to, [7, 0])) {
    gameBoard.castlePerm.whiteQSide = false;
  }
  if (arrsEqual(from, [7, 4]) || arrsEqual(to, [7, 4])) {
    gameBoard.castlePerm.whiteQSide = false;
    gameBoard.castlePerm.whiteKSide = false;
  }
  if (arrsEqual(from, [7, 7]) || arrsEqual(to, [7, 7])) {
    gameBoard.castlePerm.whiteKSide = false;
  }
};

const checkCastling = (castling, mode = 'makeMove') => {
  if (castling === 'whiteKSide') {
    if (mode === 'makeMove') moveFig([7, 7], [7, 5]);
    else if (mode === 'takeMove') moveFig([7, 5], [7, 7]);
  } else if (castling === 'whiteQSide') {
    if (mode === 'makeMove') moveFig([7, 0], [7, 3]);
    else if (mode === 'takeMove') moveFig([7, 3], [7, 0]);
  } else if (castling === 'blackKSide') {
    if (mode === 'makeMove') moveFig([0, 7], [0, 5]);
    else if (mode === 'takeMove') moveFig([0, 5], [0, 7]);
  } else if (castling === 'blackQSide') {
    if (mode === 'makeMove') moveFig([0, 0], [0, 3]);
    else if (mode === 'takeMove') moveFig([0, 3], [0, 0]);
  }
};

const updateGameBoard = () => {
  gameBoard.castlePerm = gameBoard.history[gameBoard.hisPly].castlePerm;
  gameBoard.fiftyMove = gameBoard.history[gameBoard.hisPly].fiftyMove;
  gameBoard.enPas = gameBoard.history[gameBoard.hisPly].enPas;
};

const takeMove = () => {
  gameBoard.hisPly--, gameBoard.ply--;
  const move = gameBoard.history[gameBoard.hisPly].move;
  const from = move.from;
  const to = move.to;
  if (!arrsEqual(gameBoard.enPas, noSq())) hashEnPassant();
  hashCastling();
  updateGameBoard();
  if (!arrsEqual(gameBoard.enPas, noSq())) hashEnPassant();
  hashCastling();
  gameBoard.side ^= 1;
  hashSide();
  checkEnPas(move, 'takeMove');
  checkCastling(move.flag.castling, 'takeMove');
  moveFig(to, from);
  if (move.captured !== figs.empty) addFig(to, move.captured);
  if (move.promoted !== figs.empty) {
    clearFig(from);
    const key = getKeyById(figs, move.promoted);
    const statement = figs[key].color === colors.white;
    addFig(from, statement ? figs.wP.id : figs.bP.id);
  }
};

const updateHistory = (move) => {
  gameBoard.history[gameBoard.hisPly].move = move;
  gameBoard.history[gameBoard.hisPly].fiftyMove = gameBoard.fiftyMove;
  gameBoard.history[gameBoard.hisPly].enPas = cloneObj(gameBoard.enPas);
  gameBoard.history[gameBoard.hisPly].castlePerm = cloneObj(
    gameBoard.castlePerm
  );
};

const makeMove = (move) => {
  const side = gameBoard.side;
  const from = move.from;
  const to = move.to;
  gameBoard.history[gameBoard.hisPly].posKey = gameBoard.posKey;
  checkEnPas(move, 'makeMove');
  checkCastling(move.flag.castling, 'makeMove');
  if (!arrsEqual(gameBoard.enPas, noSq())) hashEnPassant();
  hashCastling();
  updateHistory(move);
  updateCastlePerm(from, to);
  gameBoard.enPas = noSq();
  hashCastling();
  gameBoard.fiftyMove++;
  if (move.captured !== figs.empty) {
    clearFig(to);
    gameBoard.fiftyMove = 0;
  }
  gameBoard.hisPly++, gameBoard.ply++;
  checkPawnStart(move);
  moveFig(from, to);
  if (move.promoted !== figs.empty) {
    clearFig(to);
    addFig(to, move.promoted);
  }
  gameBoard.side ^= 1;
  hashSide();
  const king = gameBoard.figList[figIndex(kings[side], 0)];
  if (isSqAttackedBySide(king, gameBoard.side)) {
    takeMove();
    return false;
  }
  return true;
};

const isMoveLegal = (move) => {
  const res = makeMove(move);
  if (res) takeMove();
  return res;
};
