import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Cpu, Briefcase, Send, BookOpen } from 'lucide-react';
import { COLORS } from '../constants';
import { BlogPost } from '../types';

import { motion, AnimatePresence } from 'framer-motion';
import { ContactForm } from './ContactForm';
import { Dashboard } from './Dashboard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { FlowingText } from './FlowingText';
import { Kennisbank } from './Kennisbank';
import { Meldpunt } from './Meldpunt';
import { BlogPostDetail } from './BlogGrid';
import Image from 'next/image';

type MobileView = 'HOME' | 'DASHBOARD' | 'MELDPUNT' | 'KENNISBANK';



interface MobileHomeProps {
    problemTileContent: string;
    solutionTileContent: string;
    approachTileContent: string;
    servicesTileContent: string;
    posts: BlogPost[];
}

export const MobileHome: React.FC<MobileHomeProps> = ({ problemTileContent, solutionTileContent, approachTileContent, servicesTileContent, posts = [] }) => {
    const [view, setView] = useState<MobileView>('HOME');
    const [meldpuntOpen, setMeldpuntOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [activeTiles, setActiveTiles] = useState<string[]>([]);
    const [hasMounted, setHasMounted] = useState(false);
    // Animation state - reserved for future scroll lock implementation during animation window


    const containerRef = useRef<HTMLDivElement>(null);

    const BG_COLORS = {
        PROBLEM: '#EBC6C1', // Pale Bordeaux
        SOLUTION: '#E0E4DC', // Much lighter green
        APPROACH: '#fed48b', // Soft Mustard 
        SERVICES: '#D0E0EB', // Sky Blue variant
        BLOG: '#e3b5a3',    // Terra Cotta (5% more terra)
        CONTACT: '#D6E3D1',  // Bright Sage
        HOME: '#f8fafc'
    };

    // Helper to get gradient based on active tile
    const getActiveGradient = (tile: string) => {
        switch (tile) {
            case 'PROBLEM':
                return 'linear-gradient(135deg, #EBC6C1 0%, #DDB6B0 50%, #D1A6A0 100%)';
            case 'SOLUTION':
                return 'linear-gradient(135deg, #E0E4DC 0%, #CAD4C5 50%, #B4C0AD 100%)';
            case 'APPROACH':
                return 'linear-gradient(135deg, #fed48b 0%, #feca6e 50%, #fdbf51 100%)';
            case 'SERVICES':
                return 'linear-gradient(135deg, #D0E0EB 0%, #C4D4E0 50%, #B8C8D5 100%)';
            case 'BLOG':
                return 'linear-gradient(135deg, #e3b5a3 0%, #d9a890 50%, #cf9b82 100%)';
            case 'CONTACT':
                return 'linear-gradient(135deg, #D6E3D1 0%, #C8D7C2 50%, #BCCBB3 100%)';
            default:
                return 'none';
        }
    };

    const tileRefs = {
        PROBLEM: useRef<HTMLDivElement>(null),
        SOLUTION: useRef<HTMLDivElement>(null),
        APPROACH: useRef<HTMLDivElement>(null),
        SERVICES: useRef<HTMLDivElement>(null),
        BLOG: useRef<HTMLDivElement>(null),
        CONTACT: useRef<HTMLDivElement>(null),
    };

    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Scroll Locking for iOS/Mobile to ensure background is static when modal is open
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const isModalOpen = view !== 'HOME' || meldpuntOpen || selectedPost !== null;

        if (isModalOpen) {
            const scrollY = container.scrollTop;
            container.dataset.scrollY = scrollY.toString();

            // Fix position to prevent background scrolling (iOS friendly)
            Object.assign(container.style, {
                position: 'fixed',
                top: `-${scrollY}px`,
                width: '100%',
                height: '100dvh',
                overflow: 'hidden'
            });
        } else {
            const scrollY = parseInt(container.dataset.scrollY || '0', 10);

            Object.assign(container.style, {
                position: '',
                top: '',
                width: '',
                height: '',
                overflow: ''
            });

            container.scrollTop = scrollY;
        }
    }, [view, meldpuntOpen, selectedPost]);

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
        setSelectedPost(null);
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
        <>
            <motion.div
                ref={containerRef}
                initial={{ opacity: 0 }}

                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col min-h-[100dvh] w-full font-mono transition-colors duration-500 ease-in-out md:hidden overflow-y-auto"
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
                <style jsx>{`
                    @keyframes drawLine {
                        from { transform: scaleX(0); }
                        to { transform: scaleX(1); }
                    }
                    @keyframes drawPath {
                        to { stroke-dashoffset: 0; }
                    }
                `}</style>
                <div className="pt-12 mx-4 pb-2 flex justify-between items-end relative">
                    <div className="relative w-full">
                        <h1 className="text-4xl font-medium tracking-tight text-[#111111] mb-1">Moral Knight</h1>
                        <div className="text-xs font-bold uppercase tracking-widest text-[#194D25] pt-1.5 opacity-90 leading-relaxed">
                            De onafhankelijke waakhond<br />
                            van publieke AI
                        </div>
                        {/* Animated Pen Stroke for Subtitle */}
                        {/* Animated Pen Stroke with Flick */}
                        <div className="w-full relative overflow-visible pointer-events-none mt-2" style={{ height: '15px' }}>
                            <svg
                                width="100%"
                                height="20"
                                viewBox="0 0 400 20"
                                preserveAspectRatio="none"
                                style={{ position: 'absolute', bottom: '0', left: 0, overflow: 'visible' }}
                            >
                                <path
                                    d="M 0,15 L 392,15 L 398,0"
                                    fill="none"
                                    stroke="#A31F47"
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                    style={{
                                        strokeDasharray: 1000,
                                        strokeDashoffset: 1000,
                                        animation: 'drawPath 1.8s ease-out forwards',
                                        animationDelay: '0.2s'
                                    }}
                                />
                            </svg>
                        </div>
                    </div>

                </div>

                {/* Accordion Tiles */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 flex flex-col w-full p-4 gap-y-4 pb-12"
                    style={{ overflowAnchor: 'none' }}
                >
                    {/* Tile 1: PROBLEEM */}
                    <motion.div
                        layout="position"
                        ref={tileRefs.PROBLEM}
                        variants={tileVariants}
                        onClick={() => handleTileClick('PROBLEM')}
                        onLayoutAnimationComplete={() => handleLayoutComplete('PROBLEM')}
                        className={`w-full p-4 relative cursor-pointer transition-colors duration-300 ease-in-out scroll-mt-[100px] ${activeTiles.includes('PROBLEM')
                            ? 'bg-white rounded-none shadow-md'
                            : 'bg-[#EBC6C1] rounded-sm'
                            }`}
                        style={{ overflowAnchor: 'none', borderWidth: '1.3px', borderColor: '#061424', borderStyle: 'solid' }}
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
                        className={`w-full p-4 relative cursor-pointer transition-colors duration-300 ease-in-out scroll-mt-[100px] ${activeTiles.includes('SOLUTION')
                            ? 'bg-white rounded-none shadow-md'
                            : 'bg-[#C1C9B9] rounded-sm'
                            }`}
                        style={{ overflowAnchor: 'none', borderWidth: '1.3px', borderColor: '#061424', borderStyle: 'solid' }}
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

                                            {/* Added CTA matching Problem Tile style */}
                                            <div className="w-full mt-2">
                                                <h4 className="font-bold text-base mb-2 text-[#194D25] text-left w-full">
                                                    Heeft u behoefte aan onafhankelijke toetsing?
                                                </h4>
                                                <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700">
                                                    U kunt ons benaderen voor een vrijblijvend inhoudelijk gesprek over onze werkwijze en het toetsen van publieke AI.{' '}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (!activeTiles.includes('CONTACT')) {
                                                                handleTileClick('CONTACT');
                                                            } else {
                                                                tileRefs.CONTACT.current?.scrollIntoView({ behavior: 'smooth' });
                                                            }
                                                        }}
                                                        className="text-[#8B1A3D] font-bold hover:underline cursor-pointer"
                                                    >
                                                        Benader ons via het contactformulier.
                                                    </button>
                                                </p>
                                            </div>
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
                        className={`w-full p-4 relative cursor-pointer transition-colors duration-300 ease-in-out scroll-mt-[100px] ${activeTiles.includes('APPROACH')
                            ? 'bg-white rounded-none shadow-md'
                            : 'bg-[#fed48b] rounded-sm'
                            }`}
                        style={{ overflowAnchor: 'none', borderWidth: '1.3px', borderColor: '#061424', borderStyle: 'solid' }}
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
                        className={`w-full p-4 relative cursor-pointer transition-colors duration-300 ease-in-out scroll-mt-[100px] ${activeTiles.includes('SERVICES')
                            ? 'bg-white rounded-none shadow-md'
                            : 'bg-[#B0C4D4] rounded-sm'
                            }`}
                        style={{ overflowAnchor: 'none', borderWidth: '1.3px', borderColor: '#061424', borderStyle: 'solid' }}
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
                        className={`w-full p-4 relative cursor-pointer transition-colors duration-300 ease-in-out scroll-mt-[100px] ${activeTiles.includes('CONTACT')
                            ? 'bg-white rounded-none shadow-md'
                            : 'bg-[#D6E3D1] rounded-sm'
                            }`}
                        style={{ overflowAnchor: 'none', borderWidth: '1.3px', borderColor: '#061424', borderStyle: 'solid' }}
                    >

                        <div className="absolute top-4 right-4 opacity-50">
                            <Send size={20} strokeWidth={1.2} color="#374151" />
                        </div>
                        {!activeTiles.includes('CONTACT') && (
                            <div className="px-3 py-1.5 bg-white border border-black w-fit">
                                <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">Contact</div>
                            </div>
                        )}
                        <AnimatePresence>
                            {activeTiles.includes('CONTACT') && hasMounted && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <motion.div exit={contentExitAnimation}>
                                        <div className="flex flex-col items-start w-full">
                                            {/* Founder Section - Integrated here as requested */}
                                            <div className="w-full flex flex-col gap-4">
                                                <div className="inline-block bg-white border border-black px-3 py-1.5 w-fit">
                                                    <h3 className="font-mono text-[13.2px] font-semibold uppercase tracking-widest m-0 text-gray-900">
                                                        OPRICHTER
                                                    </h3>
                                                </div>

                                                <div
                                                    className="flex flex-col border border-black bg-white w-full p-2 transition-all duration-300 hover:border-[#fed48b] hover:border-[1.3px] group relative"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="relative w-full aspect-[4/5] grayscale group-hover:grayscale-0 transition-all duration-500 bg-gray-100">
                                                        <Image
                                                            src="/images/team/founder.jpg"
                                                            alt="Oprichter"
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 768px) 100vw, 33vw"
                                                        />
                                                    </div>
                                                </div>

                                                <div
                                                    className="flex flex-col border border-black bg-white w-full p-6 justify-center"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <h4 className="font-mono text-lg font-bold uppercase tracking-wider mb-4 text-[#194D25]">
                                                        Khalid Idmalek
                                                    </h4>
                                                    <div className="font-mono text-sm leading-relaxed text-gray-800 space-y-4">
                                                        <p>
                                                            Met ruime ervaring in het onderwijs als filosoof, docent levensbeschouwing en ethiek, ben ik gedreven door een gezonde portie democratisch idealisme. Met een creatief brein dat filosofische principes vertaalt naar praktische toepassingen, focus ik mij op het tegengaan van digitale uitsluiting en misstanden.
                                                        </p>
                                                        <p>
                                                            Vanuit de overtuiging dat technologie transparant en verantwoordelijk moet zijn, help ik organisaties door middel van onafhankelijke toetsing. Als externe&apos;third party&apos; voer ik gevraagd en ongevraagd kritische toetsingen uit van AI-systemen, waarbij wet- en regelgeving, normen en waarden, en maatschappelijke impact centraal staan.
                                                        </p>
                                                        <p>
                                                            Alle verschillende opvattingen die tegenwoordig over AI de ronde gaan, soms lijkt het op intellectueel confetti. Uiteindelijk is het cruciaal om simpelweg te toetsen wat AI feitelijk in het publieke domein teweegbrengt.
                                                        </p>
                                                        <p>
                                                            De combinatie van mijn educatieve achtergrond en praktische expertise maak ik mij hard voor het bouwen van bruggen tussen technologische ontwikkeling en het publieke belang.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* White Spacer - seamless integration */}
                                            <div className="w-full py-4 bg-white" />

                                            {/* Contact Form Details - Styled as a separate block */}
                                            <div
                                                className="w-full bg-white flex flex-col gap-4 border border-black p-4"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="inline-block bg-white border border-black px-3 py-1.5 w-fit">
                                                    <h3 className="font-mono text-[13.2px] font-semibold uppercase tracking-widest m-0 text-gray-900">
                                                        Contact
                                                    </h3>
                                                </div>
                                                <ContactForm mode="fullscreen" className="!p-0" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* New Tile: BLOG */}
                    <motion.div
                        layout="position"
                        ref={tileRefs.BLOG}
                        variants={tileVariants}
                        onClick={() => handleTileClick('BLOG')}
                        onLayoutAnimationComplete={() => handleLayoutComplete('BLOG')}
                        className={`w-full p-4 relative cursor-pointer transition-colors duration-300 ease-in-out scroll-mt-[100px] ${activeTiles.includes('BLOG')
                            ? 'bg-white rounded-none shadow-md'
                            : 'bg-[#e3b5a3] rounded-sm'
                            }`}
                        style={{ overflowAnchor: 'none', borderWidth: '1.3px', borderColor: '#061424', borderStyle: 'solid' }}
                    >

                        <div className="absolute top-4 right-4 opacity-50">
                            <BookOpen size={18} strokeWidth={2} color="#4B5563" />
                        </div>
                        <div className="px-3 py-1.5 bg-white border border-black w-fit">
                            <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">BLOG</div>
                        </div>
                        <AnimatePresence>
                            {activeTiles.includes('BLOG') && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <motion.div exit={contentExitAnimation}>
                                        <div className="flex flex-col items-start py-4">
                                            {posts.length > 0 ? (
                                                <div className="w-full flex flex-col gap-4">
                                                    {posts.map((post) => (
                                                        <a
                                                            key={post.id}
                                                            href={`/blog/${post.slug}`}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedPost(post);
                                                            }}
                                                            className="block border-b border-gray-200 pb-3 last:border-0 hover:opacity-75"
                                                        >
                                                            <div className="text-[10px] font-mono text-gray-500 mb-1">{post.date} | {post.tag}</div>
                                                            <h4 className="font-bold text-base text-[#194D25] mb-1 leading-tight">{post.title}</h4>
                                                            <p className="text-xs font-mono text-gray-600 line-clamp-2">{post.excerpt}</p>
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm font-mono text-gray-500 italic">Geen blogposts gevonden.</p>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Divider Line under tiles */}
                    <div className="border-b border-black" />

                    {/* Footer */}
                    <div className="mt-6 px-1 pb-12">
                        <div className="text-[2.66vw] font-mono uppercase tracking-widest leading-relaxed mb-6 whitespace-nowrap">
                            <FlowingText
                                text={`/ Moral Knight Est. 2025 - auditing public AI`}
                                baseColor={COLORS.SECONDARY_GREEN}
                                className="flex text-[2.66vw]"
                            />
                        </div>
                        <div className="flex flex-col gap-0.5 items-start">
                            <button onClick={() => setMeldpuntOpen(true)} className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8B1A3D' }}>/ MK Meldpunt</button>
                            <button onClick={() => setView('DASHBOARD')} className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8B1A3D' }}>/ MK Dashboard</button>
                            <button onClick={() => setView('KENNISBANK')} className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8B1A3D' }}>/ MK Kennisbank</button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {view === 'DASHBOARD' && <Dashboard onClose={handleBack} />}
            {view === 'KENNISBANK' && <Kennisbank onClose={handleBack} />}
            {selectedPost && <BlogPostDetail post={selectedPost} onClose={() => setSelectedPost(null)} onOpenMeldpunt={() => setMeldpuntOpen(true)} />}
            {(view === 'MELDPUNT' || meldpuntOpen) && <Meldpunt onClose={() => setMeldpuntOpen(false)} />}
        </>
    );
};
