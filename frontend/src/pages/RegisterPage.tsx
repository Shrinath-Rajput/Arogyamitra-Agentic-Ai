import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Loader2, Heart, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import GradientBg from '../components/GradientBg';
import AnimatedButton from '../components/AnimatedButton';
import PremiumCard from '../components/PremiumCard';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Register user
      await api.post('/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name || null
      });

      // Auto-login after registration
      const loginData = new URLSearchParams();
      loginData.append('username', formData.username);
      loginData.append('password', formData.password);

      const loginResponse = await api.post('/token', loginData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      localStorage.setItem('token', loginResponse.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBg variant="secondary" className="min-h-screen flex items-center justify-center px-4 py-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        ></motion.div>
      </div>

      <div className="w-full max-w-md z-10 my-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Card */}
          <PremiumCard gradient="emerald" className="p-8">
            {/* Logo Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mb-4 shadow-lg">
                <UserPlus className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-2">
                Join ArogyaMitra
              </h1>
              <p className="text-gray-400 text-sm font-medium">Start your health journey today</p>
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-emerald-400 group-hover:text-emerald-300 transition-colors" size={20} />
                  </div>
                  <input
                    type="text"
                    name="full_name"
                    className="w-full pl-12 pr-4 py-3 border-2 border-emerald-500/30 bg-white/10 backdrop-blur-xl rounded-xl text-white placeholder-gray-400 hover:border-emerald-400/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50 transition-all duration-300"
                    placeholder="Your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </motion.div>

              {/* Username Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-2">Username *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-emerald-400 group-hover:text-emerald-300 transition-colors" size={20} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    minLength={3}
                    className="w-full pl-12 pr-4 py-3 border-2 border-emerald-500/30 bg-white/10 backdrop-blur-xl rounded-xl text-white placeholder-gray-400 hover:border-emerald-400/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50 transition-all duration-300"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-emerald-400 group-hover:text-emerald-300 transition-colors" size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-emerald-500/30 bg-white/10 backdrop-blur-xl rounded-xl text-white placeholder-gray-400 hover:border-emerald-400/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50 transition-all duration-300"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-emerald-400 group-hover:text-emerald-300 transition-colors" size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className="w-full pl-12 pr-12 py-3 border-2 border-emerald-500/30 bg-white/10 backdrop-blur-xl rounded-xl text-white placeholder-gray-400 hover:border-emerald-400/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50 transition-all duration-300"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-2">Confirm Password *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-emerald-400 group-hover:text-emerald-300 transition-colors" size={20} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    className="w-full pl-12 pr-12 py-3 border-2 border-emerald-500/30 bg-white/10 backdrop-blur-xl rounded-xl text-white placeholder-gray-400 hover:border-emerald-400/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50 transition-all duration-300"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Register Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="pt-2"
              >
                <AnimatedButton
                  type="submit"
                  variant="secondary"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                  className="w-full"
                >
                  {!loading && <UserPlus size={20} />}
                  {loading ? 'Creating Account...' : 'Create Account'}
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
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-emerald-500/30"></div>
              <span className="text-xs text-gray-400 font-medium">ALREADY HAVE AN ACCOUNT?</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-emerald-500/30"></div>
            </motion.div>

            {/* Login Link */}
            <motion.p
              className="text-center text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Login here
              </Link>
            </motion.p>
          </PremiumCard>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-emerald-400 text-xs mt-8 font-medium flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
          Your data is encrypted and secure
        </motion.p>
      </div>
    </GradientBg>
  );
}

export default RegisterPage;
