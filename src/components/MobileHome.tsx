import React, { useState } from 'react';
import Link from 'next/link';
import { ContactForm } from './ContactForm';
import { Dashboard } from './Dashboard';
import { Meldpunt } from './Meldpunt';
import { X } from 'lucide-react';

type MobileView = 'HOME' | 'PROBLEM' | 'SOLUTION' | 'CONTACT' | 'DASHBOARD' | 'MELDPUNT';

export const MobileHome: React.FC = () => {
    const [view, setView] = useState<MobileView>('HOME');

    const handleTileClick = (newView: MobileView) => {
        setView(newView);
    };

    const handleBack = () => {
        setView('HOME');
    };

    // Sub-view component helper
    const SubView = ({
        color,
        label,
        children
    }: {
        color: string;
        label: string;
        children?: React.ReactNode
    }) => (
        <div className={`flex flex-col min-h-screen w-full ${color} font-mono overflow-hidden relative`}>
            {/* Back Button */}
            <button
                onClick={handleBack}
                className="absolute top-4 right-4 z-50 p-2 border border-black bg-white hover:bg-gray-100 transition-colors"
                aria-label="Sluiten"
            >
                <X size={24} className="text-black" />
            </button>

            {/* Label */}
            <div className="absolute top-4 left-4 z-20">
                <div className="px-3 py-1.5 bg-white border border-black">
                    <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">
                        {label}
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col pt-24 px-6 pb-6 overflow-y-auto">
                {children}
            </div>
        </div>
    );

    // Render Contact View
    if (view === 'CONTACT') {
        return (
            <div className={`flex flex-col min-h-screen w-full bg-[#F0E6D2] font-mono overflow-hidden relative`}>
                <ContactForm mode="fullscreen" onClose={handleBack} className="bg-[#F0E6D2]" />
            </div>
        );
    }

    // Render Dashboard View - Directly reusing the component but in a full screen wrapper if needed, 
    // or just letting it handle itself if it supports mobile. 
    // The Dashboard component has a fixed overlay. We might need to render it conditionally.
    // However, looking at Dashboard.tsx, it's a fixed overlay. 
    // To enable simplified mobile nav, we can just render it.
    if (view === 'DASHBOARD') {
        return <Dashboard onClose={handleBack} />;
    }

    // Render Meldpunt View
    if (view === 'MELDPUNT') {
        return <Meldpunt onClose={handleBack} mobile={true} />;
    }

    // Render Problem View
    if (view === 'PROBLEM') {
        return (
            <SubView color="bg-[#F2E8E4]" label="Wat is het probleem?">
                {/* Content placeholder for later */}
                <div className="mt-8 text-sm font-medium leading-relaxed opacity-50 uppercase tracking-widest text-center">
                    [Inhoud volgt]
                </div>
            </SubView>
        );
    }

    // Render Solution View
    if (view === 'SOLUTION') {
        return (
            <SubView color="bg-[#C1C9B9]" label="Wat is de oplossing?">
                {/* Content placeholder for later */}
                <div className="mt-8 text-sm font-medium leading-relaxed opacity-50 uppercase tracking-widest text-center">
                    [Inhoud volgt]
                </div>
            </SubView>
        );
    }

    // Render Home View
    return (
        <div className="flex flex-col min-h-screen w-full bg-[#F0F0F0] font-mono overflow-hidden md:hidden">
            {/* Header Section - No border-b here */}
            <div className="pt-12 px-6 pb-2">
                <h1 className="text-4xl font-medium tracking-tight text-[#111111] mb-1">
                    Moral Knight
                </h1>
                <div className="text-sm font-bold uppercase tracking-widest text-[#194D25] pt-1.5 opacity-90">
                    menswaardige AI in het publieke domein
                </div>
            </div>

            {/* Separator Line Container */}
            <div className="w-full px-4">
                <div className="w-full h-[1px] bg-black"></div>
            </div>

            {/* Tiles Container */}
            <div className="flex-1 flex flex-col w-full p-4 gap-4 mt-2">
                {/* Tile 1: PROBLEEM */}
                <div
                    onClick={() => handleTileClick('PROBLEM')}
                    className="flex-1 w-full bg-[#F2E8E4] border border-black rounded-none p-4 relative cursor-pointer active:scale-[0.98] transition-transform"
                >
                    {/* Desktop Label Style */}
                    <div className="absolute top-4 left-4 z-20">
                        <div className="px-3 py-1.5 bg-white border border-black">
                            <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">
                                Wat is het probleem?
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tile 2: OPLOSSING */}
                <div
                    onClick={() => handleTileClick('SOLUTION')}
                    className="flex-1 w-full bg-[#C1C9B9] border border-black rounded-none p-4 relative cursor-pointer active:scale-[0.98] transition-transform"
                >
                    {/* Desktop Label Style */}
                    <div className="absolute top-4 left-4 z-20">
                        <div className="px-3 py-1.5 bg-white border border-black">
                            <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">
                                Wat is de oplossing?
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tile 3: CONTACT */}
                <div
                    onClick={() => handleTileClick('CONTACT')}
                    className="flex-1 w-full bg-[#F0E6D2] border border-black rounded-none p-4 relative cursor-pointer active:scale-[0.98] transition-transform"
                >
                    {/* Desktop Label Style */}
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                        <div className="px-3 py-1.5 bg-white border border-black">
                            <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">
                                Contact
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Footer - Specific Grouping */}
                <div className="flex flex-col mt-2 mb-8 px-1">
                    {/* Copyright Line */}
                    <div className="text-[12px] text-gray-400 font-mono uppercase tracking-widest leading-relaxed">
                        / Moral Knight 2025 — saving the human species from annihilation
                    </div>

                    {/* Links Group - Pushed down (mt-6) and tighter gap (gap-1) */}
                    <div className="flex flex-col gap-1 mt-6">
                        <button
                            onClick={() => handleTileClick('MELDPUNT')}
                            className="font-mono font-bold antialiased uppercase tracking-widest text-[#D6827A] hover:opacity-75 text-[12px] text-left"
                        >
                            / MK Meldpunt
                        </button>
                        <button
                            onClick={() => handleTileClick('DASHBOARD')}
                            className="font-mono font-bold antialiased uppercase tracking-widest text-[#D6827A] hover:opacity-75 text-[12px] text-left"
                        >
                            / MK Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
