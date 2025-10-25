import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

function ChessLoadingScreen({ navigateTo, language = 'en', darkMode = false, duration = 2000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('chess-lobby');
    }, duration);
    return () => clearTimeout(timer);
  }, [navigateTo, duration]);

  const pieces = ['車', '馬', '炮', '兵', '將'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="chess-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="80" height="80" fill="none" stroke={darkMode ? '#f59e0b' : '#b45309'} strokeWidth="1"/>
              <line x1="40" y1="0" x2="40" y2="80" stroke={darkMode ? '#f59e0b' : '#b45309'} strokeWidth="1"/>
              <line x1="0" y1="40" x2="80" y2="40" stroke={darkMode ? '#f59e0b' : '#b45309'} strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chess-grid)" />
        </svg>
      </div>

      {/* Floating chess pieces background */}
      <div className="absolute inset-0">
        {['車', '馬', '炮'].map((piece, index) => (
          <motion.div
            key={index}
            className={`absolute text-6xl font-bold ${
              darkMode ? 'text-red-400/10' : 'text-red-700/10'
            }`}
            style={{
              fontFamily: 'STKaiti, KaiTi, serif',
              left: `${20 + index * 30}%`,
              top: `${15 + index * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {piece}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-md">
        {/* Game icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8 flex justify-center"
        >
          <div className={`w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl ${
            darkMode ? 'bg-slate-700' : 'bg-white'
          }`}>
            <img 
              src="/chinese-chess-icon.png" 
              alt="Chinese Chess" 
              className="w-24 h-24 object-contain"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-4xl font-bold mb-3 ${
            darkMode ? 'text-red-400' : 'text-red-900'
          }`}
          style={{ fontFamily: 'STKaiti, KaiTi, serif' }}
        >
          中国象棋
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`text-lg mb-8 ${
            darkMode ? 'text-slate-400' : 'text-red-700'
          }`}
          style={{ fontFamily: 'STKaiti, KaiTi, serif' }}
        >
          楚河汉界 · 智慧对弈
        </motion.div>

        {/* Animated chess pieces */}
        <div className="flex justify-center gap-3 mb-8">
          {pieces.map((piece, index) => (
            <motion.div
              key={index}
              className={`w-12 h-12 rounded-full border-3 flex items-center justify-center font-bold text-lg ${
                index < 3
                  ? darkMode 
                    ? 'bg-red-900 border-red-700 text-red-200'
                    : 'bg-red-600 border-red-800 text-white'
                  : darkMode
                    ? 'bg-slate-800 border-slate-600 text-slate-200'
                    : 'bg-slate-700 border-slate-900 text-white'
              }`}
              style={{ fontFamily: 'STKaiti, KaiTi, serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { delay: 0.5 + index * 0.1 },
                y: {
                  delay: 0.5 + index * 0.1,
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }
              }}
            >
              {piece}
            </motion.div>
          ))}
        </div>

        {/* River divider (楚河汉界) */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-6"
        >
          <div className={`relative h-8 flex items-center justify-center border-t-2 border-b-2 ${
            darkMode ? 'border-red-700' : 'border-red-800'
          }`}>
            <div className={`px-4 text-sm font-bold ${
              darkMode ? 'bg-slate-800 text-red-400' : 'bg-amber-50 text-red-900'
            }`}
              style={{ fontFamily: 'STKaiti, KaiTi, serif' }}
            >
              楚河 · 汉界
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${
          darkMode ? 'bg-slate-700' : 'bg-red-200'
        }`}>
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 to-red-700"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        </div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className={`mt-4 text-sm ${
            darkMode ? 'text-slate-500' : 'text-red-700/70'
          }`}
        >
          加载中...
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ChessLoadingScreen;

