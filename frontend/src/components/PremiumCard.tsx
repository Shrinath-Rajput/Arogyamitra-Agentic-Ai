import React from 'react';
import { motion } from 'framer-motion';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: 'cyan' | 'emerald' | 'teal' | 'accent' | 'none';
  delay?: number;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className = '',
  hover = true,
  gradient = 'none',
  delay = 0,
}) => {
  const gradientBgs = {
    cyan: 'from-cyan-500/10 to-teal-500/10',
    emerald: 'from-emerald-500/10 to-teal-500/10',
    teal: 'from-teal-500/10 to-cyan-500/10',
    accent: 'from-blue-500/10 to-cyan-500/10',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -5, transition: { duration: 0.3 } } : undefined}
    >
      <div
        className={`
          relative rounded-2xl overflow-hidden
          bg-white/80 backdrop-blur-xl
          border border-white/30 shadow-glass
          transition-all duration-300
          ${gradient !== 'none' ? `bg-gradient-to-br ${gradientBgs[gradient]}` : ''}
          ${hover ? 'hover:shadow-xl hover:border-white/50 hover:bg-white/90' : ''}
          ${className}
        `}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumCard;
