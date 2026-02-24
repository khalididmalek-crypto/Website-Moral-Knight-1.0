import React, { memo } from 'react';

interface Props {
  active: boolean;
}

export const ProjectorOverlay: React.FC<Props> = memo(({ active }) => {
  if (!active) return null;

  return (
    <>
      {/* Static Grain */}
      <div className="projector-noise" aria-hidden="true" />

      {/* Subtle Flicker Animation */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] bg-white mix-blend-overlay opacity-[0.015]"
        aria-hidden="true"
      />

      {/* Vignette - Minimal */}
      <div
        className="fixed inset-0 pointer-events-none z-[99] bg-[radial-gradient(circle_at_center,transparent_70%,rgba(0,0,0,0.02)_90%,rgba(0,0,0,0.08)_100%)]"
        aria-hidden="true"
      />

      {/* Projector Dust & Scratches */}
      <div className="projector-dust" aria-hidden="true" />
      <div className="projector-scratch" aria-hidden="true" />

      {/* Top Right Projector Glare - Subtler/Minimal */}
      <div
        className="fixed top-0 right-0 w-[85vw] h-[85vh] pointer-events-none z-[98] opacity-60"
        style={{
          background: 'radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 35%, transparent 70%)',
          filter: 'blur(60px)',
          mixBlendMode: 'overlay'
        }}
        aria-hidden="true"
      />

      {/* Top Right Sand Grain Effect - Minimal */}
      <div
        className="fixed top-0 right-0 w-[50vw] h-[50vh] pointer-events-none z-[97] opacity-60"
        style={{
          maskImage: 'radial-gradient(circle at 100% 0%, black 0%, transparent 40%)',
          WebkitMaskImage: 'radial-gradient(circle at 100% 0%, black 0%, transparent 40%)'
        }}
        aria-hidden="true"
      >
        <div className="projector-sand w-full h-full" />
      </div>
    </>
  );
});
ProjectorOverlay.displayName = 'ProjectorOverlay';




