const checkObjectsEqual = (a, b) => {
    if (a.length !== b.length) return false;
    for (const i in a) {
        if (typeof a[i] === 'object') {
            if(!checkObjectsEqual(a[i], b[i])) return false;
        } else if (a[i] !== b[i]) return false;
    }
    return true;
};

const obj1 = {
    from: [-1, -1],
    to: [-1, -1],
    captured: -1,
    promoted: -1,
    flag: {
        enPas: false,
        pawnStart: false,
        castling: '',
    },
};
const obj2 = {
    from: [-1, -1],
    to: [-1, -1],
    captured: -1,
    promoted: -1,
    flag: {
        enPas: false,
        pawnStart: false,
        castling: '',
    },
};
const obj3 = {
    from: [0, 0],
    to: [1, 1],
    captured: -1,
    promoted: -1,
    flag: {
        enPas: false,
        pawnStart: false,
        castling: '',
    },
};
const obj4 = {
    from: [-1, -1],
    to: [-1, -1],
    captured: -1,
    promoted: -1,
    flag: {
        enPas: true,
        pawnStart: false,
        castling: '',
    },
};

console.log(checkObjectsEqual(obj1, obj2));
console.log(checkObjectsEqual(obj1, obj3));
console.log(checkObjectsEqual(obj1, obj4));