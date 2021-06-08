'use strict';

//directions of figs moves
const knDir = [
  [-1, 2],
  [-2, 1],
  [-2, -1],
  [-1, -2],
  [1, -2],
  [2, -1],
  [2, 1],
  [1, 2],
];
const biDir = [
  [-1, 1],
  [-1, -1],
  [1, -1],
  [1, 1],
];
const rkDir = [
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 0],
];
const qnDir = [
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
];
const kiDir = [
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const colors = {
  white: 0,
  black: 1,
  both: 2,
};

const figs = {
  offBoard: -1,
  empty: 0,
  wP: { id: 1, value: 100, color: colors.white },
  wN: { id: 2, dirs: knDir, slide: false, value: 325, color: colors.white },
  wB: { id: 3, dirs: biDir, slide: true, value: 325, color: colors.white },
  wR: { id: 4, dirs: rkDir, slide: true, value: 550, color: colors.white },
  wQ: { id: 5, dirs: qnDir, slide: true, value: 1000, color: colors.white },
  wK: { id: 6, dirs: kiDir, slide: false, value: 50000, color: colors.white },
  bP: { id: 7, value: 100, color: colors.black },
  bN: { id: 8, dirs: knDir, slide: false, value: 325, color: colors.black },
  bB: { id: 9, dirs: biDir, slide: true, value: 325, color: colors.black },
  bR: { id: 10, dirs: rkDir, slide: true, value: 550, color: colors.black },
  bQ: { id: 11, dirs: qnDir, slide: true, value: 1000, color: colors.black },
  bK: { id: 12, dirs: kiDir, slide: false, value: 50000, color: colors.black },
};

const size64 = 8;
const gridSqNum = 120;
const maxFigNum = 10;
const typesOfFigures = 12;
const index120FirstSq = 21;
const index120FirstOffBoard = 99;
const width120 = 10;
const indexOffBoard = [-2, -1, 8, 9];

const maxDepth = 64; //for search
const maxGameMoves = 2048;
const maxPositionMoves = 256;
const inf = 30000;
const mate = 29000;
const pvEntries = 10000;

const kings = [figs.wK.id, figs.bK.id];

const gameController = {
  engineSide: colors.both,
  playerSide: colors.both,
  gameOver: false,
};

const grid = {};

const initGrid = () => {
  for (let i = -2; i < 10; i++) {
    grid[i] = {};
    for (let j = -2; j < 10; j++) {
      if (indexOffBoard.includes(i) || indexOffBoard.includes(j)) {
        grid[i][j] = figs.offBoard;
      } else {
        grid[i][j] = figs.empty;
      }
    }
  }
  grid[0] = {
    //start row of black figures
    '-2': figs.offBoard,
    '-1': figs.offBoard,
    0: figs.bR.id,
    1: figs.bN.id,
    2: figs.bB.id,
    3: figs.bQ.id,
    4: figs.bK.id,
    5: figs.bB.id,
    6: figs.bN.id,
    7: figs.bR.id,
    8: figs.offBoard,
    9: figs.offBoard,
  };
  grid[1] = {
    //start row of black pawns
    '-2': figs.offBoard,
    '-1': figs.offBoard,
    0: figs.bP.id,
    1: figs.bP.id,
    2: figs.bP.id,
    3: figs.bP.id,
    4: figs.bP.id,
    5: figs.bP.id,
    6: figs.bP.id,
    7: figs.bP.id,
    8: figs.offBoard,
    9: figs.offBoard,
  };
  grid[6] = {
    //start row of white pawns
    '-2': figs.offBoard,
    '-1': figs.offBoard,
    0: figs.wP.id,
    1: figs.wP.id,
    2: figs.wP.id,
    3: figs.wP.id,
    4: figs.wP.id,
    5: figs.wP.id,
    6: figs.wP.id,
    7: figs.wP.id,
    8: figs.offBoard,
    9: figs.offBoard,
  };
  grid[7] = {
    //start row of white figures
    '-2': figs.offBoard,
    '-1': figs.offBoard,
    0: figs.wR.id,
    1: figs.wN.id,
    2: figs.wB.id,
    3: figs.wQ.id,
    4: figs.wK.id,
    5: figs.wB.id,
    6: figs.wN.id,
    7: figs.wR.id,
    8: figs.offBoard,
    9: figs.offBoard,
  };
};

initGrid(); //object of board

const logGrid = () => {
  for (let i = 0; i < 8; i++) {
    let line = i + ' ';
    for (let j = 0; j < 8; j++) {
      const key = getKeyById(figs, grid[i][j]);
      if (key === 'empty') line += '.  ';
      else line += key + ' ';
    }
    console.log(line);
  }
};

const createSquares = (block) => {
  //defining divs in container
  let light = 0;
  for (let i = 0; i < size64; i++) {
    light ^= 1;
    for (let j = 0; j < size64; j++) {
      const div = document.createElement('div');
      div.id = `sq_${i}_${j}`;
      div.className = `square rank${i} file${j}`;
      if (light) div.className += ' light';
      else div.className += ' dark';
      block.append(div);
      light ^= 1;
    }
  }
};

const clearSquares = (block) => {
  const figures = block.querySelectorAll('.figure');
  if (!figures.length) return;
  for (const figure of figures) {
    block.removeChild(figure);
  }
};

const fillFigures = (block) => {
  clearSquares(block);
  for (let i = 0; i < size64; i++) {
    for (let j = 0; j < size64; j++) {
      if (grid[i][j] >= figs.wP.id && grid[i][j] <= figs.bK.id) {
        const img = new Image();
        img.src = `icons/${grid[i][j]}.png`;
        img.className = `figure rank${i} file${j}`;
        block.append(img);
      }
    }
  }
};

const createBoard = (block) => {
  createSquares(block);
  fillFigures(block);
};

const figIndex = (fig, figNum) => fig * width120 + figNum;
const notEmptyMove = (...args) => args.flat().every((el) => el !== -1);
const noSq = () => [-1, -1];
const sq120 = (sq) => sq[0] * width120 + sq[1] + index120FirstSq;
const mirror = (arr) => [size64 - 1 - arr[0], arr[1]];

const getKeyById = (obj, id) => {
  const entries = Object.entries(obj);
  for (const [key, value] of entries) {
    if (value.id === id || value === id) return key;
  }
  console.log(id, entries);
  throw new Error('not found key');
};
const arrsEqual = (...arrs) => {
  if (arrs.length < 2) return new Error('at least 2 arguments requied');
  for (const arr of arrs) {
    if (arr.length !== arrs[0].length) return false;
  }
  for (let i = 0; i < arrs[0].length; i++) {
    if (arrs.some((el) => el[i] !== arrs[0][i])) return false;
  }
  return true;
};
const checkObjectsEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (const i in a) {
    if (typeof a[i] === 'object') {
      if (!checkObjectsEqual(a[i], b[i])) return false;
    } else if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};
const cloneObj = (obj) => {
  let clone;
  if (!Array.isArray(obj)) clone = {};
  else clone = [];
  for (const i in obj) {
    if (typeof obj[i] === 'object') {
      clone[i] = cloneObj(obj[i]);
    } else clone[i] = obj[i];
  }
  return clone;
};
const arr0 = (n) => {
  const res = [];
  for (let i = 0; i < n; i++) res.push(0);
  return res;
};
const arrPvTable = (n) => {
  const res = [];
  for (let i = 0; i < n; i++) {
    res[i] = { move: emptyMove(), posKey: 0 };
  }
  return res;
};

const arrHistory = (n) => {
  const res = [];
  for (let i = 0; i < n; i++) {
    res[i] = {
      move: emptyMove(),
      fiftyMove: 0,
      posKey: 0,
      enPas: noSq(),
      castlePerm: {
        whiteKSide: false,
        whiteQSide: false,
        blackKSide: false,
        blackQSide: false,
      },
    };
  }
  return res;
};
const arrSearchKillers = (n) => {
  const res = [];
  for (let i = 0; i < n; i++) {
    res[i] = emptyMove();
  }
  return res;
};
const transformCastlePerm = (obj) => {
  let res = 0;
  if (obj.whiteKSide) res += 1; //2^0
  if (obj.whiteQSide) res += 2; //2^1
  if (obj.blackKSide) res += 4; //2^2
  if (obj.blackQSide) res += 8; //2^3
  return res;
};
const transformEnPas = (arr) => {
  let res = index120FirstOffBoard;
  if (notEmptyMove(arr)) res = arr[0] * width120 + arr[1] + index120FirstSq;
  return res;
};

const Flag = (enPas = false, pawnStart = false, castling = '') => ({
  enPas,
  pawnStart,
  castling,
});
const emptyMove = () => ({
  from: noSq(),
  to: noSq(),
  captured: -1,
  promoted: -1,
  flag: Flag(),
});

const rand32 = () =>
  (Math.floor(Math.random() * 225 + 1) << 23) |
  (Math.floor(Math.random() * 225 + 1) << 16) |
  (Math.floor(Math.random() * 225 + 1) << 8) |
  Math.floor(Math.random() * 225 + 1);

const initFigKeys = () => {
  const res = [];
  for (let i = 0; i < (typesOfFigures + 1) * gridSqNum; i++) {
    res[i] = rand32();
  }
  return res;
};

const figKeys = initFigKeys();

const initCastleKeys = () => {
  const res = [];
  for (let i = 0; i < 16; i++) {
    //16 cases of castling permitions
    res[i] = rand32();
  }
  return res;
};

const castleKeys = initCastleKeys();

const sideKey = rand32();

const hashFig = (fig, sq) => {
  gameBoard.posKey ^= figKeys[fig * gridSqNum + sq120(sq)];
};
const hashCastling = () => {
  gameBoard.posKey ^= castleKeys[transformCastlePerm(gameBoard.castlePerm)];
};
const hashSide = () => {
  gameBoard.posKey ^= sideKey;
};
const hashEnPassant = () => {
  gameBoard.posKey ^= figKeys[transformEnPas(gameBoard.enPas)];
};
