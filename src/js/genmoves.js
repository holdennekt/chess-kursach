'use strict';

const mvvLvaValue = [
  0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600,
];

const captureBonus = 1000000;
const enPasBonus = 1000105;
const killerBonus = 900000;
const killerBonus2 = 800000;
const pvBonus = 2000000;

const initMvvLva = () => {
  const res = [];
  const magNum = 6;
  for (let attacker = figs.wP; attacker <= figs.bK; attacker++) {
    for (let victim = figs.wP; victim <= figs.bK; victim++) {
      const i = victim * 14 + attacker;
      const temp = mvvLvaValue[attacker] / 100;
      res[i] = mvvLvaValue[victim] + magNum - temp;
    }
  }
  return res;
};

const mvvLvaScores = initMvvLva();

const addMove = (from, to, captured = 0, promoted = 0, flag = Flag()) => {
  const move = { from, to, captured, promoted, flag };
  const index = gameBoard.moveListStart[gameBoard.ply + 1];
  gameBoard.moveList[index] = move;
  if (captured !== 0) {
    const scoresIndex = captured * 14 + grid[from[0]][from[1]];
    gameBoard.moveScores[index] = mvvLvaScores[scoresIndex] + captureBonus;
  } else if (flag.enPas) {
    gameBoard.moveScores[index] = enPasBonus;
  } else {
    gameBoard.moveScores[index] = 0;
    const moveKiller1 = gameBoard.searchKillers[gameBoard.ply];
    const moveKiller2 = gameBoard.searchKillers[gameBoard.ply + maxDepth];
    if (checkObjectsEqual(move, moveKiller1)) {
      gameBoard.moveScores[index] = killerBonus;
    } else if (checkObjectsEqual(move, moveKiller2)) {
      gameBoard.moveScores[index] = killerBonus2;
    } else {
      const temp = grid[from[0]][from[1]] * gridSqNum + sq120(mirror(to));
      gameBoard.moveScores[index] = gameBoard.searchHistory[temp];
    }
  }
  gameBoard.moveListStart[gameBoard.ply + 1]++;
};

const addWhitePawnMove = (from, to, captured = figs.empty) => {
  if (from[0] === 1) {
    addMove(from, to, captured, figs.wQ);
    addMove(from, to, captured, figs.wR);
    addMove(from, to, captured, figs.wB);
    addMove(from, to, captured, figs.wN);
  } else {
    addMove(from, to, captured);
  }
};

const addBlackPawnMove = (from, to, captured = figs.empty) => {
  if (from[0] === 6) {
    addMove(from, to, captured, figs.bQ);
    addMove(from, to, captured, figs.bR);
    addMove(from, to, captured, figs.bB);
    addMove(from, to, captured, figs.bN);
  } else {
    addMove(from, to, captured);
  }
};

const whitePawns = () => {
  const figType = figs.wP;
  for (let figNum = 0; figNum < gameBoard.figNum[figType]; figNum++) {
    const sq = gameBoard.figList[figIndex(figType, figNum)];
    if (grid[sq[0] - 1][sq[1]] === figs.empty) {
      addWhitePawnMove(sq, [sq[0] - 1, sq[1]]);
      if (sq[0] === 6 && grid[sq[0] - 2][sq[1]] === figs.empty) {
        addMove(
          sq,
          [sq[0] - 2, sq[1]],
          figs.empty,
          figs.empty,
          Flag(false, true)
        );
      }
    }
    if (
      grid[sq[0] - 1][sq[1] - 1] > figs.empty &&
      figCol[grid[sq[0] - 1][sq[1] - 1]] === colors.black
    ) {
      addWhitePawnMove(sq, [sq[0] - 1, sq[1] - 1], grid[sq[0] - 1][sq[1] - 1]);
    }
    if (
      grid[sq[0] - 1][sq[1] + 1] > figs.empty &&
      figCol[grid[sq[0] - 1][sq[1] + 1]] === colors.black
    ) {
      addWhitePawnMove(sq, [sq[0] - 1, sq[1] + 1], grid[sq[0] - 1][sq[1] + 1]);
    }
    if (!arrsEqual(gameBoard.enPas, noSq())) {
      if (arrsEqual(gameBoard.enPas, [sq[0] - 1, sq[1] - 1])) {
        addMove(sq, [sq[0] - 1, sq[1] - 1], figs.empty, figs.empty, Flag(true));
      }
      if (arrsEqual(gameBoard.enPas, [sq[0] - 1, sq[1] + 1])) {
        addMove(sq, [sq[0] - 1, sq[1] + 1], figs.empty, figs.empty, Flag(true));
      }
    }
  }
};

