/**
 * GlitchIntro Component
 * 
 * Ultra-fast B&W + noise intro that plays during the natural page load.
 * - First 40% (~320ms): grayscale + noise + glitch bars  
 * - Remaining 60% (~480ms): quick transition to full color
 * - Plays on EVERY page load
 */
import React, { useState, useEffect, useRef } from 'react';

interface GlitchIntroProps {
    /** Total duration in ms — should match natural load time */
    duration?: number;
}

export const GlitchIntro: React.FC<GlitchIntroProps> = ({
    duration = 800,
}) => {
    const [phase, setPhase] = useState<'bw' | 'transition' | 'done'>('bw');
    const [bars, setBars] = useState<Array<{ top: number; height: number; offset: number; opacity: number }>>([]);
    const barTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const bwDuration = duration * 0.4;

        // Glitch bars during B&W phase — fast flickers
        barTimerRef.current = setInterval(() => {
            const count = Math.floor(Math.random() * 4) + 1;
            setBars(Array.from({ length: count }, () => ({
                top: Math.random() * 100,
                height: Math.random() * 4 + 0.5,
                offset: (Math.random() - 0.5) * 30,
                opacity: 0.03 + Math.random() * 0.12,
            })));
            setTimeout(() => setBars([]), 30 + Math.random() * 40);
        }, 50 + Math.random() * 60);

        // After 40% — start transition to color
        const transitionTimer = setTimeout(() => {
            setPhase('transition');
            if (barTimerRef.current) {
                clearInterval(barTimerRef.current);
                barTimerRef.current = null;
            }
            setBars([]);

            // Trigger CSS transitions on body + overlays
            document.body.classList.add('mk-glitch-transition');
            const noise = document.getElementById('mk-glitch-noise');
            const scanlines = document.getElementById('mk-glitch-scanlines');
            if (noise) noise.classList.add('mk-noise-fade');
            if (scanlines) scanlines.classList.add('mk-scanlines-fade');
        }, bwDuration);

        // After full duration — cleanup
        const cleanupTimer = setTimeout(() => {
            setPhase('done');
            document.body.classList.remove('mk-glitch-active', 'mk-glitch-transition');
            document.body.style.filter = '';
            const noise = document.getElementById('mk-glitch-noise');
            const scanlines = document.getElementById('mk-glitch-scanlines');
            if (noise) noise.style.display = 'none';
            if (scanlines) scanlines.style.display = 'none';
        }, duration);

        return () => {
            clearTimeout(transitionTimer);
            clearTimeout(cleanupTimer);
            if (barTimerRef.current) clearInterval(barTimerRef.current);
        };
    }, [duration]);

    if (phase === 'done' || bars.length === 0) return null;

    return (
        <>
            {bars.map((bar, i) => (
                <div
                    key={i}
                    style={{
                        position: 'fixed',
                        top: `${bar.top}%`,
                        left: 0,
                        width: '100vw',
                        height: `${bar.height}vh`,
                        zIndex: 100000,
                        pointerEvents: 'none',
                        opacity: bar.opacity,
                        transform: `translateX(${bar.offset}px)`,
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.15 + Math.random() * 0.2}) ${20 + Math.random() * 30}%, rgba(200,200,200,${0.1 + Math.random() * 0.15}) ${60 + Math.random() * 20}%, transparent)`,
                        mixBlendMode: 'difference',
                    }}
                />
            ))}
        </>
    );
};

export default GlitchIntro;
