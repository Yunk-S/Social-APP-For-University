import React from 'react';
import { ChevronLeft, Music, Sparkles, Trash2, Clock } from 'lucide-react';
import AIService from '../../../services/AIService';
import AIHistoryService from '../../../services/AIHistoryService';

export default function AIMusicScreen({ navigateTo, language = 'zh', darkMode = false }) {
  const [title, setTitle] = React.useState('');
  const [lyrics, setLyrics] = React.useState('');
  const [genre, setGenre] = React.useState('pop');
  const [mode, setMode] = React.useState('pro');
  const [model, setModel] = React.useState('suno-v4');
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    setHistory(AIHistoryService.getMusicHistory());
  }, []);

  const loadHistory = () => {
    setHistory(AIHistoryService.getMusicHistory());
  };

  const deleteHistoryItem = (id) => {
    AIHistoryService.deleteMusicGeneration(id);
    loadHistory();
  };

  const generate = async () => {
    if (!lyrics.trim()) return;
    setLoading(true);
    try {
      const r = await AIService.generateMusic({ title, lyrics, genre, mode, model });
      setResult(r);
      // Save to history
      AIHistoryService.saveMusicGeneration({
        title,
        lyrics,
        model,
        params: { genre, mode },
        result: r,
      });
      loadHistory();
    } catch (e) {
      alert(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`flex items-center gap-3 px-4 py-3 border-b ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
        <button onClick={() => navigateTo('ai-hub')} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
          <ChevronLeft className={darkMode ? 'text-slate-300' : 'text-slate-600'} />
        </button>
        <Music className={`w-5 h-5 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
        <div className="font-semibold">
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">{language === 'zh' ? '君谋AI · 生成音乐' : 'Junmou AI · Music'}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className={`rounded-2xl p-4 shadow border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="grid grid-cols-1 gap-2">
            <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder={language==='zh' ? '歌曲标题（可选）' : 'Title (optional)'} className={`px-3 py-2 rounded-xl text-sm outline-none ${darkMode ? 'bg-slate-700 text-slate-100 placeholder-slate-400' : 'bg-slate-50 text-slate-800 placeholder-slate-400'}`} />
            <textarea value={lyrics} onChange={(e)=>setLyrics(e.target.value)} rows={6} placeholder={language==='zh' ? '在此输入歌词（必填）' : 'Enter lyrics'} className={`px-3 py-2 rounded-xl text-sm outline-none resize-y ${darkMode ? 'bg-slate-700 text-slate-100 placeholder-slate-400' : 'bg-slate-50 text-slate-800 placeholder-slate-400'}`} />
            <div className="grid grid-cols-2 gap-2">
              <Select label={language==='zh' ? '风格' : 'Genre'} value={genre} setValue={setGenre} options={['pop','electronic','folk','rock','jazz','hiphop','classical','country']} />
              <Select label={language==='zh' ? '模式' : 'Mode'} value={mode} setValue={setMode} options={['pro','simple']} />
              <Select label={language==='zh' ? '模型' : 'Model'} value={model} setValue={setModel} options={['suno-v4']} />
            </div>
            <button onClick={generate} className="mt-1 px-3 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm w-full flex items-center justify-center gap-2 disabled:opacity-60" disabled={loading}>
              <Sparkles className="w-4 h-4" />
              {language==='zh' ? '生成音乐' : 'Generate Music'}
            </button>
          </div>
        </div>

        {result && (
          <div className={`rounded-2xl p-4 shadow border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="text-sm mb-2">{result.title}</div>
            <audio controls src={result.url} className="w-full" />
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6">
            <div className={`flex items-center gap-2 mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <Clock className="w-4 h-4" />
              <h3 className="text-sm font-semibold">{language === 'zh' ? '历史记录' : 'History'}</h3>
            </div>
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className={`rounded-2xl p-4 shadow border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className={`text-sm font-medium mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {item.title || (language === 'zh' ? '无标题' : 'Untitled')}
                      </div>
                      <div className={`text-xs mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'} line-clamp-2`}>
                        {item.lyrics}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.model} · {item.params.genre} · {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className={`p-1 rounded-md ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.result && item.result.url && (
                    <audio controls src={item.result.url} className="w-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Select({ label, value, setValue, options }) {
  return (
    <label className="text-xs">
      <div className="mb-1 text-slate-500">{label}</div>
      <select value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-100 text-sm">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}


