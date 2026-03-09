import React, { useRef, useState, MouseEvent } from 'react';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    glareIntensity?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
    children,
    className = '',
    intensity = 15,
    glareIntensity = 0.4,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Mouse position relative to card
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate rotation (-1 to 1)
        const rotateY = ((mouseX / width) - 0.5) * 2;
        const rotateX = ((mouseY / height) - 0.5) * -2; // Invert Y

        setRotate({
            x: rotateX * intensity,
            y: rotateY * intensity
        });

        // Calculate glare position
        setGlare({
            x: (mouseX / width) * 100,
            y: (mouseY / height) * 100,
            opacity: glareIntensity
        });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
        setGlare(prev => ({ ...prev, opacity: 0 }));
    };

    return (
        <div
            className={`perspective-container ${className}`}
            style={{ perspective: '1000px' }}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full h-full transition-all duration-200 ease-out preserve-3d"
                style={{
                    transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                    transformStyle: 'preserve-3d',
                }}
            >
                {children}

                {/* Dynamic Glare Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none rounded-inherit mix-blend-overlay transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 60%)`,
                        opacity: glare.opacity,
                        borderRadius: 'inherit'
                    }}
                />

                {/* 3D Depth Shadow */}
                <div
                    className="absolute -inset-4 bg-black/20 blur-xl pointer-events-none -z-10 rounded-[inherit] transition-all duration-200"
                    style={{
                        transform: `translateZ(-50px) translateX(${rotate.y * -1}px) translateY(${rotate.x}px)`,
                    }}
                />
            </div>
        </div>
    );
};
