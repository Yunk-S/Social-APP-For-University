
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import GomokuBoard from './GomokuBoard';
import GameResultModal from './GameResultModal';
import { theme, chineseText } from './chineseAssets';
import {
  createEmptyBoard,
  placeStone,
  checkWinner,
  isBoardFull,
  switchPlayer,
  createHistoryEntry,
} from './gameLogic';
import { findBestMove, postGameTrain } from './aiEngine';
import wsService from './mockWebSocket';

function GomokuGameScreen({ 
  navigateTo, 
  language = 'en', 
  darkMode = false,
  gameMode = 'training', // 'matchmaking', 'room', or 'training'
  roomCode = null,
  opponent = null,
  myColor: initialMyColor = 'black',
}) {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [gameStatus, setGameStatus] = useState('in_progress'); // 'in_progress', 'ended'
  const [winner, setWinner] = useState(null); // 'black', 'white', or null
  const [winningLine, setWinningLine] = useState([]);
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [myColor, setMyColor] = useState(initialMyColor); // For online & training
  const [isThinking, setIsThinking] = useState(false);
  const [lastOpponentMove, setLastOpponentMove] = useState(null); // {x,y}
  const [gameStartTime] = useState(Date.now());
  const [gameDuration, setGameDuration] = useState(0);
  const audioRef = useRef(null);

  // If user chose white (training after lobby), let AI open as black
  useEffect(() => {
    if (gameMode === 'training' && history.length === 0 && currentPlayer === 'black' && myColor === 'white' && !isThinking) {
      setIsThinking(true);
      setTimeout(() => {
        makeAIMove(board, 'black');
      }, 500);
    }
  }, [gameMode, myColor, history.length, currentPlayer, isThinking, board]);

  // Load audio
  useEffect(() => {
    try {
      audioRef.current = new Audio('/chess.MP3');
      audioRef.current.volume = 0.5;
    } catch (error) {
      console.warn('Failed to load chess sound:', error);
    }
  }, []);

  // WebSocket setup for online modes
  useEffect(() => {
    if (gameMode === 'matchmaking' || gameMode === 'room') {
      wsService.on('onMessage', handleWebSocketMessage);
      
      return () => {
        // Prefer explicit off to avoid lingering listeners
        if (wsService.off) wsService.off('onMessage');
        else wsService.on('onMessage', null);
      };
    }
  }, [gameMode]);

  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'MOVE_MADE':
        // Opponent made a move
        const { x, y, player } = message.payload;
        if (player !== myColor) {
          setLastOpponentMove({ x, y });
        }
        makeMove(x, y, player, false);
        break;
      case 'GAME_OVER':
        handleGameOver(message.payload.winner, message.payload.reason);
        break;
      default:
        break;
    }
  };

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.warn('Audio play failed:', err));
    }
  };

  const handleCellClick = (x, y) => {
    if (gameStatus !== 'in_progress') return;
    if (board[y][x] !== 'empty') return;

    // Enforce turn for both training and online modes
    if (currentPlayer !== myColor) {
      return; // Not your turn
    }

    makeMove(x, y, currentPlayer, true, board);
  };

  // baseBoard parameter prevents stale-closure by explicitly using the latest snapshot
  const makeMove = (x, y, player, isLocalMove = true, baseBoard = board) => {
    // Prevent moves if game is not in progress
    if (gameStatus !== 'in_progress') return;
    
    try {
      const newBoard = placeStone(baseBoard, x, y, player);
      const result = checkWinner(newBoard, x, y);
      
      // Add to history
      const historyEntry = createHistoryEntry(x, y, player);
      
      // Update all states together to prevent rendering issues
      setBoard(newBoard);
      setHistory(prev => [...prev, historyEntry]);
      playSound();

      // Send move to server in online modes
      if (isLocalMove && (gameMode === 'matchmaking' || gameMode === 'room')) {
        wsService.send({
          type: 'MAKE_MOVE',
          payload: { x, y, player, timestamp: historyEntry.timestamp },
        });
      }

      // Check for winner
      if (result.winner) {
        setWinner(result.winner);
        setWinningLine(result.winningLine);
        setGameStatus('ended');
        setGameDuration(Math.floor((Date.now() - gameStartTime) / 1000));
        setTimeout(() => setShowResult(true), 500);
        return;
      }

      // Check for draw
      if (isBoardFull(newBoard)) {
        setGameStatus('ended');
        setWinner(null);
        setGameDuration(Math.floor((Date.now() - gameStartTime) / 1000));
        setTimeout(() => setShowResult(true), 500);
        return;
      }

      // Switch player
      const nextPlayer = switchPlayer(player);
      setCurrentPlayer(nextPlayer);

      // Track opponent last move
      if (player !== myColor) {
        setLastOpponentMove({ x, y });
      }

      // AI move in training mode: AI plays the color that is not mine
      if (gameMode === 'training' && nextPlayer !== myColor && !isThinking) {
        setIsThinking(true);
        setTimeout(() => {
          makeAIMove(newBoard, nextPlayer);
        }, 800);
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
  };

  const makeAIMove = (currentBoard, aiPlayer) => {
    // Use setTimeout to prevent UI blocking
    setTimeout(() => {
      const bestMove = findBestMove(currentBoard, aiPlayer);
      
      if (bestMove) {
        // Temporarily disable thinking state during move
        setIsThinking(false);
        makeMove(bestMove.x, bestMove.y, aiPlayer, false, currentBoard);
      } else {
        setIsThinking(false);
      }
    }, 300);
  };

  const handleGameOver = (winnerColor, reason) => {
    setWinner(winnerColor);
    setGameStatus('ended');
    setGameDuration(Math.floor((Date.now() - gameStartTime) / 1000));
    setTimeout(() => setShowResult(true), 500);

    // Trigger lightweight post-game training (non-blocking)
    try {
      const result = winnerColor; // 'black' | 'white' | null
      postGameTrain(history, result);
    } catch (e) {
      // Ignore training errors in UI
    }
  };

  const handlePlayAgain = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('black');
    setGameStatus('in_progress');
    setWinner(null);
    setWinningLine([]);
    setHistory([]);
    setShowResult(false);
    setLastOpponentMove(null);
  };

  const handleBackToLobby = () => {
    navigateTo('gomoku-lobby');
  };

  const getResultType = () => {
    if (winner === null) return 'draw';
    // 统一判断逻辑：winner是否等于我的颜色
    return winner === myColor ? 'victory' : 'defeat';
  };

  const getOpponentName = () => {
    if (gameMode === 'training') {
      return 'AI';
    }
    return opponent?.username || 'Opponent';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full relative overflow-auto"
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #f7f1e3 0%, #e9dcc9 100%)',
      }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        darkMode ? 'border-slate-700 bg-slate-800/90' : 'border-amber-900/20 bg-amber-50/90'
      }`}>
        <button
          onClick={handleBackToLobby}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-slate-700' : 'hover:bg-amber-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">{chineseText.game.backToLobby}</span>
        </button>

        <div className="text-center">
          <div className={`text-xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-900'}`}
            style={{ fontFamily: theme.fonts.chinese }}
          >
            五子棋
          </div>
          {roomCode && (
            <div className="text-xs text-slate-500">Room: {roomCode}</div>
          )}
        </div>

        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Game Container */}
      <div className="flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto items-center md:items-start">
        {/* Board */}
        <div className="flex-1 flex flex-col items-center">
          {/* Current Player Indicator */}
          <div className={`mb-4 px-6 py-3 rounded-xl shadow-lg ${
            darkMode ? 'bg-slate-700' : 'bg-white'
          }`}>
            <div className="text-center">
              {isThinking ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                  <span className={darkMode ? 'text-slate-200' : 'text-slate-700'}>
                    {chineseText.game.thinking}
                  </span>
                </div>
              ) : (
                <>
                  <div className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {currentPlayer === myColor || gameMode === 'training' 
                      ? chineseText.game.yourTurn 
                      : chineseText.game.opponentTurn}
                  </div>
                  <div className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    {currentPlayer === 'black' ? chineseText.game.blackPlayer : chineseText.game.whitePlayer}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Board */}
          <GomokuBoard
            board={board}
            onCellClick={handleCellClick}
            winningLine={winningLine}
            disabled={gameStatus !== 'in_progress' || isThinking}
            darkMode={darkMode}
            lastOpponentMove={lastOpponentMove}
          />
        </div>

        {/* Sidebar - History (hidden on small screens to maximize board space) */}
        <div className="hidden md:block md:w-64">
          <div className={`rounded-2xl shadow-lg p-4 h-full ${
            darkMode ? 'bg-slate-800' : 'bg-white/80'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}
              style={{ fontFamily: theme.fonts.chinese }}
            >
              {chineseText.game.history}
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {history.length === 0 ? (
                <div className={`text-center py-8 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  No moves yet
                </div>
              ) : (
                history.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      darkMode ? 'bg-slate-700/50' : 'bg-slate-100'
                    }`}
                  >
                    <div className={`text-sm font-medium w-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {index + 1}
                    </div>
                    <div className={`w-4 h-4 rounded-full ${
                      entry.move.player === 'black' ? 'bg-black' : 'bg-white border-2 border-slate-300'
                    }`} />
                    <div className={`flex-1 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      ({String.fromCharCode(65 + entry.move.x)}, {entry.move.y + 1})
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <GameResultModal
        show={showResult}
        result={getResultType()}
        totalMoves={history.length}
        duration={gameDuration}
        onPlayAgain={handlePlayAgain}
        onBackToLobby={handleBackToLobby}
        darkMode={darkMode}
      />
    </motion.div>
  );
}

export default GomokuGameScreen;

