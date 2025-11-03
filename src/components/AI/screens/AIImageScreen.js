import React from 'react';
import { ChevronLeft, Image as ImageIcon, Download, Sparkles, Trash2, Clock } from 'lucide-react';
import AIService from '../../../services/AIService';
import AIHistoryService from '../../../services/AIHistoryService';

export default function AIImageScreen({ navigateTo, language = 'zh', darkMode = false }) {
  const [prompt, setPrompt] = React.useState('');
  const [model, setModel] = React.useState('DallE.3');
  const [ratio, setRatio] = React.useState('1:1');
  const [size, setSize] = React.useState('1024x1024');
  const [quality, setQuality] = React.useState('standard');
  const [style, setStyle] = React.useState('vivid');
  const [count, setCount] = React.useState(2);
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    setHistory(AIHistoryService.getImageHistory());
  }, []);

  const loadHistory = () => {
    setHistory(AIHistoryService.getImageHistory());
  };

  const deleteHistoryItem = (id) => {
    AIHistoryService.deleteImageGeneration(id);
    loadHistory();
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const urls = await AIService.generateImage({ prompt, model, ratio, size, quality, style, count });
      setImages(urls);
      // Save to history
      AIHistoryService.saveImageGeneration({
        prompt,
        model,
        params: { ratio, size, quality, style, count },
        images: urls,
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
        <ImageIcon className={`w-5 h-5 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
        <div className="font-semibold">
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">{language === 'zh' ? '君谋AI · 生成图片' : 'Junmou AI · Images'}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className={`rounded-2xl p-4 shadow border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={language === 'zh' ? '请输入图片描述，建议英文' : 'Enter image prompt'}
              className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none ${darkMode ? 'bg-slate-700 text-slate-100 placeholder-slate-400' : 'bg-slate-50 text-slate-800 placeholder-slate-400'}`}
            />
            <button onClick={generate} className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm disabled:opacity-60" disabled={loading}>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <Select label={language === 'zh' ? '模型' : 'Model'} value={model} setValue={setModel} options={['豆包', 'MJ', 'DallE.3']} />
            <Select label={language === 'zh' ? '比例' : 'Ratio'} value={ratio} setValue={setRatio} options={['1:1', '16:9', '9:16', '4:3']} />
            <Select label={language === 'zh' ? '尺寸' : 'Size'} value={size} setValue={setSize} options={['1024x1024', '1792x1024', '1024x1792']} />
            <Select label={language === 'zh' ? '质量' : 'Quality'} value={quality} setValue={setQuality} options={['standard', 'hd']} />
            <Select label={language === 'zh' ? '风格' : 'Style'} value={style} setValue={setStyle} options={['vivid', 'natural']} />
            <Select label={language === 'zh' ? '数量' : 'Count'} value={String(count)} setValue={(v)=>setCount(parseInt(v||'1',10)||1)} options={['1','2','3','4']} />
          </div>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {images.map((url, idx) => (
              <div key={idx} className={`rounded-xl overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <img alt="AI" src={url} className="w-full h-40 object-cover" />
                <div className="p-2 flex justify-end">
                  <a download href={url} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
                    <Download className="w-3 h-3" />
                    {language === 'zh' ? '下载' : 'Download'}
                  </a>
                </div>
              </div>
            ))}
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
                      <div className={`text-sm mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.prompt}</div>
                      <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.model} · {item.params.size} · {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className={`p-1 rounded-md ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {item.images.map((url, idx) => (
                      <div key={idx} className={`rounded-lg overflow-hidden border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <img alt="AI" src={url} className="w-full h-32 object-cover" />
                        <div className="p-1 flex justify-end">
                          <a download href={url} className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
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


