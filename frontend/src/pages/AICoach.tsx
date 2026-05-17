import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Send, Loader2, Bot, User, Sparkles, MessageCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumCard from '../components/PremiumCard';
import AnimatedButton from '../components/AnimatedButton';

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
      const response = await api.post('/coach/chat', { prompt: input });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('AI Coach Error:', error);

      let errorMessage = 'Sorry, I encountered an error. Please try again.';

      if (error.response) {
        errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
        console.error('Server error:', error.response.status, error.response.data);
      } else if (error.request) {
        errorMessage = '❌ Cannot connect to backend server. Please ensure the backend is running on port 8000.';
        console.error('No response from server');
      } else {
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([
        { role: 'assistant', content: 'Chat history cleared. How can I help you today?' }
      ]);
    }
  };

  if (loadingHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          ></motion.div>
          <p className="text-xl font-semibold text-white mb-2">Loading AROMI AI Coach...</p>
          <p className="text-sm text-gray-400">Initializing your personal trainer</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-cyan-500/30 to-teal-500/30 rounded-2xl">
                <Bot className="text-cyan-400 w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">AROMI AI Coach</h1>
                <p className="text-gray-400 text-sm mt-1">Your personal AI health and fitness companion</p>
              </div>
            </div>
            <motion.button
              onClick={clearHistory}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
              title="Clear chat history"
            >
              <Trash2 className="text-gray-400 hover:text-red-400 w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Chat Container */}
        <PremiumCard className="p-6 h-[600px] md:h-[700px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl
                      ${message.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-br-none'
                        : 'bg-white/10 border border-white/20 text-gray-100 rounded-bl-none'
                      }
                      backdrop-blur-xl
                    `}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-2xl rounded-bl-none backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-cyan-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    ></motion.div>
                    <motion.div
                      className="w-2 h-2 rounded-full bg-cyan-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
                    ></motion.div>
                    <motion.div
                      className="w-2 h-2 rounded-full bg-cyan-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-end gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              placeholder="Ask me anything about fitness, nutrition, or wellness..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-cyan-500/30 bg-white/10 text-white placeholder-gray-400 hover:border-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50 transition-all duration-300 disabled:opacity-50"
            />
            <motion.button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              whileHover={!loading && input.trim() ? { scale: 1.05 } : {}}
              whileTap={!loading && input.trim() ? { scale: 0.95 } : {}}
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white hover:from-cyan-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </PremiumCard>

        {/* Info Card */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PremiumCard className="p-4 bg-gradient-to-r from-cyan-500/5 to-teal-500/5">
            <p className="text-sm text-gray-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                AROMI is powered by advanced AI. Ask questions about workout routines, meal planning, health goals, or anything fitness-related. Your privacy is protected, and all conversations are encrypted.
              </span>
            </p>
          </PremiumCard>
        </motion.div>
      </div>
    </div>
  );
}

export default AICoach;
