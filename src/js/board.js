'use strict';

const gameBoard = {
  side: colors.white,
  fiftyMove: 0,
  hisPly: 0,
  ply: 0,
  castlePerm: {
    whiteKSide: true,
    whiteQSide: true,
    blackKSide: true,
    blackQSide: true,
  },
  enPas: noSq(),
  history: arrHistory(maxGameMoves),
};
gameBoard.material = [0, 0];
gameBoard.figList = arr0(typesOfFigures * maxFigNum);
gameBoard.figNum = arr0(typesOfFigures + 1);
gameBoard.moveList = arr0(maxPositionMoves * maxDepth);
gameBoard.moveListStart = arr0(maxDepth);
gameBoard.moveScores = [];
gameBoard.pvTable = arrPvTable(pvEntries);
gameBoard.pvArr = arr0(maxDepth);
gameBoard.searchHistory = arr0((typesOfFigures + 1) * gridSqNum);
gameBoard.searchKillers = arrSearchKillers(3 * maxDepth);
gameBoard.posKey = 0;

const updateMaterialAndFigList = () => {
  gameBoard.material = [0, 0];
  gameBoard.figList = arr0(typesOfFigures * maxFigNum);
  gameBoard.figNum = arr0(typesOfFigures + 1);
  for (let i = 0; i < size64; i++) {
    for (let j = 0; j < size64; j++) {
      const fig = grid[i][j];
      if (fig !== figs.empty) {
        const sq = [i, j];
        const key = getKeyById(figs, fig);
        const color = figs[key].color;
        const figNum = gameBoard.figNum[fig];
        gameBoard.material[color] += figs[key].value;
        gameBoard.figList[figIndex(fig, figNum)] = sq;
        gameBoard.figNum[fig]++;
      }
    }
  }
};

const genPosKey = () => {
  let finalKey = 0;
  for (let i = 0; i < size64; i++) {
    for (let j = 0; j < size64; j++) {
      const fig = grid[i][j];
      if (fig !== figs.empty && fig !== figs.offBoard) {
        finalKey ^= figKeys[fig * gridSqNum + (size64 * i + j)];
      }
    }
  }
  finalKey ^= castleKeys[transformCastlePerm(gameBoard.castlePerm)];
  return finalKey;
};

const isSqAttackedByPawn = (sq, side) => {
  let pawn, dir;
  const i = sq[0];
  const j = sq[1];
  if (side === colors.white) {
    pawn = figs.wP.id;
    dir = -figs.wP.dir[0];
  } else {
    pawn = figs.bP.id;
    dir = -figs.bP.dir[0];
  }
  if (grid[i + dir][j - 1] === pawn || grid[i + dir][j + 1] === pawn) {
    return true;
  }
  return false;
};

const isSqAttackedByNoSlideFig = (sq, fig) => {
  const key = getKeyById(figs, fig);
  if (figs[key].slide) throw new Error('only no slide figures allowed');
  const dirs = figs[key].dirs;
  for (const dir of dirs) {
    if (grid[sq[0] + dir[0]][sq[1] + dir[1]] === fig) {
      return true;
    }
  }
  return false;
};

const isSqAttackedBySlideFig = (sq, fig) => {
  const key = getKeyById(figs, fig);
  if (!figs[key].slide) throw new Error('only slide figures allowed');
  const queen = figs[key].color === colors.white ? figs.wQ.id : figs.bQ.id;
  const dirs = figs[key].dirs;
  for (const dir of dirs) {
    let tempI = sq[0] + dir[0];
    let tempJ = sq[1] + dir[1];
    while (grid[tempI][tempJ] !== figs.offBoard) {
      if (grid[tempI][tempJ] !== figs.empty) {
        if (grid[tempI][tempJ] === fig || grid[tempI][tempJ] === queen) {
          return true;
        }
        break;
      }
      tempI += dir[0];
      tempJ += dir[1];
    }
  }
  return false;
};

const isSqAttackedBySide = (sq, side) => {
  const pawn = isSqAttackedByPawn(sq, side);
  let fig = side === colors.white ? figs.wN.id : figs.bN.id;
  const knight = isSqAttackedByNoSlideFig(sq, fig);
  fig = side === colors.white ? figs.wB.id : figs.bB.id;
  const bishopQueen = isSqAttackedBySlideFig(sq, fig);
  fig = side === colors.white ? figs.wR.id : figs.bR.id;
  const rookQueen = isSqAttackedBySlideFig(sq, fig);
  fig = side === colors.white ? figs.wK.id : figs.bK.id;
  const king = isSqAttackedByNoSlideFig(sq, fig);
  if (pawn || knight || bishopQueen || rookQueen || king) return true;
  return false;
};

const resetBoard = () => {
  initGrid();
  gameBoard.side = colors.white;
  gameBoard.enPas = noSq();
  gameBoard.fiftyMove = 0;
  gameBoard.ply = 0;
  gameBoard.hisPly = 0;
  gameBoard.castlePerm = {
    whiteKSide: true,
    whiteQSide: true,
    blackKSide: true,
    blackQSide: true,
  };
  gameBoard.posKey = 0;
  gameBoard.moveListStart[gameBoard.ply] = 0;
  fillFigures(document.querySelector('#container'));
};
