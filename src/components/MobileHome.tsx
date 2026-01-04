import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactForm } from './ContactForm';
import { Dashboard } from './Dashboard';
import { ProgressiveImage } from './ProgressiveImage';

type MobileView = 'HOME' | 'DASHBOARD';

export const MobileHome: React.FC = () => {
    const [view, setView] = useState<MobileView>('HOME');
    const [activeTile, setActiveTile] = useState<string | null>(null);
    const [hasMounted, setHasMounted] = useState(false);
    const [isProblemScrolled, setIsProblemScrolled] = useState(false);
    const problemScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const handleTileClick = (tile: string) => {
        setActiveTile(activeTile === tile ? null : tile);
    };

    const handleBack = () => {
        setView('HOME');
        setActiveTile(null);
    };

    const handleProblemScroll = () => {
        if (problemScrollRef.current) {
            setIsProblemScrolled(problemScrollRef.current.scrollTop > 0);
        }
    };

    // Hydration Guard: Render nothing until the component has mounted on the client
    if (!hasMounted) {
        return null;
    }

    if (view === 'DASHBOARD') return <Dashboard onClose={handleBack} />;

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
                type: 'spring',
                stiffness: 60,
                damping: 15,
            },
        },
    };

    const contentExitAnimation = {
        opacity: [1, 0.5, 0],
        x: [0, 3, -3, 0],
        transition: { duration: 0.15 }
    };
    
    const problemHeaderVariants = {
        visible: { opacity: 1, x: 0, height: 'auto', transition: { type: 'spring', stiffness: 60, damping: 15 } },
        hidden: {
            opacity: [1, 0.4, 0.8, 0.1, 0],
            x: [0, 5, 15, 10, 100],
            height: 0,
            transition: {
                type: 'tween',
                duration: 0.2
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-[100dvh] w-full bg-[#f8fafc] font-mono overflow-y-auto md:hidden"
        >
            {/* Header */}
            <div className="pt-12 px-6 pb-2">
                <h1 className="text-4xl font-medium tracking-tight text-[#111111] mb-1">Moral Knight</h1>
                <div className="text-xs font-bold uppercase tracking-widest text-[#194D25] pt-1.5 opacity-90">
                    Wij zijn een onafhankelijke organisatie en bewaken publieke AI
                </div>
            </div>

            <div className="w-full px-4 my-4">
                <div className="w-full h-[1px] bg-black"></div>
            </div>

            {/* Accordion Tiles */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 flex flex-col w-full p-4 gap-y-4 pb-12"
            >
                {/* Tile 1: PROBLEEM */}
                <motion.div
                    variants={tileVariants}
                    onClick={() => handleTileClick('PROBLEM')}
                    className={`w-full border border-black p-4 relative cursor-pointer transition-colors duration-300 ease-in-out ${activeTile === 'PROBLEM'
                        ? 'bg-white rounded-3xl border-slate-100 shadow-md'
                        : 'bg-[#F2E8E4] rounded-sm'
                        }`}
                >
                    <motion.div
                        variants={problemHeaderVariants}
                        animate={isProblemScrolled ? 'hidden' : 'visible'}
                        className="px-3 py-1.5 bg-white border border-black w-fit overflow-hidden"
                    >
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">Wat is het probleem?</div>
                    </motion.div>
                    <AnimatePresence>
                        {activeTile === 'PROBLEM' && (
                            <motion.div
                                ref={problemScrollRef}
                                onScroll={handleProblemScroll}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-y-auto max-h-[60vh]"
                            >
                                <motion.div exit={contentExitAnimation}>
                                    <div className="flex flex-col items-center py-4 mt-6">
                                        <h4 className="font-bold text-base mb-2 text-[#194D25] text-left w-full">AI die mensen schaadt</h4>
                                        <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700">
                                            Kunstmatige intelligentie wordt tegenwoordig voor allerlei maatschappelijke processen gebruikt. Algoritmes bepalen de toegang tot de overheid, zorg, wonen, en werk en inkomen. Zonder onafhankelijk toezicht verdwijnt de menselijke maat achter een barrière van oncontroleerbare technologie.
                                        </p>
                                        <h5 className="font-semibold text-sm mt-4 mb-2 text-gray-800 text-left w-full">Digitale gijzeling</h5>
                                        <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700">
                                            De overheid legt vitale publieke taken in handen van commerciële tech-giganten. Hierdoor ontstaat een diepe afhankelijkheid van ondoorzichtige systemen. Als burger kun je hierdoor benadeeld worden op het vlak van rechtsbescherming, privacy en de kwaliteit van publieke voorzieningen. Op een gegeven moment is er geen weg meer terug: we verliezen controle over onze digitale infrastructuur. Dat wordt ook wel een vendor lock-in genoemd. De situatie waarbij overstappen naar een andere partij gepaard gaat met onaanvaardbaar risico. Zoals hoge kosten, technische hindernissen of operationele problemen.
                                        </p>

                                        <h5 className="font-semibold text-sm mt-4 mb-2 text-gray-800 text-left w-full">Geautomatiseerde uitsluiting</h5>
                                        <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700">
                                            De data waarop AI is getraind is nooit neutraal. Ze staan bol van vooroordelen of liggen soms in de code besloten. Een postcode of persoonlijke achtergrond bepaalt vervolgens over de kansen van mensen. Zonder dat de burger dit weet of er zicht op heeft, of het überhaupt kan controleren. Uiteraard pakt dit het nadeligst uit voor de kwetsbaren in onze maatschappij, zoals ouderen, mensen die moeite hebben met lezen en schrijven of mensen met een beperking, of gemarginaliseerde groepen.
                                        </p>

                                        <h5 className="font-semibold text-sm mt-4 mb-2 text-gray-800 text-left w-full">Macht zonder menselijk gezicht</h5>
                                        <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700">
                                            Doordat de machine beslist staat het recht op bezwaar onder druk. De menselijke maat verdwijnt in een &apos;black box&apos; en bureaucratisch gedoe. Door morele ontkoppeling (moral disengagement) leunt men teveel op de nieuwe technologie. Waardoor verantwoordelijkheid nemen voor een ander die er door in de problemen raakt uit het zicht raakt. Ondanks alle goede bedoelingen. Een algoritme kent geen gedeelde menselijke kwetsbaarheid en toont geen menselijke empathie. En zelfs in het geval van menselijke controle is er altijd een risico op automation bias. Werknemers raken verveeld door het lopende band werk eindeloze controle. Of controle blijft hangen in juridische formaliteiten. Als burger en als werknemer sta je vaak machteloos tegenover de werking van publieke AI.
                                        </p>

                                        <h5 className="font-semibold text-sm mt-4 mb-2 text-gray-800 text-left w-full">Afbrokkeling van democratie</h5>
                                        <p className="text-[14px] font-mono leading-relaxed text-gray-700">
                                            Onnavolgbare besluitvorming verandert de overheid van een bondgenoot in een onvoorspelbare machtsfactor. Wanneer de burger niet meer kan controleren hoe besluiten vallen, maakt democratische controle plaats voor argwaan en angst. Deze afbreuk van vertrouwen is geen neveneffect, maar een fundamentele aantasting van de rechtsstaat waarin de burger niet langer partner, maar proefkonijn is. Zonder onafhankelijke audits hebben overheid en bedrijfsleven een vrijbrief om publieke AI toe te passen in het maatschappelijk leven. Terwijl het afleggen van publieke verantwoording op de achtergrond verdwijnt.
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Tile 2: OPLOSSING */}
                <motion.div
                    variants={tileVariants}
                    onClick={() => handleTileClick('SOLUTION')}
                    className={`w-full border border-black p-4 relative cursor-pointer transition-colors duration-300 ease-in-out ${activeTile === 'SOLUTION'
                        ? 'bg-white rounded-3xl border-slate-100 shadow-md'
                        : 'bg-[#C1C9B9] rounded-sm'
                        }`}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">Wat is de oplossing?</div>
                    </div>
                    <AnimatePresence>
                        {activeTile === 'SOLUTION' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <motion.div exit={contentExitAnimation}>
                                    <div className="flex flex-col items-center py-4 mt-6">
                                        <h4 className="font-bold text-sm mb-2 text-gray-900 text-left w-full">De gelaagde AI-keuring</h4>
                                        <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700">
                                            In 2026 is een AI-audit geen &apos;one-size-fits-all&apos; exercitie meer; wij passen een risicogebaseerde APK toe die direct aansluit op de strenge eisen van de EU AI Act. Onze oplossing verankert de verplichte Fundamental Rights Impact Assessment (FRIA/IAMA) in de kern van de organisatie. Hiermee borgen we dat hoog-risico systemen in de zorg, het onderwijs en bij de overheid niet alleen technisch kloppen, maar ook de grondrechten van de burger onvoorwaardelijk respecteren. Waar risico’s onaanvaardbaar zijn, dwingen wij aanpassingen af voordat de samenleving geraakt wordt.
                                        </p>
                                        <h4 className="font-bold text-sm mb-2 text-gray-900 text-left w-full">Veiligheid over de gehele levenscyclus</h4>
                                        <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700">
                                            AI-systemen zijn nooit &apos;af&apos;; het zijn halffabricaten die continu leren en veranderen zodra ze met de werkelijkheid in aanraking komen. Daarom stopt ons toezicht niet bij de ingebruikname. Wij implementeren mechanismen voor Post-market Monitoring om voortdurend te waken over &apos;data drift&apos; en onvoorziene schadelijke effecten in de praktijk. Door deze voortdurende controle garanderen we veiligheid gedurende de gehele levenscyclus van het algoritme. Wij voorkomen dat een systeem dat vandaag integer lijkt, morgen ongemerkt ontspoort ten koste van het publiek belang.
                                        </p>
                                        <h4 className="font-bold text-sm mb-2 text-gray-900 text-left w-full">Betekenisvolle controle en inspraak</h4>
                                        <p className="text-[14px] font-mono leading-relaxed text-gray-700">
                                            Echte regie betekent dat mensen de daadwerkelijke macht behouden om in te grijpen. Wij borgen betekenisvolle menselijke controle: medewerkers krijgen de autoriteit en de technische &apos;stopknop&apos; om een algoritmisch besluit te negeren of direct terug te draaien. Tegelijkertijd sluiten we de cirkel met een actieve feedbackloop tussen de burger en de maker. Door de ervaringen van burgers die door het algoritme worden geraakt direct terug te koppelen naar de ontwikkelaars, corrigeren we fouten aan de bron. Wij geven de burger een stem in de techniek.
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* New Tile: ONZE AANPAK */}
                <motion.div
                    variants={tileVariants}
                    onClick={() => handleTileClick('APPROACH')}
                    className={`w-full border border-black p-4 relative cursor-pointer transition-colors duration-300 ease-in-out ${activeTile === 'APPROACH'
                        ? 'bg-white rounded-3xl border-slate-100 shadow-md'
                        : 'bg-[#CCD5C6] rounded-sm'
                        }`}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">ONZE AANPAK</div>
                    </div>
                    <AnimatePresence>
                        {activeTile === 'APPROACH' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <motion.div exit={contentExitAnimation}>
                                    <div className="flex flex-col items-center py-4 mt-6">
                                        <h4 className="font-bold text-sm mb-2 text-gray-900 text-left w-full">Advies: Koers bepalen</h4>
                                        <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700">
                                            Wij leggen het ethische fundament voor uw AI-strategie. Door educatie en scherpe kaders krijgt u de regie terug. Zo zijn investeringen vanaf dag één veilig, waardevol en juridisch houdbaar.
                                        </p>
                                        <h4 className="font-bold text-sm mb-2 text-gray-900 text-left w-full">Ontwerp: Waarden verankeren</h4>
                                        <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700">
                                            Wij vertalen abstracte principes naar concrete spelregels. Door menselijk toezicht en transparantie in het ontwerp te vlechten, bouwen we systemen die het vertrouwen van medewerker en burger winnen.
                                        </p>
                                        <h4 className="font-bold text-sm mb-2 text-gray-900 text-left w-full">Toetsing: Controle uitoefenen</h4>
                                        <p className="text-[14px] font-mono leading-relaxed text-gray-700">
                                            Wij meten of AI in de praktijk doet wat het belooft. Met feitelijke audits leveren we de bewijslast voor toezichthouders en versterken we de maatschappelijke verantwoording van uw organisatie.
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* New Tile: ONZE DIENSTEN */}
                <motion.div
                    variants={tileVariants}
                    onClick={() => handleTileClick('SERVICES')}
                    className={`w-full border border-black p-4 relative cursor-pointer transition-colors duration-300 ease-in-out ${activeTile === 'SERVICES'
                        ? 'bg-white rounded-3xl border-slate-100 shadow-md'
                        : 'bg-[#AEB5B9] rounded-sm'
                        }`}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">ONZE DIENSTEN</div>
                    </div>
                    <AnimatePresence>
                        {activeTile === 'SERVICES' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <motion.div exit={contentExitAnimation}>
                                    <div className="flex flex-col items-center py-4 mt-6">
                                        <h4 className="font-bold text-sm mb-2 text-gray-900 text-left w-full">Advies</h4>
                                        <ul className="list-disc pl-5 mb-4 text-[14px] font-mono leading-relaxed text-gray-700 w-full">
                                            <li>Educatie & AI-geletterdheid</li>
                                            <li>Risicoanalyse & AI-governance</li>
                                        </ul>
                                        <h4 className="font-bold text-sm mb-2 text-gray-900 text-left w-full">Ontwerp</h4>
                                        <ul className="list-disc pl-5 mb-4 text-[14px] font-mono leading-relaxed text-gray-700 w-full">
                                            <li>Value Sensitive Design</li>
                                            <li>Co-creatie & mensgericht ontwerp</li>
                                        </ul>
                                        <h4 className="font-bold text-sm mb-2 text-gray-900 text-left w-full">Toetsing</h4>
                                        <ul className="list-disc pl-5 text-[14px] font-mono leading-relaxed text-gray-700 w-full">
                                            <li>Ethiek- & impactassessment</li>
                                            <li>AI-audit & compliance-toets</li>
                                        </ul>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Tile 3: CONTACT */}
                <motion.div
                    variants={tileVariants}
                    onClick={() => handleTileClick('CONTACT')}
                    className={`w-full border border-black p-4 relative cursor-pointer transition-colors duration-300 ease-in-out ${activeTile === 'CONTACT'
                        ? 'bg-white rounded-3xl border-slate-100 shadow-md'
                        : 'bg-[#F0E6D2] rounded-sm'
                        }`}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">Contact</div>
                    </div>
                    <AnimatePresence>
                        {activeTile === 'CONTACT' && hasMounted && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <motion.div exit={contentExitAnimation}>
                                    <div className="flex flex-col items-start py-4 mt-6">
                                        <div className="mt-6 w-full border border-gray-200 rounded-lg p-4">
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
                        / Moral Knight 2025 — saving the human species from annihilation
                    </div>
                    <div className="flex flex-col gap-2 mt-6 items-start">
                        <button onClick={() => setView('DASHBOARD')} className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8B1A3D' }}>/ MK Dashboard</button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
