// Live Stream Service for SEER App
// Handles live streaming functionality with mock data

/**
 * Start a live stream
 * @param {Object} streamData - Stream configuration
 * @returns {Promise<Object>} Stream session data
 */
export async function startLiveStream(streamData) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const streamId = `live_${Date.now()}`;
  const streamSession = {
    streamId,
    title: streamData.title,
    category: streamData.category,
    quality: streamData.quality,
    startTime: new Date().toISOString(),
    viewers: 0,
    likes: 0,
    status: 'live'
  };
  
  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('seer_current_stream', JSON.stringify(streamSession));
    } catch (e) {
      console.error('Failed to store stream session', e);
    }
  }
  
  return { ok: true, data: streamSession };
}

/**
 * End a live stream
 * @param {string} streamId - Stream ID
 * @returns {Promise<Object>} Stream statistics
 */
export async function endLiveStream(streamId) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (typeof window !== 'undefined') {
    try {
      const streamData = localStorage.getItem('seer_current_stream');
      if (streamData) {
        const session = JSON.parse(streamData);
        const endTime = new Date().toISOString();
        const duration = Math.floor((new Date(endTime) - new Date(session.startTime)) / 1000);
        
        const statistics = {
          streamId: session.streamId,
          title: session.title,
          duration,
          totalViewers: session.viewers || 0,
          totalLikes: session.likes || 0,
          peakViewers: Math.floor((session.viewers || 0) * 1.5)
        };
        
        // Clear current stream
        localStorage.removeItem('seer_current_stream');
        
        // Store in stream history
        const history = JSON.parse(localStorage.getItem('seer_stream_history') || '[]');
        history.unshift({ ...statistics, endTime });
        localStorage.setItem('seer_stream_history', JSON.stringify(history.slice(0, 20)));
        
        return { ok: true, data: statistics };
      }
    } catch (e) {
      console.error('Failed to end stream', e);
    }
  }
  
  return { ok: false, message: 'Stream not found' };
}

/**
 * Get current live stream status
 * @returns {Object|null} Current stream data or null
 */
export function getCurrentStream() {
  if (typeof window === 'undefined') return null;
  
  try {
    const streamData = localStorage.getItem('seer_current_stream');
    return streamData ? JSON.parse(streamData) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Get stream history
 * @returns {Array} Array of past streams
 */
export function getStreamHistory() {
  if (typeof window === 'undefined') return [];
  
  try {
    const history = localStorage.getItem('seer_stream_history');
    return history ? JSON.parse(history) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Update stream statistics
 * @param {string} streamId - Stream ID
 * @param {Object} updates - Statistics to update
 * @returns {Promise<Object>} Updated stream data
 */
export async function updateStreamStats(streamId, updates) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (typeof window !== 'undefined') {
    try {
      const streamData = localStorage.getItem('seer_current_stream');
      if (streamData) {
        const session = JSON.parse(streamData);
        if (session.streamId === streamId) {
          const updatedSession = { ...session, ...updates };
          localStorage.setItem('seer_current_stream', JSON.stringify(updatedSession));
          return { ok: true, data: updatedSession };
        }
      }
    } catch (e) {
      console.error('Failed to update stream stats', e);
    }
  }
  
  return { ok: false, message: 'Stream not found' };
}

/**
 * Send a gift during live stream
 * @param {string} streamId - Stream ID
 * @param {Object} giftData - Gift information
 * @returns {Promise<Object>} Gift send result
 */
export async function sendGift(streamId, giftData) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Check if user has enough diamonds
  if (typeof window !== 'undefined') {
    try {
      const diamonds = parseInt(localStorage.getItem('seer_diamonds') || '0');
      if (diamonds < giftData.cost) {
        return { ok: false, message: 'Not enough diamonds' };
      }
      
      // Deduct diamonds
      localStorage.setItem('seer_diamonds', (diamonds - giftData.cost).toString());
      
      return { 
        ok: true, 
        data: {
          giftId: `gift_${Date.now()}`,
          ...giftData,
          timestamp: new Date().toISOString()
        }
      };
    } catch (e) {
      console.error('Failed to send gift', e);
    }
  }
  
  return { ok: false, message: 'Failed to send gift' };
}

/**
 * Get available gifts for live streaming
 * @returns {Array} Array of available gifts
 */
export function getAvailableGifts() {
  return [
    { id: 'rose', name: 'Rose', icon: '🌹', cost: 10, diamonds: 10 },
    { id: 'heart', name: 'Heart', icon: '❤️', cost: 50, diamonds: 50 },
    { id: 'star', name: 'Star', icon: '⭐', cost: 100, diamonds: 100 },
    { id: 'diamond', name: 'Diamond', icon: '💎', cost: 500, diamonds: 500 },
    { id: 'crown', name: 'Crown', icon: '👑', cost: 1000, diamonds: 1000 },
    { id: 'rocket', name: 'Rocket', icon: '🚀', cost: 5000, diamonds: 5000 },
  ];
}

/**
 * Get mock live streams (for browse/discover page)
 * @returns {Array} Array of live streams
 */
export function getMockLiveStreams() {
  return [
    {
      streamId: 'stream_001',
      username: 'Alice',
      userId: 'u001',
      avatar: '/Alice.png',
      title: 'Study Session - CS Homework Help',
      category: 'studying',
      viewers: 156,
      thumbnail: null,
      isPro: false,
    },
    {
      streamId: 'stream_002',
      username: 'Bob',
      userId: 'u002',
      avatar: '/Bob.png',
      title: 'Gaming Night - League of Legends Ranked',
      category: 'gaming',
      viewers: 423,
      thumbnail: null,
      isPro: true,
    },
    {
      streamId: 'stream_003',
      username: 'Charlie',
      userId: 'u003',
      avatar: '/Charlie.png',
      title: 'Chat with me! 聊天',
      category: 'chatting',
      viewers: 89,
      thumbnail: null,
      isPro: false,
    },
  ];
}

