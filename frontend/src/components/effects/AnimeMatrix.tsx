import React, { useEffect, useRef, useState } from 'react';

interface AnimeMatrixProps {
  text?: string;
  pattern?: "diagonal" | "rain" | "pulse" | "random" | "dna";
  color?: string;
  speed?: number;
  rows?: number;
  cols?: number;
  className?: string;
}

export const AnimeMatrix: React.FC<AnimeMatrixProps> = ({
  text,
  pattern = "pulse",
  color = "#06b6d4", // Medical Cyan
  speed = 50,
  rows = 16,
  cols = 32,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dots, setDots] = useState<number[][]>([]);

  useEffect(() => {
    // Initialize empty grid
    const grid = Array(rows).fill(0).map(() => Array(cols).fill(0));
    setDots(grid);

    let animationFrameId: number;
    let step = 0;

    const render = () => {
      step++;
      const newGrid = Array(rows).fill(0).map(() => Array(cols).fill(0));

      if (pattern === 'diagonal') {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            newGrid[r][c] = (r + c - Math.floor(step / speed)) % 10 === 0 ? 1 : 0.1;
          }
        }
      } else if (pattern === 'rain') {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            newGrid[r][c] = (Math.sin(r * 0.5 - step / speed) + Math.cos(c * 0.8)) > 0.5 ? 1 : 0.1;
          }
        }
      } else if (pattern === 'pulse') {
        const centerR = rows / 2;
        const centerC = cols / 2;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const dist = Math.sqrt(Math.pow(r - centerR, 2) + Math.pow(c - centerC, 2));
            newGrid[r][c] = Math.max(0.1, Math.sin(dist * 0.5 - step / speed));
          }
        }
      } else if (pattern === 'dna') {
        // Simulating a DNA double helix wrap
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const wave1 = Math.sin(c * 0.2 - step / speed) * (rows / 4) + (rows / 2);
            const wave2 = Math.cos(c * 0.2 - step / speed) * (rows / 4) + (rows / 2);
            if (Math.abs(r - wave1) < 1.5 || Math.abs(r - wave2) < 1.5) {
              newGrid[r][c] = 1;
            } else if (c % 4 === 0 && r > Math.min(wave1, wave2) && r < Math.max(wave1, wave2)) {
              // Connecting logic
              newGrid[r][c] = 0.5;
            } else {
              newGrid[r][c] = 0.05;
            }
          }
        }
      } else {
        // Random tech noise
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            newGrid[r][c] = Math.random() > 0.8 ? 1 : 0.1;
          }
        }
      }

      setDots(newGrid);
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [rows, cols, pattern, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw dots
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const dotRadius = Math.min(width / cols, height / rows) * 0.4;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * (width / cols) + (width / cols) / 2;
        const y = r * (height / rows) + (height / rows) / 2;
        const intensity = dots[r]?.[c] || 0.1;

        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);

        // Add neon glow
        if (intensity > 0.5) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = text ? color : color; // simplify for now, modify for text later
        ctx.globalAlpha = intensity;
        ctx.fill();
      }
    }
  }, [dots, color, rows, cols, text]);

  return (
    <div className={`relative bg-medical-dark p-4 rounded-xl border border-medical-gray shadow-neon-cyan overflow-hidden ${className}`}>
      {/* Hexagon/Grid texture overlay suitable for medical/tech */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <canvas
        ref={canvasRef}
        width={cols * 10}
        height={rows * 10}
        className="w-full h-full filter blur-[0.5px]"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute top-4 left-4 flex items-center justify-center p-2 bg-black/40 backdrop-blur rounded-lg border border-medical-cyan/20">
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-medical-cyan animate-pulse"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-medical-teal/50"></div>
          <span className="text-[10px] text-medical-cyan uppercase tracking-widest ml-1 font-mono opacity-80">Biometrics Active</span>
        </div>
      </div>
    </div>
  );
};
