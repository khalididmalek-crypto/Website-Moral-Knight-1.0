import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { THEME, COLORS } from '../constants';
import { ReportForm } from './ReportForm';

interface MeldpuntProps {
    onClose: () => void;
}

export const Meldpunt: React.FC<MeldpuntProps> = ({ onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="relative w-full max-w-3xl border border-black p-8 md:p-12 shadow-2xl my-8"
                style={{
                    color: THEME.colors.text,
                    backgroundColor: '#E6EBE8',
                    boxShadow: '0 0 50px rgba(0,0,0,0.5), inset 0 0 120px rgba(0,0,0,0.15)',
                    backgroundImage: 'linear-gradient(135deg, #DDE6E2 0%, #E4E4E1 60%, #E4D4D4 100%)',
                }}
                role="dialog"
                aria-modal="true"
                aria-label="MK Meldpunt"
            >
                {/* Internal Projector Noise Layer */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-multiply bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] z-0" />

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

                <header className="mb-8 border-b border-black pb-4 relative z-10">
                    <h2 className="text-2xl md:text-3xl flex flex-wrap gap-3 items-baseline">
                        <span className="font-mono font-medium tracking-tight" style={{ color: THEME.colors.text }}>Moral Knight</span>
                        <span className="font-mono font-medium tracking-tight" style={{ color: COLORS.PRIMARY_GREEN }}>Meldpunt</span>
                    </h2>
                    <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest mt-2 opacity-70">
                        Melden van misstanden door publieke AI
                    </p>
                </header>

                <div className="relative z-10">
                    <ReportForm onClose={onClose} mode="fullscreen" />
                </div>
            </div>
        </div>
    );
};
