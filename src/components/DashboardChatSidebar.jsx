import React from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';

const DashboardChatSidebar = () => {
  const [messages, setMessages] = React.useState([
    { from: 'bot', text: "Hi — I'm EcoInvest AI. Ask about your watchlist, reports, or recent sustainability news." }
  ]);
  const [input, setInput] = React.useState('');

  const suggested = [
    "What are the current companies on my watchlist?",
    "Add Tesla to Watchlist",
    "Generate report on Tesla",
    "News related to sustainability"
  ];

  const sendMessage = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setInput('');
    // simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: "Demo response: this would trigger the requested action." }]);
    }, 700);
  };

  const onSuggest = (text) => {
    setInput(text);
    setMessages(prev => [...prev, { from: 'user', text }]);
    // immediate simulated bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: "Demo response: handling suggested function." }]);
    }, 700);
  };

  return (
    <aside className="hidden lg:block w-80">
      <div className="sticky top-24 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-cyan-500/30 overflow-hidden h-[calc(100vh-7rem)] animate-slideIn">
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          <Bot className="w-5 h-5 relative z-10 drop-shadow-lg" />
          <h3 className="font-semibold relative z-10 drop-shadow-lg">EcoInvest AI</h3>
        </div>

        <div className="p-4 h-[calc(100%-3.5rem)] flex flex-col">
          {/* Message history */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-slate-800/50">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={`${m.from === 'user' ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/50' : 'bg-slate-800/80 border border-slate-700/50 text-slate-200'} px-3 py-2 rounded-lg max-w-[85%] backdrop-blur-sm animate-slideIn`}>
                  <p className="text-sm">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Functions */}
          <div className="mb-3">
            <div className="flex items-center gap-2 text-sm text-cyan-400 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span className="font-semibold">Suggested Functions</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggested.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggest(s)}
                  className="text-left text-sm px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg hover:bg-slate-700/50 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-slate-300 hover:text-cyan-300 backdrop-blur-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="pt-2 border-t border-cyan-500/20">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask EcoInvest AI..."
                className="flex-1 px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 text-slate-200 placeholder-slate-500 backdrop-blur-sm"
              />
              <button type="submit" className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white p-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </aside>
  );
};

export default DashboardChatSidebar;
