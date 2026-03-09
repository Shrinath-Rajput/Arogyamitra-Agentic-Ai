import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Loader2, Activity, Sparkles, Heart } from 'lucide-react';
import api from '../services/api';

// New Effects
import { TiltCard } from '../components/effects/TiltCard';
import { GlitchText } from '../components/effects/GlitchText';
import { AnimeMatrix } from '../components/effects/AnimeMatrix';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4 font-sans">

      <div className="w-full max-w-md my-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-green-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4 shadow-md">
                <UserPlus className="text-white" size={36} />
              </div>
              <h1 className="text-4xl font-bold text-green-900">Create Account</h1>
              <p className="text-green-600 text-sm mt-2 font-medium">Join ArogyaMitra</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-green-700 mb-2">
                  Username *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
                  <input
                    type="text"
                    name="username"
                    required
                    minLength={3}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-green-200 bg-green-50 rounded-xl shadow-sm hover:border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-green-900"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-green-200 bg-green-50 rounded-xl shadow-sm hover:border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-green-900"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
                  <input
                    type="text"
                    name="full_name"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-green-200 bg-green-50 rounded-xl shadow-sm hover:border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-green-900"
                    placeholder="Your full name (optional)"
                    value={formData.full_name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-green-200 bg-green-50 rounded-xl shadow-sm hover:border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-green-900"
                    placeholder="Choose a password (min 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-green-200 bg-green-50 rounded-xl shadow-sm hover:border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-green-900"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-md text-base font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2" size={20} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-3">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                  Login here
                </Link>
              </p>
            </div>
          </div>

        {/* Footer Note */}
        <p className="text-center text-green-600 text-xs mt-6 font-medium flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div> Secure Connection
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
