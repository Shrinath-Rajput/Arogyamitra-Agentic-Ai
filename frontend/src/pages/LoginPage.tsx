import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, Lock, Loader2, Heart, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import GradientBg from '../components/GradientBg';
import AnimatedButton from '../components/AnimatedButton';
import PremiumCard from '../components/PremiumCard';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/token',
        `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.detail || 'Invalid username or password');
      } else if (err.request) {
        setError('Cannot connect to server. Is the backend running?');
      } else {
        setError('An unexpected error occurred');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBg variant="primary" className="min-h-screen flex items-center justify-center px-4 py-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        ></motion.div>
      </div>

      <div className="w-full max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Card */}
          <PremiumCard gradient="cyan" className="p-8">
            {/* Logo Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl mb-4 shadow-lg">
                <Heart className="text-white" size={32} fill="white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent mb-2">
                ArogyaMitra
              </h1>
              <p className="text-gray-400 text-sm font-medium">Your AI Health Companion</p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
              >
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-cyan-400 group-hover:text-cyan-300 transition-colors" size={20} />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border-2 border-cyan-500/30 bg-white/10 backdrop-blur-xl rounded-xl text-white placeholder-gray-400 hover:border-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50 transition-all duration-300"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    disabled={loading}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-cyan-400 group-hover:text-cyan-300 transition-colors" size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-3 border-2 border-cyan-500/30 bg-white/10 backdrop-blur-xl rounded-xl text-white placeholder-gray-400 hover:border-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50 transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-cyan-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                  className="w-full"
                >
                  {!loading && <LogIn size={20} />}
                  {loading ? 'Logging In...' : 'Login'}
                </AnimatedButton>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              className="my-6 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-cyan-500/30"></div>
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-cyan-500/30"></div>
            </motion.div>

            {/* Register Link */}
            <motion.p
              className="text-center text-gray-400 text-sm mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Create one now
              </Link>
            </motion.p>

            {/* Demo Credentials */}
            <motion.div
              className="p-4 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-xl border border-cyan-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-cyan-300 text-xs mb-2 font-semibold">✨ Demo Credentials</p>
              <p className="text-gray-300 text-sm font-mono bg-black/30 px-3 py-2 rounded-lg border border-cyan-500/20">
                <span className="text-cyan-400">admin</span> / <span className="text-teal-400">admin123</span>
              </p>
            </motion.div>
          </PremiumCard>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-cyan-400 text-xs mt-8 font-medium flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-cyan-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
          Secure Connection
        </motion.p>
      </div>
    </GradientBg>
  );
}

export default LoginPage;