const blackPawns = () => {
  const figType = figs.bP;
  for (let figNum = 0; figNum < gameBoard.figNum[figType]; figNum++) {
    const sq = gameBoard.figList[figIndex(figType, figNum)];
    if (grid[sq[0] + 1][sq[1]] === figs.empty) {
      addBlackPawnMove(sq, [sq[0] + 1, sq[1]]);
      if (sq[0] === 1 && grid[sq[0] + 2][sq[1]] === figs.empty) {
        addMove(
          sq,
          [sq[0] + 2, sq[1]],
          figs.empty,
          figs.empty,
          Flag(false, true)
        );
      }
    }
    if (
      grid[sq[0] + 1][sq[1] - 1] > figs.empty &&
      figCol[grid[sq[0] + 1][sq[1] - 1]] === colors.white
    ) {
      addBlackPawnMove(sq, [sq[0] + 1, sq[1] - 1], grid[sq[0] + 1][sq[1] - 1]);
    }
    if (
      grid[sq[0] + 1][sq[1] + 1] > figs.empty &&
      figCol[grid[sq[0] + 1][sq[1] + 1]] === colors.white
    ) {
      addBlackPawnMove(sq, [sq[0] + 1, sq[1] + 1], grid[sq[0] + 1][sq[1] + 1]);
    }
    if (!arrsEqual(gameBoard.enPas, noSq())) {
      if (arrsEqual(gameBoard.enPas, [sq[0] + 1, sq[1] - 1])) {
        addMove(sq, [sq[0] + 1, sq[1] - 1], figs.empty, figs.empty, Flag(true));
      }
      if (arrsEqual(gameBoard.enPas, [sq[0] + 1, sq[1] + 1])) {
        addMove(sq, [sq[0] + 1, sq[1] + 1], figs.empty, figs.empty, Flag(true));
      }
    }
  }
};

const castle = side => {
  let i, color;
  if (side === colors.white) (i = 7), (color = 'white');
  else (i = 0), (color = 'black');
  if (gameBoard.castlePerm[color + 'KSide']) {
    if (grid[i][5] === figs.empty && grid[i][6] === figs.empty) {
      if (
        !isSqAttackedBySide([i, 4], colors[color] ^ 1) &&
        !isSqAttackedBySide([i, 5], colors[color] ^ 1) &&
        !isSqAttackedBySide([i, 6], colors[color] ^ 1)
      ) {
        addMove(
          [i, 4],
          [i, 6],
          figs.empty,
          figs.empty,
          Flag(false, false, color + 'KSide')
        );
      }
    }
  }
  if (gameBoard.castlePerm[color + 'QSide']) {
    if (
      grid[i][1] === figs.empty &&
      grid[i][2] === figs.empty &&
      grid[i][3] === figs.empty
    ) {
      if (
        !isSqAttackedBySide([i, 2], colors[color] ^ 1) &&
        !isSqAttackedBySide([i, 3], colors[color] ^ 1) &&
        !isSqAttackedBySide([i, 4], colors[color] ^ 1)
      ) {
        addMove(
          [i, 4],
          [i, 2],
          figs.empty,
          figs.empty,
          Flag(false, false, color + 'QSide')
        );
      }
    }
  }
};

const noSlide = index => {
  for (let i = index; i < index + 2; i++) {
    const fig = noSlideFigs[i];
    for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
      const sq = gameBoard.figList[figIndex(fig, figNum)];
      const dirs = figDir[fig];
      for (const dir of dirs) {
        const tempI = sq[0] + dir[0];
        const tempJ = sq[1] + dir[1];
        if (grid[tempI][tempJ] === figs.offBoard) continue;
        else if (grid[tempI][tempJ] !== figs.empty) {
          if (figCol[grid[tempI][tempJ]] !== gameBoard.side) {
            addMove(sq, [tempI, tempJ], grid[tempI][tempJ]);
          }
        } else if (grid[tempI][tempJ] === figs.empty) {
          addMove(sq, [tempI, tempJ]);
        }
      }
    }
  }
};

const slide = index => {
  for (let i = index; i < index + 3; i++) {
    const fig = slideFigs[i];
    for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
      const sq = gameBoard.figList[figIndex(fig, figNum)];
      const dirs = figDir[fig];
      for (const dir of dirs) {
        let tempI = sq[0] + dir[0];
        let tempJ = sq[1] + dir[1];
        while (grid[tempI][tempJ] !== figs.offBoard) {
          if (grid[tempI][tempJ] !== figs.empty) {
            if (figCol[grid[tempI][tempJ]] !== gameBoard.side) {
              addMove(sq, [tempI, tempJ], grid[tempI][tempJ]);
            }
            break;
          }
          addMove(sq, [tempI, tempJ]);
          tempI += dir[0];
          tempJ += dir[1];
        }
      }
    }
  }
};

const generateMoves = () => {
  gameBoard.moveListStart[gameBoard.ply + 1] =
    gameBoard.moveListStart[gameBoard.ply];
  let startIndex1, startIndex2;
  if (gameBoard.side === colors.white) {
    whitePawns();
    castle(colors.white);
    (startIndex1 = 0), (startIndex2 = 0);
  } else {
    blackPawns();
    castle(colors.black);
    (startIndex1 = 2), (startIndex2 = 3);
  }
  noSlide(startIndex1);
  slide(startIndex2);
};

const moveExists = move => {
  generateMoves();
  const start = gameBoard.moveListStart[gameBoard.ply];
  const end = gameBoard.moveListStart[gameBoard.ply + 1];
  for (let index = start; index < end; index++) {
    const moveFound = gameBoard.moveList[index];
    if (!isMoveLegal(moveFound)) {
      continue;
    }
    if (checkObjectsEqual(move, moveFound)) {
      return true;
    }
  }
  return false;
};
