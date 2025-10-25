

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { victoryBadgeSVG, defeatBadgeSVG, drawBadgeSVG, chineseText } from './chineseAssets';

function GameResultModal({ 
  show, 
  result, // 'victory', 'defeat', or 'draw'
  totalMoves, 
  duration, 
  onPlayAgain, 
  onBackToLobby,
  darkMode = false 
}) {
  if (!show) return null;

  const getBadge = () => {
    switch (result) {
      case 'victory':
        return victoryBadgeSVG;
      case 'defeat':
        return defeatBadgeSVG;
      case 'draw':
        return drawBadgeSVG;
      default:
        return victoryBadgeSVG;
    }
  };

  const getTitle = () => {
    switch (result) {
      case 'victory':
        return chineseText.result.victory;
      case 'defeat':
        return chineseText.result.defeat;
      case 'draw':
        return chineseText.result.draw;
      default:
        return '';
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ 
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 15 }}
            className={`rounded-3xl shadow-2xl p-8 max-w-md w-full ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}
            style={{
              background: darkMode 
                ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                : 'linear-gradient(135deg, #fef5e7 0%, #f9e4b7 100%)',
              border: '3px solid',
              borderColor: darkMode ? '#64748b' : '#d6b98a',
            }}
          >
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <motion.img
                src={getBadge()}
                alt={getTitle()}
                className="w-48 h-48"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
              />
            </div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-4xl font-bold text-center mb-8 ${
                darkMode ? 'text-slate-100' : 'text-slate-800'
              }`}
              style={{ fontFamily: '"Noto Serif SC", "STSong", serif' }}
            >
              {getTitle()}
            </motion.h2>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 mb-8"
            >
              <div className={`flex justify-between items-center p-4 rounded-xl ${
                darkMode ? 'bg-slate-700/50' : 'bg-white/60'
              }`}>
                <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {chineseText.result.totalMoves}
                </span>
                <span className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  {totalMoves}
                </span>
              </div>

              <div className={`flex justify-between items-center p-4 rounded-xl ${
                darkMode ? 'bg-slate-700/50' : 'bg-white/60'
              }`}>
                <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {chineseText.result.duration}
                </span>
                <span className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  {formatDuration(duration)}
                </span>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4"
            >
              <button
                onClick={onPlayAgain}
                className="flex-1 py-4 px-6 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #b22222 0%, #8b0000 100%)',
                }}
              >
                {chineseText.result.playAgain}
              </button>

              <button
                onClick={onBackToLobby}
                className={`flex-1 py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                  darkMode 
                    ? 'bg-slate-600 text-white hover:bg-slate-500' 
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
              >
                {chineseText.result.backToLobby}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GameResultModal;

