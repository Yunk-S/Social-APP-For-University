

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Users, DoorOpen, Brain, Play, Loader, Check } from 'lucide-react';
import { theme, chineseText, backgroundSVG } from './chineseAssets';
import wsService from './mockWebSocket';

function GomokuLobby({ navigateTo, language = 'en', darkMode = false }) {
  const [selectedMode, setSelectedMode] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [onlineCount, setOnlineCount] = useState(237);
  const [isMatching, setIsMatching] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from SEER app
    const username = localStorage.getItem('seer_username') || 'Guest';
    const authToken = localStorage.getItem('seer_auth_token') || 'demo_token';
    setCurrentUser({ username, authToken });

    // Connect to WebSocket service
    wsService.connect();
    wsService.on('onConnect', () => {
      setOnlineCount(wsService.getOnlinePlayerCount());
    });

    wsService.on('onMessage', handleWebSocketMessage);
    wsService.on('onError', handleWebSocketError);

    return () => {
      wsService.on('onMessage', null);
      wsService.on('onError', null);
    };
  }, []);

  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'MATCH_FOUND':
        setIsMatching(false);
        // Navigate to game with opponent info
        navigateTo('gomoku-game', {
          gameMode: 'matchmaking',
          opponent: message.payload.opponent,
          myColor: message.payload.yourColor,
        });
        break;

      case 'ROOM_CREATED':
        setIsConnecting(false);
        setRoomCode(message.payload.roomCode);
        // Wait for opponent...
        break;

      case 'ROOM_JOINED':
        setIsConnecting(false);
        // Navigate to game
        navigateTo('gomoku-game', {
          gameMode: 'room',
          opponent: message.payload.opponent,
          myColor: message.payload.yourColor,
          roomCode: roomCode,
        });
        break;

      case 'ROOM_WAITING':
        setIsConnecting(false);
        // Show waiting state
        break;

      default:
        break;
    }
  };

  const handleWebSocketError = (error) => {
    setError(error.message);
    setIsMatching(false);
    setIsConnecting(false);
    setTimeout(() => setError(''), 5000);
  };

  const handleMatchmaking = () => {
    if (!currentUser) return;
    
    setIsMatching(true);
    setError('');
    
    wsService.send({
      type: 'FIND_MATCH',
      payload: {
        username: currentUser.username,
        authToken: currentUser.authToken,
      },
    });
  };

  const handleJoinRoom = () => {
    if (!roomCode || roomCode.length !== 6) {
      setError('Please enter a valid 6-character room code');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsConnecting(true);
    setError('');

    wsService.send({
      type: 'JOIN_ROOM',
      payload: {
        roomCode: roomCode.toUpperCase(),
        username: currentUser?.username || 'Guest',
        authToken: currentUser?.authToken || 'demo',
      },
    });
  };

  const handleCreateRoom = () => {
    setIsConnecting(true);
    setError('');

    wsService.send({
      type: 'CREATE_ROOM',
      payload: {
        username: currentUser?.username || 'Guest',
        authToken: currentUser?.authToken || 'demo',
      },
    });
  };

  const [trainingColor, setTrainingColor] = useState('black');

  const handleStartTraining = () => {
    // Navigate directly to training mode with chosen color
    navigateTo('gomoku-game', {
      gameMode: 'training',
      myColor: trainingColor,
    });
  };

  const modes = [
    {
      id: 'matchmaking',
      icon: Users,
      title: chineseText.lobby.matchmaking,
      description: chineseText.lobby.matchmakingDesc,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      id: 'room',
      icon: DoorOpen,
      title: chineseText.lobby.room,
      description: chineseText.lobby.roomDesc,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'training',
      icon: Brain,
      title: chineseText.lobby.training,
      description: chineseText.lobby.trainingDesc,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full relative overflow-auto"
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : `url("${backgroundSVG}") center/cover`,
      }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b backdrop-blur-sm ${
        darkMode ? 'border-slate-700 bg-slate-800/90' : 'border-amber-900/20 bg-amber-50/90'
      }`}>
        <button
          onClick={() => navigateTo('games')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-slate-700' : 'hover:bg-amber-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="text-center">
          <div className={`text-2xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-900'}`}
            style={{ fontFamily: theme.fonts.chinese }}
          >
            {chineseText.lobby.title}
          </div>
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-amber-700'}`}
            style={{ fontFamily: theme.fonts.chinese }}
          >
            {chineseText.lobby.subtitle}
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          darkMode ? 'bg-slate-700 text-slate-300' : 'bg-white/80 text-amber-900'
        }`}>
          <Users className="w-4 h-4 inline mr-1" />
          {onlineCount}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-500/90 text-white rounded-xl shadow-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMode(mode.id)}
              className={`relative rounded-2xl p-6 cursor-pointer shadow-xl transition-all ${
                selectedMode === mode.id 
                  ? 'shadow-2xl' 
                  : ''
              }`}
              style={{
                background: selectedMode === mode.id
                  ? darkMode
                    ? 'linear-gradient(135deg, #475569 0%, #334155 100%)'
                    : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                  : darkMode 
                    ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #fef5e7 100%)',
              }}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4`}>
                <mode.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}
                style={{ fontFamily: theme.fonts.chinese }}
              >
                {mode.title}
              </h3>

              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {mode.description}
              </p>

              {selectedMode === mode.id && (
                <div className="absolute top-3 right-3">
                  <Check className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mode-specific Controls */}
        <AnimatePresence mode="wait">
          {selectedMode && (
            <motion.div
              key={selectedMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-2xl p-6 shadow-2xl ${
                darkMode ? 'bg-slate-800' : 'bg-white/90'
              }`}
            >
              {selectedMode === 'matchmaking' && (
                <div className="text-center">
                  <div className={`mb-4 text-lg ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {chineseText.lobby.onlinePlayers}: <span className="font-bold">{onlineCount}</span>
                  </div>
                  
                  <button
                    onClick={handleMatchmaking}
                    disabled={isMatching}
                    className="w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    }}
                  >
                    {isMatching ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Matching...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        {chineseText.lobby.findMatch}
                      </>
                    )}
                  </button>
                </div>
              )}

              {selectedMode === 'room' && (
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {chineseText.lobby.enterRoomCode}
                    </label>
                    <input
                      type="text"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
                      placeholder="ABC123"
                      maxLength={6}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-lg text-center ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-slate-100'
                          : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleCreateRoom}
                      disabled={isConnecting}
                      className={`py-3 px-4 rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 ${
                        darkMode 
                          ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                          : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      }`}
                    >
                      Create Room
                    </button>

                    <button
                      onClick={handleJoinRoom}
                      disabled={isConnecting}
                      className="py-3 px-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                      }}
                    >
                      {isConnecting ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          {chineseText.lobby.join}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {selectedMode === 'training' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className={`mb-4 text-lg ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      挑战高级AI，提升你的五子棋技巧
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      AI使用Minimax算法与Alpha-Beta剪枝，具有专业级水平
                    </p>
                  </div>

                  <div>
                    <label className={`block mb-3 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      选择你的执子颜色
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['black', 'white'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setTrainingColor(c)}
                          className={`py-3 px-4 rounded-xl font-bold transition-all ${
                            trainingColor === c
                              ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg'
                              : darkMode
                              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {c === 'black' ? '执黑先手' : '执白后手'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleStartTraining}
                    className="w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                    }}
                  >
                    <Play className="w-5 h-5" />
                    {chineseText.lobby.startTraining}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default GomokuLobby;

