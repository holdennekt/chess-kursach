'use strict';

const fig = {
    offBoard: -1, empty: 0,
    wP: 1,    wN: 2,    wB: 3,    wR: 4,    wQ: 5,    wK: 6,
    bP: 7,    bN: 8,    bB: 9,    bR: 10,    bQ: 11,    bK: 12,
};

const colors = {
    white: 0,
    black: 1,
    both: 2,
};

const KnDir = [[-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2], [2, -1], [2, 1], [1, 2]];
const BiDir = [[-1, 1], [-1, -1], [1, -1], [1, 1]];
const RkDir = [[0, 1], [-1, 0], [0, -1], [1, 0]];
const KiDir = [[0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1]];

const figValue = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];

const figCol = [
    0, 'white', 'white', 'white', 'white', 'white', 'white',
    'black', 'black', 'black', 'black', 'black', 'black'
];

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
}

logGrid();

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

const clickedOnSquare = click => {
    const i = parseInt(click.target.id[3]), j = parseInt(click.target.id[4]);
    console.log(`clicked on (${i}, ${j}) figure is ${grid[i][j]}`);
    highlightSquares(i, j);
    // const moves = suggestMoves(i, j);
    const attacked = isSqAttackedBySide(i, j, colors.white);
    console.log(attacked);
    updateListsMaterial();
};

const figIndex = (fig, figNum) => (fig * 10 + figNum);

const arr = n => {
    const res = [];
    for (let i = 0; i < n; i++) res.push(0);
    return res;
};