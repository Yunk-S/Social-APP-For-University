import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

function GomokuLoadingScreen({ navigateTo, language = 'en', darkMode = false, duration = 2000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('gomoku-lobby');
    }, duration);
    return () => clearTimeout(timer);
  }, [navigateTo, duration]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #f7f1e3 0%, #e9dcc9 100%)',
      }}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
          style={{
            background: darkMode 
              ? 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: darkMode 
              ? 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
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
              src="/gomoku.png" 
              alt="Gomoku" 
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
            darkMode ? 'text-amber-400' : 'text-amber-900'
          }`}
          style={{ fontFamily: 'STKaiti, KaiTi, serif' }}
        >
          五子棋
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`text-lg mb-8 ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}
          style={{ fontFamily: 'STKaiti, KaiTi, serif' }}
        >
          五子连珠 · 智慧对决
        </motion.div>

        {/* Animated stones */}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className={`w-4 h-4 rounded-full ${
                index % 2 === 0 ? 'bg-black' : 'bg-white border-2 border-slate-300'
              }`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: [1, 1.2, 1],
              }}
              transition={{
                delay: 0.5 + index * 0.1,
                scale: {
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 0.8,
                }
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${
          darkMode ? 'bg-slate-700' : 'bg-amber-200'
        }`}>
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        </div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`mt-4 text-sm ${
            darkMode ? 'text-slate-500' : 'text-slate-500'
          }`}
        >
          加载中...
        </motion.div>
      </div>
    </motion.div>
  );
}

export default GomokuLoadingScreen;

