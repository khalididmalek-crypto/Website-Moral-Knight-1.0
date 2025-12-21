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
        className="fixed inset-0 pointer-events-none z-[100] bg-white mix-blend-overlay opacity-[0.03]"
        aria-hidden="true"
      />

      {/* Vignette - Subtler */}
      <div
        className="fixed inset-0 pointer-events-none z-[99] bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.05)_85%,rgba(0,0,0,0.15)_100%)]"
        aria-hidden="true"
      />

      {/* Projector Dust & Scratches */}
      <div className="projector-dust" aria-hidden="true" />
      <div className="projector-scratch" aria-hidden="true" />

      {/* Top Right Projector Glare - Enhanced Intensity */}
      <div
        className="fixed top-0 right-0 w-[85vw] h-[85vh] pointer-events-none z-[98] opacity-85"
        style={{
          background: 'radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 35%, transparent 70%)',
          filter: 'blur(50px)',
          mixBlendMode: 'overlay'
        }}
        aria-hidden="true"
      />

      {/* Top Right Sand Grain Effect - Requested */}
      <div
        className="fixed top-0 right-0 w-[50vw] h-[50vh] pointer-events-none z-[97]"
        style={{
          maskImage: 'radial-gradient(circle at 100% 0%, black 0%, transparent 60%)',
          WebkitMaskImage: 'radial-gradient(circle at 100% 0%, black 0%, transparent 60%)'
        }}
        aria-hidden="true"
      >
        <div className="projector-sand w-full h-full" />
      </div>
    </>
  );
});
ProjectorOverlay.displayName = 'ProjectorOverlay';




