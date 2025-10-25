/**
 * Mock WebSocket Service for Gomoku Online Gameplay
 * 模拟WebSocket服务 - 用于演示在线对战功能
 * 
 * INTEGRATION GUIDE FOR REAL WEBSOCKET SERVER:
 * ============================================
 * 
 * 1. Replace this mock class with a real WebSocket connection:
 *    const ws = new WebSocket('ws://your-server.com:8080/gomoku');
 * 
 * 2. Message Protocol Specification:
 *    
 *    Client → Server:
 *    ----------------
 *    { type: 'FIND_MATCH', payload: { username, authToken } }
 *    { type: 'JOIN_ROOM', payload: { roomCode, username, authToken } }
 *    { type: 'CREATE_ROOM', payload: { username, authToken } }
 *    { type: 'MAKE_MOVE', payload: { x, y, player, timestamp, gameId } }
 *    { type: 'SURRENDER', payload: { gameId, player } }
 *    { type: 'REQUEST_DRAW', payload: { gameId, player } }
 *    { type: 'LEAVE_GAME', payload: { gameId, player } }
 *    
 *    Server → Client:
 *    ----------------
 *    { type: 'MATCH_FOUND', payload: { opponent, gameId, yourColor: 'black'|'white' } }
 *    { type: 'ROOM_CREATED', payload: { roomCode, gameId } }
 *    { type: 'ROOM_JOINED', payload: { opponent, gameId, yourColor } }
 *    { type: 'MOVE_MADE', payload: { x, y, player, timestamp } }
 *    { type: 'GAME_OVER', payload: { winner, reason: 'win'|'surrender'|'draw' } }
 *    { type: 'OPPONENT_DISCONNECTED', payload: { reconnectTimeout: 60 } }
 *    { type: 'OPPONENT_RECONNECTED', payload: {} }
 *    { type: 'ERROR', payload: { code: 'ROOM_NOT_FOUND', message: '...' } }
 * 
 * 3. Error Codes:
 *    - INVALID_CREDENTIALS: Auth token invalid or expired
 *    - ROOM_NOT_FOUND: Room code doesn't exist
 *    - ROOM_FULL: Room already has 2 players
 *    - MATCH_FAILED: No opponents available
 *    - INVALID_MOVE: Move not allowed
 *    - CONNECTION_LOST: WebSocket disconnected
 *    - TIMEOUT: Player took too long to move
 * 
 * 4. Backend Implementation Notes:
 *    - Use Socket.io or ws library for Node.js
 *    - Maintain game rooms in Redis or in-memory Map
 *    - Validate all moves on server side
 *    - Implement reconnection logic with 60s timeout
 *    - Store game history for replay/analysis
 */

class MockWebSocketService {
  constructor() {
    this.connected = false;
    this.eventHandlers = {
      onConnect: null,
      onDisconnect: null,
      onMessage: null,
      onError: null,
    };
    this.mockOnlinePlayers = 237; // Simulated online player count
    this.activeRooms = new Map(); // Room code -> { players: [], gameId }
  }

  /**
   * Connect to the mock WebSocket server
   * In real implementation: ws.connect(url)
   */
  connect() {
    // Simulate connection delay
    setTimeout(() => {
      this.connected = true;
      if (this.eventHandlers.onConnect) {
        this.eventHandlers.onConnect();
      }
    }, 500);
  }

  /**
   * Disconnect from the server
   */
  disconnect() {
    this.connected = false;
    if (this.eventHandlers.onDisconnect) {
      this.eventHandlers.onDisconnect();
    }
  }

  /**
   * Send a message to the server
   * In real implementation: ws.send(JSON.stringify(message))
   */
  send(message) {
    if (!this.connected) {
      this.handleError({ code: 'CONNECTION_LOST', message: 'Not connected to server' });
      return;
    }

    // Handle different message types
    switch (message.type) {
      case 'FIND_MATCH':
        this.handleFindMatch(message.payload);
        break;
      case 'CREATE_ROOM':
        this.handleCreateRoom(message.payload);
        break;
      case 'JOIN_ROOM':
        this.handleJoinRoom(message.payload);
        break;
      case 'MAKE_MOVE':
        this.handleMove(message.payload);
        break;
      case 'SURRENDER':
        this.handleSurrender(message.payload);
        break;
      case 'REQUEST_DRAW':
        this.handleDrawRequest(message.payload);
        break;
      default:
        this.handleError({ code: 'UNKNOWN_MESSAGE_TYPE', message: `Unknown message type: ${message.type}` });
    }
  }

  /**
   * Register event handlers
   */
  on(event, handler) {
    if (this.eventHandlers[event] !== undefined) {
      this.eventHandlers[event] = handler;
    }
  }

  /**
   * Provide an explicit off API for safety in components
   */
  off(event) {
    if (this.eventHandlers[event] !== undefined) {
      this.eventHandlers[event] = null;
    }
  }

  /**
   * Mock: Handle matchmaking request
   */
  handleFindMatch(payload) {
    // Simulate matchmaking delay (2-5 seconds)
    const delay = 2000 + Math.random() * 3000;
    
    setTimeout(() => {
      // Check if still connected
      if (!this.connected) return;

      // Randomly decide if match found (90% success rate for demo)
      if (Math.random() < 0.9) {
        const mockOpponent = {
          username: this.generateMockUsername(),
          rating: Math.floor(1000 + Math.random() * 1000),
        };

        const gameId = this.generateGameId();
        const yourColor = Math.random() < 0.5 ? 'black' : 'white';

        this.handleMessage({
          type: 'MATCH_FOUND',
          payload: {
            opponent: mockOpponent,
            gameId,
            yourColor,
          },
        });
      } else {
        this.handleError({ code: 'MATCH_FAILED', message: 'No opponents available. Please try again.' });
      }
    }, delay);
  }

