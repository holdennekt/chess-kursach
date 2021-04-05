const suggestMoves = (i, j) => {
    let figure = grid[i][j];
    let availableCells = [];
    if (figure < 7) {
        if (figure === fig.wP) {
            if (grid[i - 1][j] === 0) availableCells.push([i - 1, j]);
            if (grid[i - 1][j] === 0 && i === 6) availableCells.push([i - 2, j]);
            if (grid[i - 1][j - 1] > 6) availableCells.push([i - 1, j - 1]);
            if (grid[i - 1][j + 1] > 6) availableCells.push([i - 1, j + 1]);
        }
        else if(false) {}

    }
    for (const i of availableCells) {
        const id = `#cell_${i[0]}${i[1]}`;
        $(id)[0].className += ' suggested';
        console.log(id, $(id));
    }
    return availableCells;
}