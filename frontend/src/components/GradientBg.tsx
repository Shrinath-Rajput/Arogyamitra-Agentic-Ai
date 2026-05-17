import React from 'react';

interface GradientBgProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'emerald' | 'cyan';
  children?: React.ReactNode;
  className?: string;
}

export const GradientBg: React.FC<GradientBgProps> = ({
  variant = 'primary',
  children,
  className = '',
}) => {
  const variants = {
    primary: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
    secondary: 'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900',
    tertiary: 'bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900',
    emerald: 'bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950',
    cyan: 'bg-gradient-to-br from-slate-950 via-cyan-950 to-teal-950',
  };

  return (
    <div className={`relative overflow-hidden ${variants[variant]} ${className}`}>
      {/* Animated Blob 1 */}
      <div
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-full blur-3xl animate-float"
        style={{ animationDelay: '0s' }}
      ></div>

      {/* Animated Blob 2 */}
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/30 to-transparent rounded-full blur-3xl animate-float"
        style={{ animationDelay: '2s' }}
      ></div>

      {/* Animated Blob 3 */}
      <div
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-float"
        style={{ animationDelay: '4s' }}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GradientBg;
