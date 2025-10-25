

import { 
  isValidMove, 
  placeStone, 
  checkWinner, 
  getRelevantPositions,
  countInLine,
  BOARD_SIZE,
  createEmptyBoard
} from './gameLogic';

// =============== Lightweight Neural Network (MLP) ===============
// A tiny 2-layer perceptron for board evaluation prior; deterministic and fast
// Input: flattened 15x15 one-hot (-1 for white, +1 for black, 0 empty), plus bias
// Output: scalar prior in [-1,1] (positive is good for aiPlayer)
const NN = {
  // Random but fixed weights; can be updated by trainStep()
  W1: new Float32Array(64 * (BOARD_SIZE * BOARD_SIZE + 1)).fill(0).map((_, i) => ((Math.sin(i * 1337) + 1) * 0.5 - 0.25) * 0.02),
  W2: new Float32Array(64 + 1).fill(0).map((_, i) => ((Math.cos(i * 977) + 1) * 0.5 - 0.25) * 0.05),
  learningRate: 0.001,
};

function nnForward(board, aiPlayer) {
  const inpSize = BOARD_SIZE * BOARD_SIZE + 1; // +bias
  const hiddenSize = 64;
  const hidden = new Float32Array(hiddenSize);
  let idx = 0;
  for (let h = 0; h < hiddenSize; h++) {
    let s = 0;
    let k = 0;
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const c = board[y][x];
        const v = c === 'empty' ? 0 : (c === aiPlayer ? 1 : -1);
        s += v * NN.W1[h * inpSize + k];
        k++;
      }
    }
    s += 1.0 * NN.W1[h * inpSize + (inpSize - 1)]; // bias
    // ReLU
    hidden[h] = s > 0 ? s : 0;
  }
  // Output layer: tanh
  let out = 0;
  for (let h = 0; h < hiddenSize; h++) out += hidden[h] * NN.W2[h];
  out += 1.0 * NN.W2[hiddenSize];
  return Math.tanh(out);
}

// Simple online train step (supervised-like): target in [-1,1]
function nnTrainStep(board, aiPlayer, target) {
  // Forward pass caches
  const inpSize = BOARD_SIZE * BOARD_SIZE + 1;
  const hiddenSize = 64;
  const hidden = new Float32Array(hiddenSize);
  for (let h = 0; h < hiddenSize; h++) {
    let s = 0, k = 0;
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const c = board[y][x];
        const v = c === 'empty' ? 0 : (c === aiPlayer ? 1 : -1);
        s += v * NN.W1[h * inpSize + k];
        k++;
      }
    }
    s += NN.W1[h * inpSize + (inpSize - 1)];
    hidden[h] = s > 0 ? s : 0;
  }
  let z = 0;
  for (let h = 0; h < hiddenSize; h++) z += hidden[h] * NN.W2[h];
  z += NN.W2[hiddenSize];
  const yhat = Math.tanh(z);

  const lr = NN.learningRate;
  // dL/dz for tanh with MSE 0.5*(yhat-target)^2
  const dz = (yhat - target) * (1 - yhat * yhat);
  for (let h = 0; h < hiddenSize; h++) {
    NN.W2[h] -= lr * dz * hidden[h];
  }
  NN.W2[hiddenSize] -= lr * dz * 1.0;
  // Backprop to W1 (only for active ReLU neurons)
  for (let h = 0; h < hiddenSize; h++) {
    if (hidden[h] <= 0) continue;
    const dh = dz * NN.W2[h];
    let k = 0;
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const c = board[y][x];
        const v = c === 'empty' ? 0 : (c === aiPlayer ? 1 : -1);
        NN.W1[h * inpSize + k] -= lr * dh * v;
        k++;
      }
    }
    NN.W1[h * inpSize + (inpSize - 1)] -= lr * dh * 1.0;
  }
}

// Public API: post-game training with simple credit assignment
// result: 'black' | 'white' | null
// history: [{ move: {x,y,player}, timestamp }]
export function postGameTrain(history, result) {
  if (!history || history.length === 0) return;
  const boards = [];
  let board = createEmptyBoard();
  for (const h of history) {
    const { x, y, player } = h.move;
    board = placeStone(board, x, y, player);
    boards.push({ board, player });
  }
  // Reward signal
  const blackTarget = result === 'black' ? 1 : result === 'white' ? -1 : 0;
  const whiteTarget = -blackTarget;

  // Train on final few positions to avoid overfitting early noise
  const start = Math.max(0, boards.length - 8);
  for (let i = start; i < boards.length; i++) {
    const { board: b, player } = boards[i];
    const target = player === 'black' ? blackTarget : whiteTarget;
    if (target !== 0) nnTrainStep(b, player, target);
  }
}

