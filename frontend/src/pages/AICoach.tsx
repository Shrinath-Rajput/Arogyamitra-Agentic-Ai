import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Send, Loader2, Bot, User, Sparkles, MessageCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function AICoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await api.get('/coach/history');

      if (response.data.length === 0) {
        // Show welcome message if no history
        setMessages([
          { role: 'assistant', content: 'Hello! I am AROMI, your ArogyaMitra AI Coach! 🌟 I\'m here to help you with fitness, nutrition, and wellness advice. How can I assist you today?' }
        ]);
      } else {
        setMessages(response.data);
      }
    } catch (error: any) {
      console.error('Failed to load chat history', error);
      if (error.response?.status === 401) {
        setMessages([
          { role: 'assistant', content: '🔒 Your session has expired. Please log in again.' }
        ]);
      } else {
        setMessages([
          { role: 'assistant', content: 'Hello! I am AROMI, your ArogyaMitra AI Coach! 🌟 I\'m here to help you with fitness, nutrition, and wellness advice. How can I assist you today?' }
        ]);
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/coach/chat',
        { prompt: input }
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('AI Coach Error:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
        console.error('Server error:', error.response.status, error.response.data);
      } else if (error.request) {
        // Request made but no response
        errorMessage = '❌ Cannot connect to backend server. Please ensure the backend is running on port 8000.';
        console.error('No response from server');
      } else {
        // Other errors
        errorMessage = `❌ Error: ${error.message}`;
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-6 bg-white rounded-2xl p-6 shadow-lg border-2 border-indigo-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-xl mr-4">
              <Bot className="text-indigo-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-indigo-900 flex items-center gap-2">
                AI Health Coach
              </h1>
              <p className="text-indigo-700 text-sm mt-1">Your personal fitness & nutrition assistant</p>
            </div>
          </div>
          <MessageCircle className="text-indigo-400" size={40} />
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-6 bg-white rounded-xl shadow-lg border-2 border-indigo-200 hover:shadow-xl transition-all">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="animate-spin text-indigo-600 mx-auto mb-3" size={40} />
              <p className="text-indigo-600">Loading chat history...</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`shrink-0 ${msg.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`p-2.5 rounded-xl h-10 w-10 flex items-center justify-center shadow-md ${msg.role === 'user'
                        ? 'bg-indigo-600'
                        : 'bg-indigo-100 border-2 border-indigo-200'
                      }`}>
                      {msg.role === 'user' ? (
                        <User size={18} className="text-white" />
                      ) : (
                        <Bot size={18} className="text-indigo-600" />
                      )}
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-xl shadow-md transition-all hover:shadow-lg ${msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-md'
                      : 'bg-indigo-50 text-indigo-900 rounded-tl-md border-2 border-indigo-200'
                    }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex flex-row items-center">
                  <div className="p-2.5 rounded-xl h-10 w-10 flex items-center justify-center bg-indigo-100 border-2 border-indigo-200 shadow-md mr-3">
                    <Bot size={18} className="text-indigo-600" />
                  </div>
                  <div className="p-4 rounded-xl rounded-tl-md bg-indigo-50 border-2 border-indigo-200 shadow-md">
                    <div className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin text-indigo-600" />
                      <span className="text-sm text-indigo-700">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full p-4 pr-12 border-2 border-indigo-200 bg-white text-indigo-900 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all hover:border-indigo-300"
            placeholder="Ask me anything about fitness, nutrition, or health..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <MessageCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-400" size={20} />
        </div>
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Send size={20} />
          <span className="font-semibold hidden sm:inline">Send</span>
        </button>
      </div>

      {/* Quick Suggestions - Optional */}
      {messages.length === 1 && !loading && (
        <div className="mt-4 animate-fadeIn">
          <p className="text-xs text-gray-500 mb-2">💡 Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Create a workout plan',
              'Suggest healthy meals',
              'How to lose weight?',
              'Best exercises for abs'
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setInput(suggestion)}
                className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 hover:text-indigo-900 hover:bg-indigo-100 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AICoach;
