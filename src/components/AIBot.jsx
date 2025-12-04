import React from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const AIBot = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState([
    {
      type: 'bot',
      text: 'Hello! I\'m Kyzeel AI. I can help you understand sustainability reports, carbon credit projects, and ESG metrics. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: 'Thank you for your question. This is a demo response. In production, I would provide detailed analysis of sustainability metrics, carbon credits, and ESG ratings based on your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 rounded-full shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 transition-all duration-300 transform hover:scale-110 z-50 animate-bounce-slow"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-50 border border-emerald-500/40 animate-scaleIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 text-white p-4 rounded-t-2xl flex justify-between items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 animate-shimmer"></div>
            <div className="flex items-center space-x-2 relative z-10">
              <MessageCircle className="w-5 h-5 animate-pulse-slow" />
              <h3 className="font-bold">Kyzeel AI</h3>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-emerald-700/50 rounded-lg p-1.5 transition-all duration-300 relative z-10 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
                style={{animationDelay: `${index * 50}ms`}}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl shadow-lg ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-br-none'
                      : 'bg-slate-800/80 backdrop-blur-sm text-slate-200 rounded-bl-none border border-emerald-500/30'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1.5 block">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-emerald-500/30 bg-slate-800/50 rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about sustainability metrics..."
                className="flex-1 px-4 py-2.5 bg-slate-800/60 border border-emerald-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-slate-200 placeholder-slate-400 transition-all duration-300"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-2.5 rounded-xl hover:from-emerald-500 hover:to-green-500 transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIBot;
