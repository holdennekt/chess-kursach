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

const evalPosition = () => {
  let score = gameBoard.material[0] - gameBoard.material[1];
  let fig = figs.wP.id;
  for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
    const sq = gameBoard.figList[figIndex(fig, figNum)];
    const mirrored = mirror(sq);
    score += pawnTable[mirrored[0]][mirrored[1]];
  }
  fig = figs.bP.id;
  for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
    const sq = gameBoard.figList[figIndex(fig, figNum)];
    score -= pawnTable[sq[0]][sq[1]];
  }
  fig = figs.wN.id;
  for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
    const sq = gameBoard.figList[figIndex(fig, figNum)];
    const mirrored = mirror(sq);
    score += knightTable[mirrored[0]][mirrored[1]];
  }
  fig = figs.bN.id;
  for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
    const sq = gameBoard.figList[figIndex(fig, figNum)];
    score -= knightTable[sq[0]][sq[1]];
  }
  fig = figs.wB.id;
  for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
    const sq = gameBoard.figList[figIndex(fig, figNum)];
    const mirrored = mirror(sq);
    score += bishopTable[mirrored[0]][mirrored[1]];
  }
  fig = figs.bB.id;
  for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
    const sq = gameBoard.figList[figIndex(fig, figNum)];
    score -= bishopTable[sq[0]][sq[1]];
  }
  fig = figs.wR.id;
  for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
    const sq = gameBoard.figList[figIndex(fig, figNum)];
    const mirrored = mirror(sq);
    score += rookTable[mirrored[0]][mirrored[1]];
  }
  fig = figs.bR.id;
  for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
    const sq = gameBoard.figList[figIndex(fig, figNum)];
    score -= rookTable[sq[0]][sq[1]];
  }
  fig = figs.wQ.id;
  for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
    const sq = gameBoard.figList[figIndex(fig, figNum)];
    const mirrored = mirror(sq);
    score += rookTable[mirrored[0]][mirrored[1]];
  }
  fig = figs.bQ.id;
  for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
    const sq = gameBoard.figList[figIndex(fig, figNum)];
    score -= rookTable[sq[0]][sq[1]];
  }
  if (gameBoard.figNum[figs.wB.id] >= 2) score += bishopPair;
  if (gameBoard.figNum[figs.bB.id] >= 2) score -= bishopPair;
  if (gameBoard.side === colors.white) return score;
  return -score;
};
