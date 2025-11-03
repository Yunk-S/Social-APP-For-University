import React from 'react';
import { Sparkles, Image as ImageIcon, Music, Video } from 'lucide-react';

export default function AIQuickBar({ navigateTo, language = 'zh', darkMode = false }) {
  const [text, setText] = React.useState('');

  const ask = () => {
    const prompt = text.trim();
    if (!prompt) return navigateTo('ai-chat');
    navigateTo('ai-chat', { prompt });
  };

  return (
    <div className="px-4 pt-2 pb-3 sticky top-0 z-20">
      <div
        className={`rounded-2xl p-3 shadow-md border transition-colors ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <Sparkles className={`w-5 h-5 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
          <div className={`text-sm font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
            {language === 'zh' ? '君谋AI' : 'SEER AI'}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask()}
            placeholder={language === 'zh' ? '向AI提问...' : 'Ask AI anything...'}
            className={`flex-1 text-sm px-3 py-2 rounded-xl outline-none ${
              darkMode ? 'bg-slate-700 text-slate-100 placeholder-slate-400' : 'bg-slate-50 text-slate-800 placeholder-slate-400'
            }`}
          />
          <button
            onClick={ask}
            className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow hover:opacity-90"
          >
            {language === 'zh' ? '问AI' : 'Ask AI'}
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs">
          <button
            onClick={() => navigateTo('ai-image')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            {language === 'zh' ? '生成图片' : 'Image'}
          </button>
          <button
            onClick={() => navigateTo('ai-music')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Music className="w-4 h-4" />
            {language === 'zh' ? '生成音乐' : 'Music'}
          </button>
          <button
            onClick={() => navigateTo('ai-video')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Video className="w-4 h-4" />
            {language === 'zh' ? '生成视频' : 'Video'}
          </button>
        </div>
      </div>
    </div>
  );
}


