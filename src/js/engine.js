'use strict';

const knBiRkKi = (i, j, side) => {
    let knight, bishop, rook, queen, king;
    if (side === colors.white) {
        knight = fig.wN;
        bishop = fig.wB;
        rook = fig.wR;
        queen = fig.wQ;
        king = fig.wK;
    } else {
        knight = fig.bN;
        bishop = fig.bB;
        rook = fig.bR;
        queen = fig.bQ;
        king = fig.bK;
    }
    for (const dir of KnDir) {
        if (grid[i + dir[0]][j + dir[1]] === knight) {
            console.log(`attacked by ${revFig[grid[i + dir[0]][j + dir[1]]]}`);
            return true;
        }
    }
    for (const dir of BiDir) {
        let tempI = i + dir[0], tempJ = j + dir[1];
        while (grid[tempI][tempJ] !== fig.offBoard) {
            if (grid[tempI][tempJ] !== fig.empty) {
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
        while (grid[tempI][tempJ] !== fig.offBoard) {
            if (grid[tempI][tempJ] !== fig.empty) {
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
const isSqAttackedBySide = (i, j, side) => {
    if (side === colors.white) {
        if (grid[i + 1][j - 1] === fig.wP || grid[i + 1][j + 1] === fig.wP) {
            console.log('attacked by wP');
            return true;
        }
    } else if (grid[i - 1][j - 1] === fig.bP || grid[i - 1][j + 1] === fig.bP) {
        console.log('attacked by bP');
        return true;
    }
    return knBiRkKi(i, j, side);
};
