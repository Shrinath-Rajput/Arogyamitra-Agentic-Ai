import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Apple, Calendar, ChevronRight, AlertCircle,
  TrendingUp, Trophy, Target, Zap, Heart, MessageCircle,
  Clock, Star, Flame
} from 'lucide-react';
import api from '../services/api';

interface UserData {
  username: string;
  full_name?: string;
  fitness_goal?: string;
  current_weight?: number;
  target_weight?: number;
}

interface Stats {
  workoutPlans: number;
  mealPlans: number;
  progressEntries: number;
  achievements: number;
  totalPoints: number;
  currentStreak: number;
}

interface RecentActivity {
  type: string;
  title: string;
  date: string;
  icon: any;
}

function Dashboard() {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats>({
    workoutPlans: 0,
    mealPlans: 0,
    progressEntries: 0,
    achievements: 0,
    totalPoints: 0,
    currentStreak: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/health')
      .then(() => {
        setBackendStatus('online');
        fetchAllData();
      })
      .catch(() => {
        setBackendStatus('offline');
        setLoading(false);
      });
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch user data
      const userResponse = await api.get('/users/me', { headers });
      setUser(userResponse.data);

      // Fetch stats
      const [workouts, meals, progress, achievements] = await Promise.all([
        api.get('/workout/history', { headers }).catch(() => ({ data: [] })),
        api.get('/meals/history', { headers }).catch(() => ({ data: [] })),
        api.get('/progress/entries', { headers }).catch(() => ({ data: [] })),
        api.get('/progress/achievements', { headers }).catch(() => ({ data: [] }))
      ]);

      const totalPoints = achievements.data.reduce((sum: number, a: any) => sum + (a.points || 0), 0);

      setStats({
        workoutPlans: workouts.data.length || 0,
        mealPlans: meals.data.length || 0,
        progressEntries: progress.data.length || 0,
        achievements: achievements.data.length || 0,
        totalPoints,
        currentStreak: progress.data.length || 0
      });

      // Build recent activities
      const activities: RecentActivity[] = [];

      if (workouts.data.length > 0) {
        activities.push({
          type: 'workout',
          title: 'Generated workout plan',
          date: new Date(workouts.data[0].created_at).toLocaleDateString(),
          icon: Activity
        });
      }

      if (meals.data.length > 0) {
        activities.push({
          type: 'meal',
          title: 'Created meal plan',
          date: new Date(meals.data[0].created_at).toLocaleDateString(),
          icon: Apple
        });
      }

      if (progress.data.length > 0) {
        activities.push({
          type: 'progress',
          title: `Logged weight: ${progress.data[progress.data.length - 1].weight} kg`,
          date: new Date(progress.data[progress.data.length - 1].date).toLocaleDateString(),
          icon: TrendingUp
        });
      }

      if (achievements.data.length > 0) {
        activities.push({
          type: 'achievement',
          title: `Unlocked: ${achievements.data[achievements.data.length - 1].title}`,
          date: new Date(achievements.data[achievements.data.length - 1].unlocked_at).toLocaleDateString(),
          icon: Trophy
        });
      }

      setRecentActivities(activities.slice(0, 4));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      setLoading(false);
    }
  };

  const motivationalQuotes = [
    "Every workout is progress!",
    "Your health is an investment, not an expense.",
    "Strong body, strong mind!",
    "Today's pain is tomorrow's power.",
    "Fitness is not about being better than someone else. It's about being better than you used to be."
  ];

  const todayQuote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-blue-900">Loading your health dashboard...</p>
          <p className="text-sm text-blue-600 mt-2">Gathering your health data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
              Welcome back, {user?.full_name || user?.username || 'User'}! 👋
            </h1>
            <p className="text-blue-700 mt-3 flex items-center text-lg">
              <Activity className="text-green-600 mr-2" size={22} />
              <span className="font-semibold text-green-600">{stats.currentStreak} day streak</span>
              <span className="mx-2">•</span>
              <span>{user?.fitness_goal || 'Getting healthier every day'}</span>
            </p>
          </div>
          <div className={`flex items-center px-5 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all ${backendStatus === 'online' ? 'bg-green-100 text-green-700 border-2 border-green-500' :
              backendStatus === 'offline' ? 'bg-red-100 text-red-700 border-2 border-red-500' : 'bg-gray-100 text-gray-700 border-2 border-gray-400'
            }`}>
            <div className={`w-2.5 h-2.5 rounded-full mr-2 ${backendStatus === 'online' ? 'bg-green-600 animate-pulse' :
                backendStatus === 'offline' ? 'bg-red-500' : 'bg-gray-400'
              }`} />
            {backendStatus === 'online' ? 'Vitals Stable' : 'Offline'}
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <Activity className="text-blue-600" size={28} />
            </div>
            <p className="text-lg md:text-xl font-semibold text-blue-900 italic">"{todayQuote}"</p>
          </div>
        </div>
      </header>

      {backendStatus === 'offline' && (
        <div className="mb-8 p-5 bg-red-950/50 border-2 border-red-500/30 rounded-2xl flex flex-col text-red-400 shadow-lg shadow-red-500/20">
          <div className="flex items-center mb-2">
            <AlertCircle className="mr-3" size={22} />
            <span className="font-bold text-lg">Backend Service Unavailable</span>
          </div>
          <p className="text-sm ml-8">
            The frontend is trying to connect to <code className="bg-red-900/50 px-2 py-1 rounded font-mono text-xs border border-red-500/30">http://127.0.0.1:8000</code>.
            Please ensure the backend server is running and CORS is correctly configured.
          </p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="text-blue-600" size={26} />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Total</span>
          </div>
          <div className="text-3xl font-bold text-blue-900">{stats.workoutPlans}</div>
          <div className="text-sm font-medium text-blue-700 mt-1">Workout Plans</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-green-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Apple className="text-green-600" size={26} />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Total</span>
          </div>
          <div className="text-3xl font-bold text-green-900">{stats.mealPlans}</div>
          <div className="text-sm font-medium text-green-700 mt-1">Meal Plans</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-teal-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <TrendingUp className="text-teal-600" size={26} />
            </div>
            <span className="text-xs font-semibold text-teal-600 bg-teal-100 px-2 py-1 rounded-full">Logged</span>
          </div>
          <div className="text-3xl font-bold text-teal-900">{stats.progressEntries}</div>
          <div className="text-sm font-medium text-teal-700 mt-1">Progress Entries</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-amber-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Trophy className="text-amber-600" size={26} />
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">{stats.totalPoints} pts</span>
          </div>
          <div className="text-3xl font-bold text-amber-900">{stats.achievements}</div>
          <div className="text-sm font-medium text-amber-700 mt-1">Achievements</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Action Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Workout Plan Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-300 hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-xl mr-4">
                  <Activity className="text-blue-600" size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900">Workout Plans</h2>
                  <p className="text-blue-600 text-sm">Personalized routines</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-blue-700">Generated Plans</span>
                  <span className="font-bold text-lg text-blue-900">{stats.workoutPlans}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/workout')}
                className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md"
              >
                Generate New Plan <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          </div>

          {/* Meal Plan Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-300 hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-xl mr-4">
                  <Apple className="text-green-600" size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-green-900">Meal Plans</h2>
                  <p className="text-green-600 text-sm">Nutrition guidance</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-green-700">Created Plans</span>
                  <span className="font-bold text-lg text-green-900">{stats.mealPlans}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/meals')}
                className="w-full flex items-center justify-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md"
              >
                Create Meal Plan <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-teal-300 hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-teal-100 rounded-xl mr-4">
                  <TrendingUp className="text-teal-600" size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-teal-900">Progress</h2>
                  <p className="text-teal-600 text-sm">Track your journey</p>
                </div>
              </div>
              <div className="mb-4">
                {user?.current_weight && user?.target_weight && (
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-teal-700">Goal</span>
                    <span className="font-bold text-lg text-teal-900">{user.current_weight} → {user.target_weight} kg</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-teal-700">Entries</span>
                  <span className="font-bold text-lg text-teal-900">{stats.progressEntries}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/progress')}
                className="w-full flex items-center justify-center bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-all font-semibold shadow-md"
              >
                Log Progress <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          </div>

          {/* AI Coach Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-indigo-300 hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-xl mr-4">
                  <MessageCircle className="text-indigo-600" size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-indigo-900">AI Health Coach</h2>
                  <p className="text-indigo-600 text-sm">Chat with AROMI</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-indigo-700">
                  Get personalized advice and answers to your wellness questions
                </p>
              </div>
              <button
                onClick={() => navigate('/coach')}
                className="w-full flex items-center justify-center bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all font-semibold shadow-md"
              >
                Start Chat <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Recent Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-200 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4 pb-3 border-b-2 border-blue-200">
              <div className="p-2 bg-blue-100 rounded-lg mr-2">
                <Clock className="text-blue-600" size={20} />
              </div>
              <h3 className="text-lg font-bold text-blue-900">Recent Activity</h3>
            </div>
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="p-2 bg-white rounded-lg mr-3 shadow-sm border border-blue-200">
                        <Icon size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-blue-900 truncate">{activity.title}</p>
                        <p className="text-xs text-blue-600 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Zap className="mx-auto text-blue-300 mb-3" size={40} />
                <p className="text-sm font-semibold text-blue-700">No activity yet</p>
                <p className="text-xs text-blue-600 mt-1">Start your wellness journey!</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-md border-2 border-green-200 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4 pb-3 border-b-2 border-green-200">
              <div className="p-2 bg-green-100 rounded-lg mr-2">
                <Zap className="text-green-600" size={20} />
              </div>
              <h3 className="text-lg font-bold text-green-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/profile')}
                className="w-full flex items-center p-3 bg-green-50 rounded-lg border border-green-200 hover:border-green-400 hover:bg-green-100 hover:shadow-md transition-all text-left text-green-900"
              >
                <Target size={20} className="mr-3 text-green-600" />
                <span className="text-sm font-semibold">Update Profile</span>
                <ChevronRight size={16} className="ml-auto text-green-600" />
              </button>
              <button
                onClick={() => navigate('/progress')}
                className="w-full flex items-center p-3 bg-green-50 rounded-lg border border-green-200 hover:border-green-400 hover:bg-green-100 hover:shadow-md transition-all text-left text-green-900"
              >
                <Heart size={20} className="mr-3 text-green-600" />
                <span className="text-sm font-semibold">Log Vitals</span>
                <ChevronRight size={16} className="ml-auto text-green-600" />
              </button>
              <button
                onClick={() => navigate('/coach')}
                className="w-full flex items-center p-3 bg-green-50 rounded-lg border border-green-200 hover:border-green-400 hover:bg-green-100 hover:shadow-md transition-all text-left text-green-900"
              >
                <MessageCircle size={20} className="mr-3 text-green-600" />
                <span className="text-sm font-semibold">Consult AI</span>
                <ChevronRight size={16} className="ml-auto text-green-600" />
              </button>
            </div>
          </div>

          {/* Achievements Preview */}
          {stats.achievements > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-amber-300 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <Trophy size={28} className="text-amber-600 mr-2" />
                <h3 className="text-lg font-bold text-amber-900">Health Milestones</h3>
              </div>
              <div className="bg-amber-50 rounded-xl p-5 mb-4 border border-amber-200">
                <div className="text-4xl font-bold text-amber-900">{stats.achievements}</div>
                <div className="text-sm text-amber-700 mt-1 font-semibold">Badges Earned</div>
              </div>
              <div className="text-sm mb-4">
                <div className="flex justify-between mb-1 bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <span className="text-amber-700 font-medium">Health Points</span>
                  <span className="font-bold text-lg text-amber-900">{stats.totalPoints}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/progress')}
                className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-all font-bold text-sm shadow-md"
              >
                View All Records <ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
