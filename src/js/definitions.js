'use strict';

const figs = {
    offBoard: -1, empty: 0,
    wP: 1,    wN: 2,    wB: 3,    wR: 4,    wQ: 5,    wK: 6,
    bP: 7,    bN: 8,    bB: 9,    bR: 10,    bQ: 11,    bK: 12,
};
const revFig = [
    'none',
    'wP', 'wN', 'wB', 'wR', 'wQ', 'wK',
    'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'
];

const colors = {
    'white': 0,
    'black': 1,
    'both': 2,
};

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

const figDir = [
    0, 0, KnDir, BiDir, RkDir, KiDir, KiDir,
    0, KnDir, BiDir, RkDir, KiDir, KiDir
];
const noSlideFigs = [figs.wN, figs.wK, figs.bN, figs.bK];
const slideFigs = [figs.wB, figs.wR, figs.wQ, figs.bB, figs.bR, figs.bQ];

const figValue = [
    0, 100, 325, 325, 550, 1000, 50000,
    100, 325, 325, 550, 1000, 50000
];

const figCol = [
    0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1
];

const maxDepth = 64;
const maxGameMoves = 2048;
const maxPositionMoves = 256;
const inf = 30000;
const mate = 29000;
const pvEntries = 10000;

const mirrorTable = [
    [[7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7]],
    [[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7]],
    [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7]],
    [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7]],
    [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7]],
    [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7]],
    [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7]],
    [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]]
];

const kings = [figs.wK, figs.bK];

const grid = {};
for (let i = -2; i < 10; i++) {
    grid[i] = {};
    for (let j = -2; j < 10; j++) {
        grid[i][j] = 0;
    }
}
for (let i = -2; i < 10; i++) {
    grid[-2][i] = figs.offBoard;
    grid[-1][i] = figs.offBoard;
    grid[8][i] = figs.offBoard;
    grid[9][i] = figs.offBoard;
    grid[i][-2] = figs.offBoard;
    grid[i][-1] = figs.offBoard;
    grid[i][8] = figs.offBoard;
    grid[i][9] = figs.offBoard;
}
for (let i = 0; i < 8; i++) {
    grid[1][i] = figs.bP;
    grid[6][i] = figs.wP;
}
grid[0] = {
    '-2': figs.offBoard,
    '-1': figs.offBoard,
    0: figs.bR,
    1: figs.bN,
    2: figs.bB,
    3: figs.bQ,
    4: figs.bK,
    5: figs.bB,
    6: figs.bN,
    7: figs.bR,
    8: figs.offBoard,
    9: figs.offBoard,
};
grid[7] = {
    '-2': figs.offBoard,
    '-1': figs.offBoard,
    0: figs.wR,
    1: figs.wN,
    2: figs.wB,
    3: figs.wQ,
    4: figs.wK,
    5: figs.wB,
    6: figs.wN,
    7: figs.wR,
    8: figs.offBoard,
    9: figs.offBoard,
};

const logGrid = () => {
    let row = grid[-2];
    console.log(
        row[-2], row[-1], row[0], row[1], row[2],
        row[3], row[4], row[5], row[6], row[7], row[8], row[9]
    );
    row = grid[-1];
    console.log(
        row[-2], row[-1], row[0], row[1], row[2],
        row[3], row[4], row[5], row[6], row[7], row[8], row[9]
    );
    for (const i in grid) {
        if (i !== '-2' && i !== '-1') {
            row = grid[i];
            console.log(
                row[-2], row[-1], row[0], row[1], row[2],
                row[3], row[4], row[5], row[6], row[7], row[8], row[9]
            );
        }
    }
};

//logGrid();

const createSquares = block => {                //defining divs in container
    let light = 0;
    for (let i = 0; i < 8; i++) {
        light ^= 1;
        for (let j = 0; j < 8; j++) {
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
    if (figures.length === 0) return undefined;
    for (const figure in figures) {
        block.removeChild(figure);
    }
};

const fillFigures = block => {
    clearSquares(block);
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (grid[i][j] >= 1 && grid[i][j] <= 12) {
                let img = new Image();
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

const printer = () => {
    for (const move of gameBoard.moveList) {
        const from = move.from, to = move.to;
        if (move.from === undefined) break;
        console.log(
            revFig[grid[from[0]][from[1]]], from[0], from[1],
            '| to', to[0], to[1],
            '| captured', revFig[move.captured],
            '| promoted to', revFig[move.promoted]
        );
    }
};

const figIndex = (fig, figNum) => (fig * 10 + figNum);

const arr0 = n => {
    const res = [];
    for (let i = 0; i < n; i++) res.push(0);
    return res;
};
const arrOfObj = n => {
    const res = [];
    for (let i = 0; i < n; i++) {
        res.push({move: {from: 0, to: 0}, posKey: 0});
    }
    return res;
}
const arr = n => new Array(n);
const arrOfEmptyObjects = n => {
    const res = [];
    for (let i = 0; i < n; i++) {
        res.push({});
    }
    return res;
}
const emptyMove = () => ({from: 0, to: 0});

const rand32 = () => {
    return (Math.floor((Math.random() * 225) + 1) << 23) |
           (Math.floor((Math.random() * 225) + 1) << 16) |
           (Math.floor((Math.random() * 225) + 1) << 8) |
           Math.floor((Math.random() * 225) + 1);
}
const figKeys = new Array(14 * 120);
let sideKey;
const castleKeys = new Array(16);
const hashFig = (fig, sq) => {gameBoard.posKey ^= figKeys[(fig * 120) + sq];};
const hashCastling = () => {
    gameBoard.posKey ^= castleKeys[gameBoard.castlePerm];
};
const hashSide = () => {gameBoard.posKey ^= sideKey;};
const hashEmpersant = () => {gameBoard.posKey ^= figKeys[gameBoard.enPas];};
