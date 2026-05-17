import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, Activity, Apple, TrendingUp, Bot, User, Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import GradientBg from './GradientBg';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/workout', label: 'Workout Plan', icon: Activity },
    { path: '/meals', label: 'Meal Plan', icon: Apple },
    { path: '/progress', label: 'Progress', icon: TrendingUp },
    { path: '/coach', label: 'AI Coach', icon: Bot },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white/10 backdrop-blur-xl border-b border-white/20 z-50">
        <motion.div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
            <Heart className="text-white w-6 h-6" fill="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ArogyaMitra</h1>
          </div>
        </motion.div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`
        w-full md:w-72 fixed md:static top-0 left-0 h-screen md:h-auto
        bg-white/10 backdrop-blur-xl border-r border-white/20
        md:border-r md:border-white/20
        flex flex-col
        z-40 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        pt-20 md:pt-0
      `}>
        <div className="p-6 flex flex-col h-full">
          {/* Logo - Desktop Only */}
          <motion.div
            className="hidden md:block mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg">
                <Heart className="text-white w-7 h-7" fill="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ArogyaMitra</h1>
                <p className="text-xs text-cyan-300 font-medium">AI Health Companion</p>
              </div>
            </div>
          </motion.div>

          {/* Menu Items */}
          <ul className="space-y-3 flex-1 mt-4 md:mt-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center px-4 py-3 rounded-xl transition-all group relative overflow-hidden
                      ${isActive(item.path)
                        ? 'bg-gradient-to-r from-cyan-500/30 to-teal-500/30 text-white shadow-lg border border-cyan-400/50'
                        : 'text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 hover:border-cyan-400/30'
                      }
                    `}
                  >
                    {/* Active Indicator */}
                    {isActive(item.path) && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-teal-500 rounded-r-full"
                        layoutId="active-indicator"
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                    )}

                    <Icon className={`mr-3 transition-transform group-hover:scale-110 ${isActive(item.path) ? 'text-cyan-300' : 'text-gray-400'}`} size={20} />
                    <span className="font-semibold text-sm">{item.label}</span>

                    {!isActive(item.path) && (
                      <div className="ml-auto w-1.5 h-1.5 bg-white/0 rounded-full group-hover:bg-cyan-400/50 transition-all"></div>
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {/* Logout Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            onClick={handleLogout}
            className="mt-6 flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group border border-red-500/20 hover:border-red-400/50"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold text-sm">Logout</span>
          </motion.button>

          {/* Footer */}
          <motion.div
            className="hidden md:block mt-4 pt-4 border-t border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-xs text-gray-400 text-center font-medium">
              © 2026 ArogyaMitra
            </p>
            <p className="text-xs text-cyan-400 text-center mt-1">
              AI Health Companion
            </p>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 bg-black/70 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        ></motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-20">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
