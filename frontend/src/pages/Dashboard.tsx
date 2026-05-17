import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Apple, Calendar, ChevronRight, AlertCircle,
  TrendingUp, Trophy, Target, Zap, Heart, MessageCircle,
  Clock, Star, Flame, ArrowRight, Bot
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import PremiumCard from '../components/PremiumCard';
import StatCard from '../components/StatCard';
import AnimatedButton from '../components/AnimatedButton';

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

  const quickActions = [
    { label: 'New Workout', path: '/workout', icon: Zap, color: 'cyan' },
    { label: 'New Meal Plan', path: '/meals', icon: Apple, color: 'emerald' },
    { label: 'Log Progress', path: '/progress', icon: TrendingUp, color: 'blue' },
    { label: 'AI Coach', path: '/coach', icon: Bot, color: 'teal' },
  ];

  if (loading) {
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
          <p className="text-xl font-semibold text-white mb-2">Loading your health dashboard...</p>
          <p className="text-sm text-gray-400">Gathering your health data</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-white mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">{user?.full_name || user?.username || 'User'}</span>! 👋
              </motion.h1>
              <motion.p
                className="text-gray-400 mt-2 flex items-center gap-2 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Flame className="text-orange-500 w-5 h-5" />
                <span className="font-semibold text-cyan-400">{stats.currentStreak} day streak</span>
                <span className="mx-2 text-gray-600">•</span>
                <span className="text-gray-300">{user?.fitness_goal || 'Getting healthier every day'}</span>
              </motion.p>
            </div>

            {/* Status Badge */}
            <motion.div
              className={`
                flex items-center px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-xl border
                ${backendStatus === 'online'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : backendStatus === 'offline'
                  ? 'bg-red-500/20 text-red-300 border-red-500/50'
                  : 'bg-gray-500/20 text-gray-300 border-gray-500/50'
                }
              `}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className={`w-2.5 h-2.5 rounded-full mr-2 ${
                  backendStatus === 'online' ? 'bg-emerald-400' : backendStatus === 'offline' ? 'bg-red-400' : 'bg-gray-400'
                }`}
                animate={backendStatus === 'online' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {backendStatus === 'online' ? '✓ System Online' : '✗ Offline'}
            </motion.div>
          </div>

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <PremiumCard gradient="accent" className="p-6">
              <div className="flex items-start gap-4">
                <motion.div
                  className="p-3 bg-cyan-500/20 rounded-xl flex-shrink-0"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Heart className="text-cyan-400 w-6 h-6" fill="currentColor" />
                </motion.div>
                <p className="text-lg md:text-xl font-semibold text-white italic leading-relaxed">
                  "{todayQuote}"
                </p>
              </div>
            </PremiumCard>
          </motion.div>
        </motion.header>

        {/* Backend Status Alert */}
        {backendStatus === 'offline' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl flex items-start gap-3 shadow-lg"
          >
            <AlertCircle className="text-red-400 w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-300 mb-1">Backend Service Unavailable</h3>
              <p className="text-red-400 text-sm">
                Please ensure the backend server is running at <code className="bg-red-900/30 px-2 py-1 rounded font-mono text-xs">http://127.0.0.1:8000</code>
              </p>
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <StatCard
            icon={Activity}
            label="Workout Plans"
            value={stats.workoutPlans}
            color="cyan"
            delay={0}
          />
          <StatCard
            icon={Apple}
            label="Meal Plans"
            value={stats.mealPlans}
            color="emerald"
            delay={0.1}
          />
          <StatCard
            icon={TrendingUp}
            label="Progress Entries"
            value={stats.progressEntries}
            color="blue"
            delay={0.2}
          />
          <StatCard
            icon={Trophy}
            label="Achievements"
            value={stats.achievements}
            color="amber"
            delay={0.3}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const colorMap = {
              cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/30 hover:border-cyan-400',
              emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-400',
              blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/30 hover:border-blue-400',
              teal: 'from-teal-500/10 to-teal-500/5 border-teal-500/30 hover:border-teal-400',
            };

            return (
              <motion.button
                key={action.path}
                onClick={() => navigate(action.path)}
                className={`relative rounded-xl p-4 border backdrop-blur-xl transition-all duration-300 group overflow-hidden bg-gradient-to-br ${colorMap[action.color as keyof typeof colorMap]}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-6 h-6 ${
                      action.color === 'cyan' ? 'text-cyan-400' :
                      action.color === 'emerald' ? 'text-emerald-400' :
                      action.color === 'blue' ? 'text-blue-400' :
                      'text-teal-400'
                    } group-hover:scale-110 transition-transform`} />
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                  <p className="text-white font-semibold text-sm text-left">{action.label}</p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Cards */}
          <motion.div
            className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Workout Card */}
            <PremiumCard gradient="cyan" className="p-6 group cursor-pointer" onClick={() => navigate('/workout')}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Workout Plans</h2>
                  <p className="text-gray-400 text-sm">Personalized routines</p>
                </div>
                <motion.div
                  className="p-3 bg-cyan-500/20 rounded-xl group-hover:bg-cyan-500/30 transition-colors"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Activity className="text-cyan-400 w-6 h-6" />
                </motion.div>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stats.workoutPlans}</div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.workoutPlans * 20, 100)}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                  ></motion.div>
                </div>
              </div>
              <AnimatedButton variant="primary" size="md" className="w-full">
                Create New <ChevronRight size={16} />
              </AnimatedButton>
            </PremiumCard>

            {/* Meals Card */}
            <PremiumCard gradient="emerald" className="p-6 group cursor-pointer" onClick={() => navigate('/meals')}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Meal Plans</h2>
                  <p className="text-gray-400 text-sm">Nutrition guidance</p>
                </div>
                <motion.div
                  className="p-3 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-colors"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  <Apple className="text-emerald-400 w-6 h-6" />
                </motion.div>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{stats.mealPlans}</div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.mealPlans * 20, 100)}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                  ></motion.div>
                </div>
              </div>
              <AnimatedButton variant="primary" size="md" className="w-full">
                Create New <ChevronRight size={16} />
              </AnimatedButton>
            </PremiumCard>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <PremiumCard className="p-6 h-full">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0 mt-1">
                          <Icon className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-50" />
                    <p className="text-gray-400 text-sm">No recent activity yet</p>
                    <p className="text-gray-500 text-xs mt-1">Start by creating your first plan</p>
                  </div>
                )}
              </div>
            </PremiumCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
