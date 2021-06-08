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
    if (objctsEqual(move, moveKiller1)) {
      gameBoard.moveScores[index] = killerBonus;
    } else if (objctsEqual(move, moveKiller2)) {
      gameBoard.moveScores[index] = killerBonus2;
    } else {
      const temp = grid[from[0]][from[1]] * gridSqNum + sq120(mirror(to));
      gameBoard.moveScores[index] = gameBoard.searchHistory[temp];
    }
  }
  gameBoard.moveListStart[gameBoard.ply + 1]++;
};

const addPawnMove = (color, from, to, captured = figs.empty) => {
  let promI, queen, rook, bishop, knight;
  if (color === colors.white) {
    promI = 1;
    queen = figs.wQ.id;
    rook = figs.wR.id;
    bishop = figs.wB.id;
    knight = figs.wN.id;
  } else {
    promI = 6;
    queen = figs.bQ.id;
    rook = figs.bR.id;
    bishop = figs.bB.id;
    knight = figs.bN.id;
  }
  if (from[0] === promI) {
    addMove(from, to, captured, queen);
    addMove(from, to, captured, rook);
    addMove(from, to, captured, bishop);
    addMove(from, to, captured, knight);
  } else {
    addMove(from, to, captured);
  }
};

const addPawnCaptureMoves = (sq, capI, color) => {
  let key = getKeyById(figs, grid[capI][sq[1] - 1]);
  let statement =
    grid[capI][sq[1] - 1] > figs.empty && (figs[key].color === color) ^ 1;
  if (statement) {
    addPawnMove(color, sq, [capI, sq[1] - 1], grid[capI][sq[1] - 1]);
  }
  key = getKeyById(figs, grid[capI][sq[1] + 1]);
  statement =
    grid[capI][sq[1] + 1] > figs.empty && (figs[key].color === color) ^ 1;
  if (statement) {
    addPawnMove(color, sq, [capI, sq[1] + 1], grid[capI][sq[1] + 1]);
  }
};

const generatePawnMoves = (color) => {
  let fig, dir, startI;
  if (color === colors.white) {
    fig = figs.wP.id;
    dir = figs.wP.dir[0];
    startI = 6;
  } else {
    fig = figs.bP.id;
    dir = figs.bP.dir[0];
    startI = 1;
  }
  for (let figNum = 0; figNum < gameBoard.figNum[fig]; figNum++) {
    const sq = gameBoard.figList[figIndex(fig, figNum)];
    if (grid[sq[0] + dir][sq[1]] === figs.empty) {
      addPawnMove(color, sq, [sq[0] + dir, sq[1]]);
      const toSq = [sq[0] + dir * 2, sq[1]];
      if (sq[0] === startI && grid[toSq[0]][toSq[1]] === figs.empty) {
        addMove(sq, toSq, figs.empty, figs.empty, Flag(false, true));
      }
    }
    const capI = sq[0] + dir;
    addPawnCaptureMoves(sq, capI, color);
    if (!arrsEqual(gameBoard.enPas, noSq())) {
      if (arrsEqual(gameBoard.enPas, [capI, sq[1] - 1])) {
        addMove(sq, [capI, sq[1] - 1], figs.empty, figs.empty, Flag(true));
      }
      if (arrsEqual(gameBoard.enPas, [capI, sq[1] + 1])) {
        addMove(sq, [capI, sq[1] + 1], figs.empty, figs.empty, Flag(true));
      }
    }
  }
};

const castlingKingSide = (rank, color, side) => {
  if (gameBoard.castlePerm[color + 'KSide']) {
    const tempJ = [5, 6];
    if (tempJ.every((el) => grid[rank][el] === figs.empty)) {
      const kingWay = [4, 5, 6];
      if (kingWay.every((el) => !isSqAttackedBySide([rank, el], side ^ 1))) {
        const flag = Flag(false, false, color + 'KSide');
        addMove([rank, 4], [rank, 6], figs.empty, figs.empty, flag);
      }
    }
  }
};

const castlingQueenSide = (rank, color, side) => {
  if (gameBoard.castlePerm[color + 'QSide']) {
    const tempJ = [1, 2, 3];
    if (tempJ.every((el) => grid[rank][el] === figs.empty)) {
      const kingWay = [2, 3, 4];
      if (kingWay.every((el) => !isSqAttackedBySide([rank, el], side ^ 1))) {
        const flag = Flag(false, false, color + 'QSide');
        addMove([rank, 4], [rank, 2], figs.empty, figs.empty, flag);
      }
    }
  }
};

const castling = (side) => {
  let rank, color;
  if (side === colors.white) {
    rank = 7;
    color = 'white';
  } else {
    rank = 0;
    color = 'black';
  }
  castlingKingSide(rank, color, side);
  castlingQueenSide(rank, color, side);
};

const noSlideFigs = (col) => {
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

const slideFigs = (col) => {
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
  const side = gameBoard.side;
  generatePawnMoves(side);
  castling(side);
  noSlideFigs(side);
  slideFigs(side);
};

const moveExists = (move) => {
  generateMoves();
  const start = gameBoard.moveListStart[gameBoard.ply];
  const end = gameBoard.moveListStart[gameBoard.ply + 1];
  for (let index = start; index < end; index++) {
    const moveFound = gameBoard.moveList[index];
    if (!isMoveLegal(moveFound)) {
      continue;
    }
    if (objctsEqual(move, moveFound)) {
      return true;
    }
  }
  return false;
};
