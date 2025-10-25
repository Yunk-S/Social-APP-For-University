/**
 * Gomoku Game Logic Engine
 */

const BOARD_SIZE = 15;
const WIN_LENGTH = 5;

/**
 * Initialize an empty 15x15 board
 */
export function createEmptyBoard() {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill("empty"));
}

/**
 * Check if a position is valid and empty
 */
export function isValidMove(board, x, y) {
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    return false;
  }
  return board[y][x] === "empty";
}

/**
 * Place a stone on the board
 */
export function placeStone(board, x, y, player) {
  if (!isValidMove(board, x, y)) {
    throw new Error("INVALID_MOVE");
  }
  
  const newBoard = board.map(row => [...row]);
  newBoard[y][x] = player;
  return newBoard;
}

/**
 * Check for winner in all 4 directions from a position
 * Returns: { winner: "black"|"white"|null, winningLine: [[x,y], ...] }
 */
export function checkWinner(board, lastX, lastY) {
  const player = board[lastY][lastX];
  if (player === "empty") return { winner: null, winningLine: [] };

  const directions = [
    { dx: 1, dy: 0 },   // Horizontal
    { dx: 0, dy: 1 },   // Vertical
    { dx: 1, dy: 1 },   // Diagonal \
    { dx: 1, dy: -1 },  // Diagonal /
  ];

  for (const { dx, dy } of directions) {
    const line = getLine(board, lastX, lastY, dx, dy, player);
    if (line.length >= WIN_LENGTH) {
      return { winner: player, winningLine: line };
    }
  }

  return { winner: null, winningLine: [] };
}

/**
 * Get continuous stones in a direction
 */
function getLine(board, x, y, dx, dy, player) {
  const line = [[x, y]];
  
  // Check positive direction
  let nx = x + dx;
  let ny = y + dy;
  while (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[ny][nx] === player) {
    line.push([nx, ny]);
    nx += dx;
    ny += dy;
  }
  
  // Check negative direction
  nx = x - dx;
  ny = y - dy;
  while (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[ny][nx] === player) {
    line.unshift([nx, ny]);
    nx -= dx;
    ny -= dy;
  }
  
  return line;
}

/**
 * Check if the board is full (draw condition)
 */
export function isBoardFull(board) {
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x] === "empty") return false;
    }
  }
  return true;
}

/**
 * Get all empty positions on the board
 */
export function getEmptyPositions(board) {
  const positions = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x] === "empty") {
        positions.push([x, y]);
      }
    }
  }
  return positions;
}

/**
 * Get positions within a certain radius of existing stones (for AI optimization)
 */
export function getRelevantPositions(board, radius = 2) {
  const relevant = new Set();
  
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x] !== "empty") {
        // Add positions around this stone
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[ny][nx] === "empty") {
              relevant.add(`${nx},${ny}`);
            }
          }
        }
      }
    }
  }
  
  // If board is empty, return center position
  if (relevant.size === 0) {
    return [[Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2)]];
  }
  
  return Array.from(relevant).map(pos => pos.split(',').map(Number));
}

/**
 * Count stones in a line (used for pattern recognition)
 */
export function countInLine(board, x, y, dx, dy, player, maxCount = 5) {
  let count = 0;
  let blocked = 0; // 0 = open, 1 = one end blocked, 2 = both ends blocked
  
  // Count in positive direction
  let nx = x;
  let ny = y;
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
  
  // Count in negative direction
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
 * Switch player
 */
export function switchPlayer(currentPlayer) {
  return currentPlayer === "black" ? "white" : "black";
}

/**
 * Create game history entry
 */
export function createHistoryEntry(x, y, player) {
  return {
    move: { x, y, player },
    timestamp: new Date().toISOString()
  };
}

export { BOARD_SIZE, WIN_LENGTH };