const directions = [
  { dx: 1, dy: 0 },   // Horizontal
  { dx: 0, dy: 1 },   // Vertical
  { dx: 1, dy: 1 },   // Diagonal \
  { dx: 1, dy: -1 },  // Diagonal /
];

// ===================== ZOBRIST HASHING =====================
const Z_KEYS = (() => {
  const rand = () => Math.floor(Math.random() * 2 ** 31);
  const keys = { black: [], white: [] };
  for (let y = 0; y < BOARD_SIZE; y++) {
    keys.black[y] = [];
    keys.white[y] = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      keys.black[y][x] = rand();
      keys.white[y][x] = rand();
    }
  }
  return keys;
})();

function computeHash(board) {
  let h = 0;
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const c = board[y][x];
      if (c === 'black') h ^= Z_KEYS.black[y][x];
      else if (c === 'white') h ^= Z_KEYS.white[y][x];
    }
  }
  return h >>> 0;
}

function hashAfterMove(hash, x, y, player) {
  const key = player === 'black' ? Z_KEYS.black[y][x] : Z_KEYS.white[y][x];
  return (hash ^ key) >>> 0;
}

// Transposition table entries
const TT_EXACT = 0, TT_LOWER = 1, TT_UPPER = 2;
const TT_MAX = 20000;
const tt = new Map(); // key -> { depth, score, flag, move }
function ttSet(key, entry) {
  if (tt.size > TT_MAX) tt.clear();
  tt.set(key, entry);
}

function createHistoryTable() {
  const make = () => Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  return { black: make(), white: make() };
}

/**
 * Pattern scores for heuristic evaluation
 * Based on common Gomoku patterns and their strategic value
 * Enhanced scoring system for stronger AI
 */
const SCORES = {
  FIVE: 10000000,      // Five in a row - instant win
  OPEN_FOUR: 500000,   // Four in a row with both ends open (must block/win)
  FOUR: 50000,         // Four in a row with one end blocked
  OPEN_THREE: 5000,    // Three in a row with both ends open (very strong)
  THREE: 500,          // Three in a row with one end blocked
  OPEN_TWO: 100,       // Two in a row with both ends open
  TWO: 10,             // Two in a row with one end blocked
  ONE: 1,              // Single stone
};

/**
 * Count stones in a line assuming a VIRTUAL stone at (x, y).
 * This avoids copying the whole board for evaluation.
 */
function countInLineVirtual(board, x, y, dx, dy, player, maxCount = 5) {
  let count = 1; // include the virtual stone at (x, y)
  let blocked = 0;

  // forward direction
  let nx = x + dx;
  let ny = y + dy;
  while (count < maxCount && nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
    if (board[ny][nx] === player) {
      count++;
      nx += dx;
      ny += dy;
    } else {
      if (board[ny][nx] !== "empty") blocked++;
      break;
    }
  }
  if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) blocked++;

  // backward direction
  nx = x - dx;
  ny = y - dy;
  while (count < maxCount && nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
    if (board[ny][nx] === player) {
      count++;
      nx -= dx;
      ny -= dy;
    } else {
      if (board[ny][nx] !== "empty") blocked++;
      break;
    }
  }
  if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) blocked++;

  return { count, blocked };
}

/**
 * Evaluate a position for a specific player using pattern recognition
 * Uses virtual placement at (x, y) to avoid stale-zero scoring.
 */
function evaluatePosition(board, x, y, player) {
  if (!isValidMove(board, x, y)) return 0;

  let score = 0;

  for (const { dx, dy } of directions) {
    const { count, blocked } = countInLineVirtual(board, x, y, dx, dy, player);

    if (count >= 5) {
      score += SCORES.FIVE;
    } else if (count === 4) {
      score += blocked === 0 ? SCORES.OPEN_FOUR : SCORES.FOUR;
    } else if (count === 3) {
      score += blocked === 0 ? SCORES.OPEN_THREE : SCORES.THREE;
    } else if (count === 2) {
      score += blocked === 0 ? SCORES.OPEN_TWO : SCORES.TWO;
    } else if (count === 1) {
      score += SCORES.ONE;
    }
  }

  return score;
}

