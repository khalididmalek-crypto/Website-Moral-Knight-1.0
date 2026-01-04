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
                            <h4 className="font-bold text-sm mb-2 text-gray-900 text-left w-full">Ethische AI als bijzaak</h4>
                            <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700">
                                Tegenwoordig verplaatst de discussie over AI zich steeds vaker naar de rechtszaal. Dankzij de EU AI Act zijn morele keuzes wettelijk verplicht: manipulatieve systemen zijn verboden en audits een harde eis. Maar deze &apos;zorgplicht&apos; gaat verder dan de techniek. Uiteindelijk gaat het om mensen. Wij helpen organisaties om AI-geletterd te worden en toetsen AI in het publieke domein gevraagd en ongevraagd. Want het grootste risico zit vaak niet in de code, maar in hoe menselijk toezicht wordt georganiseerd.
                            </p>
                            <h4 className="font-bold text-sm mb-2 text-gray-900 text-left w-full">De blinde vlek</h4>
                            <p className="mb-4 text-[14px] font-mono leading-relaxed text-gray-700">
                                Wetgeving dient als basis, maar biedt nog geen harde garanties voor ethische resultaten. Wat is de grootste blinde vlek ten aanzien van AI in het publieke domein? Het gebrek aan degelijke evaluatie. Een helder zicht op de hoe de AI feitelijk functioneert in de praktijk en of burgers er daadwerkelijk mee geholpen worden. Wij vinden het onacceptabel dat technologie alleen werkt &apos;op papier&apos; terwijl het maatschappelijk belang er hinder van heeft. Wij maken de feitelijke impact van publieke AI tastbaar en zichtbaar.
                            </p>
                            <h4 className="font-bold text-sm mb-2 text-gray-900 text-left w-full">Afhankelijkheid en macht</h4>
                            <p className="text-[14px] font-mono leading-relaxed text-gray-700">
                                De regulatie van AI gaat niet alleen om algoritmes, maar om de hele keten (van chips tot cloud). In Europa wordt zwaar geleund op een paar grote tech-spelers, wat onze digitale autonomie ondermijnt. Wij bewaken onze soevereiniteit door de hele keten kritisch door te lichten aan de hand van menselijke waarden, zonder oog voor duurzaamheid en mensenrechten te verliezen.
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
                    </div>
                </div>

                {/* New Tile: ONZE AANPAK */}
                <div
                    onClick={() => handleTileClick('APPROACH')}
                    className={`animate-fade-in-slow w-full border border-black p-4 relative cursor-pointer transition-all duration-300 ease-in-out ${activeTile === 'APPROACH'
                        ? 'bg-white rounded-3xl border-slate-100 shadow-md min-h-[200px]'
                        : 'bg-[#CCD5C6] rounded-sm flex-1'
                        }`}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">ONZE AANPAK</div>
                    </div>
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTile === 'APPROACH' ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col items-center py-4">
                            <p className="text-[14px] font-mono leading-relaxed text-gray-700"></p>
                        </div>
                    </div>
                </div>

                {/* New Tile: ONZE DIENSTEN */}
                <div
                    onClick={() => handleTileClick('SERVICES')}
                    className={`animate-fade-in-slow w-full border border-black p-4 relative cursor-pointer transition-all duration-300 ease-in-out ${activeTile === 'SERVICES'
                        ? 'bg-white rounded-3xl border-slate-100 shadow-md min-h-[200px]'
                        : 'bg-[#AEB5B9] rounded-sm flex-1'
                        }`}
                >
                    <div className="px-3 py-1.5 bg-white border border-black w-fit">
                        <div className="font-mono text-[13.2px] font-semibold uppercase tracking-widest text-gray-900">ONZE DIENSTEN</div>
                    </div>
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTile === 'SERVICES' ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col items-center py-4">
                            <p className="text-[14px] font-mono leading-relaxed text-gray-700"></p>
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
