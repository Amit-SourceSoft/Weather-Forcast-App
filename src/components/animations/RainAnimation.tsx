// src/components/animations/RainAnimation.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion'; // Example using framer-motion

// Basic raindrop SVG or element
const RainDrop = ({ x, y, duration }: { x: number; y: number; duration: number }) => (
  <motion.div
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: '-10px', // Start above the screen
      width: '2px',
      height: '15px',
      background: 'linear-gradient(to bottom, rgba(173, 216, 230, 0), rgba(173, 216, 230, 0.8))', // Fading light blue
      borderRadius: '50%',
      opacity: 0.6,
      pointerEvents: 'none',
    }}
    initial={{ y: -10 }}
    animate={{ y: '110vh' }} // Animate to below the viewport height
    transition={{
      duration: duration,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'linear',
      delay: Math.random() * duration, // Stagger start times slightly
    }}
  />
);

export function RainAnimation() {
  const numDrops = 100; // Adjust density

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none', // Allow interaction with elements behind
        zIndex: 0, // Behind main content but visible
      }}
      aria-hidden="true"
    >
      {Array.from({ length: numDrops }).map((_, i) => {
        const x = Math.random() * 100; // Random horizontal position
        const duration = Math.random() * 1 + 0.5; // Random duration between 0.5s and 1.5s
        const y = Math.random() * 100; // Initial random Y to stagger starts (though animation starts from top)
        return <RainDrop key={i} x={x} y={y} duration={duration} />;
      })}
    </div>
  );
}
