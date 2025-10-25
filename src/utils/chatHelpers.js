/**
 * 聊天辅助函数
 */

/**
 * 格式化时间戳
 */
export function formatMessageTime(timestamp, language = 'en') {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  // 今天
  if (diff < oneDay && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // 昨天
  if (diff < 2 * oneDay && date.getDate() === now.getDate() - 1) {
    return language === 'zh' ? '昨天' : 'Yesterday';
  }
  
  // 一周内
  if (diff < oneWeek) {
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
      weekday: 'long'
    });
  }
  
  // 更早
  return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 格式化音视频时长
 */
export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * 检测消息中的链接
 */
export function detectLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

/**
 * 检测消息中的 @ 提及
 */
export function detectMentions(text) {
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

/**
 * 检测消息中的话题标签
 */
export function detectHashtags(text) {
  const hashtagRegex = /#(\w+)/g;
  const hashtags = [];
  let match;
  
  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1]);
  }
  
  return hashtags;
}

/**
 * 高亮关键词
 */
export function highlightKeywords(text, keywords) {
  if (!keywords || keywords.length === 0) return text;
  
  let result = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    result = result.replace(regex, '<mark>$1</mark>');
  });
  
  return result;
}

/**
 * 获取消息预览文本
 */
export function getMessagePreview(message, maxLength = 50) {
  if (message.isDeleted) {
    return '[消息已撤回]';
  }
  
  switch (message.type) {
    case 'text':
      return message.content.length > maxLength
        ? message.content.substring(0, maxLength) + '...'
        : message.content;
    case 'image':
      return '[图片]';
    case 'video':
      return '[视频]';
    case 'voice':
      return '[语音]';
    case 'file':
      return `[文件] ${message.metadata?.fileName || ''}`;
    default:
      return '[消息]';
  }
}

/**
 * 验证消息内容
 */
export function validateMessage(content, type = 'text') {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: '消息不能为空' };
  }
  
  if (type === 'text' && content.length > 5000) {
    return { valid: false, error: '消息长度不能超过5000字符' };
  }
  
  return { valid: true };
}

/**
 * 生成消息通知文本
 */
export function getNotificationText(message, language = 'en') {
  const sender = message.senderName || 'Someone';
  
  switch (message.type) {
    case 'text':
      return message.content;
    case 'image':
      return language === 'zh' ? `${sender} 发送了一张图片` : `${sender} sent a photo`;
    case 'video':
      return language === 'zh' ? `${sender} 发送了一个视频` : `${sender} sent a video`;
    case 'voice':
      return language === 'zh' ? `${sender} 发送了一段语音` : `${sender} sent a voice message`;
    case 'file':
      return language === 'zh' ? `${sender} 发送了一个文件` : `${sender} sent a file`;
    default:
      return language === 'zh' ? `${sender} 发送了一条消息` : `${sender} sent a message`;
  }
}

/**
 * 按日期分组消息
 */
export function groupMessagesByDate(messages, language = 'en') {
  const groups = {};
  
  messages.forEach(message => {
    const date = new Date(message.timestamp);
    const dateKey = date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US');
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(message);
  });
  
  return groups;
}

/**
 * 检查消息是否可撤回（一般2分钟内）
 */
export function canRecallMessage(message, timeLimit = 120000) {
  if (!message.isMine) return false;
  const now = Date.now();
  return (now - message.timestamp) < timeLimit;
}

/**
 * 检查消息是否可编辑
 */
export function canEditMessage(message) {
  return message.isMine && message.type === 'text' && !message.isDeleted;
}

/**
 * 生成消息搜索索引
 */
export function createSearchIndex(messages) {
  return messages.map(msg => ({
    id: msg.id,
    searchText: `${msg.content} ${msg.senderName || ''} ${msg.metadata?.fileName || ''}`.toLowerCase()
  }));
}

/**
 * 搜索消息
 */
export function searchMessages(messages, query) {
  if (!query || query.trim().length === 0) {
    return messages;
  }
  
  const lowerQuery = query.toLowerCase();
  
  return messages.filter(msg => {
    // 搜索文本内容
    if (msg.type === 'text' && msg.content.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // 搜索文件名
    if (msg.metadata?.fileName && msg.metadata.fileName.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // 搜索发送者
    if (msg.senderName && msg.senderName.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    return false;
  });
}

/**
 * 过滤消息类型
 */
export function filterMessagesByType(messages, types) {
  if (!types || types.length === 0) {
    return messages;
  }
  
  return messages.filter(msg => types.includes(msg.type));
}

/**
 * 计算未读消息数
 */
export function getUnreadCount(messages, userId) {
  return messages.filter(msg => 
    msg.senderId !== userId && !msg.isRead
  ).length;
}

/**
 * 标记消息已读
 */
export function markMessagesAsRead(messages, messageIds) {
  return messages.map(msg => 
    messageIds.includes(msg.id)
      ? { ...msg, isRead: true, status: 'read' }
      : msg
  );
}

/**
 * 合并连续的系统消息
 */
export function mergeSystemMessages(messages) {
  const merged = [];
  let systemMsgBuffer = [];
  
  messages.forEach((msg, index) => {
    if (msg.type === 'system') {
      systemMsgBuffer.push(msg);
    } else {
      if (systemMsgBuffer.length > 0) {
        merged.push({
          type: 'system',
          id: `system_${index}`,
          content: systemMsgBuffer.map(m => m.content).join('; '),
          timestamp: systemMsgBuffer[0].timestamp
        });
        systemMsgBuffer = [];
      }
      merged.push(msg);
    }
  });
  
  if (systemMsgBuffer.length > 0) {
    merged.push({
      type: 'system',
      id: `system_end`,
      content: systemMsgBuffer.map(m => m.content).join('; '),
      timestamp: systemMsgBuffer[0].timestamp
    });
  }
  
  return merged;
}

/**
 * 获取消息发送状态文本
 */
export function getStatusText(status, language = 'en') {
  const statusMap = {
    en: {
      sending: 'Sending...',
      sent: 'Sent',
      delivered: 'Delivered',
      read: 'Read',
      failed: 'Failed'
    },
    zh: {
      sending: '发送中...',
      sent: '已发送',
      delivered: '已送达',
      read: '已读',
      failed: '发送失败'
    }
  };
  
  return statusMap[language][status] || status;
}

