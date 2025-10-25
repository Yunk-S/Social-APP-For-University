/**
 * WebSocket 实时通讯服务
 * 用于替代 mockWebSocket，提供真实的 WebSocket 连接
 * 
 * 功能包括：
 * - 自动重连
 * - 心跳检测
 * - 消息队列（离线时缓存）
 * - 事件订阅/发布
 */

class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.heartbeatInterval = null;
    this.messageQueue = [];
    this.listeners = new Map();
    this.isConnected = false;
    this.authToken = null;
    this.userId = null;
  }

  /**
   * 初始化连接
   */
  connect(userId, authToken) {
    this.userId = userId;
    this.authToken = authToken;

    try {
      this.ws = new WebSocket(`${this.url}?userId=${userId}&token=${authToken}`);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * 连接成功处理
   */
  handleOpen(event) {
    console.log('WebSocket connected');
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    // 开始心跳
    this.startHeartbeat();
    
    // 发送缓存的消息
    this.flushMessageQueue();
    
    // 触发连接成功事件
    this.emit('connected', { userId: this.userId });
  }

  /**
   * 接收消息处理
   */
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      
      // 根据消息类型分发事件
      switch (data.type) {
        case 'MESSAGE':
          this.emit('message', data.payload);
          break;
        case 'MESSAGE_READ':
          this.emit('messageRead', data.payload);
          break;
        case 'MESSAGE_DELIVERED':
          this.emit('messageDelivered', data.payload);
          break;
        case 'TYPING':
          this.emit('typing', data.payload);
          break;
        case 'ONLINE_STATUS':
          this.emit('onlineStatus', data.payload);
          break;
        case 'GROUP_UPDATE':
          this.emit('groupUpdate', data.payload);
          break;
        case 'MESSAGE_DELETED':
          this.emit('messageDeleted', data.payload);
          break;
        case 'MESSAGE_EDITED':
          this.emit('messageEdited', data.payload);
          break;
        case 'REACTION':
          this.emit('reaction', data.payload);
          break;
        case 'PONG':
          // 心跳响应
          break;
        default:
          console.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  /**
   * 错误处理
   */
  handleError(error) {
    console.error('WebSocket error:', error);
    this.emit('error', error);
  }

  /**
   * 连接关闭处理
   */
  handleClose(event) {
    console.log('WebSocket closed:', event.code, event.reason);
    this.isConnected = false;
    this.stopHeartbeat();
    
    this.emit('disconnected', { code: event.code, reason: event.reason });
    
    // 尝试重连
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  /**
   * 发送消息
   */
  send(type, payload) {
    const message = JSON.stringify({ type, payload, timestamp: Date.now() });
    
    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      // 离线时加入队列
      this.messageQueue.push(message);
      console.warn('Message queued (offline):', type);
    }
  }

  /**
   * 发送文本消息
   */
  sendTextMessage(conversationId, content, replyTo = null) {
    this.send('SEND_MESSAGE', {
      conversationId,
      type: 'text',
      content,
      replyTo,
      clientId: this.generateClientId()
    });
  }

  /**
   * 发送媒体消息（图片/视频/语音/文件）
   */
  sendMediaMessage(conversationId, mediaType, mediaUrl, metadata = {}) {
    this.send('SEND_MESSAGE', {
      conversationId,
      type: mediaType, // 'image', 'video', 'voice', 'file'
      content: mediaUrl,
      metadata, // { duration, size, fileName, thumbnail, etc. }
      clientId: this.generateClientId()
    });
  }

  /**
   * 标记消息已读
   */
  markAsRead(conversationId, messageIds) {
    this.send('MARK_READ', {
      conversationId,
      messageIds
    });
  }

  /**
   * 发送输入中状态
   */
  sendTypingStatus(conversationId, isTyping) {
    this.send('TYPING', {
      conversationId,
      isTyping
    });
  }

  /**
   * 撤回消息
   */
  deleteMessage(conversationId, messageId) {
    this.send('DELETE_MESSAGE', {
      conversationId,
      messageId
    });
  }

  /**
   * 编辑消息
   */
  editMessage(conversationId, messageId, newContent) {
    this.send('EDIT_MESSAGE', {
      conversationId,
      messageId,
      newContent
    });
  }

  /**
   * 添加表情反应
   */
  addReaction(conversationId, messageId, emoji) {
    this.send('ADD_REACTION', {
      conversationId,
      messageId,
      emoji
    });
  }

  /**
   * 移除表情反应
   */
  removeReaction(conversationId, messageId, emoji) {
    this.send('REMOVE_REACTION', {
      conversationId,
      messageId,
      emoji
    });
  }

  /**
   * 创建群聊
   */
  createGroup(name, memberIds, avatar = null) {
    this.send('CREATE_GROUP', {
      name,
      memberIds,
      avatar
    });
  }

  /**
   * 邀请成员加入群聊
   */
  inviteToGroup(groupId, userIds) {
    this.send('INVITE_TO_GROUP', {
      groupId,
      userIds
    });
  }

  /**
   * 踢出群成员
   */
  removeFromGroup(groupId, userId) {
    this.send('REMOVE_FROM_GROUP', {
      groupId,
      userId
    });
  }

  /**
   * 更新群公告
   */
  updateGroupAnnouncement(groupId, announcement) {
    this.send('UPDATE_GROUP_ANNOUNCEMENT', {
      groupId,
      announcement
    });
  }

  /**
   * 设置群管理员
   */
  setGroupAdmin(groupId, userId, isAdmin) {
    this.send('SET_GROUP_ADMIN', {
      groupId,
      userId,
      isAdmin
    });
  }

  /**
   * 退出群聊
   */
  leaveGroup(groupId) {
    this.send('LEAVE_GROUP', {
      groupId
    });
  }

  /**
   * 订阅事件
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    // 返回取消订阅函数
    return () => this.off(event, callback);
  }

  /**
   * 取消订阅
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  /**
   * 心跳检测
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send('PING', {});
      }
    }, 30000); // 每30秒发送一次心跳
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * 重连调度
   */
  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.userId && this.authToken) {
        this.connect(this.userId, this.authToken);
      }
    }, delay);
  }

  /**
   * 刷新消息队列
   */
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.ws.send(message);
    }
  }

  /**
   * 生成客户端消息ID
   */
  generateClientId() {
    return `${this.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.messageQueue = [];
  }

  /**
   * 获取连接状态
   */
  getConnectionState() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length
    };
  }
}

// 单例模式
const wsService = new WebSocketService();
export default wsService;

