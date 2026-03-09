import { useState, useEffect } from 'react';
import { LineChart, Activity, TrendingUp, Target, Award, Trophy, Sparkles, Loader2 } from 'lucide-react';
import api from '../services/api';

// Progress tracking component
interface ProgressEntry {
  id: number;
  date: string;
  weight: number;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  points: number;
  charity_contribution: number;
  unlocked_at: string;
}

interface Stats {
  total_entries: number;
  first_weight?: number;
  current_weight?: number;
  target_weight?: number;
  weight_change: number;
  progress_percentage: number;
  total_points: number;
  total_charity: number;
  achievement_count: number;
}

function Progress() {
  const [weight, setWeight] = useState('');
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [entriesRes, achievementsRes, statsRes] = await Promise.all([
        api.get('/progress/entries', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/progress/achievements', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/progress/stats', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setEntries(entriesRes.data);
      setAchievements(achievementsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch progress data', error);
    }
  };

  const addEntry = async () => {
    if (!weight || isNaN(parseFloat(weight))) {
      alert('Please enter a valid weight');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.post('/progress/entry',
        { weight: parseFloat(weight) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWeight('');
      fetchData();
    } catch (error) {
      alert('Failed to save progress entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-200">
        <div className="flex items-center">
          <div className="p-3 bg-teal-100 rounded-xl mr-4">
            <TrendingUp className="text-teal-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-teal-900 flex items-center gap-2">
              Vitals Tracking
            </h1>
            <p className="text-teal-700 text-sm mt-1">Track your health journey and milestones</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && stats.total_entries > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border-2 border-teal-200 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-teal-700">Current Weight</div>
              <Target className="text-teal-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-teal-900">{stats.current_weight?.toFixed(1)} <span className="text-lg">kg</span></div>
          </div>
          <div className="bg-white p-5 rounded-xl border-2 border-blue-200 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-blue-700">Weight Change</div>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div className={`text-3xl font-bold ${stats.weight_change > 0 ? 'text-green-600' : 'text-blue-600'}`}>
              {stats.weight_change > 0 ? '-' : '+'}{Math.abs(stats.weight_change).toFixed(1)} <span className="text-lg">kg</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border-2 border-green-200 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-green-700">Progress</div>
              <Activity className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-green-900">{stats.progress_percentage}<span className="text-lg">%</span></div>
          </div>
          <div className="bg-white p-5 rounded-xl border-2 border-amber-200 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-amber-700">Charity Impact</div>
              <Award className="text-amber-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-amber-900">₹{stats.total_charity.toFixed(2)}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Input Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border-2 border-teal-200 shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-xl font-bold mb-5 flex items-center pb-3 border-b-2 border-teal-200 text-teal-900">
            <div className="p-2 bg-teal-100 rounded-lg mr-3">
              <Target className="text-teal-600" size={20} />
            </div>
            Update Vitals
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-2">Current Weight (kg)</label>
              <input
                type="number"
                className="w-full px-4 py-3 border-2 border-teal-200 bg-teal-50 text-teal-900 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all hover:border-teal-300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 75.5"
                step="0.1"
              />
            </div>
            <button
              onClick={addEntry}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2" size={20} />
                  Save Entry
                </>
              )}
            </button>
          </div>

          {stats && stats.target_weight && (
            <div className="mt-6 p-5 bg-teal-50 rounded-lg border-2 border-teal-200">
              <div className="text-sm font-semibold text-teal-600 mb-2">Target Weight</div>
              <div className="text-2xl font-bold text-teal-900 mb-2">{stats.target_weight} kg</div>
              {stats.current_weight && (
                <div className="text-sm text-teal-700 flex items-center">
                  <Target className="mr-1" size={14} />
                  {Math.abs(stats.current_weight - stats.target_weight).toFixed(1)} kg to go
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress History */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-xl font-bold mb-5 flex items-center pb-3 border-b-2 border-blue-200 text-blue-900">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Activity className="text-blue-600" size={20} />
            </div>
            Vitals History
          </h2>
          {entries.length === 0 ? (
            <div className="text-center py-12 text-blue-700">
              <LineChart className="mx-auto mb-4 text-blue-300" size={64} />
              <p className="text-lg font-semibold text-blue-800 mb-2">No progress entries yet</p>
              <p className="text-sm text-blue-600">Add your first vitals entry to start tracking!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:shadow-md transition-all border-2 border-blue-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-blue-200">
                      <TrendingUp className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-blue-900">{entry.weight} kg</div>
                      <div className="text-sm text-blue-600">
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-blue-600">
                    <Award size={22} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-green-200">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-green-100 rounded-xl mr-4 border border-green-200">
            <Trophy size={36} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-green-900">Health Milestones</h2>
            <p className="text-green-700 text-lg">Unlocked {achievements.length} milestones • {stats?.total_points || 0} points</p>
          </div>
        </div>

        {achievements.length === 0 ? (
          <div className="bg-green-50 rounded-lg p-8 text-center border-2 border-green-200">
            <Award className="mx-auto mb-4 text-green-400" size={64} />
            <p className="text-2xl font-bold mb-3 text-green-900">Keep maintaining vitals! The first milestone awaits</p>
            <p className="text-lg text-green-700">Track your progress regularly to unlock milestones and contribute to charity</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className="bg-green-50 p-5 rounded-lg border-2 border-green-200 hover:shadow-lg hover:border-green-300 transition-all"
              >
                <div className="flex items-start">
                  <div className="p-2 bg-green-100 rounded-lg mr-3 border border-green-200">
                    <Award size={24} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg mb-1 text-green-900">{achievement.title}</div>
                    <div className="text-sm text-green-700 mb-3">{achievement.description}</div>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="px-2 py-1 bg-green-100 rounded-lg text-green-800 border border-green-200">{achievement.points} pts</span>
                      <span className="px-2 py-1 bg-green-100 rounded-lg text-green-800 border border-green-200">₹{achievement.charity_contribution} impact</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Progress;
