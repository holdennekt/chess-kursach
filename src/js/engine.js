'use strict';

const knBiRkKi = (sq, side, obj) => {
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
        if (obj[i + dir[0]][j + dir[1]] === knight) {
            //console.log(`attackedBy${revFigs[obj[i + dir[0]][j + dir[1]]]}`);
            return true;
        }
    }
    for (const dir of BiDir) {
        let tempI = i + dir[0], tempJ = j + dir[1];
        while (obj[tempI][tempJ] !== figs.offBoard) {
            if (obj[tempI][tempJ] !== figs.empty) {
                if (obj[tempI][tempJ] === bishop ||
                    obj[tempI][tempJ] === queen) {
                    // console.log(`attacked by ${revFigs[obj[tempI][tempJ]]}`);
                    return true;
                }
                break;
            }
            tempI += dir[0], tempJ += dir[1];
        }
    }
    for (const dir of RkDir) {
        let tempI = i + dir[0], tempJ = j + dir[1];
        while (obj[tempI][tempJ] !== figs.offBoard) {
            if (obj[tempI][tempJ] !== figs.empty) {
                if (obj[tempI][tempJ] === rook ||
                    obj[tempI][tempJ] === queen) {
                    // console.log(`attacked by ${revFigs[obj[tempI][tempJ]]}`);
                    return true;
                }
                break;
            }
            tempI += dir[0], tempJ += dir[1];
        }
    }
    for (const dir of KiDir) {
        if (obj[i + dir[0]][j + dir[1]] === king) {
            //console.log(`attackedBy${revFigs[obj[i + dir[0]][j + dir[1]]]}`);
            return true;
        }
    }
    return false;
};
const isSqAttackedBySide = (sq, side, obj = grid) => {
    const i = sq[0], j = sq[1];
    if (side === colors.white) {
        if (obj[i + 1][j - 1] === figs.wP || obj[i + 1][j + 1] === figs.wP) {
            // console.log('attacked by wP');
            return true;
        }
    } else if (obj[i - 1][j - 1] === figs.bP || obj[i - 1][j + 1] === figs.bP) {
        // console.log('attacked by bP');
        return true;
    }
    return knBiRkKi([i, j], side, obj);
};
