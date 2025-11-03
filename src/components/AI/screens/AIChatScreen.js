import React from 'react';
import { Sparkles, Send, ChevronLeft, History, SlidersHorizontal, Trash2, Plus } from 'lucide-react';
import AIService from '../../../services/AIService';
import AIHistoryService from '../../../services/AIHistoryService';

export default function AIChatScreen({ navigateTo, language = 'zh', darkMode = false, prompt: initialPrompt }) {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState(initialPrompt || '');
  const [loading, setLoading] = React.useState(false);
  const [model, setModel] = React.useState(() => localStorage.getItem('seer_ai_model') || 'gpt-5');
  const [showModels, setShowModels] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [conversationId, setConversationId] = React.useState(null);

  const ask = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      // Create conversation lazily on first send
      let cid = conversationId;
      if (!cid) {
        cid = AIHistoryService.createConversation({ title: text.slice(0, 20) || '新对话', model });
        setConversationId(cid);
      }
      AIHistoryService.appendMessage(cid, userMsg);

      const reply = await AIService.chat({ prompt: text, messages: newMessages, model });
      setMessages((m) => [...m, reply]);
      AIHistoryService.appendMessage(cid, reply);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: String(e.message || e) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-full flex flex-col relative ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
        <button onClick={() => navigateTo('ai-hub')} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
          <ChevronLeft className={darkMode ? 'text-slate-300' : 'text-slate-600'} />
        </button>
        <Sparkles className={`w-5 h-5 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
        <div className="font-semibold flex-1">
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">{language === 'zh' ? '君谋AI 聊天' : 'Junmou AI Chat'}</span>
        </div>
        <button onClick={() => setShowHistory(true)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`} title={language==='zh'?'历史':'History'}>
          <History className={darkMode ? 'text-slate-300' : 'text-slate-600'} />
        </button>
        <button onClick={() => setShowModels((v)=>!v)} className={`px-2 py-1 rounded-lg text-xs border ${darkMode ? 'border-slate-600 text-slate-200' : 'border-slate-300 text-slate-700'}`}>
          {language==='zh'?'模型':'Model'}: {model}
        </button>
      </div>

      {/* When empty – show welcome hero and quick actions (GPT-like) */}
      {messages.length === 0 && (
        <div className="px-6 pt-8">
          <div className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{language==='zh'?'有什么可以帮忙的？':'What can I help with?'}</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: language==='zh'?'创建图片':'Create image', onClick: ()=>navigateTo('ai-image') },
              { label: language==='zh'?'总结文本':'Summarize text', onClick: ()=>setInput(language==='zh'?'请帮我总结以下文本要点：':'Summarize the following text: ') },
              { label: '代码', onClick: ()=>setInput(language==='zh'?'请用Python写一个冒泡排序示例：':'Write a Python bubble sort example:') },
              { label: language==='zh'?'制定计划':'Make a plan', onClick: ()=>setInput(language==='zh'?'请帮我制定一周学习计划：':'Create a one-week study plan:') },
              { label: language==='zh'?'提供建议':'Give advice', onClick: ()=>setInput(language==='zh'?'我想提升时间管理能力，有什么建议？':'How can I improve time management?') },
              { label: language==='zh'?'更多':'More', onClick: ()=>navigateTo('ai-hub') },
            ].map((a, i)=>(
              <button key={i} onClick={a.onClick} className={`px-3 py-3 rounded-2xl text-sm font-medium text-left ${darkMode?'bg-slate-800 text-slate-200 border border-slate-700':'bg-white text-slate-800 border border-slate-200'} shadow-sm`}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'bg-white text-slate-800 border border-slate-200'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'zh' ? '正在思考…' : 'Thinking…'}</div>
        )}
      </div>

      {/* Composer fixed at bottom */}
      <div className="p-4">
        <div className={`rounded-2xl p-4 shadow border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask()}
              placeholder={language === 'zh' ? '输入问题并按 Enter' : 'Type a question and press Enter'}
              className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none ${darkMode ? 'bg-slate-700 text-slate-100 placeholder-slate-400' : 'bg-slate-50 text-slate-800 placeholder-slate-400'}`}
            />
            <button onClick={ask} className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm disabled:opacity-60" disabled={loading}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Model selector sheet */}
      {showModels && (
        <div className="absolute inset-0 bg-black/30 z-30" onClick={()=>setShowModels(false)}>
          <div className={`absolute bottom-0 left-0 right-0 p-4 rounded-t-2xl ${darkMode?'bg-slate-900':'bg-white'} shadow-2xl`} onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className={darkMode?'text-slate-300':'text-slate-600'} />
              <div className="text-sm font-semibold">{language==='zh'?'选择模型':'Choose Model'}</div>
            </div>
            {['gpt-5','DeepSeek-R1-Think','Qwen-2.5-72B-Local'].map((m)=> (
              <button key={m} onClick={()=>{ setModel(m); localStorage.setItem('seer_ai_model', m); setShowModels(false); }} className={`w-full text-left px-3 py-3 rounded-xl mb-2 ${m===model ? 'bg-indigo-600 text-white':'border ' + (darkMode?'border-slate-700 text-slate-200':'border-slate-200 text-slate-800')}`}>{m}</button>
            ))}
            <div className={`text-xs ${darkMode?'text-slate-400':'text-slate-500'}`}>{language==='zh'?'该设置仅影响本设备':'Setting stored on this device only'}</div>
          </div>
        </div>
      )}

      {/* History bottom sheet for mobile */}
      {showHistory && (
        <div className="absolute inset-0 bg-black/30 z-30" onClick={()=>setShowHistory(false)}>
          <div className={`absolute bottom-0 left-0 right-0 p-4 rounded-t-2xl ${darkMode?'bg-slate-900':'bg-white'} shadow-2xl`} onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">{language==='zh'?'历史对话':'History'}</div>
              <button onClick={()=>{ setConversationId(null); setMessages([]); }} className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${darkMode?'bg-slate-800 text-slate-200':'bg-slate-100 text-slate-700'}`}>
                <Plus className="w-3 h-3" />{language==='zh'?'新对话':'New Chat'}
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto" style={{maxHeight:'60vh'}}>
              {AIHistoryService.listConversations().map(c => (
                <div key={c.id} className={`p-3 rounded-xl border cursor-pointer ${darkMode?'border-slate-700 hover:bg-slate-800':'border-slate-200 hover:bg-slate-50'}`} onClick={()=>{ setConversationId(c.id); setMessages(AIHistoryService.getMessages(c.id)); setShowHistory(false); setModel(c.model || model); }}>
                  <div className="text-sm font-medium truncate">{c.title}</div>
                  <div className="text-xs text-slate-500 truncate">{c.model} · {new Date(c.updatedAt).toLocaleString()}</div>
                </div>
              ))}
              {AIHistoryService.listConversations().length===0 && (
                <div className={`text-xs ${darkMode?'text-slate-500':'text-slate-500'}`}>{language==='zh'?'暂无历史记录':'No history yet'}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


