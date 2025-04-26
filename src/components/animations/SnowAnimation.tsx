// src/components/animations/SnowAnimation.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Basic snowflake element
const Snowflake = ({ x, y, size, duration, delay }: { x: number; y: number; size: number; duration: number; delay: number }) => (
  <motion.div
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: '-10px',
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '50%',
      opacity: 0.8,
      pointerEvents: 'none',
      boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
    }}
    initial={{ y: -10, x: `${x}%` }}
    animate={{
      y: '110vh',
      x: [`${x}%`, `${x + Math.random() * 10 - 5}%`, `${x}%`], // Gentle horizontal drift
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'linear',
      delay: delay,
    }}
  />
);

export function SnowAnimation() {
  const numFlakes = 80; // Adjust density

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
       aria-hidden="true"
    >
      {Array.from({ length: numFlakes }).map((_, i) => {
        const x = Math.random() * 100;
        const size = Math.random() * 4 + 2; // Size between 2px and 6px
        const duration = Math.random() * 5 + 5; // Duration between 5s and 10s
        const delay = Math.random() * duration; // Stagger start times
         const y = Math.random() * 100; // Initial random Y (though animation starts from top)
        return <Snowflake key={i} x={x} y={y} size={size} duration={duration} delay={delay} />;
      })}
    </div>
  );
}
