'use strict';

const pawnTable = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [10, 10, 0, -10, -10, 0, 10, 10],
  [5, 0, 0, 5, 5, 0, 0, 5],
  [0, 0, 10, 20, 20, 10, 0, 0],
  [5, 5, 5, 10, 10, 5, 5, 5],
  [10, 10, 10, 20, 20, 10, 10, 10],
  [20, 20, 20, 30, 30, 20, 20, 20],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const knightTable = [
  [0, -10, 0, 0, 0, 0, -10, 0],
  [0, 0, 0, 5, 5, 0, 0, 0],
  [0, 0, 10, 10, 10, 10, 0, 0],
  [0, 0, 10, 20, 20, 10, 5, 0],
  [5, 10, 15, 20, 20, 15, 10, 5],
  [5, 10, 10, 20, 20, 10, 10, 5],
  [0, 0, 5, 10, 10, 5, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const bishopTable = [
  [0, 0, -10, 0, 0, -10, 0, 0],
  [0, 0, 0, 10, 10, 0, 0, 0],
  [0, 0, 10, 15, 15, 10, 0, 0],
  [0, 10, 15, 20, 20, 15, 10, 0],
  [0, 10, 15, 20, 20, 15, 10, 0],
  [0, 0, 10, 15, 15, 10, 0, 0],
  [0, 0, 0, 10, 10, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const rookTable = [
  [0, 0, 5, 10, 10, 5, 0, 0],
  [0, 0, 5, 10, 10, 5, 0, 0],
  [0, 0, 5, 10, 10, 5, 0, 0],
  [0, 0, 5, 10, 10, 5, 0, 0],
  [0, 0, 5, 10, 10, 5, 0, 0],
  [0, 0, 5, 10, 10, 5, 0, 0],
  [25, 25, 25, 25, 25, 25, 25, 25],
  [0, 0, 5, 10, 10, 5, 0, 0],
];

const bishopPair = 40;

figs.wP.table = pawnTable;
figs.wN.table = knightTable;
figs.wB.table = bishopTable;
figs.wR.table = rookTable;
figs.wQ.table = rookTable;
figs.bP.table = pawnTable;
figs.bN.table = knightTable;
figs.bB.table = bishopTable;
figs.bR.table = rookTable;
figs.bQ.table = rookTable;

const evalPosition = () => {
  let score = gameBoard.material[0] - gameBoard.material[1];
  for (const key in figs) {
    const fig = figs[key];
    if (typeof fig === 'number' || kings.includes(fig.id)) continue;
    for (let figNum = 0; figNum < gameBoard.figNum[fig.id]; figNum++) {
      const sq = gameBoard.figList[figIndex(fig.id, figNum)];
      if (fig.color === colors.white) {
        const mirrored = mirror(sq);
        score += fig.table[mirrored[0]][mirrored[1]];
      } else {
        score -= fig.table[sq[0]][sq[1]];
      }
    }
  }
  if (gameBoard.figNum[figs.wB.id] >= 2) score += bishopPair;
  if (gameBoard.figNum[figs.bB.id] >= 2) score -= bishopPair;
  if (gameBoard.side === colors.white) return score;
  return -score;
};
