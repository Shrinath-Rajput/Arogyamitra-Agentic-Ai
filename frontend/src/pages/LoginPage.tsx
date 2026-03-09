import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, Lock, Loader2, Activity, Heart, Zap } from 'lucide-react';
import api from '../services/api';

// New Effects
import { TiltCard } from '../components/effects/TiltCard';
import { GlitchText } from '../components/effects/GlitchText';
import { AnimeMatrix } from '../components/effects/AnimeMatrix';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4 font-sans">

      <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-200">
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4 shadow-md">
                <Activity className="text-white" size={36} />
              </div>
              <h1 className="text-4xl font-bold text-blue-900">ArogyaMitra</h1>
              <p className="text-blue-600 text-sm mt-2 font-medium">Welcome Back</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-blue-400" size={20} />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-blue-200 bg-blue-50 rounded-xl shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-blue-900"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-blue-400" size={20} />
                  </div>
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-blue-200 bg-blue-50 rounded-xl shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-blue-900"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-md text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Logging In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2" size={20} />
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-3">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Register here
                </Link>
              </p>
              <div className="pt-4 border-t border-blue-200">
                <p className="text-green-600 text-xs mb-1 font-medium">Demo Credentials</p>
                <p className="text-blue-900 text-sm font-medium bg-blue-50 px-4 py-2 rounded-lg inline-block border border-blue-200">
                  admin / admin123
                </p>
              </div>
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

export default LoginPage;
