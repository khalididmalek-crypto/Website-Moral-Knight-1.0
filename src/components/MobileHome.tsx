import React, { useState, useEffect, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { ContactForm } from './ContactForm';
import { Dashboard } from './Dashboard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Meldpunt } from './Meldpunt';

type MobileView = 'HOME' | 'DASHBOARD' | 'MELDPUNT';


interface MobileHomeProps {
    problemTileContent: string;
    solutionTileContent: string;
    approachTileContent: string;
    servicesTileContent: string;
}

export const MobileHome: React.FC<MobileHomeProps> = ({ problemTileContent, solutionTileContent, approachTileContent, servicesTileContent }) => {
    const [view, setView] = useState<MobileView>('HOME');
    const [meldpuntOpen, setMeldpuntOpen] = useState(false);
    const [activeTiles, setActiveTiles] = useState<string[]>([]);
    const [hasMounted, setHasMounted] = useState(false);
    // Animation state - reserved for future scroll lock implementation during animation window


    const containerRef = useRef<HTMLDivElement>(null);

    const BG_COLORS = {

        PROBLEM: '#f9f5f3',
        SOLUTION: '#f3f6f1',
        APPROACH: '#f5f7f3',
        SERVICES: '#f0f2f4',
        CONTACT: '#fbf9f3',
        HOME: '#f8fafc'
    };

    const tileRefs = {

        PROBLEM: useRef<HTMLDivElement>(null),
        SOLUTION: useRef<HTMLDivElement>(null),
        APPROACH: useRef<HTMLDivElement>(null),
        SERVICES: useRef<HTMLDivElement>(null),
        CONTACT: useRef<HTMLDivElement>(null),
    };

    useEffect(() => {
        setHasMounted(true);
    }, []);

    // NOTE: Removed the useEffect that triggered on activeTile change with a timeout.
    // Instead, we now use the onLayoutAnimationComplete callback on each tile.
    // This ensures we only scroll when the physical DOM expansion is 100% done.

    const handleTileClick = (tile: string) => {
        setActiveTiles(prev => {
            if (prev.includes(tile)) {
                return prev.filter(t => t !== tile);
            } else {
                return [...prev, tile];
            }
        });
    };


    const handleBack = () => {
        setView('HOME');
        setMeldpuntOpen(false);
        setActiveTiles([]);
    };

    // This function handles the scroll after the animation finishes
    const handleLayoutComplete = (tileKey: string) => {
        // Only scroll if the tile is outside the viewport
        if (activeTiles.includes(tileKey) && tileRefs[tileKey as keyof typeof tileRefs].current) {
            const tileElement = tileRefs[tileKey as keyof typeof tileRefs].current;
            if (!tileElement) return;
            const rect = tileElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Check if tile is fully visible in viewport
            const isFullyVisible = rect.top >= 0 && rect.bottom <= viewportHeight;

            // Only scroll if tile is not fully visible
            if (!isFullyVisible) {
                // Use requestAnimationFrame for smoother scroll
                requestAnimationFrame(() => {
                    tileElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                    });
                });
            }
        }
    };

    // Hydration Guard: Render nothing until the component has mounted on the client
    if (!hasMounted) {
        return null;
    }

    if (view === 'DASHBOARD') return <Dashboard onClose={handleBack} />;
    if (view === 'MELDPUNT' || meldpuntOpen) return <Meldpunt onClose={handleBack} />;


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const tileVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
            },
        },
    };


    const contentExitAnimation = {
        opacity: [1, 0.5, 0],
        x: [0, 3, -3, 0],
        transition: { duration: 0.15 }
    };

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-[100dvh] w-full font-mono overflow-y-auto md:hidden transition-colors duration-500 ease-in-out"
            style={{
                backgroundColor: activeTiles.length > 0 ? BG_COLORS[activeTiles[activeTiles.length - 1] as keyof typeof BG_COLORS] : BG_COLORS.HOME,
            }}

        >
            {/* Header */}
            <div className="pt-12 mx-4 pb-2 border-b border-black">
                <h1 className="text-4xl font-medium tracking-tight text-[#111111] mb-1">Moral Knight</h1>
                <div className="text-xs font-bold uppercase tracking-widest text-[#194D25] pt-1.5 opacity-90 leading-relaxed">
                    Wij zijn een onafhankelijke waakhond<br />
                    en toetsen publieke AI
                </div>
            </div>

            {/* Accordion Tiles */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 flex flex-col w-full p-4 pl-4 gap-y-4 pb-12"
                style={{ overflowAnchor: 'none' }}
            >
                {/* Tile 1: PROBLEEM */}
                <motion.div
                    layout="position"
                    ref={tileRefs.PROBLEM}
                    variants={tileVariants}
                    onClick={() => handleTileClick('PROBLEM')}
                    onLayoutAnimationComplete={() => handleLayoutComplete('PROBLEM')}
                    className={`w-full border border-black p-4 relative cursor-pointer transition-colors duration-300 ease-in-out scroll-mt-[100px] ${activeTiles.includes('PROBLEM')
                        ? 'bg-white rounded-none shadow-md'
                        : 'bg-[#F2E8E4] rounded-sm'
                        }`}
                    style={{ overflowAnchor: 'none' }}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">Wat is het probleem?</div>
                    </div>
                    <AnimatePresence>
                        {activeTiles.includes('PROBLEM') && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <motion.div exit={contentExitAnimation}>
                                    <div className="flex flex-col items-start py-4">

                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h2: ({ node, ...props }) => <h4 className="font-bold text-base mb-2 text-[#194D25] text-left w-full" {...props} />,
                                                h3: ({ node, ...props }) => <h5 className="font-semibold text-sm mt-4 mb-2 text-gray-800 text-left w-full" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700" {...props} />,
                                                a: ({ node, href, ...props }) => {
                                                    if (href === '#meldpunt') {
                                                        return (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setMeldpuntOpen(true);
                                                                }}
                                                                className="text-[#8B1A3D] font-bold hover:underline cursor-pointer"
                                                            >
                                                                {props.children}
                                                            </button>
                                                        );
                                                    }
                                                    return <a href={href} className="text-[#8B1A3D] hover:underline" {...props} />;
                                                }
                                            }}

                                        >
                                            {problemTileContent}
                                        </ReactMarkdown>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Tile 2: OPLOSSING */}
                <motion.div
                    layout="position"
                    ref={tileRefs.SOLUTION}
                    variants={tileVariants}
                    onClick={() => handleTileClick('SOLUTION')}
                    onLayoutAnimationComplete={() => handleLayoutComplete('SOLUTION')}
                    className={`w-full border border-black p-4 relative cursor-pointer transition-colors duration-300 ease-in-out scroll-mt-[100px] ${activeTiles.includes('SOLUTION')
                        ? 'bg-white rounded-none shadow-md'
                        : 'bg-[#C1C9B9] rounded-sm'
                        }`}
                    style={{ overflowAnchor: 'none' }}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">Wat is de oplossing?</div>
                    </div>
                    <AnimatePresence>
                        {activeTiles.includes('SOLUTION') && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <motion.div exit={contentExitAnimation}>
                                    <div className="flex flex-col items-start py-4">

                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h2: ({ node, ...props }) => <h4 className="font-bold text-base mb-2 text-[#194D25] text-left w-full" {...props} />,
                                                h3: ({ node, ...props }) => <h5 className="font-semibold text-sm mt-4 mb-2 text-gray-800 text-left w-full" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700" {...props} />,
                                                a: ({ node, href, ...props }) => {
                                                    if (href === '#meldpunt') {
                                                        return (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setMeldpuntOpen(true);
                                                                }}
                                                                className="text-[#8B1A3D] font-bold hover:underline cursor-pointer"
                                                            >
                                                                {props.children}
                                                            </button>
                                                        );
                                                    }
                                                    return <a href={href} className="text-[#8B1A3D] hover:underline" {...props} />;
                                                }
                                            }}

                                        >
                                            {solutionTileContent}
                                        </ReactMarkdown>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* New Tile: ONZE AANPAK */}
                <motion.div
                    layout="position"
                    ref={tileRefs.APPROACH}
                    variants={tileVariants}
                    onClick={() => handleTileClick('APPROACH')}
                    onLayoutAnimationComplete={() => handleLayoutComplete('APPROACH')}
                    className={`w-full border border-black p-4 relative cursor-pointer transition-colors duration-300 ease-in-out scroll-mt-[100px] ${activeTiles.includes('APPROACH')
                        ? 'bg-white rounded-none shadow-md'
                        : 'bg-[#CCD5C6] rounded-sm'
                        }`}
                    style={{ overflowAnchor: 'none' }}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">ONZE AANPAK</div>
                    </div>
                    <AnimatePresence>
                        {activeTiles.includes('APPROACH') && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <motion.div exit={contentExitAnimation}>
                                    <div className="flex flex-col items-start py-4">

                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h2: ({ node, ...props }) => <h4 className="font-bold text-base mb-2 text-[#194D25] text-left w-full" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700" {...props} />,
                                            }}

                                        >
                                            {approachTileContent}
                                        </ReactMarkdown>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* New Tile: ONZE DIENSTEN */}
                <motion.div
                    layout="position"
                    ref={tileRefs.SERVICES}
                    variants={tileVariants}
                    onClick={() => handleTileClick('SERVICES')}
                    onLayoutAnimationComplete={() => handleLayoutComplete('SERVICES')}
                    className={`w-full border border-black p-4 relative cursor-pointer transition-colors duration-300 ease-in-out scroll-mt-[100px] ${activeTiles.includes('SERVICES')
                        ? 'bg-white rounded-none shadow-md'
                        : 'bg-[#AEB5B9] rounded-sm'
                        }`}
                    style={{ overflowAnchor: 'none' }}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">ONZE DIENSTEN</div>
                    </div>
                    <AnimatePresence>
                        {activeTiles.includes('SERVICES') && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <motion.div exit={contentExitAnimation}>
                                    <div className="flex flex-col items-start py-4">

                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h2: ({ node, ...props }) => <h4 className="font-bold text-base mb-2 text-[#194D25] text-left w-full" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 text-[14px] font-mono leading-relaxed text-gray-700 w-full" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                            }}

                                        >
                                            {servicesTileContent}
                                        </ReactMarkdown>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Tile 3: CONTACT */}
                <motion.div
                    layout="position"
                    ref={tileRefs.CONTACT}
                    variants={tileVariants}
                    onClick={() => handleTileClick('CONTACT')}
                    onLayoutAnimationComplete={() => handleLayoutComplete('CONTACT')}
                    className={`w-full border border-black p-4 relative cursor-pointer transition-colors duration-300 ease-in-out scroll-mt-[100px] ${activeTiles.includes('CONTACT')
                        ? 'bg-white rounded-none shadow-md'
                        : 'bg-[#F0E6D2] rounded-sm'
                        }`}
                    style={{ overflowAnchor: 'none' }}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">Contact</div>
                    </div>
                    <AnimatePresence>
                        {activeTiles.includes('CONTACT') && hasMounted && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <motion.div exit={contentExitAnimation}>
                                    <div className="flex flex-col items-start py-4">
                                        <div className="w-full bg-white">
                                            <ContactForm mode="fullscreen" className="!p-0" />
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Footer */}
                <div className="mt-8 px-2 pb-8">
                    <div className="text-[12px] text-gray-400 font-mono uppercase tracking-widest leading-relaxed">
                        / Moral Knight since 2025 - Auditing public AI
                    </div>
                    <div className="flex flex-col gap-2 mt-6 items-start">
                        <button onClick={() => setMeldpuntOpen(true)} className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8B1A3D' }}>/ MK Meldpunt</button>
                        <button onClick={() => setView('DASHBOARD')} className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8B1A3D' }}>/ MK Dashboard</button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
