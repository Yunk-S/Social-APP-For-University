import React from 'react';
import { ChevronLeft, Video, Sparkles, Trash2, Clock } from 'lucide-react';
import AIService from '../../../services/AIService';
import AIHistoryService from '../../../services/AIHistoryService';

export default function AIVideoScreen({ navigateTo, language = 'zh', darkMode = false }) {
  const [tab, setTab] = React.useState('text'); // text | image
  const [prompt, setPrompt] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [model, setModel] = React.useState('Doubao');
  const [ratio, setRatio] = React.useState('16:9');
  const [seconds, setSeconds] = React.useState(5);
  const [resolution, setResolution] = React.useState('720p');
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    setHistory(AIHistoryService.getVideoHistory());
  }, []);

  const loadHistory = () => {
    setHistory(AIHistoryService.getVideoHistory());
  };

  const deleteHistoryItem = (id) => {
    AIHistoryService.deleteVideoGeneration(id);
    loadHistory();
  };

  const generate = async () => {
    const hasPrompt = prompt.trim().length > 0;
    const hasImg = tab === 'image' ? imageUrl.trim().length > 0 : true;
    if (!(hasPrompt && hasImg)) return;
    setLoading(true);
    try {
      const finalPrompt = tab === 'image' && imageUrl ? `[image:${imageUrl}] ${prompt}` : prompt;
      const r = await AIService.generateVideo({ prompt: finalPrompt, ratio, seconds, resolution, model });
      setResult(r);
      // Save to history
      AIHistoryService.saveVideoGeneration({
        prompt: finalPrompt,
        model,
        params: { ratio, seconds, resolution, tab, imageUrl },
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
        <Video className={`w-5 h-5 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
        <div className="font-semibold">
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">{language === 'zh' ? '君谋AI · 生成视频' : 'Junmou AI · Video'}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className={`rounded-2xl p-4 shadow border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`flex items-center gap-2 text-sm mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <button onClick={() => setTab('text')} className={`px-3 py-1 rounded-full ${tab==='text' ? 'bg-indigo-600 text-white' : darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>{language==='zh'?'文生视频':'Text To Video'}</button>
            <button onClick={() => setTab('image')} className={`px-3 py-1 rounded-full ${tab==='image' ? 'bg-indigo-600 text-white' : darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>{language==='zh'?'图生视频':'Image To Video'}</button>
          </div>

          {tab === 'image' && (
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={language==='zh'?'粘贴参考图像 URL（可选）':'Paste reference image URL (optional)'}
              className={`w-full mb-2 px-3 py-2 rounded-xl text-sm outline-none ${darkMode ? 'bg-slate-700 text-slate-100 placeholder-slate-400' : 'bg-slate-50 text-slate-800 placeholder-slate-400'}`}
            />
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder={language==='zh'?'请输入视频描述，包含主体、动作、场景':'Enter video prompt with subject, action, scene'}
            className={`w-full px-3 py-2 rounded-xl text-sm outline-none resize-y ${darkMode ? 'bg-slate-700 text-slate-100 placeholder-slate-400' : 'bg-slate-50 text-slate-800 placeholder-slate-400'}`}
          />

          <div className="grid grid-cols-2 gap-2 mt-3">
            <Select label={language==='zh' ? '模型' : 'Model'} value={model} setValue={setModel} options={['Doubao','Kling','Luma','Runway']} />
            <Select label={language==='zh' ? '比例' : 'Ratio'} value={ratio} setValue={setRatio} options={['16:9','9:16','1:1']} />
            <Select label={language==='zh' ? '时长' : 'Seconds'} value={String(seconds)} setValue={(v)=>setSeconds(parseInt(v||'5',10)||5)} options={['5','10','15']} />
            <Select label={language==='zh' ? '分辨率' : 'Resolution'} value={resolution} setValue={setResolution} options={['720p','1080p']} />
          </div>

          <button onClick={generate} className="mt-3 px-3 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm w-full flex items-center justify-center gap-2 disabled:opacity-60" disabled={loading}>
            <Sparkles className="w-4 h-4" />
            {language==='zh' ? '生成视频' : 'Generate Video'}
          </button>
        </div>

        {result && (
          <div className={`rounded-2xl p-4 shadow border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <video src={result.url} controls className="w-full rounded-xl" poster={result.cover} />
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
                      <div className={`text-sm mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'} line-clamp-2`}>
                        {item.prompt}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.model} · {item.params.ratio} · {item.params.seconds}s · {item.params.resolution} · {new Date(item.createdAt).toLocaleString()}
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
                    <video src={item.result.url} controls className="w-full rounded-xl" poster={item.result.cover} />
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


