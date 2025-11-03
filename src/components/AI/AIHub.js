import React from 'react';
import { Sparkles, MessageSquare, Image as ImageIcon, Music, Video, ChevronLeft } from 'lucide-react';

export default function AIHub({ navigateTo, language = 'zh', darkMode = false }) {
  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`px-4 py-3 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
        <button onClick={() => navigateTo('chat')} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
          <ChevronLeft className={darkMode ? 'text-slate-300' : 'text-slate-600'} />
        </button>
        <Sparkles className={`w-5 h-5 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
        <div className="font-semibold">
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">{language === 'zh' ? '君谋AI' : 'Junmou AI'}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-5xl font-extrabold">
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">{language === 'zh' ? '君谋AI' : 'Junmou AI'}</span>
        </div>
        <div
          className={`rounded-2xl p-5 shadow border ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-xl font-bold mb-2">{language === 'zh' ? '拥抱变化，点燃创意火焰' : 'Embrace change, ignite creativity'}</div>
          <div className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} text-sm`}>
            {language === 'zh'
              ? '快速开始：选择一种能力或直接进入聊天'
              : 'Quick start: choose a capability or jump into chat'}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => navigateTo('ai-chat')}
              className="flex items-center gap-2 px-3 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow"
            >
              <MessageSquare className="w-5 h-5" />
              {language === 'zh' ? 'AI 聊天' : 'AI Chat'}
            </button>
            <button
              onClick={() => navigateTo('ai-image')}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl ${
                darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-800'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              {language === 'zh' ? '生成图片' : 'Images'}
            </button>
            <button
              onClick={() => navigateTo('ai-music')}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl ${
                darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-800'
              }`}
            >
              <Music className="w-5 h-5" />
              {language === 'zh' ? '生成音乐' : 'Music'}
            </button>
            <button
              onClick={() => navigateTo('ai-video')}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl ${
                darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-800'
              }`}
            >
              <Video className="w-5 h-5" />
              {language === 'zh' ? '生成视频' : 'Video'}
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          {language === 'zh'
            ? '提示：可在浏览器 localStorage 设置 seer_ai_base_url 来接入学校AI。'
            : 'Tip: set seer_ai_base_url in localStorage to connect school AI.'}
        </div>
      </div>
    </div>
  );
}


