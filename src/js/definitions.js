'use strict';

const fig = {
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
const noSlideFigs = [fig.wN, fig.wK, fig.bN, fig.bK];
const slideFigs = [fig.wB, fig.wR, fig.wQ, fig.bB, fig.bR, fig.bQ];

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

const kings = [fig.wK, fig.bK];

const grid = {};
for (let i = -2; i < 10; i++) {
    grid[i] = {};
    for (let j = -2; j < 10; j++) {
        grid[i][j] = 0;
    }
}
for (let i = -2; i < 10; i++) {
    grid[-2][i] = fig.offBoard;
    grid[-1][i] = fig.offBoard;
    grid[8][i] = fig.offBoard;
    grid[9][i] = fig.offBoard;
    grid[i][-2] = fig.offBoard;
    grid[i][-1] = fig.offBoard;
    grid[i][8] = fig.offBoard;
    grid[i][9] = fig.offBoard;
}
for (let i = 0; i < 8; i++) {
    grid[1][i] = fig.bP;
    grid[6][i] = fig.wP;
}
grid[0] = {
    '-2': fig.offBoard,
    '-1': fig.offBoard,
    0: fig.bR,
    1: fig.bN,
    2: fig.bB,
    3: fig.bQ,
    4: fig.bK,
    5: fig.bB,
    6: fig.bN,
    7: fig.bR,
    8: fig.offBoard,
    9: fig.offBoard,
};
grid[7] = {
    '-2': fig.offBoard,
    '-1': fig.offBoard,
    0: fig.wR,
    1: fig.wN,
    2: fig.wB,
    3: fig.wQ,
    4: fig.wK,
    5: fig.wB,
    6: fig.wN,
    7: fig.wR,
    8: fig.offBoard,
    9: fig.offBoard,
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
    const divs = [[], [], [], [], [], [], [], []];
    for (let i = 0; i < 8; i++) {
        light ^= 1;
        for (let j = 0; j < 8; j++) {
            const div = document.createElement('div');
            div.id = 'sq_' + i + j;
            div.className = 'square';
            if (light === 1) div.className += ' light';
            else div.className += ' dark';
            div.innerHTML = div.id;
            block.append(div);
            light ^= 1;
            divs[i].push(div);
        }
    }
    return divs;
};

const fillSquares = divs => {
    let url;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 8; j++) {
            url = `url('icons/${grid[i][j]}.png')`;
            divs[i][j].style.backgroundImage = url;
        }
    }
    for (let i = 6; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            url = `url('icons/${grid[i][j]}.png')`;
            divs[i][j].style.backgroundImage = url;
        }
    }
};

const createBoard = block => {
    const divs = createSquares(block);
    fillSquares(divs);
};

const highlightSquares = (i, j) => {
    const selected = document.querySelector('.selected');
    if (selected) selected.classList.remove('selected');
    const suggested = document.querySelectorAll('.suggested');
    for (const elem of suggested) elem.classList.remove('suggested');
    if (grid[i][j] !== fig.empty) {
        document.querySelector(`#sq_${i}${j}`).className += ' selected';
    }
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

const emptMove = () => ({from: 0, to: 0});

const clickedOnSquare = click => {
    const i = parseInt(click.target.id[3]), j = parseInt(click.target.id[4]);
    console.log(`clicked on (${i}, ${j}) figure is ${grid[i][j]}`);
    highlightSquares(i, j);
    console.log(
        'by white', isSqAttackedBySide([i, j], colors.white),
        'by black', isSqAttackedBySide([i, j], colors.black)
    );
    gameBoard.moveListStart = arr0(7);
    updateListsMaterial();
    generateMoves();
    //printer();
    searchPosition();
};

const figIndex = (fig, figNum) => (fig * 10 + figNum);
