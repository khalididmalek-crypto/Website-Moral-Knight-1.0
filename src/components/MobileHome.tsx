import React, { useState } from 'react';
import { ContactForm } from './ContactForm';
import { Dashboard } from './Dashboard';
import { Meldpunt } from './Meldpunt';

type MobileView = 'HOME' | 'PROBLEM' | 'SOLUTION' | 'CONTACT' | 'DASHBOARD' | 'MELDPUNT';

export const MobileHome: React.FC = () => {
    const [view, setView] = useState<MobileView>('HOME');
    const [activeTile, setActiveTile] = useState<MobileView | null>(null);

    const handleTileClick = (newView: MobileView) => {
        if (activeTile === newView) {
            setActiveTile(null);
        } else {
            setActiveTile(newView);
        }
    };

    const handleBack = () => {
        setView('HOME');
        setActiveTile(null);
    };

    // Render Contact View (Legacy)
    if (view === 'CONTACT') {
        return (
            <div className="flex flex-col min-h-[100dvh] w-full bg-[#F0E6D2] font-mono overflow-hidden relative">
                <ContactForm mode="fullscreen" onClose={handleBack} className="bg-[#F0E6D2]" />
            </div>
        );
    }

    if (view === 'DASHBOARD') return <Dashboard onClose={handleBack} />;
    if (view === 'MELDPUNT') return <Meldpunt onClose={handleBack} />;

    return (
        <div className="flex flex-col min-h-[100dvh] w-full bg-[#f8fafc] font-mono overflow-hidden md:hidden">
            {/* Header Section */}
            <div className="pt-12 px-6 pb-2">
                <h1 className="text-4xl font-medium tracking-tight text-[#111111] mb-1">
                    Moral Knight
                </h1>
                <div className="text-sm font-bold uppercase tracking-widest text-[#194D25] pt-1.5 opacity-90">
                    menswaardige AI in het publieke domein
                </div>
            </div>

            <div className="w-full px-4">
                <div className="w-full h-[1px] bg-black"></div>
            </div>

            {/* Tiles Container */}
            <div className="flex-1 flex flex-col w-full p-4 gap-4 mt-2 mb-0">
                {/* Tile 1: PROBLEEM */}
                <div
                    onClick={() => handleTileClick('PROBLEM')}
                    className={`animate-fade-in-slow w-full border border-black p-4 relative cursor-pointer transition-all duration-300 ease-in-out ${activeTile === 'PROBLEM'
                        ? 'bg-white rounded-3xl border-slate-100 shadow-md min-h-[200px]'
                        : 'bg-[#F2E8E4] rounded-sm flex-1'
                        }`}
                    style={{ animationDelay: '0ms' }}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">
                            Wat is het probleem?
                        </div>
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTile === 'PROBLEM' ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0'
                        }`}>
                        <div className="text-[13px] font-medium leading-relaxed uppercase tracking-widest py-4">
                            Inhoud volgt...
                        </div>
                    </div>
                </div>

                {/* Tile 2: OPLOSSING */}
                <div
                    onClick={() => handleTileClick('SOLUTION')}
                    className={`animate-fade-in-slow w-full border border-black p-4 relative cursor-pointer transition-all duration-300 ease-in-out ${activeTile === 'SOLUTION'
                        ? 'bg-white rounded-3xl border-slate-100 shadow-md min-h-[200px]'
                        : 'bg-[#C1C9B9] rounded-sm flex-1'
                        }`}
                    style={{ animationDelay: '150ms' }}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">
                            Wat is de oplossing?
                        </div>
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTile === 'SOLUTION' ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0'
                        }`}>
                        <div className="text-[13px] font-medium leading-relaxed uppercase tracking-widest py-4">
                            Inhoud volgt...
                        </div>
                    </div>
                </div>

                {/* Tile 3: CONTACT */}
                <div
                    onClick={() => handleTileClick('CONTACT')}
                    className={`animate-fade-in-slow w-full border border-black p-4 relative cursor-pointer transition-all duration-300 ease-in-out ${activeTile === 'CONTACT'
                        ? 'bg-white rounded-3xl border-slate-100 shadow-md min-h-[200px]'
                        : 'bg-[#F0E6D2] rounded-sm flex-1'
                        }`}
                    style={{ animationDelay: '300ms' }}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">
                            Contact
                        </div>
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTile === 'CONTACT' ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0'
                        }`}>
                        <div className="w-full">
                            <ContactForm mode="fullscreen" className="bg-white" />
                        </div>
                    </div>
                </div>

                {/* Mobile Footer */}
                <div className="flex flex-col mt-2 px-1 pb-6">
                    <div className="text-[12px] text-gray-400 font-mono uppercase tracking-widest leading-relaxed">
                        / Moral Knight 2025 — saving the human species from annihilation
                    </div>

                    <div className="flex flex-col gap-1 mt-6 hidden md:block">
                        <button
                            onClick={() => handleTileClick('MELDPUNT')}
                            className="font-mono font-bold antialiased uppercase tracking-widest text-[#D6827A] hover:opacity-75 text-[12px] text-left py-2"
                        >
                            / MK Meldpunt
                        </button>
                        <button
                            onClick={() => handleTileClick('DASHBOARD')}
                            className="font-mono font-bold antialiased uppercase tracking-widest text-[#D6827A] hover:opacity-75 text-[12px] text-left py-2"
                        >
                            / MK Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
