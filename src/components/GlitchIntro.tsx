/**
 * GlitchIntro Component
 * 
 * Ultra-fast B&W + noise intro that plays during the natural page load.
 * Supports variable intensity:
 * - intensity 1.0: Full effect (first visit)
 * - intensity 0.3: Subtle effect (page reload)
 * - intensity 0:   No effect (back/forward navigation)
 * 
 * Navigation type detection:
 * - 'navigate' without session flag → first visit → full
 * - 'reload' → page refresh → 30%
 * - 'back_forward' → browser back/forward → skip entirely
 * - 'navigate' with session flag → SPA-like navigation → skip
 */
import React, { useState, useEffect, useRef } from 'react';

interface GlitchIntroProps {
    /** Total duration in ms — should match natural load time */
    duration?: number;
}

/** Detect nav type and return intensity 0–1 */
function getGlitchIntensity(): number {
    if (typeof window === 'undefined') return 0;

    try {
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        const navType = navEntries[0]?.type;

        if (navType === 'back_forward') {
            // Back/forward → never show glitch
            return 0;
        }

        if (navType === 'reload') {
            // Page reload → subtle 30% glitch
            return 0.3;
        }

        // 'navigate' — check if this is the first visit in this session
        const hasVisited = sessionStorage.getItem('mk-visited');
        if (!hasVisited) {
            // True first visit → full glitch
            sessionStorage.setItem('mk-visited', '1');
            return 1.0;
        }

        // Already visited in this session but navigated via URL bar / link
        // Still show a subtle glitch
        return 0.3;
    } catch {
        return 0;
    }
}

export const GlitchIntro: React.FC<GlitchIntroProps> = ({
    duration = 800,
}) => {
    const [intensity] = useState(() => getGlitchIntensity());
    const [phase, setPhase] = useState<'bw' | 'transition' | 'done'>(() =>
        intensity === 0 ? 'done' : 'bw'
    );
    const [bars, setBars] = useState<Array<{ top: number; height: number; offset: number; opacity: number }>>([]);
    const barTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        // If no glitch needed, immediately clean up body state
        if (intensity === 0) {
            document.body.classList.remove('mk-glitch-active', 'mk-glitch-transition');
            document.body.style.filter = '';
            const noise = document.getElementById('mk-glitch-noise');
            const scanlines = document.getElementById('mk-glitch-scanlines');
            if (noise) noise.style.display = 'none';
            if (scanlines) scanlines.style.display = 'none';
            setPhase('done');
            return;
        }

        // Scale duration by intensity (30% intensity → shorter duration)
        const scaledDuration = duration * (0.5 + intensity * 0.5); // 0.3 → 65%, 1.0 → 100%
        const bwDuration = scaledDuration * 0.4;

        // Scale the grayscale filter by intensity
        const grayscaleAmount = Math.round(35 * intensity);
        document.body.style.filter = `grayscale(${grayscaleAmount}%) contrast(${1 + 0.1 * intensity})`;

        // Scale noise overlay opacity by intensity
        const noise = document.getElementById('mk-glitch-noise');
        if (noise) {
            noise.style.display = '';
            noise.style.opacity = String(intensity);
        }

        // Scale scanlines opacity by intensity
        const scanlines = document.getElementById('mk-glitch-scanlines');
        if (scanlines) {
            scanlines.style.display = '';
            scanlines.style.opacity = String(0.08 * intensity);
        }

        // Glitch bars during B&W phase — scaled by intensity
        barTimerRef.current = setInterval(() => {
            const count = Math.floor(Math.random() * Math.max(1, 4 * intensity)) + 1;
            setBars(Array.from({ length: count }, () => ({
                top: Math.random() * 100,
                height: Math.random() * 4 + 0.5,
                offset: (Math.random() - 0.5) * 30 * intensity,
                opacity: (0.03 + Math.random() * 0.12) * intensity,
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
            const n = document.getElementById('mk-glitch-noise');
            const s = document.getElementById('mk-glitch-scanlines');
            if (n) n.classList.add('mk-noise-fade');
            if (s) s.classList.add('mk-scanlines-fade');
        }, bwDuration);

        // After full duration — cleanup
        const cleanupTimer = setTimeout(() => {
            setPhase('done');
            document.body.classList.remove('mk-glitch-active', 'mk-glitch-transition');
            document.body.style.filter = '';
            const n = document.getElementById('mk-glitch-noise');
            const s = document.getElementById('mk-glitch-scanlines');
            if (n) n.style.display = 'none';
            if (s) s.style.display = 'none';
        }, scaledDuration);

        return () => {
            clearTimeout(transitionTimer);
            clearTimeout(cleanupTimer);
            if (barTimerRef.current) clearInterval(barTimerRef.current);
        };
    }, [duration, intensity]);

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
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,${(0.15 + Math.random() * 0.2) * intensity}) ${20 + Math.random() * 30}%, rgba(200,200,200,${(0.1 + Math.random() * 0.15) * intensity}) ${60 + Math.random() * 20}%, transparent)`,
                        mixBlendMode: 'difference',
                    }}
                />
            ))}
        </>
    );
};

export default GlitchIntro;
