import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Cpu, Briefcase, Send } from 'lucide-react';
import { COLORS } from '../constants';

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
        PROBLEM: '#F8F3F1', // Much lighter redish
        SOLUTION: '#E0E4DC', // Much lighter green
        APPROACH: '#E5E9E2', // Much lighter neutral green
        SERVICES: '#D7DADE', // Much lighter blue/grey
        CONTACT: '#F7F2E8',  // Much lighter sandy yellow
        HOME: '#f8fafc'
    };

    // Helper to get gradient based on active tile
    const getActiveGradient = (tile: string) => {
        switch (tile) {
            case 'PROBLEM':
                // Intensified gradient: more contrast from top-left to bottom-right
                return 'linear-gradient(135deg, #F8F3F1 0%, #F2E3DC 50%, #E8CDCD 100%)';
            case 'SOLUTION':
                return 'linear-gradient(135deg, #E0E4DC 0%, #CAD4C5 50%, #B4C0AD 100%)';
            case 'APPROACH':
                return 'linear-gradient(135deg, #E5E9E2 0%, #D1DEC8 50%, #BCC8B4 100%)';
            case 'SERVICES':
                return 'linear-gradient(135deg, #D7DADE 0%, #BEC7CF 50%, #AEBEC9 100%)';
            case 'CONTACT':
                return 'linear-gradient(135deg, #F7F2E8 0%, #EEE1C8 50%, #E4D4B8 100%)';
            default:
                return 'none';
        }
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

    const lastActiveTile = activeTiles.length > 0 ? activeTiles[activeTiles.length - 1] : 'HOME';

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-[100dvh] w-full font-mono overflow-y-auto md:hidden transition-colors duration-500 ease-in-out"
            style={{
                backgroundColor: BG_COLORS[lastActiveTile as keyof typeof BG_COLORS],
                backgroundImage: activeTiles.length > 0 ? getActiveGradient(lastActiveTile) : 'none',
            }}
        >
            {/* Projector Noise Layer for the background when active */}
            {activeTiles.length > 0 && (
                <div className="fixed inset-0 pointer-events-none opacity-[0.10] mix-blend-multiply bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] z-0" />
            )}

            {/* Common Noise Pattern for Tiles - Defined here to be reused if needed */}

            <svg className="hidden">
                <filter id="tileNoiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
            </svg>

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

                    <div className="absolute top-4 right-4 opacity-50">
                        <X size={18} strokeWidth={2} color={COLORS.PRIMARY_GREEN} />
                    </div>
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

                    <div className="absolute top-4 right-4 opacity-50">
                        <ArrowLeft size={18} strokeWidth={2} color={COLORS.PRIMARY_GREEN} />
                    </div>
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

                    <div className="absolute top-4 right-4 opacity-50">
                        <Cpu size={18} strokeWidth={2} color={COLORS.PRIMARY_GREEN} />
                    </div>
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

                    <div className="absolute top-4 right-4 opacity-50">
                        <Briefcase size={18} strokeWidth={2} color="#F1E1DB" />
                    </div>
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

                    <div className="absolute top-4 right-4 opacity-50">
                        <Send size={20} strokeWidth={1.2} color="#888F93" />
                    </div>
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

                {/* Divider Line under tiles */}
                <div className="mx-4 border-b border-black" />

                {/* Footer */}
                <div className="mt-10 px-4 pb-12">
                    <div className="text-[12px] text-black font-mono uppercase tracking-widest leading-relaxed mb-6">
                        <div className="flex">
                            <span className="mr-2">/</span>
                            <div>
                                Moral Knight since 2025<br />
                                Auditing public AI
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 items-start">
                        <button onClick={() => setMeldpuntOpen(true)} className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8B1A3D' }}>/ MK Meldpunt</button>
                        <button onClick={() => setView('DASHBOARD')} className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8B1A3D' }}>/ MK Dashboard</button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
