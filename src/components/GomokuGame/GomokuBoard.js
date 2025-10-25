

import React from 'react';
import { theme, blackStoneSVG, whiteStoneSVG, starPoints } from './chineseAssets';
import { BOARD_SIZE } from './gameLogic';

const CELL_SIZE = 30; // Size of each cell in pixels
const PADDING = 20; // Padding around the board
const STONE_SIZE = 26; // Size of the stone

function GomokuBoard({ board, onCellClick, winningLine = [], disabled = false, darkMode = false, lastOpponentMove = null }) {
  const boardWidth = CELL_SIZE * (BOARD_SIZE - 1) + PADDING * 2;
  const boardHeight = CELL_SIZE * (BOARD_SIZE - 1) + PADDING * 2;

  const handleClick = (e) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - PADDING;
    const y = e.clientY - rect.top - PADDING;

    // Calculate nearest intersection
    const col = Math.round(x / CELL_SIZE);
    const row = Math.round(y / CELL_SIZE);

    if (col >= 0 && col < BOARD_SIZE && row >= 0 && row < BOARD_SIZE) {
      onCellClick(col, row);
    }
  };

  const isWinningPosition = (x, y) => {
    return winningLine.some(([wx, wy]) => wx === x && wy === y);
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className="relative rounded-lg shadow-2xl"
        style={{
          width: boardWidth,
          height: boardHeight,
          background: darkMode 
            ? 'linear-gradient(135deg, #d4a373 0%, #c9964b 100%)'
            : 'linear-gradient(135deg, #daa520 0%, #b8860b 100%)',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={handleClick}
      >
        <svg
          width={boardWidth}
          height={boardHeight}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Grid lines */}
          {Array.from({ length: BOARD_SIZE }).map((_, i) => (
            <g key={`grid-${i}`}>
              {/* Horizontal line */}
              <line
                x1={PADDING}
                y1={PADDING + i * CELL_SIZE}
                x2={PADDING + (BOARD_SIZE - 1) * CELL_SIZE}
                y2={PADDING + i * CELL_SIZE}
                stroke={theme.colors.boardLine}
                strokeWidth="1.5"
              />
              {/* Vertical line */}
              <line
                x1={PADDING + i * CELL_SIZE}
                y1={PADDING}
                x2={PADDING + i * CELL_SIZE}
                y2={PADDING + (BOARD_SIZE - 1) * CELL_SIZE}
                stroke={theme.colors.boardLine}
                strokeWidth="1.5"
              />
            </g>
          ))}

          {/* Star points */}
          {starPoints.map(([x, y], idx) => (
            <circle
              key={`star-${idx}`}
              cx={PADDING + x * CELL_SIZE}
              cy={PADDING + y * CELL_SIZE}
              r="4"
              fill={theme.colors.boardLine}
            />
          ))}

          {/* Winning line highlight */}
          {winningLine.length > 0 && (
            <line
              x1={PADDING + winningLine[0][0] * CELL_SIZE}
              y1={PADDING + winningLine[0][1] * CELL_SIZE}
              x2={PADDING + winningLine[winningLine.length - 1][0] * CELL_SIZE}
              y2={PADDING + winningLine[winningLine.length - 1][1] * CELL_SIZE}
              stroke="#ff4444"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.7"
            />
          )}
        </svg>

        {/* Stones */}
        {board.map((row, y) =>
          row.map((cell, x) => {
            if (cell === 'empty') return null;

            const isWinning = isWinningPosition(x, y);
            const stoneSVG = cell === 'black' ? blackStoneSVG : whiteStoneSVG;

            // Only animate the latest placed stone to avoid mass reflows
            const isLatest = (() => {
              // Find last non-empty by scanning backwards minimally
              for (let yy = BOARD_SIZE - 1; yy >= 0; yy--) {
                for (let xx = BOARD_SIZE - 1; xx >= 0; xx--) {
                  if (board[yy][xx] !== 'empty') {
                    return xx === x && yy === y;
                  }
                }
              }
              return false;
            })();

            const isLastOpponent = lastOpponentMove && lastOpponentMove.x === x && lastOpponentMove.y === y;

            return (
              <div
                key={`stone-${x}-${y}`}
                style={{
                  position: 'absolute',
                  left: PADDING + x * CELL_SIZE - STONE_SIZE / 2,
                  top: PADDING + y * CELL_SIZE - STONE_SIZE / 2,
                  width: STONE_SIZE,
                  height: STONE_SIZE,
                  backgroundImage: `url("${stoneSVG}")`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  transform: isWinning ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                  filter: isWinning ? 'drop-shadow(0 0 8px rgba(255, 68, 68, 0.8))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  animation: isLatest ? 'placeStone 0.3s ease-out' : 'none',
                }}
              >
                {isLastOpponent && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: -6,
                      borderRadius: '9999px',
                      border: '3px solid rgba(59,130,246,0.9)',
                      boxShadow: '0 0 12px rgba(59,130,246,0.8)',
                      animation: 'pulseRing 1.2s ease-out infinite',
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes placeStone {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes pulseRing {
          0% { opacity: 0.9; transform: scale(0.9); }
          50% { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0.9; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
}

export default GomokuBoard;

