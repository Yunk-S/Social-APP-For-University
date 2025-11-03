import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AILoadingScreen({ navigateTo, language = 'zh', darkMode = false }) {
  React.useEffect(() => {
    const timer = setTimeout(() => navigateTo('ai-hub'), 900);
    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div className={`h-full flex flex-col items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
        <div className="text-3xl font-extrabold">
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">{language==='zh'?'君谋AI':'Junmou AI'}</span>
        </div>
      </div>
      <div className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} text-sm`}>
        {language==='zh' ? '正在连接，请稍候…' : 'Connecting, please wait…'}
      </div>
      <div className="mt-6 flex gap-2">
        {[0,1,2].map(i => (
          <div key={i} className={`w-3 h-3 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`} style={{animation:`bounce 1s ${i*0.15}s infinite`}} />
        ))}
      </div>
    </div>
  );
}


