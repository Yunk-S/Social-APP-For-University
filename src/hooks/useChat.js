/**
 * 聊天功能 Hook
 * 封装聊天相关的状态和逻辑
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import wsService from '../services/WebSocketService';
import messageService from '../services/MessageService';

export function useChat(conversationId) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!conversationId) return;

    const init = async () => {
      try {
        setIsLoading(true);
        
        // 初始化数据库
        await messageService.initDB();
        
        // 加载历史消息
        const history = await messageService.getMessages(conversationId, 50);
        setMessages(history);
        
        // 连接 WebSocket
        const userId = localStorage.getItem('seer_user_id') || 'demo_user';
        const authToken = localStorage.getItem('seer_auth_token') || 'demo_token';
        
        if (!wsService.isConnected) {
          wsService.connect(userId, authToken);
        }
        
        setIsConnected(wsService.isConnected);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    init();
  }, [conversationId]);

  const sendMessage = useCallback((content, type = 'text', metadata = {}) => {
    if (!conversationId) return;

    const tempMessage = {
      id: `temp_${Date.now()}`,
      conversationId,
      senderId: localStorage.getItem('seer_user_id'),
      content,
      type,
      timestamp: Date.now(),
      isMine: true,
      status: 'sending',
      metadata
    };

    setMessages(prev => [...prev, tempMessage]);

    if (type === 'text') {
      wsService.sendTextMessage(conversationId, content);
    } else {
      wsService.sendMediaMessage(conversationId, type, content, metadata);
    }
  }, [conversationId]);

  return {
    messages,
    isLoading,
    isConnected,
    error,
    sendMessage
  };
}

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        await messageService.initDB();
        const convs = await messageService.getConversations();
        setConversations(convs);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load conversations:', err);
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  return { conversations, isLoading };
}

export function useTypingIndicator(conversationId) {
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef(null);

  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      wsService.sendTypingStatus(conversationId, true);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      wsService.sendTypingStatus(conversationId, false);
    }, 2000);
  }, [conversationId, isTyping]);

  const stopTyping = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsTyping(false);
    wsService.sendTypingStatus(conversationId, false);
  }, [conversationId]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isTyping, startTyping, stopTyping };
}

