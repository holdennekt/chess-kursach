'use strict';

const knBiRkKi = (sq, side) => {
    let knight, bishop, rook, queen, king;
    const i = sq[0], j = sq[1];
    if (side === colors.white) {
        knight = figs.wN;
        bishop = figs.wB;
        rook = figs.wR;
        queen = figs.wQ;
        king = figs.wK;
    } else {
        knight = figs.bN;
        bishop = figs.bB;
        rook = figs.bR;
        queen = figs.bQ;
        king = figs.bK;
    }
    for (const dir of KnDir) {
        if (grid[i + dir[0]][j + dir[1]] === knight) {
            console.log(`attacked by ${revFig[grid[i + dir[0]][j + dir[1]]]}`);
            return true;
        }
    }
    for (const dir of BiDir) {
        let tempI = i + dir[0], tempJ = j + dir[1];
        while (grid[tempI][tempJ] !== figs.offBoard) {
            if (grid[tempI][tempJ] !== figs.empty) {
                if (grid[tempI][tempJ] === bishop ||
                    grid[tempI][tempJ] === queen) {
                    console.log(`attacked by ${revFig[grid[tempI][tempJ]]}`);
                    return true;
                }
                break;
            }
            tempI += dir[0], tempJ += dir[1];
        }
    }
    for (const dir of RkDir) {
        let tempI = i + dir[0], tempJ = j + dir[1];
        while (grid[tempI][tempJ] !== figs.offBoard) {
            if (grid[tempI][tempJ] !== figs.empty) {
                if (grid[tempI][tempJ] === rook ||
                    grid[tempI][tempJ] === queen) {
                    console.log(`attacked by ${revFig[grid[tempI][tempJ]]}`);
                    return true;
                }
                break;
            }
            tempI += dir[0], tempJ += dir[1];
        }
    }
    for (const dir of KiDir) {
        if (grid[i + dir[0]][j + dir[1]] === king) {
            console.log(`attacked by ${revFig[grid[i + dir[0]][j + dir[1]]]}`);
            return true;
        }
    }
    return false;
};
const isSqAttackedBySide = (sq, side) => {
    const i = sq[0], j = sq[1];
    if (side === colors.white) {
        if (grid[i + 1][j - 1] === figs.wP || grid[i + 1][j + 1] === figs.wP) {
            console.log('attacked by wP');
            return true;
        }
    } else if (grid[i - 1][j - 1] === figs.bP || grid[i - 1][j + 1] === figs.bP) {
        console.log('attacked by bP');
        return true;
    }
    return knBiRkKi([i, j], side);
};
