'use client';

import React from 'react';

interface GrainEffectProps {
  className?: string;
}

const GrainEffect: React.FC<GrainEffectProps> = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 h-screen w-full opacity-20 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        filter: 'contrast(200%) brightness(150%)',
      }}
    />
  );
};

export default GrainEffect;
