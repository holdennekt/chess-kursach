'use strict';

const gameBoard = {
  'side': colors.white,
  'fiftyMove': 0,
  'hisPly': 0,
  'ply': 0,
  'castlePerm': {
    whiteKSide: true,
    whiteQSide: true,
    blackKSide: true,
    blackQSide: true,
  },
  'enPas': noSq(),
  'history': arrHistory(maxGameMoves),
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
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const fig = grid[i][j];
      if (fig !== figs.empty) {
        const sq = [i, j];
        const color = figCol[fig];
        gameBoard.material[color] += figValue[fig];
        gameBoard.figList[figIndex(fig, gameBoard.figNum[fig])] = sq;
        gameBoard.figNum[fig]++;
      }
    }
  }
};

const genPosKey = () => {
  let finalKey = 0;
  let fig = figs.empty;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      fig = grid[i][j];
      if (fig !== figs.empty && fig !== figs.offBoard) {
        finalKey ^= figKeys[(fig * gridSqNum) + (size * i + j)];
      }
    }
  }
  if (gameBoard.side === colors.white) {
    finalKey ^= sideKey;
  }
  if (!arrsEqual(gameBoard.enPas, noSq())) {
    console.log(transformEnPas(gameBoard.enPas));
    finalKey ^= figKeys[transformEnPas(gameBoard.enPas)];
  }
  finalKey ^= castleKeys[transformCastlePerm(gameBoard.castlePerm)];
  return finalKey;
};

const knBiRkKi = (sq, side, obj) => {
  let knight, bishop, rook, queen, king;
  const i = sq[0], j = sq[1];
  if (side === colors.white) {
    knight = figs.wN;
    bishop = figs.wB;
    rook = figs.wR;
    queen = figs.wQ;
    king = figs.wK;
  } else {
    knight = figs.bN;
    bishop = figs.bB;
    rook = figs.bR;
    queen = figs.bQ;
    king = figs.bK;
  }
  for (const dir of KnDir) {
    if (obj[i + dir[0]][j + dir[1]] === knight) {
      return true;
    }
  }
  for (const dir of BiDir) {
    let tempI = i + dir[0], tempJ = j + dir[1];
    while (obj[tempI][tempJ] !== figs.offBoard) {
      if (obj[tempI][tempJ] !== figs.empty) {
        if (obj[tempI][tempJ] === bishop ||
            obj[tempI][tempJ] === queen) {
          return true;
        }
        break;
      }
      tempI += dir[0], tempJ += dir[1];
    }
  }
  for (const dir of RkDir) {
    let tempI = i + dir[0], tempJ = j + dir[1];
    while (obj[tempI][tempJ] !== figs.offBoard) {
      if (obj[tempI][tempJ] !== figs.empty) {
        if (obj[tempI][tempJ] === rook ||
            obj[tempI][tempJ] === queen) {
          return true;
        }
        break;
      }
      tempI += dir[0], tempJ += dir[1];
    }
  }
  for (const dir of KiDir) {
    if (obj[i + dir[0]][j + dir[1]] === king) {
      return true;
    }
  }
  return false;
};

const isSqAttackedBySide = (sq, side, obj = grid) => {
  const i = sq[0], j = sq[1];
  if (side === colors.white) {
    if (obj[i + 1][j - 1] === figs.wP || obj[i + 1][j + 1] === figs.wP) {
      return true;
    }
  } else if (obj[i - 1][j - 1] === figs.bP || obj[i - 1][j + 1] === figs.bP) {
    return true;
  }
  return knBiRkKi([i, j], side, obj);
};

const resetBoard = () => {
  grid = initGrid();
  gameBoard.side = colors.white;
  gameBoard.enPas = [-1, -1];
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
