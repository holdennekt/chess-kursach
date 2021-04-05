'use strict';

const suggestMoves = (i, j) => {
    const figure = grid[i][j];
    const availableCells = [];
    if (figure < 7) {
        if (figure === fig.wP) {
            if (grid[i - 1][j] === 0) availableCells.push([i - 1, j]);
            if (grid[i - 1][j] === 0 && i === 6) availableCells.push([i - 2, j]);
            if (grid[i - 1][j - 1] > 6) availableCells.push([i - 1, j - 1]);
            if (grid[i - 1][j + 1] > 6) availableCells.push([i - 1, j + 1]);
        }
    }
    for (const i of availableCells) {
        const id = `#cell_${i[0]}${i[1]}`;
        const elem = document.querySelector(id);
        elem.className += ' suggested';
    }
    return availableCells;
};
