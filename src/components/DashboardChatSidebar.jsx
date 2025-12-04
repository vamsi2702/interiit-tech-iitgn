import React from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { ThemeContext } from '../App';

const DashboardChatSidebar = () => {
  const { theme } = React.useContext(ThemeContext);
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
    <aside className="hidden lg:block w-80 h-full overflow-hidden">
      <div className={`h-full ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border-green-500/30' : 'bg-white border-gray-200'} backdrop-blur-xl shadow-xl rounded-2xl border animate-slideIn flex flex-col`}>
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          <Bot className="w-5 h-5 relative z-10 drop-shadow-lg" />
          <h3 className="font-semibold relative z-10 drop-shadow-lg">EcoInvest AI</h3>
        </div>

        <div className="p-4 flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Message history */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-transparent">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={`${m.from === 'user' ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50' : theme === 'dark' ? 'bg-slate-800/80 border border-slate-700/50 text-slate-200' : 'bg-gray-50 border border-gray-200 text-slate-800'} px-3 py-2 rounded-lg max-w-[85%] backdrop-blur-sm animate-slideIn`}>
                  <p className="text-sm">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Functions */}
          <div className="mb-3 flex-shrink-0">
            <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} mb-2`}>
              <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} animate-pulse`} />
              <span className="font-semibold">Suggested Functions</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggested.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggest(s)}
                  className={`text-left text-sm px-3 py-2 ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border-green-500/30' : 'bg-gray-50 hover:bg-gray-100 text-slate-700 border-gray-200'} border rounded-lg hover:border-green-500 hover:shadow-md transition-all backdrop-blur-sm`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className={`pt-2 border-t ${theme === 'dark' ? 'border-green-500/20' : 'border-gray-200'} flex-shrink-0`}>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask EcoInvest AI..."
                className={`flex-1 px-3 py-2 ${theme === 'dark' ? 'bg-slate-800/50 text-slate-200 placeholder-slate-500 border-green-500/30' : 'bg-white text-slate-800 placeholder-slate-500 border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm`}
              />
              <button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-2 rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all hover:scale-105">
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

