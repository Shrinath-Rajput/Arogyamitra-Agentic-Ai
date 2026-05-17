import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'cyan' | 'emerald' | 'blue' | 'teal' | 'amber' | 'red';
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  trend = 'neutral',
  color = 'cyan',
  delay = 0,
}) => {
  const colorMap = {
    cyan: {
      bg: 'bg-cyan-50',
      icon: 'text-cyan-600',
      accent: 'bg-cyan-100',
      border: 'border-cyan-200',
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      accent: 'bg-emerald-100',
      border: 'border-emerald-200',
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      accent: 'bg-blue-100',
      border: 'border-blue-200',
    },
    teal: {
      bg: 'bg-teal-50',
      icon: 'text-teal-600',
      accent: 'bg-teal-100',
      border: 'border-teal-200',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      accent: 'bg-amber-100',
      border: 'border-amber-200',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      accent: 'bg-red-100',
      border: 'border-red-200',
    },
  };

  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <div
        className={`
          relative rounded-2xl overflow-hidden p-6
          bg-white/90 backdrop-blur-lg
          border border-white/40 shadow-glass
          transition-all duration-300 hover:shadow-xl
          group
        `}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 opacity-5 ${colors.bg}`}></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${colors.accent} transition-transform group-hover:scale-110`}>
              <Icon className={`${colors.icon} w-6 h-6`} />
            </div>
          </div>

          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {change && (
              <span
                className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                  trend === 'up'
                    ? 'bg-emerald-100 text-emerald-700'
                    : trend === 'down'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