/**
 * Evaluate the entire board state
 * Returns a score from the AI's perspective (positive = good for AI)
 * Enhanced with better defensive evaluation
 */
function evaluateBoard(board, aiPlayer) {
  const opponent = aiPlayer === "black" ? "white" : "black";
  let score = 0;

  // Only evaluate positions near existing stones to reduce O(N^2)
  const positions = getRelevantPositions(board, 2);
  for (const [x, y] of positions) {
    if (board[y][x] !== "empty") continue;
    const offensiveScore = evaluatePosition(board, x, y, aiPlayer);
    const defensiveScore = evaluatePosition(board, x, y, opponent);
    // Add slight offensive bias to avoid over-defending
    // Centrality prior (encourage central play early)
    const cx = Math.abs(x - Math.floor(BOARD_SIZE / 2));
    const cy = Math.abs(y - Math.floor(BOARD_SIZE / 2));
    const centrality = -(cx + cy);
    score += offensiveScore * 1.2 + defensiveScore * 0.95 + centrality * 0.5;
  }

  // Neural network prior scaled into heuristic range
  const prior = nnForward(board, aiPlayer); // [-1,1]
  score += prior * 200; // small but impactful prior

  return score;
}

/**
 * Threat categories for quick tactical decisions
 */
const THREAT = {
  NONE: 0,
  OPEN_THREE: 1,
  FOUR: 2, // closed four (one end blocked)
  DOUBLE_OPEN_THREE: 3,
  OPEN_FOUR: 4,
  WIN: 5,
};

/**
 * Classify the tactical threat created by playing (x,y)
 */
function classifyThreatForMove(board, x, y, player) {
  const stats = [];
  let hasFive = false;
  let hasOpenFour = false;
  let hasClosedFour = false;
  let openThreeCount = 0;

  for (const { dx, dy } of directions) {
    const { count, blocked } = countInLineVirtual(board, x, y, dx, dy, player);
    stats.push({ count, blocked });
    if (count >= 5) hasFive = true;
    if (count === 4 && blocked === 0) hasOpenFour = true;
    if (count === 4 && blocked === 1) hasClosedFour = true;
    if (count === 3 && blocked === 0) openThreeCount++;
  }

  if (hasFive) return { type: THREAT.WIN, score: SCORES.FIVE };
  if (hasOpenFour) return { type: THREAT.OPEN_FOUR, score: SCORES.OPEN_FOUR };
  if (openThreeCount >= 2) return { type: THREAT.DOUBLE_OPEN_THREE, score: SCORES.OPEN_FOUR * 0.8 };
  if (hasClosedFour) return { type: THREAT.FOUR, score: SCORES.FOUR };
  if (openThreeCount === 1) return { type: THREAT.OPEN_THREE, score: SCORES.OPEN_THREE };
  return { type: THREAT.NONE, score: 0 };
}

/** Determine if the position is "quiet" (no major threats for either side). */
function isQuiet(board) {
  const positions = getRelevantPositions(board, 2);
  for (const [x, y] of positions) {
    if (board[y][x] !== 'empty') continue;
    const a = classifyThreatForMove(board, x, y, 'black');
    const b = classifyThreatForMove(board, x, y, 'white');
    if (
      a.type === THREAT.WIN || a.type === THREAT.OPEN_FOUR || a.type === THREAT.DOUBLE_OPEN_THREE ||
      b.type === THREAT.WIN || b.type === THREAT.OPEN_FOUR || b.type === THREAT.DOUBLE_OPEN_THREE
    ) {
      return false;
    }
  }
  return true;
}

/** Quiescence search: extend search on tactical (noisy) moves only. */
function quiescence(board, aiPlayer, alpha, beta, deadline) {
  const standPat = evaluateBoard(board, aiPlayer);
  if (standPat >= beta) return beta;
  if (alpha < standPat) alpha = standPat;

  if (Date.now() > deadline) return alpha;

  const positions = getRelevantPositions(board, 2);
  const opponent = aiPlayer === 'black' ? 'white' : 'black';

  // Generate tactical moves only
  const tactical = [];
  for (const [x, y] of positions) {
    if (board[y][x] !== 'empty') continue;
    const tAi = classifyThreatForMove(board, x, y, aiPlayer);
    const tOp = classifyThreatForMove(board, x, y, opponent);
    if (
      tAi.type === THREAT.WIN || tAi.type === THREAT.OPEN_FOUR || tAi.type === THREAT.DOUBLE_OPEN_THREE ||
      tOp.type === THREAT.WIN || tOp.type === THREAT.OPEN_FOUR || tOp.type === THREAT.DOUBLE_OPEN_THREE
    ) {
      const s = (tAi.score || 0) + (tOp.score || 0);
      tactical.push({ x, y, s });
    }
  }

  tactical.sort((a, b) => b.s - a.s).slice(0, 16);

  for (const m of tactical) {
    if (Date.now() > deadline) break;
    const newBoard = placeStone(board, m.x, m.y, aiPlayer);
    const score = -quiescence(newBoard, opponent, -beta, -alpha, deadline);
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }

  return alpha;
}

