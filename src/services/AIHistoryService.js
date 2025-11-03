// Simple localStorage-based history for AI chats and generations

const KEY = 'seer_ai_history_v1';
const GENERATION_KEY = 'seer_ai_generations_v1';

function loadStore() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { conversations: {} };
  } catch {
    return { conversations: {} };
  }
}

function saveStore(store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

function loadGenerations() {
  try {
    const raw = localStorage.getItem(GENERATION_KEY);
    return raw ? JSON.parse(raw) : { images: [], music: [], videos: [] };
  } catch {
    return { images: [], music: [], videos: [] };
  }
}

function saveGenerations(store) {
  localStorage.setItem(GENERATION_KEY, JSON.stringify(store));
}

function now() {
  return new Date().toISOString();
}

export const AIHistoryService = {
  createConversation({ title = 'New chat', model = 'gpt-5' } = {}) {
    const id = `ai_${Date.now()}`;
    const store = loadStore();
    store.conversations[id] = {
      id,
      title,
      model,
      createdAt: now(),
      updatedAt: now(),
      messages: [],
    };
    saveStore(store);
    return id;
  },

  listConversations() {
    const store = loadStore();
    const list = Object.values(store.conversations);
    list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return list.map(({ id, title, model, updatedAt }) => ({ id, title, model, updatedAt }));
  },

  getMessages(conversationId) {
    const store = loadStore();
    return store.conversations[conversationId]?.messages || [];
  },

  appendMessage(conversationId, message) {
    const store = loadStore();
    const conv = store.conversations[conversationId];
    if (!conv) return;
    conv.messages.push({ ...message, timestamp: Date.now() });
    conv.updatedAt = now();
    if (!conv.title && message.role === 'user') {
      conv.title = (message.content || '').slice(0, 20) || 'New chat';
    }
    saveStore(store);
  },

  renameConversation(conversationId, title) {
    const store = loadStore();
    const conv = store.conversations[conversationId];
    if (!conv) return;
    conv.title = title;
    conv.updatedAt = now();
    saveStore(store);
  },

  deleteConversation(conversationId) {
    const store = loadStore();
    delete store.conversations[conversationId];
    saveStore(store);
  },

  // Image generation history
  saveImageGeneration({ prompt, model, params, images }) {
    const store = loadGenerations();
    const entry = {
      id: `img_${Date.now()}`,
      prompt,
      model,
      params,
      images,
      createdAt: now(),
    };
    store.images.unshift(entry); // Add to beginning
    // Keep only last 50 generations
    if (store.images.length > 50) store.images = store.images.slice(0, 50);
    saveGenerations(store);
    return entry.id;
  },

  getImageHistory(limit = 20) {
    const store = loadGenerations();
    return store.images.slice(0, limit);
  },

  deleteImageGeneration(id) {
    const store = loadGenerations();
    store.images = store.images.filter(item => item.id !== id);
    saveGenerations(store);
  },

  // Music generation history
  saveMusicGeneration({ title, lyrics, model, params, result }) {
    const store = loadGenerations();
    const entry = {
      id: `music_${Date.now()}`,
      title,
      lyrics,
      model,
      params,
      result,
      createdAt: now(),
    };
    store.music.unshift(entry);
    if (store.music.length > 50) store.music = store.music.slice(0, 50);
    saveGenerations(store);
    return entry.id;
  },

  getMusicHistory(limit = 20) {
    const store = loadGenerations();
    return store.music.slice(0, limit);
  },

  deleteMusicGeneration(id) {
    const store = loadGenerations();
    store.music = store.music.filter(item => item.id !== id);
    saveGenerations(store);
  },

  // Video generation history
  saveVideoGeneration({ prompt, model, params, result }) {
    const store = loadGenerations();
    const entry = {
      id: `video_${Date.now()}`,
      prompt,
      model,
      params,
      result,
      createdAt: now(),
    };
    store.videos.unshift(entry);
    if (store.videos.length > 50) store.videos = store.videos.slice(0, 50);
    saveGenerations(store);
    return entry.id;
  },

  getVideoHistory(limit = 20) {
    const store = loadGenerations();
    return store.videos.slice(0, limit);
  },

  deleteVideoGeneration(id) {
    const store = loadGenerations();
    store.videos = store.videos.filter(item => item.id !== id);
    saveGenerations(store);
  },
};

export default AIHistoryService;


