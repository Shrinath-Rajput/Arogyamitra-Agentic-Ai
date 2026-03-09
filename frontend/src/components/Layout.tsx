import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, Activity, Apple, TrendingUp, Bot, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-50 border-b-2 border-blue-200">
        <h1 className="text-2xl font-bold text-blue-900">
          ArogyaMitra
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-blue-100 transition-colors text-blue-900"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`
        w-full md:w-72 bg-white shadow-xl border-r-2 border-blue-200
        md:block fixed md:static top-0 left-0 h-full z-40
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex flex-col h-full">
          {/* Logo - Desktop Only */}
          <div className="hidden md:block mb-8">
            <h1 className="text-3xl font-bold text-blue-900">
              ArogyaMitra
            </h1>
            <p className="text-xs text-blue-600 mt-1 font-medium">✨ Your AI Health Companion</p>
          </div>

          {/* Menu Items */}
          <ul className="space-y-2 flex-1 mt-4 md:mt-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.path}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center p-3.5 rounded-xl transition-all group relative overflow-hidden ${isActive(item.path)
                        ? 'bg-blue-600 text-white shadow-md border-2 border-blue-300'
                        : 'text-blue-700 hover:bg-blue-50 hover:text-blue-900 border-2 border-transparent hover:border-blue-200'
                      }`}
                  >
                    {/* Active Indicator */}
                    {isActive(item.path) && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-400 rounded-r-full"></div>
                    )}

                    <Icon
                      className={`mr-3 transition-transform group-hover:scale-110`}
                      size={22}
                    />
                    <span className="font-medium">{item.label}</span>

                    {/* Hover Effect */}
                    {!isActive(item.path) && (
                      <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-6 flex items-center p-3.5 text-red-600 hover:bg-red-50 rounded-xl transition-all group border-2 border-transparent hover:border-red-200"
          >
            <LogOut className="mr-3" size={22} />
            <span className="font-medium">Logout</span>
          </button>

          {/* Footer */}
          <div className="hidden md:block mt-4 pt-4 border-t-2 border-blue-200">
            <p className="text-xs text-gray-500 text-center font-medium">
              © 2026 ArogyaMitra
            </p>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