/**
 * Return all immediate winning moves for player
 */
function listImmediateWins(board, player) {
  const positions = getRelevantPositions(board, 2);
  const wins = [];
  for (const [x, y] of positions) {
    if (board[y][x] !== 'empty') continue;
    const nb = placeStone(board, x, y, player);
    const result = checkWinner(nb, x, y);
    if (result.winner === player) wins.push({ x, y });
  }
  return wins;
}

/**
 * Minimal VCF/VCT threat search: try to find a forcing line made of threats
 * Returns the first initiating move that forces a win within depth, else null
 */
function threatSearch(board, player, depth, deadline, allowOpenThree = true) {
  if (Date.now() > deadline || depth <= 0) return null;
  const opponent = player === 'black' ? 'white' : 'black';
  const positions = getRelevantPositions(board, 2)
    .map(([x, y]) => ({ x, y, s: evaluatePosition(board, x, y, player) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 16);

  for (const { x, y } of positions) {
    if (Date.now() > deadline) break;
    if (!isValidMove(board, x, y)) continue;

    // Winning right now
    const nb = placeStone(board, x, y, player);
    const win = checkWinner(nb, x, y);
    if (win.winner === player) return { x, y };

    const th = classifyThreatForMove(board, x, y, player);
    const isStrongThreat = th.type === THREAT.OPEN_FOUR || th.type === THREAT.DOUBLE_OPEN_THREE || (allowOpenThree && th.type === THREAT.OPEN_THREE);
    if (!isStrongThreat) continue;

    // Opponent must block any immediate win created next move
    const playerWinsNext = listImmediateWins(nb, player);
    if (playerWinsNext.length === 0) continue;

    // Aggregate distinct blocking squares (the squares of our immediate wins)
    const blocks = Array.from(new Set(playerWinsNext.map(m => `${m.x},${m.y}`)))
      .map(k => ({ x: Number(k.split(',')[0]), y: Number(k.split(',')[1]) }));

    let forced = true;
    for (const b of blocks) {
      if (Date.now() > deadline) { forced = false; break; }
      if (!isValidMove(nb, b.x, b.y)) { continue; }
      const oppBoard = placeStone(nb, b.x, b.y, opponent);
      // After opponent blocks, can we continue threatening to keep it forced?
      const cont = threatSearch(oppBoard, player, depth - 1, deadline, allowOpenThree);
      if (!cont) { forced = false; break; }
    }

    if (forced) return { x, y };
  }

  return null;
}

/**
 * Minimax algorithm with alpha-beta pruning
 * @param {Array} board - Current board state
 * @param {number} depth - Search depth remaining
 * @param {boolean} isMaximizing - True if maximizing player (AI), false if minimizing (opponent)
 * @param {string} aiPlayer - AI player color ("black" or "white")
 * @param {number} alpha - Alpha value for pruning
 * @param {number} beta - Beta value for pruning
 * @returns {number} - Evaluated score
 */
function minimax(board, depth, isMaximizing, aiPlayer, alpha = -Infinity, beta = Infinity, deadline = Infinity, hash = null, history = null) {
  const opponent = aiPlayer === "black" ? "white" : "black";
  const currentPlayer = isMaximizing ? aiPlayer : opponent;
  
  // Terminal conditions
  if (depth === 0 || Date.now() > deadline) {
    // Use quiescence to avoid horizon-induced weak moves
    return quiescence(board, aiPlayer, alpha, beta, deadline);
  }

  // Lookup transposition table
  const key = hash === null ? computeHash(board) : hash;
  const ttEntry = tt.get(key);
  if (ttEntry && ttEntry.depth >= depth) {
    if (ttEntry.flag === TT_EXACT) return ttEntry.score;
    if (ttEntry.flag === TT_LOWER) alpha = Math.max(alpha, ttEntry.score);
    else if (ttEntry.flag === TT_UPPER) beta = Math.min(beta, ttEntry.score);
    if (alpha >= beta) return ttEntry.score;
  }
  
  // Get relevant positions (within 2 cells of existing stones for efficiency)
  const positions = getRelevantPositions(board, 2);
  
  // Sort positions by heuristic value for better alpha-beta pruning
  positions.sort((a, b) => {
    const scoreA = evaluatePosition(board, a[0], a[1], currentPlayer);
    const scoreB = evaluatePosition(board, b[0], b[1], currentPlayer);
    // history heuristic
    let ha = 0, hb = 0;
    if (history) {
      const table = history[currentPlayer];
      ha = table[a[1]][a[0]];
      hb = table[b[1]][b[0]];
    }
    return (scoreB + hb * 0.001) - (scoreA + ha * 0.001);
  });

  // Filter out obviously non-threatening moves (keep a fallback if all filtered)
  const combinedScore = (x, y) => evaluatePosition(board, x, y, aiPlayer) + evaluatePosition(board, x, y, opponent);
  const THRESH = SCORES.TWO + 5; // at least minor threat either side
  let filtered = positions.filter(([x, y]) => combinedScore(x, y) >= THRESH);
  if (filtered.length === 0) filtered = positions;
  
  let bestScore;
  if (isMaximizing) {
    let maxScore = -Infinity;
    
    for (const [x, y] of (filtered.length ? filtered : positions)) {
      const newBoard = placeStone(board, x, y, aiPlayer);
      const result = checkWinner(newBoard, x, y);
      
      // If this move wins, return immediately
      if (result.winner === aiPlayer) {
        const score = SCORES.FIVE;
        tt.set(key, { depth, score, flag: TT_EXACT });
        return score;
      }
      
      const childHash = hashAfterMove(key, x, y, aiPlayer);
      const score = minimax(newBoard, depth - 1, false, aiPlayer, alpha, beta, deadline, childHash, history);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      
      // Alpha-beta pruning
      if (beta <= alpha) {
        break;
      }
    }
    
    bestScore = maxScore;
  } else {
    let minScore = Infinity;
    
    for (const [x, y] of (filtered.length ? filtered : positions)) {
      const newBoard = placeStone(board, x, y, opponent);
      const result = checkWinner(newBoard, x, y);
      
      // If opponent wins, return immediately
      if (result.winner === opponent) {
        const score = -SCORES.FIVE;
        tt.set(key, { depth, score, flag: TT_EXACT });
        return score;
      }
      
      const childHash = hashAfterMove(key, x, y, opponent);
      const score = minimax(newBoard, depth - 1, true, aiPlayer, alpha, beta, deadline, childHash, history);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      
      // Alpha-beta pruning
      if (beta <= alpha) {
        break;
      }
    }
    
    bestScore = minScore;
  }

  // Store to TT
  let flag = TT_EXACT;
  if (bestScore <= alpha) flag = TT_UPPER;
  else if (bestScore >= beta) flag = TT_LOWER;
  ttSet(key, { depth, score: bestScore, flag });

  return bestScore;
}

/**
 * Find the best move for the AI
 * Enhanced AI with deeper search and smarter evaluation
 * @param {Array} board - Current board state
 * @param {string} aiPlayer - AI player color
 * @returns {Object} - { x, y, score } of best move
 */
export function findBestMove(board, aiPlayer) {
  const positions = getRelevantPositions(board, 2);
  const opponent = aiPlayer === "black" ? "white" : "black";
  const timeLimitMs = 120; // time budget per AI move to avoid UI jank
  const deadline = Date.now() + timeLimitMs;
  const threatDeadline = Date.now() + Math.min(40, Math.floor(timeLimitMs * 0.35));
  
  // If this is the first move, play in the center
  if (positions.length === 1) {
    const center = Math.floor(BOARD_SIZE / 2);
    return { x: center, y: center, score: 0 };
  }
  
  // Critical tactics first: wins, blocks, open-fours, double open-threes
  let aiWins = [];
  let oppWins = [];
  let aiOpenFours = [];
  let oppOpenFours = [];
  let aiDoubleThrees = [];
  let oppDoubleThrees = [];

  for (const [x, y] of positions) {
    const aiThreat = classifyThreatForMove(board, x, y, aiPlayer);
    const oppThreat = classifyThreatForMove(board, x, y, opponent);

    if (aiThreat.type === THREAT.WIN) aiWins.push({ x, y });
    if (oppThreat.type === THREAT.WIN) oppWins.push({ x, y });
    if (aiThreat.type === THREAT.OPEN_FOUR) aiOpenFours.push({ x, y });
    if (oppThreat.type === THREAT.OPEN_FOUR) oppOpenFours.push({ x, y });
    if (aiThreat.type === THREAT.DOUBLE_OPEN_THREE) aiDoubleThrees.push({ x, y });
    if (oppThreat.type === THREAT.DOUBLE_OPEN_THREE) oppDoubleThrees.push({ x, y });
  }

  if (aiWins.length) return { ...aiWins[0], score: SCORES.FIVE };
  if (oppWins.length) return { ...oppWins[0], score: SCORES.FIVE };
  if (aiOpenFours.length) return { ...aiOpenFours[0], score: SCORES.OPEN_FOUR };
  if (oppOpenFours.length) return { ...oppOpenFours[0], score: SCORES.OPEN_FOUR };
  if (aiDoubleThrees.length) return { ...aiDoubleThrees[0], score: SCORES.OPEN_FOUR * 0.8 };
  if (oppDoubleThrees.length) return { ...oppDoubleThrees[0], score: SCORES.OPEN_FOUR * 0.8 };

  // Try VCF/VCT tactical search
  const vcf = threatSearch(board, aiPlayer, 4, threatDeadline, false);
  if (vcf) return { x: vcf.x, y: vcf.y, score: SCORES.OPEN_FOUR };
  const vct = threatSearch(board, aiPlayer, 4, threatDeadline, true);
  if (vct) return { x: vct.x, y: vct.y, score: SCORES.OPEN_THREE };
  const oppThreat = threatSearch(board, opponent, 4, threatDeadline, true);
  if (oppThreat) {
    // Prevent opponent from initiating the forcing line by occupying the starting cell
    return { x: oppThreat.x, y: oppThreat.y, score: SCORES.OPEN_FOUR };
  }
  
  // Iterative deepening within time budget with adaptive max depth
  const moveCount = positions.length;
  const maxDepth = moveCount < 10 ? 4 : moveCount < 30 ? 4 : 5;
  
  let bestMove = null;
  let bestScore = -Infinity;
  
  // Sort positions by heuristic for better alpha-beta pruning
  const sortedPositions = positions.map(([x, y]) => {
    const nn = nnForward(board, aiPlayer);
    const score = evaluatePosition(board, x, y, aiPlayer) + 
                  evaluatePosition(board, x, y, opponent) * 0.95 + nn * 50;
    return { x, y, score };
  }).sort((a, b) => b.score - a.score).slice(0, Math.min(15, positions.length));
  
  // Evaluate candidate moves with iterative deepening
  let pvMove = null; // principal variation move from last iteration
  const history = createHistoryTable();
  for (let depth = 2; depth <= maxDepth && Date.now() < deadline; depth++) {
    for (const { x, y } of sortedPositions) {
      if (Date.now() >= deadline) break;
      const newBoard = placeStone(board, x, y, aiPlayer);
      const baseHash = computeHash(board);
      const score = minimax(newBoard, depth, false, aiPlayer, -Infinity, Infinity, deadline, hashAfterMove(baseHash, x, y, aiPlayer), history);
      const finalScore = score + Math.random() * 0.005;
      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestMove = { x, y, score: finalScore };
        pvMove = { x, y };
        // history heuristic bump
        history[aiPlayer][y][x] += depth * depth;
      }
    }
    // Move PV to front for next iteration
    if (pvMove) {
      const idx = sortedPositions.findIndex(m => m.x === pvMove.x && m.y === pvMove.y);
      if (idx > 0) {
        const [m] = sortedPositions.splice(idx, 1);
        sortedPositions.unshift(m);
      }
    }
  }
  
  return bestMove || { x: positions[0][0], y: positions[0][1], score: 0 };
}

/**
 * Simple heuristic-only move (for easy difficulty fallback)
 */
export function findHeuristicMove(board, aiPlayer) {
  const positions = getRelevantPositions(board, 2);
  
  if (positions.length === 1) {
    const center = Math.floor(BOARD_SIZE / 2);
    return { x: center, y: center };
  }
  
  let bestMove = positions[0];
  let bestScore = -Infinity;
  
  for (const [x, y] of positions) {
    const score = evaluatePosition(board, x, y, aiPlayer);
    if (score > bestScore) {
      bestScore = score;
      bestMove = [x, y];
    }
  }
  
  return { x: bestMove[0], y: bestMove[1] };
}



