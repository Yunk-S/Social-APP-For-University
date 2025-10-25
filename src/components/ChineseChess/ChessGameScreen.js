import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, RotateCcw, Home } from 'lucide-react';
import wsService from '../GomokuGame/mockWebSocket';

function ChessGameScreen({ 
  navigateTo, 
  language = 'en', 
  darkMode = false,
  gameMode = 'training', // 'matchmaking', 'room', or 'training'
  roomCode = null,
  opponent = null,
  mySide = 'red', // 'red' or 'black'
  aiDifficulty = 'medium', // 'easy', 'medium', 'hard'
}) {
  const canvasRef = useRef(null);
  const gameInstanceRef = useRef(null);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'checkmate', 'draw'
  const [currentTurn, setCurrentTurn] = useState('red'); // 红方先手
  const [moveHistory, setMoveHistory] = useState([]);
  const [showControls, setShowControls] = useState(true);

  // 初始化游戏
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸（使用原始stype2的尺寸）
    canvas.width = 523;
    canvas.height = 580;

    // 初始化游戏实例
    initChessGame(canvas, ctx);

    // 清理函数
    return () => {
      if (gameInstanceRef.current && gameInstanceRef.current.cleanup) {
        gameInstanceRef.current.cleanup();
      }
    };
  }, []);

  // 检查AI是否应该先走（训练模式且玩家选择黑方）
  useEffect(() => {
    if (gameMode === 'training' && mySide === 'black' && gameInstanceRef.current) {
      // 延迟一下让棋盘先渲染出来
      const timer = setTimeout(() => {
        if (gameInstanceRef.current && gameInstanceRef.current.triggerAIMove) {
          gameInstanceRef.current.triggerAIMove();
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [gameMode, mySide, gameInstanceRef.current]);

  // WebSocket消息处理（用于在线对战）
  useEffect(() => {
    if (gameMode === 'matchmaking' || gameMode === 'room') {
      wsService.on('onMessage', handleWebSocketMessage);
      
      return () => {
        if (wsService.off) wsService.off('onMessage');
        else wsService.on('onMessage', null);
      };
    }
  }, [gameMode]);

  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'CHESS_MOVE':
        // 对手走棋
        const { from, to } = message.payload;
        if (gameInstanceRef.current) {
          gameInstanceRef.current.makeOpponentMove(from, to);
        }
        break;
      case 'GAME_OVER':
        handleGameOver(message.payload.winner, message.payload.reason);
        break;
      default:
        break;
    }
  };

  const initChessGame = (canvas, ctx) => {
    // 棋盘配置（使用原始stype2的配置以确保棋子位置正确）
    const config = {
      width: 523,
      height: 580,
      spaceX: 57,
      spaceY: 57,
      // 为了不裁剪边缘棋子，给四周预留约32px的边距
      pointStartX: 35,
      pointStartY: 35,
    };

    // 初始棋盘布局 (10行9列)
    // 0: 空, r=红方, b=黑方, 后缀: j=将/帅, s=士, x=象, m=马, c=车, p=炮, z=卒/兵
    const initialBoard = [
      // 黑方（上方）
      ['bc', 'bm', 'bx', 'bs', 'bj', 'bs', 'bx', 'bm', 'bc'],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 'bp', 0, 0, 0, 0, 0, 'bp', 0],
      ['bz', 0, 'bz', 0, 'bz', 0, 'bz', 0, 'bz'],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ['rz', 0, 'rz', 0, 'rz', 0, 'rz', 0, 'rz'],
      [0, 'rp', 0, 0, 0, 0, 0, 'rp', 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      // 红方（下方）
      ['rc', 'rm', 'rx', 'rs', 'rj', 'rs', 'rx', 'rm', 'rc'],
    ];

    let board = JSON.parse(JSON.stringify(initialBoard));
    let selectedPiece = null; // board coordinates
    let legalMoves = [];
    let currentPlayer = 'r'; // r=红方, b=黑方
    let images = {};
    let imagesLoaded = false;

    // 棋子名称映射
    const pieceNames = {
      'rj': '帅', 'rs': '仕', 'rx': '相', 'rm': '马', 'rc': '车', 'rp': '炮', 'rz': '兵',
      'bj': '将', 'bs': '士', 'bx': '象', 'bm': '马', 'bc': '车', 'bp': '炮', 'bz': '卒',
    };

    // 加载图片
    const imagesToLoad = [
      // 不使用背景图片，改为绘制矢量棋盘避免位移
      'r_box', 'r_c', 'r_j', 'r_m', 'r_p', 'r_s', 'r_x', 'r_z',
      'b_box', 'b_c', 'b_j', 'b_m', 'b_p', 'b_s', 'b_x', 'b_z',
    ];

    let loadedCount = 0;
    imagesToLoad.forEach(name => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imagesToLoad.length) {
          imagesLoaded = true;
          drawBoard();
        }
      };
      img.onerror = () => {
        loadedCount++;
        console.warn(`Failed to load image: ${name}`);
        if (loadedCount === imagesToLoad.length) {
          imagesLoaded = true;
          drawBoard();
        }
      };
      img.src = `/chess-images/${name}.png`;
      images[name] = img;
    });

    // 绘制棋盘
    const drawBoard = () => {
      // 清空画布
      ctx.clearRect(0, 0, config.width, config.height);

      // 背景底色
      ctx.fillStyle = '#F4E4C1';
      ctx.fillRect(0, 0, config.width, config.height);

      // 外框
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        config.pointStartX - 1,
        config.pointStartY - 1,
        8 * config.spaceX + 2,
        9 * config.spaceY + 2
      );

      // 棋盘线
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      
      // 横线
      for (let i = 0; i < 10; i++) {
        const y = config.pointStartY + i * config.spaceY;
        ctx.beginPath();
        ctx.moveTo(config.pointStartX, y);
        ctx.lineTo(config.pointStartX + 8 * config.spaceX, y);
        ctx.stroke();
      }
      
      // 竖线
      for (let i = 0; i < 9; i++) {
        const x = config.pointStartX + i * config.spaceX;
        ctx.beginPath();
        ctx.moveTo(x, config.pointStartY);
        if (i === 0 || i === 8) {
          ctx.lineTo(x, config.pointStartY + 9 * config.spaceY);
        } else {
          ctx.lineTo(x, config.pointStartY + 4 * config.spaceY);
          ctx.moveTo(x, config.pointStartY + 5 * config.spaceY);
          ctx.lineTo(x, config.pointStartY + 9 * config.spaceY);
        }
        ctx.stroke();
      }

      // 楚河汉界
      ctx.fillStyle = '#8B4513';
      ctx.font = 'bold 24px STKaiti, KaiTi, serif';
      ctx.textAlign = 'center';
      const riverY = config.pointStartY + 4.5 * config.spaceY + 8;
      if (mySide === 'black') {
        // 翻转视角：汉界在左，楚河在右（视觉保持用户方在下）
        ctx.fillText('汉界', config.pointStartX + 2 * config.spaceX, riverY);
        ctx.fillText('楚河', config.pointStartX + 6 * config.spaceX, riverY);
      } else {
        ctx.fillText('楚河', config.pointStartX + 2 * config.spaceX, riverY);
        ctx.fillText('汉界', config.pointStartX + 6 * config.spaceX, riverY);
      }

      // 绘制棋子
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 9; x++) {
          const piece = board[y][x];
          if (piece) {
            drawPiece(x, y, piece, false);
          }
        }
      }

      // 绘制当前选中棋子的可落子提示（绿色点/红色框）
      if (selectedPiece && legalMoves.length > 0) {
        for (const mv of legalMoves) {
          const disp = toDisplayCoord(mv.x, mv.y);
          const mx = config.pointStartX + disp.x * config.spaceX;
          const my = config.pointStartY + disp.y * config.spaceY;
          if (mv.capture) {
            // 红色小方框作为吃子提示
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(mx - 16, my - 16, 32, 32);
          } else {
            // 绿色小圆点作为普通落子
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(mx, my, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    // 绘制棋子
    const drawPiece = (x, y, piece, isSelected) => {
      // 根据我的视角映射显示坐标
      const disp = toDisplayCoord(x, y);
      const px = config.pointStartX + disp.x * config.spaceX;
      const py = config.pointStartY + disp.y * config.spaceY;
      
      const side = piece[0]; // 'r' or 'b'
      const type = piece[1]; // 'j', 's', 'x', 'm', 'c', 'p', 'z'
      const imageName = `${side}_${type}`;
      
      if (images[imageName] && images[imageName].complete) {
        // 绘制棋子图片
        ctx.drawImage(images[imageName], px - 28, py - 28, 56, 56);
      } else {
        // 备用：绘制圆形棋子
        ctx.beginPath();
        ctx.arc(px, py, 25, 0, 2 * Math.PI);
        ctx.fillStyle = side === 'r' ? '#DC143C' : '#2C3E50';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制棋子文字
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 20px STKaiti, KaiTi, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pieceNames[piece] || '?', px, py);
      }

      // 取消选中框与红点显示（按需求不再绘制）
    };

    // 处理点击事件
    const handleClick = (event) => {
      if (!imagesLoaded) return;

      const rect = canvas.getBoundingClientRect();
      // 映射为canvas坐标，修复CSS缩放导致的点击偏移
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;

      // 计算点击的格子
      let gridX = Math.round((clickX - config.pointStartX) / config.spaceX);
      let gridY = Math.round((clickY - config.pointStartY) / config.spaceY);

      // 边界检查
      if (gridX < 0 || gridX > 8 || gridY < 0 || gridY > 9) return;

      // 若用户选择黑方，显示是翻转后的，需要映射到真实棋盘坐标
      const boardX = mySide === 'black' ? 8 - gridX : gridX;
      const boardY = mySide === 'black' ? 9 - gridY : gridY;

      const clickedPiece = board[boardY][boardX];

      // 如果已选中棋子
      if (selectedPiece) {
        // 如果点击的是同一个棋子，取消选中
        if (selectedPiece.x === boardX && selectedPiece.y === boardY) {
          selectedPiece = null;
          drawBoard();
          return;
        }

        // 如果点击的是己方其他棋子，切换选中
        if (clickedPiece && clickedPiece[0] === currentPlayer) {
          selectedPiece = { x: boardX, y: boardY, piece: clickedPiece };
          drawBoard();
          return;
        }

        // 尝试移动棋子
        if (isValidMove(selectedPiece.x, selectedPiece.y, boardX, boardY)) {
          makeMove(selectedPiece.x, selectedPiece.y, boardX, boardY);
        }
        
        selectedPiece = null;
        drawBoard();
      } else {
        // 选中棋子
        if (clickedPiece && clickedPiece[0] === currentPlayer) {
          // 只允许选择己方棋子
          if (gameMode === 'training' || currentPlayer === mySide[0]) {
            selectedPiece = { x: boardX, y: boardY, piece: clickedPiece };
            // 重新计算提示位置
            legalMoves = computeLegalMoves(boardX, boardY);
            drawBoard();
          }
        }
      }
    };

    // 将棋盘坐标映射为屏幕显示坐标
    const toDisplayCoord = (x, y) => {
      if (mySide === 'black') {
        return { x: 8 - x, y: 9 - y };
      }
      return { x, y };
    };

    // 计算某棋子的所有可落子位置（同步视角映射由 drawBoard 处理）
    const computeLegalMoves = (fromX, fromY) => {
      const moves = [];
      for (let ty = 0; ty < 10; ty++) {
        for (let tx = 0; tx < 9; tx++) {
          if (tx === fromX && ty === fromY) continue;
          if (isValidMove(fromX, fromY, tx, ty)) {
            const target = board[ty][tx];
            moves.push({ x: tx, y: ty, capture: !!target });
          }
        }
      }
      return moves;
    };

    // 验证移动是否合法（简化版）
    const isValidMove = (fromX, fromY, toX, toY) => {
      const piece = board[fromY][fromX];
      const target = board[toY][toX];
      
      // 不能吃自己的棋子
      if (target && target[0] === piece[0]) return false;

      const type = piece[1];
      const dx = Math.abs(toX - fromX);
      const dy = Math.abs(toY - fromY);

      // 简化的走法规则
      switch (type) {
        case 'j': // 将/帅
          // 只能在九宫内移动一格
          if (dx + dy !== 1) return false;
          if (piece[0] === 'r' && (toY < 7 || toX < 3 || toX > 5)) return false;
          if (piece[0] === 'b' && (toY > 2 || toX < 3 || toX > 5)) return false;
          return true;
        
        case 's': // 士
          // 斜走一格，不出九宫
          if (dx !== 1 || dy !== 1) return false;
          if (piece[0] === 'r' && (toY < 7 || toX < 3 || toX > 5)) return false;
          if (piece[0] === 'b' && (toY > 2 || toX < 3 || toX > 5)) return false;
          return true;
        
        case 'x': // 象
          // 田字格走法
          if (dx !== 2 || dy !== 2) return false;
          // 象眼不能被堵
          if (board[fromY + (toY - fromY) / 2][fromX + (toX - fromX) / 2]) return false;
          // 不能过河
          if (piece[0] === 'r' && toY < 5) return false;
          if (piece[0] === 'b' && toY > 4) return false;
          return true;
        
        case 'z': // 卒/兵
          // 过河前只能前进
          if (piece[0] === 'r') {
            if (fromY > 4) { // 未过河
              return dx === 0 && toY === fromY - 1;
            } else { // 过河了
              return (dx === 1 && dy === 0) || (dx === 0 && dy === 1 && toY < fromY);
            }
          } else {
            if (fromY < 5) { // 未过河
              return dx === 0 && toY === fromY + 1;
            } else { // 过河了
              return (dx === 1 && dy === 0) || (dx === 0 && dy === 1 && toY > fromY);
            }
          }
        
        case 'm': // 马
          // 日字格走法
          if (!((dx === 1 && dy === 2) || (dx === 2 && dy === 1))) return false;
          // 马腿不能被堵
          if (dx === 1) {
            if (board[fromY + (toY > fromY ? 1 : -1)][fromX]) return false;
          } else {
            if (board[fromY][fromX + (toX > fromX ? 1 : -1)]) return false;
          }
          return true;
        
        case 'c': // 车
          // 直线走
          if (dx !== 0 && dy !== 0) return false;
          // 检查路径是否有障碍
          if (dx === 0) {
            const step = toY > fromY ? 1 : -1;
            for (let y = fromY + step; y !== toY; y += step) {
              if (board[y][fromX]) return false;
            }
          } else {
            const step = toX > fromX ? 1 : -1;
            for (let x = fromX + step; x !== toX; x += step) {
              if (board[fromY][x]) return false;
            }
          }
          return true;
        
        case 'p': // 炮
          // 直线走
          if (dx !== 0 && dy !== 0) return false;
          // 计算中间有多少个棋子
          let count = 0;
          if (dx === 0) {
            const step = toY > fromY ? 1 : -1;
            for (let y = fromY + step; y !== toY; y += step) {
              if (board[y][fromX]) count++;
            }
          } else {
            const step = toX > fromX ? 1 : -1;
            for (let x = fromX + step; x !== toX; x += step) {
              if (board[fromY][x]) count++;
            }
          }
          // 移动时中间不能有棋子，吃子时中间必须有一个棋子
          if (target) {
            return count === 1;
          } else {
            return count === 0;
          }
        
        default:
          return false;
      }
    };

    // 执行移动
    const makeMove = (fromX, fromY, toX, toY) => {
      const piece = board[fromY][fromX];
      const capturedPiece = board[toY][toX];
      
      // 移动棋子
      board[toY][toX] = piece;
      board[fromY][fromX] = 0;
      
      // 记录移动
      const move = {
        from: { x: fromX, y: fromY },
        to: { x: toX, y: toY },
        piece: piece,
        captured: capturedPiece,
        player: currentPlayer,
      };
      setMoveHistory(prev => [...prev, move]);

      // 播放音效
      playSound(capturedPiece ? 'click' : 'select');

      // 检查是否将军/将死
      if (capturedPiece && (capturedPiece === 'rj' || capturedPiece === 'bj')) {
        setGameStatus('checkmate');
        setTimeout(() => {
          alert(`${currentPlayer === 'r' ? '红方' : '黑方'}获胜！`);
        }, 100);
        return;
      }

      // 切换玩家
      currentPlayer = currentPlayer === 'r' ? 'b' : 'r';
      setCurrentTurn(currentPlayer === 'r' ? 'red' : 'black');

      // 发送移动到服务器（在线对战）
      if (gameMode === 'matchmaking' || gameMode === 'room') {
        wsService.send({
          type: 'CHESS_MOVE',
          payload: {
            from: { x: fromX, y: fromY },
            to: { x: toX, y: toY },
          },
        });
      }

      // AI移动（人机对战）
      if (gameMode === 'training' && currentPlayer !== mySide[0]) {
        setTimeout(() => {
          makeAIMove();
        }, 800);
      }

      drawBoard();
    };

    // AI移动（Alpha-Beta搜索 + 启发式评估）
    const makeAIMove = () => {
      const MAX_DEPTH = 3; // 可按性能调节
      const aiSide = currentPlayer; // 轮到谁就是AI控制谁

      const best = findBestMoveAlphaBeta(board, aiSide, MAX_DEPTH);
      if (best && best.move) {
        makeMove(best.move.from.x, best.move.from.y, best.move.to.x, best.move.to.y);
      }
    };

    // 评估函数（红方为正，黑方为负）
    const evaluateBoard = (bd) => {
      const base = { j: 10000, c: 900, m: 400, p: 450, x: 250, s: 250, z: 100 };
      let score = 0;
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 9; x++) {
          const pc = bd[y][x];
          if (!pc) continue;
          let val = base[pc[1]] || 0;
          // 位置启发：兵(卒)过河加分，提高攻势
          if (pc[1] === 'z') {
            if (pc[0] === 'r' && y < 5) val += 80;
            if (pc[0] === 'b' && y > 4) val += 80;
          }
          score += pc[0] === 'r' ? val : -val;
        }
      }
      return score;
    };

    const cloneBoard = (bd) => JSON.parse(JSON.stringify(bd));

    const generateMoves = (bd, side) => {
      const moves = [];
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 9; x++) {
          const pc = bd[y][x];
          if (!pc || pc[0] !== side) continue;
          for (let ty = 0; ty < 10; ty++) {
            for (let tx = 0; tx < 9; tx++) {
              if (isValidMoveWithBoard(bd, x, y, tx, ty)) {
                const target = bd[ty][tx];
                const captureScore = target ? (target[1] === 'j' ? 10000 : 10) : 0;
                moves.push({ from: { x, y }, to: { x: tx, y: ty }, captureScore });
              }
            }
          }
        }
      }
      // 简单走法排序：优先吃子
      moves.sort((a, b) => b.captureScore - a.captureScore);
      return moves;
    };

    // 在搜索中使用的合法校验，基于传入棋盘
    const isValidMoveWithBoard = (bd, fromX, fromY, toX, toY) => {
      const piece = bd[fromY][fromX];
      const target = bd[toY][toX];
      if (!piece) return false;
      if (target && target[0] === piece[0]) return false;

      // 为复用现有规则，临时替换全局引用
      const saved = board;
      board = bd;
      const ok = isValidMove(fromX, fromY, toX, toY);
      board = saved;
      return ok;
    };

    const doMove = (bd, mv) => {
      const next = cloneBoard(bd);
      next[mv.to.y][mv.to.x] = next[mv.from.y][mv.from.x];
      next[mv.from.y][mv.from.x] = 0;
      return next;
    };

    const otherSide = (s) => (s === 'r' ? 'b' : 'r');

    const findBestMoveAlphaBeta = (bd, side, depth) => {
      const alphaBeta = (boardNode, d, alpha, beta, maximizing, sideToMove) => {
        if (d === 0) return { score: evaluateBoard(boardNode) };
        const moves = generateMoves(boardNode, sideToMove);
        if (moves.length === 0) return { score: evaluateBoard(boardNode) };

        let bestMove = null;
        if (maximizing) {
          let value = -Infinity;
          for (const mv of moves) {
            const child = doMove(boardNode, mv);
            const result = alphaBeta(child, d - 1, alpha, beta, false, otherSide(sideToMove));
            if (result.score > value) {
              value = result.score;
              bestMove = mv;
            }
            alpha = Math.max(alpha, value);
            if (alpha >= beta) break; // 剪枝
          }
          return { score: value, move: bestMove };
        } else {
          let value = Infinity;
          for (const mv of moves) {
            const child = doMove(boardNode, mv);
            const result = alphaBeta(child, d - 1, alpha, beta, true, otherSide(sideToMove));
            if (result.score < value) {
              value = result.score;
              bestMove = mv;
            }
            beta = Math.min(beta, value);
            if (alpha >= beta) break; // 剪枝
          }
          return { score: value, move: bestMove };
        }
      };

      const maximizing = side === 'r'; // 红方最大化，黑方最小化（因评估为红正黑负）
      return alphaBeta(bd, depth, -Infinity, Infinity, maximizing, side);
    };

    // 播放音效
    const playSound = (type) => {
      try {
        const audio = new Audio(`/chess-audio/${type}.wav`);
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch (e) {}
    };

    // 悔棋
    const undoMove = () => {
      if (moveHistory.length === 0) return;
      
      const lastMove = moveHistory[moveHistory.length - 1];
      board[lastMove.from.y][lastMove.from.x] = lastMove.piece;
      board[lastMove.to.y][lastMove.to.x] = lastMove.captured || 0;
      
      currentPlayer = lastMove.player;
      setCurrentTurn(currentPlayer === 'r' ? 'red' : 'black');
      setMoveHistory(prev => prev.slice(0, -1));
      
      selectedPiece = null;
      drawBoard();
    };

    // 重新开始
    const restart = () => {
      board = JSON.parse(JSON.stringify(initialBoard));
      selectedPiece = null;
      currentPlayer = 'r';
      setCurrentTurn('red');
      setMoveHistory([]);
      setGameStatus('playing');
      drawBoard();
    };

    canvas.addEventListener('click', handleClick);

    // 存储游戏实例
    gameInstanceRef.current = {
      undoMove,
      restart,
      makeOpponentMove: (from, to) => {
        makeMove(from.x, from.y, to.x, to.y);
      },
      triggerAIMove: () => {
        if (currentPlayer !== mySide[0]) {
          makeAIMove();
        }
      },
      cleanup: () => {
        canvas.removeEventListener('click', handleClick);
      },
    };

    // 初始绘制
    if (imagesLoaded) {
      drawBoard();
    }
  };

  const handleUndo = () => {
    if (gameInstanceRef.current) {
      gameInstanceRef.current.undoMove();
    }
  };

  const handleRestart = () => {
    if (window.confirm('确定要重新开始吗？')) {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.restart();
      }
    }
  };

  const handleBackToLobby = () => {
    navigateTo('chess-lobby');
  };

  const handleGameOver = (winner, reason) => {
    setGameStatus('checkmate');
    alert(`游戏结束：${winner === mySide ? '你' : '对手'}获胜！`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full relative overflow-auto"
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      }}
    >
      {/* 头部 */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        darkMode ? 'border-slate-700 bg-slate-800/90' : 'border-red-900/20 bg-red-50/90'
      }`}>
        <button
          onClick={handleBackToLobby}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-slate-700' : 'hover:bg-red-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">返回大厅</span>
        </button>

        <div className="text-center">
          <div className={`text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-900'}`}
            style={{ fontFamily: 'STKaiti, KaiTi, serif' }}
          >
            中国象棋
          </div>
          {roomCode && (
            <div className="text-xs text-slate-500">房间: {roomCode}</div>
          )}
        </div>

        <button
          onClick={() => setShowControls(!showControls)}
          className={`px-3 py-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-slate-700' : 'hover:bg-red-100'
          }`}
        >
          <Home className="w-5 h-5" />
        </button>
      </div>

      {/* 游戏容器 */}
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-60px)]">
        {/* 当前回合提示 */}
        <div className={`mb-4 px-6 py-3 rounded-xl shadow-lg ${
          darkMode ? 'bg-slate-700' : 'bg-white'
        }`}>
          <div className="text-center">
            <div className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}
              style={{ fontFamily: 'STKaiti, KaiTi, serif' }}
            >
              {currentTurn === 'red' ? '红方回合' : '黑方回合'}
            </div>
            {gameMode !== 'training' && (
              <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {currentTurn === mySide ? '你的回合' : `${opponent?.username || '对手'}的回合`}
              </div>
            )}
          </div>
        </div>

        {/* 棋盘Canvas */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${
          darkMode ? 'border-4 border-slate-700' : 'border-4 border-amber-900/30'
        }`}>
          <canvas 
            ref={canvasRef}
            className="cursor-pointer"
            style={{ 
              display: 'block',
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>

        {/* 控制按钮 */}
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex gap-3"
          >
            <button
              onClick={handleUndo}
              disabled={moveHistory.length === 0 || gameMode !== 'training'}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode 
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  : 'bg-white text-slate-800 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              悔棋
            </button>

            <button
              onClick={handleRestart}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105 ${
                darkMode 
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  : 'bg-white text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              重新开始
            </button>
          </motion.div>
        )}

        {/* 移动历史（可选） */}
        {moveHistory.length > 0 && (
          <div className={`mt-4 w-full max-w-md p-4 rounded-xl ${
            darkMode ? 'bg-slate-800' : 'bg-white/80'
          }`}>
            <div className={`text-sm font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
              style={{ fontFamily: 'STKaiti, KaiTi, serif' }}
            >
              走棋记录
            </div>
            <div className="max-h-32 overflow-y-auto text-xs space-y-1">
              {moveHistory.slice(-10).map((move, index) => (
                <div key={index} className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                  {moveHistory.length - 10 + index + 1}. {move.player === 'r' ? '红' : '黑'}方: 
                  ({move.from.x},{move.from.y}) → ({move.to.x},{move.to.y})
                  {move.captured && ' (吃子)'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ChessGameScreen;

