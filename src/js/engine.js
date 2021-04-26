'use strict';

const isSqAttackedBySide = (i, j, side) => {
    if (side === colors.white) {
        if (grid[i + 1][j - 1] === fig.wP || grid[i + 1][j + 1] === fig.wP) {
            return true;
        }
        for (const dir of KnDir) {
            if (grid[i + dir[0]][j + dir[1]] === fig.wN) {
                return true;
            }
        }
        for (const dir of BiDir) {
            let tempI = i + dir[0], tempJ = j + dir[1];
            while (grid[tempI][tempJ] !== fig.offBoard) {
                if (grid[tempI][tempJ] !== fig.empty) {
                    if (grid[tempI][tempJ] === fig.wB || grid[tempI][tempJ] === fig.wQ) {
                        return true;
                    }
                    break;
                }
                tempI += dir[0], tempJ += dir[1];
            }
        }
    }
    else {
        if (grid[i - 1][j - 1] === fig.bP || grid[i - 1][j + 1] === fig.bP) {
            return true;
        }
        for (const dir of KnDir) {
            if (grid[i + dir[0]][j + dir[1]] === fig.bN) {
                return true;
            }
        }
        for (const dir of Bidir) {
            let tempI = i + dir[0], tempJ = j + dir[1];
            while (grid[tempI][tempJ] !== fig.offBoard) {
                if (grid[tempI][tempJ] !== fig.empty) {
                    if (grid[tempI][tempJ] === fig.bB || grid[tempI][tempJ] === fig.bQ) {
                        return true;
                    }
                    break;
                }
                tempI += dir[0], tempJ += dir[1];
            }
        }
    }
    return false;
};

const suggestMoves = (i, j) => {
    const figure = grid[i][j];
    const availableSquares = [];
    if (figure < 7) {
        if (figure === fig.wP) {
            if (grid[i - 1][j] === 0) availableSquares.push([i - 1, j]);
            if (grid[i - 1][j] === 0 && i === 6) availableSquares.push([i - 2, j]);
            if (grid[i - 1][j - 1] > 6) availableSquares.push([i - 1, j - 1]);
            if (grid[i - 1][j + 1] > 6) availableSquares.push([i - 1, j + 1]);
        }
    }
    for (const i of availableSquares) {
        const elem = document.querySelector(`#sq_${i[0]}${i[1]}`);
        elem.className += ' suggested';
    }
    return availableSquares;
};
