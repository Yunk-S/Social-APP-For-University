/**
 * 消息服务 - 处理消息持久化、历史记录、搜索等
 */

class MessageService {
  constructor() {
    this.dbName = 'SEER_Messages';
    this.dbVersion = 1;
    this.db = null;
  }

  /**
   * 初始化 IndexedDB
   */
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 消息存储
        if (!db.objectStoreNames.contains('messages')) {
          const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
          messageStore.createIndex('conversationId', 'conversationId', { unique: false });
          messageStore.createIndex('timestamp', 'timestamp', { unique: false });
          messageStore.createIndex('senderId', 'senderId', { unique: false });
        }

        // 会话存储
        if (!db.objectStoreNames.contains('conversations')) {
          const convStore = db.createObjectStore('conversations', { keyPath: 'id' });
          convStore.createIndex('lastMessageTime', 'lastMessageTime', { unique: false });
          convStore.createIndex('isPinned', 'isPinned', { unique: false });
        }

        // 草稿存储
        if (!db.objectStoreNames.contains('drafts')) {
          db.createObjectStore('drafts', { keyPath: 'conversationId' });
        }
      };
    });
  }

  /**
   * 保存消息
   */
  async saveMessage(message) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readwrite');
      const store = transaction.objectStore('messages');
      const request = store.put(message);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 批量保存消息
   */
  async saveMessages(messages) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readwrite');
      const store = transaction.objectStore('messages');

      messages.forEach(msg => store.put(msg));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * 获取会话的历史消息
   */
  async getMessages(conversationId, limit = 50, beforeTimestamp = null) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readonly');
      const store = transaction.objectStore('messages');
      const index = store.index('conversationId');
      const range = IDBKeyRange.only(conversationId);
      const request = index.openCursor(range, 'prev');

      const messages = [];
      let count = 0;

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && count < limit) {
          const message = cursor.value;
          
          // 如果指定了 beforeTimestamp，只获取之前的消息
          if (!beforeTimestamp || message.timestamp < beforeTimestamp) {
            messages.push(message);
            count++;
          }
          
          cursor.continue();
        } else {
          resolve(messages.reverse()); // 返回正序
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 搜索消息
   */
  async searchMessages(conversationId, keyword) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readonly');
      const store = transaction.objectStore('messages');
      const index = store.index('conversationId');
      const range = IDBKeyRange.only(conversationId);
      const request = index.openCursor(range);

      const results = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const message = cursor.value;
          
          // 搜索文本消息内容
          if (message.type === 'text' && 
              message.content.toLowerCase().includes(keyword.toLowerCase())) {
            results.push(message);
          }
          
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 删除消息
   */
  async deleteMessage(messageId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readwrite');
      const store = transaction.objectStore('messages');
      const request = store.delete(messageId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 更新消息（用于编辑）
   */
  async updateMessage(messageId, updates) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readwrite');
      const store = transaction.objectStore('messages');
      const getRequest = store.get(messageId);

      getRequest.onsuccess = () => {
        const message = getRequest.result;
        if (message) {
          Object.assign(message, updates);
          const putRequest = store.put(message);
          putRequest.onsuccess = () => resolve(message);
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Message not found'));
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * 保存会话信息
   */
  async saveConversation(conversation) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');
      const request = store.put(conversation);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 获取所有会话
   */
  async getConversations() {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readonly');
      const store = transaction.objectStore('conversations');
      const index = store.index('lastMessageTime');
      const request = index.openCursor(null, 'prev');

      const conversations = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          conversations.push(cursor.value);
          cursor.continue();
        } else {
          resolve(conversations);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 更新会话未读数
   */
  async updateUnreadCount(conversationId, count) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');
      const getRequest = store.get(conversationId);

      getRequest.onsuccess = () => {
        const conversation = getRequest.result;
        if (conversation) {
          conversation.unreadCount = count;
          const putRequest = store.put(conversation);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve(); // 会话不存在，忽略
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * 保存草稿
   */
  async saveDraft(conversationId, content) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['drafts'], 'readwrite');
      const store = transaction.objectStore('drafts');
      const request = store.put({
        conversationId,
        content,
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 获取草稿
   */
  async getDraft(conversationId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['drafts'], 'readonly');
      const store = transaction.objectStore('drafts');
      const request = store.get(conversationId);

      request.onsuccess = () => resolve(request.result?.content || '');
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 清除草稿
   */
  async clearDraft(conversationId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['drafts'], 'readwrite');
      const store = transaction.objectStore('drafts');
      const request = store.delete(conversationId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 清空会话的所有消息
   */
  async clearConversation(conversationId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readwrite');
      const store = transaction.objectStore('messages');
      const index = store.index('conversationId');
      const range = IDBKeyRange.only(conversationId);
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 获取消息统计
   */
  async getMessageStats(conversationId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readonly');
      const store = transaction.objectStore('messages');
      const index = store.index('conversationId');
      const range = IDBKeyRange.only(conversationId);
      const request = index.openCursor(range);

      const stats = {
        total: 0,
        text: 0,
        image: 0,
        video: 0,
        voice: 0,
        file: 0
      };

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const message = cursor.value;
          stats.total++;
          if (stats[message.type] !== undefined) {
            stats[message.type]++;
          }
          cursor.continue();
        } else {
          resolve(stats);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
}

const messageService = new MessageService();
export default messageService;

