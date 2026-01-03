import React, { useState } from 'react';
import { ContactForm } from './ContactForm';
import { Dashboard } from './Dashboard';

type MobileView = 'HOME' | 'DASHBOARD';

export const MobileHome: React.FC = () => {
    const [view, setView] = useState<MobileView>('HOME');
    const [activeTile, setActiveTile] = useState<string | null>(null);

    const handleTileClick = (tile: string) => {
        setActiveTile(activeTile === tile ? null : tile);
    };

    const handleBack = () => {
        setView('HOME');
        setActiveTile(null);
    };

    if (view === 'DASHBOARD') return <Dashboard onClose={handleBack} />;

    return (
        <div className="flex flex-col min-h-[100dvh] w-full bg-[#f8fafc] font-mono overflow-y-auto md:hidden">
            {/* Header */}
            <div className="pt-12 px-6 pb-2">
                <h1 className="text-4xl font-medium tracking-tight text-[#111111] mb-1">Moral Knight</h1>
                <div className="text-sm font-bold uppercase tracking-widest text-[#194D25] pt-1.5 opacity-90">
                    menswaardige AI in het publieke domein
                </div>
            </div>

            <div className="w-full px-4 my-4">
                <div className="w-full h-[1px] bg-black"></div>
            </div>

            {/* Accordion Tiles */}
            <div className="flex-1 flex flex-col w-full p-4 gap-y-4 pb-12">

                {/* Tile 1: PROBLEEM */}
                <div
                    onClick={() => handleTileClick('PROBLEM')}
                    className={`animate-fade-in-slow w-full border border-black p-4 relative cursor-pointer transition-all duration-300 ease-in-out ${activeTile === 'PROBLEM'
                        ? 'bg-white rounded-3xl border-slate-100 shadow-md min-h-[200px]'
                        : 'bg-[#F2E8E4] rounded-sm flex-1'
                        }`}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">Wat is het probleem?</div>
                    </div>
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTile === 'PROBLEM' ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col items-center py-4">
                            <p className="text-[13px] font-mono leading-relaxed text-gray-700 break-all">
                                s;bogjh;otejhb;oerqthgb;oirthb;oqrtehboihrgbo&apos;ihrte
                            </p>
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
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">Wat is de oplossing?</div>
                    </div>
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTile === 'SOLUTION' ? 'max-h-[1200px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col items-center py-4">
                            <p className="text-[13px] font-mono leading-relaxed text-gray-700 break-all">
                                s;bogjh;otejhb;oerqthgb;oirthb;oqrtehboihrgbo&apos;ihrte
                            </p>
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
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">Contact</div>
                    </div>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTile === 'CONTACT' ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
                    >
                        <ContactForm mode="fullscreen" className="!p-0" />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 px-2 pb-8">
                    <div className="text-[12px] text-gray-400 font-mono uppercase tracking-widest leading-relaxed">
                        / Moral Knight 2025 — saving the human species from annihilation
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button onClick={() => setView('DASHBOARD')} className="text-[11px] font-bold uppercase tracking-widest text-slate-500">/ Dashboard</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
