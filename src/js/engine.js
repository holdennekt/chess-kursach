'use strict';

const isSqAttackedBySide = (i, j, side) => {
    if (side === colors.white) {
        if (grid[i + 1][j - 1] === fig.wP || grid[i + 1][j + 1] === fig.wP) {
            console.log(`attacked by 1`);
            return true;
        }
        for (const dir of KnDir) {
            if (grid[i + dir[0]][j + dir[1]] === fig.wN) {
                console.log(`attacked by ${grid[i + dir[0]][j + dir[1]]}`);
                return true;
            }
        }
        for (const dir of BiDir) {
            let tempI = i + dir[0], tempJ = j + dir[1];
            while (grid[tempI][tempJ] !== fig.offBoard) {
                if (grid[tempI][tempJ] !== fig.empty) {
                    if (grid[tempI][tempJ] === fig.wB || grid[tempI][tempJ] === fig.wQ) {
                        console.log(`attacked by ${grid[tempI][tempJ]}`);
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
                    if (grid[tempI][tempJ] === fig.wR || grid[tempI][tempJ] === fig.wQ) {
                        console.log(`attacked by ${grid[tempI][tempJ]}`);
                        return true;
                    }
                    break;
                }
                tempI += dir[0], tempJ += dir[1];
            }
        }
        for (const dir of KiDir) {
            if (grid[i + dir[0]][j + dir[1]] === fig.wK) {
                console.log(`attacked by ${grid[i + dir[0]][j + dir[1]]}`);
                return true;
            }
        }
    }
    else {
        if (grid[i - 1][j - 1] === fig.bP || grid[i - 1][j + 1] === fig.bP) {
            console.log(`attacked by 7`);
            return true;
        }
        for (const dir of KnDir) {
            if (grid[i + dir[0]][j + dir[1]] === fig.bN) {
                console.log(`attacked by ${grid[i + dir[0]][j + dir[1]]}`);
                return true;
            }
        }
        for (const dir of Bidir) {
            let tempI = i + dir[0], tempJ = j + dir[1];
            while (grid[tempI][tempJ] !== fig.offBoard) {
                if (grid[tempI][tempJ] !== fig.empty) {
                    if (grid[tempI][tempJ] === fig.bB || grid[tempI][tempJ] === fig.bQ) {
                        console.log(`attacked by ${grid[tempI][tempJ]}`);
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
                    if (grid[tempI][tempJ] === fig.bR || grid[tempI][tempJ] === fig.bQ) {
                        console.log(`attacked by ${grid[tempI][tempJ]}`);
                        return true;
                    }
                    break;
                }
                tempI += dir[0], tempJ += dir[1];
            }
        }
        for (const dir of KiDir) {
            if (grid[i + dir[0]][j + dir[1]] === fig.bK) {
                console.log(`attacked by ${grid[i + dir[0]][j + dir[1]]}`);
                return true;
            }
        }
    }
    return false;
};