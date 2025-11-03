/**
 * 建筑聊天服务
 * 管理建筑内的聊天频道
 */

const BUILDING_CHAT_KEY = 'seer_building_chat_v1';
const BUILDING_USERS_KEY = 'seer_building_users_v1';

function loadChats() {
  try {
    const raw = localStorage.getItem(BUILDING_CHAT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveChats(chats) {
  localStorage.setItem(BUILDING_CHAT_KEY, JSON.stringify(chats));
}

function loadBuildingUsers() {
  try {
    const raw = localStorage.getItem(BUILDING_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveBuildingUsers(users) {
  localStorage.setItem(BUILDING_USERS_KEY, JSON.stringify(users));
}

function now() {
  return Date.now();
}

const BuildingChatService = {
  /**
   * 进入建筑
   */
  enterBuilding(buildingId, userId, username, avatar) {
    const users = loadBuildingUsers();
    if (!users[buildingId]) {
      users[buildingId] = [];
    }
    
    // 移除旧的用户记录（如果存在）
    users[buildingId] = users[buildingId].filter(u => u.userId !== userId);
    
    // 添加新的用户记录
    users[buildingId].push({
      userId,
      username,
      avatar,
      enteredAt: now(),
    });
    
    saveBuildingUsers(users);
    
    // 发送系统消息
    this.addSystemMessage(buildingId, `${username} 进入了建筑`);
  },

  /**
   * 离开建筑
   */
  leaveBuilding(buildingId, userId, username) {
    const users = loadBuildingUsers();
    if (users[buildingId]) {
      users[buildingId] = users[buildingId].filter(u => u.userId !== userId);
      saveBuildingUsers(users);
      
      // 发送系统消息
      this.addSystemMessage(buildingId, `${username} 离开了建筑`);
    }
  },

  /**
   * 获取建筑内的用户列表
   */
  getBuildingUsers(buildingId) {
    const users = loadBuildingUsers();
    const buildingUsers = users[buildingId] || [];
    
    // 清理超过2小时的用户
    const twoHoursAgo = now() - 2 * 60 * 60 * 1000;
    const activeUsers = buildingUsers.filter(u => u.enteredAt > twoHoursAgo);
    
    if (activeUsers.length !== buildingUsers.length) {
      users[buildingId] = activeUsers;
      saveBuildingUsers(users);
    }
    
    return activeUsers;
  },

  /**
   * 获取建筑聊天消息
   */
  getMessages(buildingId, limit = 100) {
    const chats = loadChats();
    const messages = chats[buildingId] || [];
    return messages.slice(-limit);
  },

  /**
   * 发送消息
   */
  sendMessage(buildingId, userId, username, avatar, content, type = 'text', metadata = {}) {
    const chats = loadChats();
    if (!chats[buildingId]) {
      chats[buildingId] = [];
    }

    const message = {
      id: `msg_${now()}_${Math.random().toString(36).substr(2, 9)}`,
      buildingId,
      userId,
      username,
      avatar,
      content,
      type, // text, image, link, game_invite
      metadata,
      timestamp: now(),
    };

    chats[buildingId].push(message);
    
    // 只保留最近500条消息
    if (chats[buildingId].length > 500) {
      chats[buildingId] = chats[buildingId].slice(-500);
    }

    saveChats(chats);
    return message;
  },

  /**
   * 发送游戏邀请
   */
  sendGameInvite(buildingId, userId, username, avatar, gameName, gameType, roomCode) {
    return this.sendMessage(
      buildingId,
      userId,
      username,
      avatar,
      `邀请你一起玩 ${gameName}`,
      'game_invite',
      { gameName, gameType, roomCode }
    );
  },

  /**
   * 发送链接
   */
  sendLink(buildingId, userId, username, avatar, url, title, description) {
    return this.sendMessage(
      buildingId,
      userId,
      username,
      avatar,
      url,
      'link',
      { title, description }
    );
  },

  /**
   * 添加系统消息
   */
  addSystemMessage(buildingId, content) {
    const chats = loadChats();
    if (!chats[buildingId]) {
      chats[buildingId] = [];
    }

    const message = {
      id: `sys_${now()}_${Math.random().toString(36).substr(2, 9)}`,
      buildingId,
      userId: 'system',
      username: '系统',
      avatar: null,
      content,
      type: 'system',
      metadata: {},
      timestamp: now(),
    };

    chats[buildingId].push(message);
    
    if (chats[buildingId].length > 500) {
      chats[buildingId] = chats[buildingId].slice(-500);
    }

    saveChats(chats);
    return message;
  },

  /**
   * 清除建筑聊天历史
   */
  clearBuildingChat(buildingId) {
    const chats = loadChats();
    delete chats[buildingId];
    saveChats(chats);
  },

  /**
   * 获取所有建筑的用户统计
   */
  getAllBuildingsUserCount() {
    const users = loadBuildingUsers();
    const counts = {};
    
    Object.keys(users).forEach(buildingId => {
      const activeUsers = this.getBuildingUsers(buildingId);
      counts[buildingId] = activeUsers.length;
    });
    
    return counts;
  },
};

export default BuildingChatService;

