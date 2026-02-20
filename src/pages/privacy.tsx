import React from 'react';
import Head from 'next/head';
import { ProjectorOverlay } from '../components/ProjectorOverlay';
import { COLORS } from '../constants';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen w-full font-sans flex flex-col items-center relative overflow-x-hidden bg-[#F0F4F7]">
            <Head>
                <title>Privacyverklaring - Moral Knight</title>
                <meta name="robots" content="noindex" />
            </Head>

            <ProjectorOverlay active />

            <div className="w-full max-w-4xl px-6 py-12 md:py-20 z-10 flex flex-col gap-10">
                {/* Navigation & Actions */}
                <div className="flex border-b border-black pb-4 print:hidden no-print">
                    <button
                        onClick={() => {
                            if (window.history.length > 1) {
                                window.history.back();
                            } else {
                                window.close();
                            }
                        }}
                        className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-[#8B1A3D] transition-colors cursor-pointer bg-transparent border-none p-0"
                        style={{ color: COLORS.PRIMARY_GREEN }}
                    >
                        <ArrowLeft size={16} />
                        Terug naar formulier
                    </button>
                </div>

                {/* Content */}
                <main className="bg-white border border-black p-8 md:p-12 shadow-sm font-mono text-sm leading-relaxed print:shadow-none print:border-none print:p-0">
                    <header className="mb-12 border-b border-gray-100 pb-8">
                        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-2" style={{ color: COLORS.PRIMARY_GREEN }}>
                            {`Privacyverklaring`}
                        </h1>
                        <p className="text-[10px] opacity-60 uppercase tracking-widest">
                            {`Laatste update: 20 februari 2026 — Moral Knight Responsible AI`}
                        </p>
                    </header>

                    <div className="space-y-8 text-gray-800 print-content">
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-l-4 border-green-800 pl-4 py-1" style={{ color: COLORS.PRIMARY_GREEN }}>
                                {`1. Inleiding`}
                            </h2>
                            <p>
                                {`Moral Knight ("wij", "ons") hecht grote waarde aan uw privacy. In deze verklaring leggen wij uit hoe wij omgaan met persoonsgegevens die via onze website worden verzameld. Onze processen zijn ontworpen volgens de principes van Responsible AI en de Algemene Verordening Gegevensbescherming (AVG/GDPR).`}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-l-4 border-green-800 pl-4 py-1" style={{ color: COLORS.PRIMARY_GREEN }}>
                                {`2. Gegevensverzameling & Doeleinden`}
                            </h2>
                            <p className="mb-4">{`Wij verzamelen gegevens op een uiterst beperkte en privacy-vriendelijke manier:`}</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>{`Geen Tracking:`}</strong> {` Wij gebruiken geen cookies en geen trackers zoals Google Analytics. Uw bezoek aan deze website is volledig anoniem.`}</li>
                                <li><strong>{`Meldpunt & Anonimiteit:`}</strong> {` Bij het doen van een melding (MK Meldpunt) kunt u kiezen voor een volledig anonieme optie. In dat geval vragen en bewaren wij géén naam of e-mailadres.`}</li>
                                <li><strong>{`Contactformulier:`}</strong> {` Alleen als u expliciet contact met ons opneemt, gebruiken wij de verstrekte naam en e-mailadres uitsluitend voor dat doel.`}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-l-4 border-green-800 pl-4 py-1" style={{ color: COLORS.PRIMARY_GREEN }}>
                                {`3. Dataminimalisatie & Veilige Verzending`}
                            </h2>
                            <p>
                                {`Conform onze Responsible AI-principes verzamelen wij alleen de strikt noodzakelijke gegevens. Meldingen en bestanden worden via een versleutelde verbinding (SSL/TLS) naar onze beveiligde server bij een Nederlandse hostingprovider verzonden. Geüploade documenten worden vertrouwelijk behandeld en niet buiten de EU verwerkt of opgeslagen.`}
                            </p>
                            <p className="mt-4">
                                <strong>{`Klokkenluidersbescherming:`}</strong> {` Om geen sporen achter te laten op uw apparaten, sturen wij géén automatische bevestigingsmails naar melders van misstanden. Na verzending ontvangt u direct op uw scherm een uniek kenmerk.`}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-l-4 border-green-800 pl-4 py-1" style={{ color: COLORS.PRIMARY_GREEN }}>
                                {`4. Uw Rechten`}
                            </h2>
                            <p>
                                {`U heeft te allen tijde het recht op inzage, correctie of verwijdering van uw persoonsgegevens (indien verstrekt). Voor anonieme meldingen bezitten wij geen gegevens die herleidbaar zijn naar uw persoon. Neem voor verzoeken contact met ons op.`}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-l-4 border-green-800 pl-4 py-1" style={{ color: COLORS.PRIMARY_GREEN }}>
                                {`5. Beveiliging & Hosting`}
                            </h2>
                            <p>
                                {`Wij nemen passende technische maatregelen, waaronder moderne encryptie en het gebruik van strikte beveiligingsheaders. Onze website en data worden gehost in Nederlandse datacenters onder Nederlandse jurisdictie. Wij minimaliseren menselijke toegang tot verzamelde onderzoeksdata.`}
                            </p>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <p className="italic opacity-80">
                                {`Voor vragen over deze privacyverklaring kunt u contact met ons opnemen via het contactformulier op de hoofdpagina.`}
                            </p>
                        </section>
                    </div>
                </main>

                {/* Footer Copy */}
                <footer className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest opacity-40 pb-10">
                    <span>Moral Knight / 2025</span>
                    <span>AVG COMPLIANT</span>
                </footer>
            </div>

            <style jsx global>{`
                @media print {
                    html, body, #__next, main { 
                        height: auto !important; 
                        overflow: visible !important; 
                        display: block !important; 
                        position: static !important;
                    }
                    nav, footer, .no-print, button { display: none !important; }
                    .print-content { 
                        display: block !important; 
                        width: 100% !important; 
                        color: black !important; 
                    }
                    
                    /* Zorg dat tekst zwart is op wit voor de printer */
                    * {
                        color: black !important;
                        background: white !important;
                        box-shadow: none !important;
                        text-shadow: none !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                        transition: none !important;
                        animation: none !important;
                    }

                    main {
                        box-shadow: none !important;
                        border: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        position: static !important;
                    }
                }
            `}</style>
        </div>
    );
}
