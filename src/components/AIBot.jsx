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
        className="fixed bottom-6 right-6 bg-forest-green text-white p-4 rounded-full shadow-lg hover:bg-eco-green transition-all transform hover:scale-110 z-50"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-forest-green text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Kyzeel AI</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-eco-green rounded p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-forest-green text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about sustainability metrics..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
              />
              <button
                type="submit"
                className="bg-forest-green text-white p-2 rounded-lg hover:bg-eco-green transition"
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
