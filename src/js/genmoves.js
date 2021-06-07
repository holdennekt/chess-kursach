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
  for (let attacker = figs.wP.id; attacker <= figs.bK.id; attacker++) {
    for (let victim = figs.wP.id; victim <= figs.bK.id; victim++) {
      const i = victim * (typesOfFigures + 1) + attacker;
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
    const scoresIndex =
      captured * (typesOfFigures + 1) + grid[from[0]][from[1]];
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
    addMove(from, to, captured, figs.wQ.id);
    addMove(from, to, captured, figs.wR.id);
    addMove(from, to, captured, figs.wB.id);
    addMove(from, to, captured, figs.wN.id);
  } else {
    addMove(from, to, captured);
  }
};

const addBlackPawnMove = (from, to, captured = figs.empty) => {
  if (from[0] === 6) {
    addMove(from, to, captured, figs.bQ.id);
    addMove(from, to, captured, figs.bR.id);
    addMove(from, to, captured, figs.bB.id);
    addMove(from, to, captured, figs.bN.id);
  } else {
    addMove(from, to, captured);
  }
};

const whitePawns = () => {
  const figType = figs.wP.id;
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
    let key = getKeyById(figs, grid[sq[0] - 1][sq[1] - 1]);
    if (
      grid[sq[0] - 1][sq[1] - 1] > figs.empty &&
      figs[key].color === colors.black
    ) {
      addWhitePawnMove(sq, [sq[0] - 1, sq[1] - 1], grid[sq[0] - 1][sq[1] - 1]);
    }
    key = getKeyById(figs, grid[sq[0] - 1][sq[1] + 1]);
    if (
      grid[sq[0] - 1][sq[1] + 1] > figs.empty &&
      figs[key].color === colors.black
    ) {
      addWhitePawnMove(sq, [sq[0] - 1, sq[1] + 1], grid[sq[0] - 1][sq[1] + 1]);
    }
    if (!arrsEqual(gameBoard.enPas, noSq())) {
      const i = sq[0] - 1;
      if (arrsEqual(gameBoard.enPas, [i, sq[1] - 1])) {
        addMove(sq, [i, sq[1] - 1], figs.empty, figs.empty, Flag(true));
      }
      if (arrsEqual(gameBoard.enPas, [sq[0] - 1, sq[1] + 1])) {
        addMove(sq, [i, sq[1] + 1], figs.empty, figs.empty, Flag(true));
      }
    }
  }
};

const blackPawns = () => {
  const figType = figs.bP.id;
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
    let key = getKeyById(figs, grid[sq[0] + 1][sq[1] - 1]);
    if (
      grid[sq[0] + 1][sq[1] - 1] > figs.empty &&
      figs[key].color === colors.white
    ) {
      addBlackPawnMove(sq, [sq[0] + 1, sq[1] - 1], grid[sq[0] + 1][sq[1] - 1]);
    }
    key = getKeyById(figs, grid[sq[0] + 1][sq[1] + 1]);
    if (
      grid[sq[0] + 1][sq[1] + 1] > figs.empty &&
      figs[key].color === colors.white
    ) {
      addBlackPawnMove(sq, [sq[0] + 1, sq[1] + 1], grid[sq[0] + 1][sq[1] + 1]);
    }
    if (!arrsEqual(gameBoard.enPas, noSq())) {
      const i = sq[0] + 1;
      if (arrsEqual(gameBoard.enPas, [i, sq[1] - 1])) {
        addMove(sq, [i, sq[1] - 1], figs.empty, figs.empty, Flag(true));
      }
      if (arrsEqual(gameBoard.enPas, [sq[0] + 1, sq[1] + 1])) {
        addMove(sq, [i, sq[1] + 1], figs.empty, figs.empty, Flag(true));
      }
    }
  }
};

const castling = side => {
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

const noSlideFigs = col => {
  for (const i in figs) {
    if (figs[i].slide === false && figs[i].color === col) {
      const fig = figs[i].id;
      for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
        const sq = gameBoard.figList[figIndex(fig, figNum)];
        const dirs = figs[i].dirs;
        for (const dir of dirs) {
          const tempI = sq[0] + dir[0];
          const tempJ = sq[1] + dir[1];
          if (grid[tempI][tempJ] === figs.offBoard) continue;
          else if (grid[tempI][tempJ] !== figs.empty) {
            const key = getKeyById(figs, grid[tempI][tempJ]);
            if (figs[key].color !== gameBoard.side) {
              addMove(sq, [tempI, tempJ], grid[tempI][tempJ]);
            }
          } else if (grid[tempI][tempJ] === figs.empty) {
            addMove(sq, [tempI, tempJ]);
          }
        }
      }
    }
  }
};

const slideFigs = col => {
  for (const i in figs) {
    if (figs[i].slide && figs[i].color === col) {
      const fig = figs[i].id;
      for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
        const sq = gameBoard.figList[figIndex(fig, figNum)];
        const dirs = figs[i].dirs;
        for (const dir of dirs) {
          let tempI = sq[0] + dir[0];
          let tempJ = sq[1] + dir[1];
          while (grid[tempI][tempJ] !== figs.offBoard) {
            if (grid[tempI][tempJ] !== figs.empty) {
              const key = getKeyById(figs, grid[tempI][tempJ]);
              if (figs[key].color !== gameBoard.side) {
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
  }
};

const generateMoves = () => {
  gameBoard.moveListStart[gameBoard.ply + 1] =
    gameBoard.moveListStart[gameBoard.ply];
  if (gameBoard.side === colors.white) {
    whitePawns();
  } else {
    blackPawns();
  }
  castling(gameBoard.side);
  noSlideFigs(gameBoard.side);
  slideFigs(gameBoard.side);
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