  /**
   * Mock: Create a room
   */
  handleCreateRoom(payload) {
    const roomCode = this.generateRoomCode();
    const gameId = this.generateGameId();

    this.activeRooms.set(roomCode, {
      players: [payload.username],
      gameId,
      creator: payload.username,
    });

    setTimeout(() => {
      this.handleMessage({
        type: 'ROOM_CREATED',
        payload: { roomCode, gameId },
      });
    }, 300);
  }

  /**
   * Mock: Join a room
   */
  handleJoinRoom(payload) {
    const { roomCode, username } = payload;

    setTimeout(() => {
      // Validate room code format
      if (!/^[A-Z0-9]{6}$/.test(roomCode)) {
        this.handleError({ code: 'INVALID_ROOM_CODE', message: 'Room code must be 6 alphanumeric characters' });
        return;
      }

      const room = this.activeRooms.get(roomCode);

      if (!room) {
        // For demo purposes, auto-create room if it doesn't exist
        const gameId = this.generateGameId();
        this.activeRooms.set(roomCode, {
          players: [username],
          gameId,
          creator: username,
        });

        this.handleMessage({
          type: 'ROOM_WAITING',
          payload: { roomCode, gameId, message: 'Waiting for opponent...' },
        });

        // Simulate opponent joining after a delay
        setTimeout(() => {
          const opponent = { username: this.generateMockUsername() };
          this.handleMessage({
            type: 'ROOM_JOINED',
            payload: {
              opponent,
              gameId,
              yourColor: 'black', // Creator is always black
            },
          });
        }, 3000 + Math.random() * 3000);
        return;
      }

      if (room.players.length >= 2) {
        this.handleError({ code: 'ROOM_FULL', message: 'This room is already full' });
        return;
      }

      // Join existing room
      room.players.push(username);
      const opponent = { username: room.creator };
      const yourColor = Math.random() < 0.5 ? 'black' : 'white';

      this.handleMessage({
        type: 'ROOM_JOINED',
        payload: {
          opponent,
          gameId: room.gameId,
          yourColor,
        },
      });
    }, 500);
  }

  /**
   * Mock: Handle a move
   */
  handleMove(payload) {
    // Echo the move back (in real implementation, server validates and broadcasts)
    setTimeout(() => {
      this.handleMessage({
        type: 'MOVE_MADE',
        payload,
      });
    }, 100);
  }

  /**
   * Mock: Handle surrender
   */
  handleSurrender(payload) {
    setTimeout(() => {
      this.handleMessage({
        type: 'GAME_OVER',
        payload: {
          winner: payload.player === 'black' ? 'white' : 'black',
          reason: 'surrender',
        },
      });
    }, 200);
  }

  /**
   * Mock: Handle draw request
   */
  handleDrawRequest(payload) {
    // Simulate opponent accepting draw (70% of the time)
    setTimeout(() => {
      if (Math.random() < 0.7) {
        this.handleMessage({
          type: 'GAME_OVER',
          payload: {
            winner: null,
            reason: 'draw',
          },
        });
      } else {
        this.handleMessage({
          type: 'DRAW_DECLINED',
          payload: { message: 'Opponent declined draw request' },
        });
      }
    }, 1000);
  }

  /**
   * Handle incoming messages from server
   */
  handleMessage(message) {
    if (this.eventHandlers.onMessage) {
      this.eventHandlers.onMessage(message);
    }
  }

  /**
   * Handle errors
   */
  handleError(error) {
    if (this.eventHandlers.onError) {
      this.eventHandlers.onError(error);
    }
  }

  /**
   * Get mock online player count
   */
  getOnlinePlayerCount() {
    return this.mockOnlinePlayers;
  }

  /**
   * Generate a random 6-character room code
   */
  generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Generate a unique game ID
   */
  generateGameId() {
    return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a random mock username
   */
  generateMockUsername() {
    const adjectives = ['Swift', 'Clever', 'Brave', 'Wise', 'Silent', 'Golden', 'Silver', 'Crystal'];
    const nouns = ['Dragon', 'Phoenix', 'Tiger', 'Panda', 'Crane', 'Lotus', 'Bamboo', 'Moon'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj}${noun}${Math.floor(Math.random() * 100)}`;
  }
}

// Export singleton instance
export default new MockWebSocketService();

/**
 * EXAMPLE USAGE:
 * 
 * import wsService from './mockWebSocket';
 * 
 * // Set up event handlers
 * wsService.on('onConnect', () => console.log('Connected'));
 * wsService.on('onMessage', (msg) => handleServerMessage(msg));
 * wsService.on('onError', (err) => console.error(err));
 * 
 * // Connect
 * wsService.connect();
 * 
 * // Find a match
 * wsService.send({
 *   type: 'FIND_MATCH',
 *   payload: { username: 'Player1', authToken: 'abc123' }
 * });
 * 
 * // Make a move
 * wsService.send({
 *   type: 'MAKE_MOVE',
 *   payload: { x: 7, y: 7, player: 'black', timestamp: new Date().toISOString() }
 * });
 */

