'use strict';

const clearFig = (sq, obj = gameBoard, board = grid) => {
  const fig = board[sq[0]][sq[1]];
  const key = getKeyById(figs, fig);
  const col = figs[key].color;
  let tFigNum = -1;
  board[sq[0]][sq[1]] = figs.empty;
  obj.material[col] -= figs[key].value;
  for (let i = 0; i < obj.figNum[fig]; i++) {
    if (
      obj.figList[figIndex(fig, i)][0] === sq[0] &&
      obj.figList[figIndex(fig, i)][1] === sq[1]
    ) {
      tFigNum = i;
      break;
    }
  }
  obj.figNum[fig]--;
  obj.figList[figIndex(fig, tFigNum)] =
    obj.figList[figIndex(fig, obj.figNum[fig])];
};

const addFig = (sq, fig, obj = gameBoard, board = grid) => {
  const key = getKeyById(figs, fig);
  const col = figs[key].color;
  board[sq[0]][sq[1]] = fig;
  obj.material[col] += figs[key].value;
  obj.figList[figIndex(fig, obj.figNum[fig])] = sq;
  obj.figNum[fig]++;
};

const moveFig = (from, to, obj = gameBoard, board = grid) => {
  const fig = board[from[0]][from[1]];
  hashFig(fig, from);
  board[from[0]][from[1]] = figs.empty;
  hashFig(fig, to);
  board[to[0]][to[1]] = fig;
  for (let i = 0; i < obj.figNum[fig]; i++) {
    if (
      obj.figList[figIndex(fig, i)][0] === from[0] &&
      obj.figList[figIndex(fig, i)][1] === from[1]
    ) {
      obj.figList[figIndex(fig, i)] = to;
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
    }
    else if (mode === 'takeMove') {
      if (gameBoard.side === colors.white) {
        addFig([to[0] + 1, to[1]], figs.bP.id);
      } else {
        addFig([to[0] - 1, to[1]], figs.wP.id);
      }
    }
  }
};

const checkPawnStart = move => {
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
}

const updateCastlePerm = (from, to, obj = gameBoard) => {
  if (arrsEqual(from, [0, 0]) || arrsEqual(to, [0, 0])) {
    obj.castlePerm.blackQSide = false;
  }
  if (arrsEqual(from, [0, 4]) || arrsEqual(to, [0, 4])) {
    obj.castlePerm.blackQSide = false;
    obj.castlePerm.blackKSide = false;
  }
  if (arrsEqual(from, [0, 7]) || arrsEqual(to, [0, 7])) {
    obj.castlePerm.blackKSide = false;
  }
  if (arrsEqual(from, [7, 0]) || arrsEqual(to, [7, 0])) {
    obj.castlePerm.whiteQSide = false;
  }
  if (arrsEqual(from, [7, 4]) || arrsEqual(to, [7, 4])) {
    obj.castlePerm.whiteQSide = false;
    obj.castlePerm.whiteKSide = false;
  }
  if (arrsEqual(from, [7, 7]) || arrsEqual(to, [7, 7])) {
    obj.castlePerm.whiteKSide = false;
  }
};

const checkCastling = (castling, dir = 'straight') => {
  if (castling === 'whiteKSide') {
    if (dir === 'straight') moveFig([7, 7], [7, 5]);
    else moveFig([7, 5], [7, 7]);
  }
  else if (castling === 'whiteQSide') {
    if (dir === 'straight') moveFig([7, 0], [7, 3]);
    else moveFig([7, 3], [7, 0]);
  }
  else if (castling === 'blackKSide') {
    if (dir === 'straight') moveFig([0, 7], [0, 5]);
    else moveFig([0, 5], [0, 7]);
  }
  else if (castling === 'blackQSide') {
    if (dir === 'straight') moveFig([0, 0], [0, 3]);
    else moveFig([0, 3], [0, 0]);
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
  checkCastling(move.flag.castling, 'reverse');
  moveFig(to, from);
  if (move.captured !== figs.empty) addFig(to, move.captured);
  if (move.promoted !== figs.empty) {
    clearFig(from);
    const key = getKeyById(figs, move.promoted);
    const statement = figs[key].color === colors.white;
    addFig(from, statement ? figs.wP.id : figs.bP.id);
  }
};

const updateHistory = move => {
  gameBoard.history[gameBoard.hisPly].move = move;
  gameBoard.history[gameBoard.hisPly].fiftyMove = gameBoard.fiftyMove;
  gameBoard.history[gameBoard.hisPly].enPas = cloneObj(gameBoard.enPas);
  gameBoard.history[gameBoard.hisPly].castlePerm = cloneObj(
    gameBoard.castlePerm
  );
};

const makeMove = move => {
  const side = gameBoard.side;
  const from = move.from;
  const to = move.to;
  gameBoard.history[gameBoard.hisPly].posKey = gameBoard.posKey;
  checkEnPas(move, 'makeMove');
  checkCastling(move.flag.castling);
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

const isMoveLegal = move => {
  const res = makeMove(move);
  if (res) takeMove();
  return res;
};
