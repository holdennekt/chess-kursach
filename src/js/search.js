'use strict';
const search = {};
search.nodes;
search.failHigh;
search.failHighFirst;
search.depth;
search.time;
search.start;
search.stop;
search.best;
search.thinking;

const pickNextMove = moveNum => {
  let bestScore = -1;
  let bestNum = moveNum;
  const end = gameBoard.moveListStart[gameBoard.ply + 1];
  for (let i = moveNum; i < end; i++) {
    if (gameBoard.moveScores[i] > bestScore) {
      bestScore = gameBoard.moveScores[i];
      bestNum = i;
    }
  }
  if (bestNum !== moveNum) {
    let temp = gameBoard.moveScores[moveNum];
    gameBoard.moveScores[moveNum] = gameBoard.moveScores[bestNum];
    gameBoard.moveScores[bestNum] = temp;

    temp = gameBoard.moveList[moveNum];
    gameBoard.moveList[moveNum] = gameBoard.moveList[bestNum];
    gameBoard.moveList[bestNum] = temp;
  }
};

const checkTime = () => {
  if (Date.now() - search.start > search.time) search.stop = true;
};

const isRepetition = () => {
  const start = gameBoard.hisPly - gameBoard.fiftyMove;
  for (let i = start; i < gameBoard.hisPly - 1; i++) {
    if (gameBoard.posKey === gameBoard.history[i].posKey) {
      return true;
    }
  }
  return false;
};

const quiescence = (alpha, beta) => {
  if (search.nodes % 2048 === 0) checkTime();
  search.nodes++;
  const statement = isRepetition() || gameBoard.fiftyMove >= 100;
  if (statement && gameBoard.ply !== 0) {
    return 0;
  }
  if (gameBoard.ply > maxDepth - 1) {
    return evalPosition();
  }
  let score = evalPosition();
  if (score >= beta) {
    return beta;
  }
  if (score > alpha) {
    alpha = score;
  }
  generateMoves();
  let legal = 0,
    bestMove = emptyMove();
  const oldAlpha = alpha;
  const start = gameBoard.moveListStart[gameBoard.ply];
  const end = gameBoard.moveListStart[gameBoard.ply + 1];
  for (let i = start; i < end; i++) {
    pickNextMove(i);
    const move = gameBoard.moveList[i];
    if (move.captured === 0 || !makeMove(move)) continue;
    legal++;
    score = -quiescence(-beta, -alpha);
    takeMove();
    if (search.stop) return 0;
    if (score > alpha) {
      if (score >= beta) {
        if (legal === 1) {
          search.failHighFirst++;
        }
        search.failHigh++;
        return beta;
      }
      alpha = score;
      bestMove = move;
    }
  }
  if (alpha !== oldAlpha) {
    storePvMove(bestMove);
  }
  return alpha;
};

const searchPvMove = pvMove => {
  const start = gameBoard.moveListStart[gameBoard.ply];
  const end = gameBoard.moveListStart[gameBoard.ply + 1];
  if (!checkObjectsEqual(pvMove, emptyMove())) {
    for (let i = start; i < end; i++) {
      if (checkObjectsEqual(gameBoard.moveList[i], pvMove)) return i;
    }
  }
  return -1;
};

const alphaBeta = (alpha, beta, depth) => {
  if (depth <= 0) {
    return quiescence(alpha, beta);
  }
  if (search.nodes % 2048 === 0) checkTime();
  search.nodes++;
  const statement = isRepetition() || gameBoard.fiftyMove >= 100;
  if (statement && gameBoard.ply !== 0) {
    return 0;
  }
  if (gameBoard.ply > maxDepth - 1) {
    return evalPosition();
  }
  const inCheck = isSqAttackedBySide(
    gameBoard.figList[figIndex(kings[gameBoard.side], 0)],
    gameBoard.side ^ 1
  );
  if (inCheck) depth++;
  let score = -inf;
  generateMoves();
  let legal = 0,
    bestMove = emptyMove();
  const oldAlpha = alpha;
  const pvMove = probePvTable();
  const index = searchPvMove(pvMove);
  if (index !== -1) gameBoard.moveScores[index] = pvBonus;
  const start = gameBoard.moveListStart[gameBoard.ply];
  const end = gameBoard.moveListStart[gameBoard.ply + 1];
  for (let i = start; i < end; i++) {
    pickNextMove(i);
    const move = gameBoard.moveList[i];
    if (!makeMove(move)) continue;
    legal++;
    score = -alphaBeta(-beta, -alpha, depth - 1);
    takeMove();
    if (search.stop) return 0;
    if (score > alpha) {
      if (score >= beta) {
        if (legal === 1) search.failHighFirst++;
        search.failHigh++;
        if (move.captured === 0) {
          gameBoard.searchKillers[maxDepth + gameBoard.ply] =
            gameBoard.searchKillers[gameBoard.ply];
          gameBoard.searchKillers[gameBoard.ply] = move;
        }
        return beta;
      }
      if (move.captured === 0) {
        const from = move.from,
          to = move.to;
        const index = grid[from[0]][from[1]] * gridSqNum + sq120(mirror(to));
        gameBoard.searchHistory[index] += depth * depth;
      }
      alpha = score;
      bestMove = move;
    }
  }
  if (legal === 0) {
    if (inCheck) return -mate + gameBoard.ply;
    return 0;
  }
  if (alpha !== oldAlpha) {
    storePvMove(bestMove);
  }
  return alpha;
};

const clearForSearch = () => {
  gameBoard.searchHistory = arr0((typesOfFigures + 1) * gridSqNum);
  gameBoard.searchKillers = arrSearchKillers(3 * maxDepth);
  gameBoard.pvTable = arrPvTable(pvEntries);
  gameBoard.ply = 0;
  search.nodes = 0;
  search.failHigh = 0;
  search.failHighFirst = 0;
  search.start = Date.now();
  search.stop = false;
};

const searchPosition = () => {
  let bestScore = -inf,
    curDepth = 0,
    bestMove;
  clearForSearch();
  for (curDepth = 1; curDepth <= search.depth; curDepth++) {
    bestScore = alphaBeta(-inf, inf, curDepth);
    if (search.stop) break;
    bestMove = probePvTable();
    let lineInfo =
      `depth: ${curDepth} best: ${bestMove.from} -> ${bestMove.to} ` +
      `score: ${bestScore} nodes: ${search.nodes}`;
    const pvNum = getPvNum(curDepth);
    for (let i = 0; i < pvNum; i++) {
      lineInfo += ` ${gameBoard.pvArr[i].from} -> ${gameBoard.pvArr[i].to}`;
    }
    if (curDepth !== 1) {
      const temp = (search.failHighFirst / search.failHigh) * 100;
      lineInfo += ` Ordering: ${temp.toFixed(2)}%`;
    }
    console.log(lineInfo);
  }
  search.best = bestMove;
  search.thinking = false;
};
