// Lightweight AI service wrapper.
// Uses school's AI endpoint when configured; otherwise falls back to local mock assets.

const AI_BASE_URL =
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_AI_BASE_URL) ||
  (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('seer_ai_base_url')) ||
  '';

const USE_MOCK = !AI_BASE_URL;

async function httpPost(path, body) {
  const url = `${AI_BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: (typeof window !== 'undefined' && localStorage.getItem('seer_auth_token')) || '',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI request failed: ${res.status} ${text}`);
  }
  return res.json();
}

export const AIService = {
  // One-shot chat completion. Provide messages if available.
  async chat({ prompt, messages = [], model = 'gpt-5' }) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      return {
        role: 'assistant',
        content:
          '这是演示回复。请在 .env 或 localStorage 中配置 REACT_APP_AI_BASE_URL 或 seer_ai_base_url 以连接学校AI。',
      };
    }
    const data = await httpPost('/v1/chat/completions', { prompt, messages, model });
    // Normalize common provider formats
    const content =
      data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || data?.data || '';
    return { role: 'assistant', content };
  },

  async generateImage({
    prompt,
    model = 'DallE.3',
    ratio = '1:1',
    size = '1024x1024',
    quality = 'standard',
    style = 'vivid',
    seed,
    count = 2,
  }) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 800));
      // Use built-in sample images
      const imgs = ['/chessimage.png', '/gomokuimage.png'];
      return imgs.slice(0, Math.max(1, Math.min(count, imgs.length)));
    }
    const data = await httpPost('/v1/images/generations', {
      prompt,
      model,
      ratio,
      size,
      quality,
      style,
      seed,
      n: count,
    });
    const urls = (data?.data || []).map((x) => x.url || x?.b64_json || x);
    return urls;
  },

  async generateMusic({ title = '', lyrics, genre = 'pop', model = 'suno-v4', mode = 'pro' }) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1200));
      return { url: '/chess.MP3', title: title || 'Demo Track' };
    }
    const data = await httpPost('/v1/audio/music', { title, lyrics, genre, model, mode });
    return { url: data?.url || data?.data?.url, title: title || 'AI Track' };
  },

  async generateVideo({ prompt, ratio = '16:9', seconds = 5, resolution = '720p', model = 'Doubao' }) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1500));
      return { url: '/example.mp4', cover: '/chessimage.png' };
    }
    const data = await httpPost('/v1/video/generations', { prompt, ratio, seconds, resolution, model });
    return { url: data?.url || data?.data?.url, cover: data?.cover };
  },
};

export default AIService;


