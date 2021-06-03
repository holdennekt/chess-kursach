'use strict';

const figs = {
  offBoard: -1, empty: 0,
  wP: 1,    wN: 2,    wB: 3,    wR: 4,    wQ: 5,    wK: 6,
  bP: 7,    bN: 8,    bB: 9,    bR: 10,    bQ: 11,    bK: 12,
};

const size = 8, gridSqNum = 120;
const maxFigNum = 10, typesOfFigures = 12;

const revFigs = [
  '. ',
  'wP', 'wN', 'wB', 'wR', 'wQ', 'wK',
  'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'
];

const colors = {
  'white': 0,
  'black': 1,
  'both': 2,
};

//directions of figs moves
const KnDir = [
  [-1, 2], [-2, 1], [-2, -1], [-1, -2],
  [1, -2], [2, -1], [2, 1], [1, 2]
];
const BiDir = [[-1, 1], [-1, -1], [1, -1], [1, 1]];
const RkDir = [[0, 1], [-1, 0], [0, -1], [1, 0]];
const KiDir = [
  [0, 1], [-1, 1], [-1, 0], [-1, -1],
  [0, -1], [1, -1], [1, 0], [1, 1]
];

const figDir = [      //direction of move for particular figure
  0,
  0, KnDir, BiDir, RkDir, KiDir, KiDir,
  0, KnDir, BiDir, RkDir, KiDir, KiDir
];
const noSlideFigs = [figs.wN, figs.wK, figs.bN, figs.bK];
const slideFigs = [figs.wB, figs.wR, figs.wQ, figs.bB, figs.bR, figs.bQ];

const figValue = [     //value for particular figure
  0, 100, 325, 325, 550, 1000, 50000,
  100, 325, 325, 550, 1000, 50000
];

const figCol = [        //color for particular figure
  0,
  colors.white, colors.white, colors.white,
  colors.white, colors.white, colors.white,
  colors.black, colors.black, colors.black,
  colors.black, colors.black, colors.black
];

const maxDepth = 64;        //for search
const maxGameMoves = 2048;
const maxPositionMoves = 256;
const inf = 30000;
const mate = 29000;
const pvEntries = 10000;

const kings = [figs.wK, figs.bK];

const gameController = {
  engineSide: colors.both,
  playerSide: colors.both,
  gameOver: false,
};

const initGrid = () => {
  const res = {};
  for (let i = -2; i < 10; i++) {
    res[i] = {};
    for (let j = -2; j < 10; j++) {
      if (i === -2 || i === -1 || i === 8 || i === 9 ||
        j === -2 || j === -1 || j === 8 || j === 9) {
        res[i][j] = figs.offBoard;
      } else {
        res[i][j] = figs.empty;
      }
    }
  }
  res[0] = {
    '-2': figs.offBoard, '-1': figs.offBoard, 0: figs.bR, 1: figs.bN,
    2: figs.bB, 3: figs.bQ, 4: figs.bK, 5: figs.bB,
    6: figs.bN, 7: figs.bR, 8: figs.offBoard, 9: figs.offBoard,
  };
  res[1] = {
    '-2': figs.offBoard, '-1': figs.offBoard, 0: figs.bP, 1: figs.bP,
    2: figs.bP, 3: figs.bP, 4: figs.bP, 5: figs.bP,
    6: figs.bP, 7: figs.bP, 8: figs.offBoard, 9: figs.offBoard,
  };
  res[6] = {
    '-2': figs.offBoard, '-1': figs.offBoard, 0: figs.wP, 1: figs.wP,
    2: figs.wP, 3: figs.wP, 4: figs.wP, 5: figs.wP,
    6: figs.wP, 7: figs.wP, 8: figs.offBoard, 9: figs.offBoard,
  };
  res[7] = {
    '-2': figs.offBoard, '-1': figs.offBoard, 0: figs.wR, 1: figs.wN,
    2: figs.wB, 3: figs.wQ, 4: figs.wK, 5: figs.wB,
    6: figs.wN, 7: figs.wR, 8: figs.offBoard, 9: figs.offBoard,
  };
  return res;
};

let grid = initGrid();

const logGrid = () => {
  console.log('-----------GRID----------');
  console.log('  0  1  2  3  4  5  6  7');
  for (const i in grid) {
    if (i === '-2' || i === '-1' || i === '8' || i === '9') continue;
    const row = grid[i];
    console.log(
      i, revFigs[row[0]], revFigs[row[1]], revFigs[row[2]],
      revFigs[row[3]], revFigs[row[4]], revFigs[row[5]],
      revFigs[row[6]], revFigs[row[7]]
    );
  }
  console.log('-------------------------');
};

