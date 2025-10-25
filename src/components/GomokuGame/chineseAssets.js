

export const theme = {
  colors: {
    background: '#f7f1e3',
    backgroundGradientStart: '#f7f1e3',
    backgroundGradientEnd: '#e9dcc9',
    boardLine: '#7a5c3a',
    woodDark: '#5a4028',
    accent: '#d6b98a',
    textPrimary: '#7a5c3a',
    textSecondary: '#a67c52',
    cloudPattern: '#d0c1a1',
  },
  fonts: {
    chinese: '"Noto Serif SC", "STSong", "SimSun", serif',
    regular: 'system-ui, sans-serif',
  },
};

// Background SVG with ancient paper texture and cloud patterns
export const backgroundSVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900' viewBox='0 0 1600 900'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%23f7f1e3'/><stop offset='100%' stop-color='%23e9dcc9'/></linearGradient><pattern id='cloud' x='0' y='0' width='200' height='120' patternUnits='userSpaceOnUse'><path d='M20,80 C40,30 80,30 100,70 C120,20 160,20 180,80' fill='none' stroke='%23d0c1a1' stroke-width='3' opacity='0.5'/></pattern></defs><rect width='1600' height='900' fill='url(%23g)'/><rect width='1600' height='900' fill='url(%23cloud)' opacity='0.25'/><rect x='60' y='40' width='1480' height='820' fill='none' stroke='%237a5c3a' stroke-width='8' rx='24' ry='24'/><rect x='46' y='26' width='1508' height='848' fill='none' stroke='%23d6b98a' stroke-width='6' rx='28' ry='28'/></svg>`;

// Victory badge SVG (红色胜字)
export const victoryBadgeSVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><defs><filter id='shadow' x='-20%' y='-20%' width='140%' height='140%'><feDropShadow dx='0' dy='3' stdDeviation='4' flood-opacity='0.4'/></filter></defs><circle cx='128' cy='128' r='112' fill='%23b22222' stroke='%237a0a0a' stroke-width='12' filter='url(%23shadow)'/><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' alignment-baseline='middle' font-size='140' font-family='"Noto Serif SC", serif' fill='%23ffffff'>胜</text><circle cx='128' cy='128' r='120' fill='none' stroke='%23f5e6c8' stroke-width='6' stroke-dasharray='8 12'/></svg>`;

// Defeat badge SVG (灰色负字)
export const defeatBadgeSVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><defs><filter id='shadow' x='-20%' y='-20%' width='140%' height='140%'><feDropShadow dx='0' dy='3' stdDeviation='4' flood-opacity='0.4'/></filter></defs><circle cx='128' cy='128' r='112' fill='%232f3542' stroke='%230f1319' stroke-width='12' filter='url(%23shadow)'/><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' alignment-baseline='middle' font-size='140' font-family='"Noto Serif SC", serif' fill='%23ffffff'>负</text><circle cx='128' cy='128' r='120' fill='none' stroke='%23c7c7c7' stroke-width='6' stroke-dasharray='8 12'/></svg>`;

// Draw badge SVG (平局)
export const drawBadgeSVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><defs><filter id='shadow' x='-20%' y='-20%' width='140%' height='140%'><feDropShadow dx='0' dy='3' stdDeviation='4' flood-opacity='0.4'/></filter></defs><circle cx='128' cy='128' r='112' fill='%23808080' stroke='%23505050' stroke-width='12' filter='url(%23shadow)'/><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' alignment-baseline='middle' font-size='100' font-family='"Noto Serif SC", serif' fill='%23ffffff'>平局</text><circle cx='128' cy='128' r='120' fill='none' stroke='%23e0e0e0' stroke-width='6' stroke-dasharray='8 12'/></svg>`;

// Black stone SVG
export const blackStoneSVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><defs><radialGradient id='g' cx='40%' cy='35%' r='60%'><stop offset='0%' stop-color='%23777'/><stop offset='40%' stop-color='%23222'/><stop offset='100%' stop-color='%23000'/></radialGradient></defs><circle cx='32' cy='32' r='28' fill='url(%23g)'/></svg>`;

// White stone SVG
export const whiteStoneSVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><defs><radialGradient id='g' cx='40%' cy='35%' r='60%'><stop offset='0%' stop-color='%23ffffff'/><stop offset='40%' stop-color='%23e6e6e6'/><stop offset='100%' stop-color='%23bbbbbb'/></radialGradient></defs><circle cx='32' cy='32' r='28' fill='url(%23g)' stroke='%239e9e9e' stroke-width='0.5'/></svg>`;

// Star points on the board (traditional positions for 15x15 board)
export const starPoints = [
  [3, 3], [3, 7], [3, 11],
  [7, 3], [7, 7], [7, 11],
  [11, 3], [11, 7], [11, 11]
];

// Chinese text translations
export const chineseText = {
  lobby: {
    title: '五子棋对战',
    subtitle: '琴棋书画 · 五子连珠',
    matchmaking: '匹配对战',
    matchmakingDesc: '随机匹配在线玩家',
    room: '房间对战',
    roomDesc: '输入房间码进入',
    training: '人机训练',
    trainingDesc: 'AI对战练习',
    onlinePlayers: '在线人数',
    findMatch: '开始匹配',
    enterRoomCode: '输入房间码',
    join: '加入房间',
    selectDifficulty: '选择难度',
    easy: '简单',
    normal: '普通',
    hard: '困难',
    startTraining: '开始训练',
  },
  game: {
    blackPlayer: '黑子',
    whitePlayer: '白子',
    yourTurn: '您的回合',
    opponentTurn: '对方回合',
    thinking: 'AI思考中...',
    history: '对局记录',
    backToLobby: '返回大厅',
    surrender: '认输',
    requestDraw: '求和',
  },
  result: {
    victory: '胜利',
    defeat: '失败',
    draw: '平局',
    totalMoves: '总步数',
    duration: '对局时长',
    playAgain: '再来一局',
    backToLobby: '返回大厅',
  }
};

