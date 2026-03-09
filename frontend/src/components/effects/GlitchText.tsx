import React, { useEffect, useState } from 'react';

// Renamed from GlitchText to PulseText logically, but keeping filename for import compatibility right now
interface PulseTextProps {
    text: string;
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    speed?: 'slow' | 'normal' | 'fast';
    color?: string;
    intensity?: 'low' | 'medium' | 'high';
}

export const GlitchText: React.FC<PulseTextProps> = ({
    text,
    as: Component = 'h1',
    className = '',
    speed = 'normal',
    color = '#06b6d4', // Medical Cyan
    intensity = 'medium'
}) => {
    const [isPulsing, setIsPulsing] = useState(false);

    useEffect(() => {
        // Trigger heartbeat double-pulse
        const triggerPulse = () => {
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 150);

            setTimeout(() => {
                setIsPulsing(true);
                setTimeout(() => setIsPulsing(false), 150);
            }, 300);

            // Next pulse interval based on speed
            const nextDelay = speed === 'fast'
                ? 800
                : speed === 'slow'
                    ? 2000
                    : 1200;

            timeoutId = setTimeout(triggerPulse, nextDelay);
        };

        let timeoutId = setTimeout(triggerPulse, 500);
        return () => clearTimeout(timeoutId);
    }, [speed]);

    const blurAmount = intensity === 'high' ? '4px' : intensity === 'low' ? '1px' : '2px';

    return (
        <Component
            className={`relative inline-block font-bold tracking-widest ${className}`}
            style={{
                textShadow: isPulsing ? `0 0 ${blurAmount} ${color}, 0 0 10px ${color}` : 'none',
                color: isPulsing ? '#ffffff' : color,
                transition: 'all 0.1s ease-in-out'
            }}
        >
            {text}
        </Component>
    );
};