const createSquares = block => {                //defining divs in container
  let light = 0;
  for (let i = 0; i < size; i++) {
    light ^= 1;
    for (let j = 0; j < size; j++) {
      const div = document.createElement('div');
      div.id = 'sq_' + i + j;
      div.className = `square rank${i} file${j}`;
      if (light === 1) div.className += ' light';
      else div.className += ' dark';
      block.append(div);
      light ^= 1;
    }
  }
};

const clearSquares = block => {
  const figures = block.querySelectorAll('.figure');
  if (figures.length === 0) return;
  for (const figure of figures) {
    block.removeChild(figure);
  }
};

const fillFigures = block => {
  clearSquares(block);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] >= figs.wP && grid[i][j] <= figs.bK) {
        const img = new Image();
        img.src = `icons/${grid[i][j]}.png`;
        img.className = `figure rank${i} file${j}`;
        block.append(img);
      }
    }
  }
};

const createBoard = block => {
  createSquares(block);
  fillFigures(block);
};

const figIndex = (fig, figNum) => (fig * 10 + figNum);
const notEmptyMove = (...args) => args.flat().every(el => el !== -1);
const noSq = () => [-1, -1];
const sq120 = sq => (sq[0] * 10 + sq[1] + 21);
const mirror = arr => [7 - arr[0], arr[1]];

const arrsEqual = (...arrs) => {
  if (arrs.length === 1) return new Error('at least 2 arguments requied');
  for (const arr of arrs) {
    if (arr.length !== arrs[0].length) return false;
  }
  for (const i in arrs[0]) {
    if (arrs.some(el => el[i] !== arrs[0][i])) return false;
  }
  return true;
};
const checkObjectsEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (const i in a) {
    if (typeof a[i] === 'object') {
      if (!checkObjectsEqual(a[i], b[i])) return false;
    } else if (a[i] !== b[i]) return false;
  }
  return true;
};
const cloneObj = obj => {
  let clone;
  if (!Array.isArray(obj)) clone = {};
  else clone = [];
  for (const i in obj) {
    if (typeof obj[i] === 'object') {
      clone[i] =  cloneObj(obj[i]);
    } else clone[i] = obj[i];
  }
  return clone;
};
const arr0 = n => {
  const res = [];
  for (let i = 0; i < n; i++) res.push(0);
  return res;
};
const arrPvTable = n => {
  const res = [];
  for (let i = 0; i < n; i++) {
    res[i] = { move: emptyMove(), posKey: 0 };
  }
  return res;
};
const arr = n => new Array(n);
const arrHistory = n => {
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
const arrSearchKillers = n => {
  const res = [];
  for (let i = 0; i < n; i++) {
    res[i] = emptyMove();
  }
  return res;
};
const transformCastlePerm = obj => {
  let res = 0;
  if (obj.whiteKSide) res += 1;
  if (obj.whiteQSide) res += 2;
  if (obj.blackKSide) res += 4;
  if (obj.blackQSide) res += 8;
  return res;
};
const transformEnPas = arr => {
  let res = 99;
  if (notEmptyMove(arr)) res = arr[0] * 10 + arr[1] + 21;
  return res;
};

const Flag = (enPas = false, pawnStart = false, castling = '') => (
  { enPas, pawnStart, castling }
);
const emptyMove = () => (
  { from: noSq(), to: noSq(), captured: -1, promoted: -1, flag: Flag() }
);

const rand32 = () => (
  (Math.floor((Math.random() * 225) + 1) << 23) |
  (Math.floor((Math.random() * 225) + 1) << 16) |
  (Math.floor((Math.random() * 225) + 1) << 8) |
  Math.floor((Math.random() * 225) + 1)
);

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
  for (let i = 0; i < 16; i++) {  //16 cases of castling permitions
    res[i] = rand32();
  }
  return res;
};

const castleKeys = initCastleKeys();

const sideKey = rand32();

const hashFig = (fig, sq) => {
  gameBoard.posKey ^= figKeys[(fig * gridSqNum) + sq120(sq)];
};
const hashCastling = () => {
  gameBoard.posKey ^= castleKeys[transformCastlePerm(gameBoard.castlePerm)];
};
const hashSide = () => { gameBoard.posKey ^= sideKey; };
const hashEnPassant = () => {
  gameBoard.posKey ^= figKeys[transformEnPas(gameBoard.enPas)];
};
