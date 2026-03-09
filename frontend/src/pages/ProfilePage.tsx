import { useState, useEffect } from 'react';
import { User, Mail, Save, Loader2, Award, TrendingUp, Info, Sparkles } from 'lucide-react';
import api from '../services/api';

interface UserProfile {
  username: string;
  email: string;
  full_name?: string;
  age?: number;
  gender?: string;
  height?: number;
  current_weight?: number;
  target_weight?: number;
  fitness_level?: string;
  fitness_goal?: string;
  health_conditions?: string[];
  dietary_restrictions?: string[];
}

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!profile) return;

    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value === '' ? undefined : value
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      await api.put('/users/me', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl max-w-md mx-auto mt-10 animate-scaleIn">
        <p className="text-red-700 flex items-center">
          <Info className="mr-2" size={20} />
          Failed to load profile
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-xl mr-4">
            <User className="text-blue-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
              My Profile
            </h1>
            <p className="text-blue-700 text-sm mt-1">Manage your information and health goals</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-8 mb-6">

        {message && (
          <div className="bg-green-900/50 border-2 border-green-500/30 text-green-400 px-5 py-4 rounded-xl mb-6 flex items-center shadow-sm">
            <Award className="mr-3 flex-shrink-0" size={22} />
            <span className="font-medium">{message}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border-2 border-red-500/30 text-red-400 px-5 py-4 rounded-xl mb-6 flex items-center shadow-sm">
            <Info className="mr-3 flex-shrink-0" size={22} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-bold text-blue-900 mb-5 flex items-center pb-3 border-b-2 border-blue-200">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Mail className="text-blue-600" size={20} />
              </div>
              Basic Information
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Username</label>
                <input
                  type="text"
                  value={profile.username}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                />              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-200 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 text-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={profile.full_name || ''}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border-2 border-blue-200 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 text-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age || ''}
                  onChange={handleChange}
                  placeholder="Your age"
                  min="13"
                  max="120"
                  className="w-full px-4 py-3 border-2 border-blue-200 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 text-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={profile.gender || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-200 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 text-blue-900 flex appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230284c7%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                >
                  <option value="" className="bg-white">Select gender</option>
                  <option value="male" className="bg-white">Male</option>
                  <option value="female" className="bg-white">Female</option>
                  <option value="other" className="bg-white">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fitness Information */}
          <div>
            <h3 className="text-xl font-bold text-teal-900 mb-5 flex items-center pb-3 border-b-2 border-teal-200">
              <div className="p-2 bg-teal-100 rounded-lg mr-3">
                <TrendingUp className="text-teal-600" size={20} />
              </div>
              Health Metrics
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-teal-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={profile.height || ''}
                  onChange={handleChange}
                  placeholder="e.g., 170"
                  min="100"
                  max="250"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-teal-200 bg-teal-50 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all hover:border-teal-300 text-teal-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-700 mb-2">Current Weight (kg)</label>
                <input
                  type="number"
                  name="current_weight"
                  value={profile.current_weight || ''}
                  onChange={handleChange}
                  placeholder="e.g., 75"
                  min="30"
                  max="300"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-teal-200 bg-teal-50 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all hover:border-teal-300 text-teal-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-700 mb-2">Target Weight (kg)</label>
                <input
                  type="number"
                  name="target_weight"
                  value={profile.target_weight || ''}
                  onChange={handleChange}
                  placeholder="e.g., 70"
                  min="30"
                  max="300"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-teal-200 bg-teal-50 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all hover:border-teal-300 text-teal-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-700 mb-2">Health Status</label>
                <select
                  name="fitness_level"
                  value={profile.fitness_level || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-teal-200 bg-teal-50 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all hover:border-teal-300 text-teal-900 flex appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230d9488%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                >
                  <option value="" className="bg-white">Select level</option>
                  <option value="beginner" className="bg-white">Beginner</option>
                  <option value="intermediate" className="bg-white">Intermediate</option>
                  <option value="advanced" className="bg-white">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-teal-700 mb-2">Health Goal</label>
                <select
                  name="fitness_goal"
                  value={profile.fitness_goal || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-teal-200 bg-teal-50 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all hover:border-teal-300 text-teal-900 flex appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230d9488%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                >
                  <option value="" className="bg-white">Select goal</option>
                  <option value="weight_loss" className="bg-white">Weight Loss</option>
                  <option value="muscle_gain" className="bg-white">Muscle Gain</option>
                  <option value="maintenance" className="bg-white">Maintenance</option>
                  <option value="endurance" className="bg-white">Endurance</option>
                  <option value="flexibility" className="bg-white">Flexibility</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end pt-6 border-t-2 border-blue-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-8 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md font-semibold"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2" size={20} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-teal-200 p-8">
        {/* Removed decorative elements */}
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-teal-100 rounded-xl mr-4">
              <Award className="text-teal-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-teal-900">Health Profile</h2>
          </div>
          <p className="text-teal-800 mb-6 text-lg">
            Complete your profile to get personalized health and nutrition plans tailored to your goals!
          </p>
          <div className="bg-teal-50 rounded-xl p-6 border-2 border-teal-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-teal-700">Profile Completion</p>
              <p className="text-2xl font-bold text-teal-900">{Math.round((Object.values(profile).filter(v => v !== null && v !== undefined && v !== '').length / 15) * 100)}%</p>
            </div>
            <div className="w-full bg-teal-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-teal-600 h-3 rounded-full transition-all shadow-md"
                style={{ width: `${Math.round((Object.values(profile).filter(v => v !== null && v !== undefined && v !== '').length / 15) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
