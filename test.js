const noSq = [-1, -1];
const noMove = { from: noSq, to: noSq, captured: 0, promoted: 0 };


const gameBoard = {
    castlePerm: {
        wks: true,
        wqs: true,
        bks: true,
        bqs: true,
    },
    history: [
        { move: noMove },
        { move: noMove },
        { move: noMove },
        { move: noMove },
        { move: noMove },
        { move: noMove },
    ],
    enPas: [-1, -1],
};

const cloneObj = obj => {
    let clone;
    if (!Array.isArray(obj)) clone = {};
    else clone = [];
    for (const i in obj) {
        if (typeof obj[i] === 'object') {
            clone[i] =  cloneObj(obj[i]);
        }
        else clone[i] = obj[i];
    }
    return clone;
};

const clone = cloneObj(gameBoard.enPas);
console.log(clone);