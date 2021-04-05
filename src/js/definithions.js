const fig = {
    empty: 0,
    wP: 1,    wN: 2,    wB: 3,    wR: 4,    wQ: 5,    wK: 6,
    bP: 7,    bN: 8,    bB: 9,    bR: 10,    bQ: 11,    bK: 12,
};

const colors = {
    white: 0,
    black: 1,
    both: 2,
};

const createGrid = () => {                           //grid of board
    let grid = [[], [], [], [], [], [], [], []];
    grid[0] = [fig.bR, fig.bN, fig.bB, fig.bQ, fig.bK, fig.bB, fig.bN, fig.bR];
    grid[1] = [fig.bP, fig.bP, fig.bP, fig.bP, fig.bP, fig.bP, fig.bP, fig.bP];
    for (let i = 2; i < 6; i++) {
        grid[i] = [fig.empty, fig.empty, fig.empty, fig.empty, fig.empty, fig.empty, fig.empty, fig.empty];
    }
    grid[6] = [fig.wP, fig.wP, fig.wP, fig.wP, fig.wP, fig.wP, fig.wP, fig.wP];
    grid[7] = [fig.wR, fig.wN, fig.wB, fig.wQ, fig.wK, fig.wB, fig.wN, fig.wR];
    return grid;
}

const fillDivs = (block) => {                        //defining divs in container
    let light = 0;
    let divs = [[], [], [], [], [], [], [], []];
    for (let i = 0; i < 8; i++) {
        light ^= 1;
        for (let j = 0; j < 8; j++) {
            const div = document.createElement('div');
            div.id = 'cell_' + i + j;
            div.className = 'cell';
            if (light === 1) div.className += ' light';
            else div.className += ' dark';
            div.innerHTML = div.id;
            block.append(div);
            light ^= 1;
            divs[i].push(div);
        }
    }
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 8; j++) {
            let url = `url('icons/${grid[i][j]}.png')`;
            divs[i][j].style.backgroundImage = url;
        }
    }
    for (let i = 6; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let url = `url('icons/${grid[i][j]}.png')`;
            divs[i][j].style.backgroundImage = url;
        }
    }
}

const clickedOnCell = click => {
    let i = parseInt(click.target.id[5]), j = parseInt(click.target.id[6]);
    console.log(i, j, grid[i][j]);
    const selected = document.querySelector('.selected');
    const suggested = document.querySelectorAll('.suggested');
    if (selected) selected.classList.remove('selected');
    for (const elem of suggested) elem.classList.remove('suggested');
    if (grid[i][j] !== fig.empty) {
        click.target.className += ' selected';
        const moves = suggestMoves(i, j);
    }
}


