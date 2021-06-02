const size = 8;

const figs = {
    offBoard: -1, empty: 0,
    wP: 1,    wN: 2,    wB: 3,    wR: 4,    wQ: 5,    wK: 6,
    bP: 7,    bN: 8,    bB: 9,    bR: 10,    bQ: 11,    bK: 12,
};

const revFigs = [
    '. ',
    'wP', 'wN', 'wB', 'wR', 'wQ', 'wK',
    'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'
];

const cloneObj = obj => {
    const clone = {};
    for (const i in obj) {
        if (typeof obj[i] === 'object') {
            clone[i] = cloneObj(obj[i]);
        } else clone[i] = obj[i];
    }
    return clone;
};

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
for (let i = 0; i < size; i++) {
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

const logGrid = obj => {
    console.log('-----------GRID----------');
    console.log('  0  1  2  3  4  5  6  7');
    for (const i in obj) {
        if (i === '-2' || i === '-1' || i === '8' || i === '9') continue;
        const row = obj[i];
        console.log(
            i, revFigs[row[0]], revFigs[row[1]], revFigs[row[2]],
            revFigs[row[3]], revFigs[row[4]], revFigs[row[5]],
            revFigs[row[6]], revFigs[row[7]]
        );
    }
    console.log('-------------------------');
};

logGrid(grid);

const oldDate = Date.now();
const obj = cloneObj(grid);
console.log(Date.now() - oldDate, 'ms took cloning');

obj[4][4] = 1, obj[6][4] = 0;
logGrid(obj);