import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { THEME, COLORS } from '../constants';
import { useCounter } from '../hooks/useCounter';

interface DashboardProps {
    onClose: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onClose }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        requestAnimationFrame(() => setAnimate(true));

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Mock data for the dashboard
    const stats = {
        total: 1248,
        correct: 28,
        wrong: 62,
        vague: 10,
    };

    const animatedTotal = useCounter(stats.total, 2000);

    // Common transition style for smooth effect
    const smoothTransition = {
        transitionProperty: 'height',
        transitionDuration: '2000ms',
        transitionTimingFunction: 'ease-out', // More gradual/smooth
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="relative w-full max-w-3xl border border-black p-6 md:p-12 shadow-2xl mx-4 my-auto max-h-[90vh] md:max-h-[85vh] overflow-y-auto"
                style={{
                    color: THEME.colors.text,
                    backgroundColor: '#E6EBE8',
                    boxShadow: '0 0 50px rgba(0,0,0,0.5), inset 0 0 120px rgba(0,0,0,0.15)',
                    backgroundImage: 'linear-gradient(135deg, #DDE6E2 0%, #E4E4E1 60%, #E4D4D4 100%)',
                }}
                role="dialog"
                aria-modal="true"
                aria-label="Dashboard"
            >
                {/* Internal Projector Noise Layer */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-multiply bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] z-0" />

                {/* Subtle flicker overlay */}
                <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] bg-white mix-blend-overlay animate-pulse" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 group p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#194D25] min-w-[44px] min-h-[44px] flex items-center justify-center z-20"
                    aria-label="Sluiten"
                >
                    <X
                        size={24}
                        strokeWidth={1.5}
                        className="text-[#194D25] group-hover:text-[#8B1A3D] transition-colors duration-200"
                    />
                </button>

                <header className="mb-8 md:mb-12 border-b border-black pb-4 relative z-10 pt-4 md:pt-0">
                    <h2 className="text-2xl md:text-3xl flex flex-wrap gap-3 items-baseline">
                        <span className="font-mono font-medium tracking-tight" style={{ color: THEME.colors.text }}>Moral Knight</span>
                        <span className="font-mono font-medium tracking-tight" style={{ color: COLORS.PRIMARY_GREEN }}>Dashboard</span>
                    </h2>
                </header>

                <div className="mb-10 md:mb-20">
                    <div className="font-mono text-sm md:text-base text-gray-800 leading-normal max-w-2xl px-1">
                        Wij hebben <span
                            className="font-mono text-2xl md:text-3xl font-light mx-1"
                            style={{ color: COLORS.PRIMARY_GREEN }}
                        >
                            {animatedTotal.toLocaleString('nl-NL')}
                        </span> vragen gesteld aan publieke AI
                    </div>
                </div>

                <div className="flex justify-between items-end h-48 md:h-64 gap-4 md:gap-16">
                    {/* Goed Antwoord */}
                    <div className="flex flex-col items-center w-1/3 h-full justify-end group relative">
                        <div
                            className="font-mono text-[10px] md:text-sm mb-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                            style={{ color: COLORS.PRIMARY_GREEN }}
                        >
                            {stats.correct}%
                        </div>
                        <div
                            className="w-full"
                            style={{
                                ...smoothTransition,
                                height: animate ? `${stats.correct}%` : '0%',
                                backgroundColor: '#4F7359'
                            }}
                        />
                        <span className="font-mono text-[10px] md:text-sm mt-4 uppercase tracking-widest text-center h-10 flex items-start justify-center">
                            Goed<br />Antwoord
                        </span>
                    </div>

                    {/* Fout Antwoord */}
                    <div className="flex flex-col items-center w-1/3 h-full justify-end group relative">
                        <div
                            className="font-mono text-[10px] md:text-sm mb-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                            style={{ color: COLORS.BORDEAUX_RED }}
                        >
                            {stats.wrong}%
                        </div>
                        <div
                            className="w-full"
                            style={{
                                ...smoothTransition,
                                height: animate ? `${stats.wrong}%` : '0%',
                                backgroundColor: '#8C5E67'
                            }}
                        />
                        <span className="font-mono text-[10px] md:text-sm mt-4 uppercase tracking-widest text-center h-10 flex items-start justify-center">
                            Fout<br />Antwoord
                        </span>
                    </div>

                    {/* Vaag Antwoord */}
                    <div className="flex flex-col items-center w-1/3 h-full justify-end group relative">
                        <div
                            className="font-mono text-[10px] md:text-sm mb-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100 text-gray-500"
                        >
                            {stats.vague}%
                        </div>
                        <div
                            className="w-full bg-gray-400"
                            style={{
                                ...smoothTransition,
                                height: animate ? `${stats.vague}%` : '0%',
                            }}
                        />
                        <span className="font-mono text-[10px] md:text-sm mt-4 uppercase tracking-widest text-center h-10 flex items-start justify-center">
                            Vaag<br />Antwoord
                        </span>
                    </div>
                </div>

                <div
                    className="mt-12 md:mt-20 text-left font-mono text-[10px] md:text-sm z-20"
                    style={{ color: '#2F4F38' }}
                >
                    (meer data - coming soon)
                </div>
            </div>
        </div>
    );
};
