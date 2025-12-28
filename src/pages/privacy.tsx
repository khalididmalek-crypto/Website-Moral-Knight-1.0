import React from 'react';
import Head from 'next/head';
import { ProjectorOverlay } from '../components/ProjectorOverlay';
import { COLORS } from '../constants';
import { Printer, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    const handlePrint = () => {
        window.print();
    };


    return (
        <div className="min-h-screen w-full font-sans flex flex-col items-center relative overflow-x-hidden bg-[#F0F4F7]">
            <Head>
                <title>Privacyverklaring - Moral Knight</title>
                <meta name="robots" content="noindex" />
            </Head>

            <ProjectorOverlay active />

            <div className="w-full max-w-4xl px-6 py-12 md:py-20 z-10 flex flex-col gap-10">
                {/* Navigation & Actions */}
                <div className="flex justify-between items-center border-b border-black pb-4 print:hidden no-print">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-[#8B1A3D] transition-colors cursor-pointer bg-transparent border-none p-0"
                        style={{ color: COLORS.PRIMARY_GREEN }}
                    >
                        <ArrowLeft size={16} />
                        Terug naar formulier
                    </button>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-4 py-2 border border-black bg-white hover:bg-[#F7F7F7] transition-all"
                        style={{ color: COLORS.PRIMARY_GREEN }}
                    >
                        <Printer size={16} />
                        Printen / PDF
                    </button>
                </div>

                {/* Content */}
                <main className="bg-white border border-black p-8 md:p-12 shadow-sm font-mono text-sm leading-relaxed print:shadow-none print:border-none print:p-0">
                    <header className="mb-12 border-b border-gray-100 pb-8">
                        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-2" style={{ color: COLORS.PRIMARY_GREEN }}>
                            {`Privacyverklaring`}
                        </h1>
                        <p className="text-[10px] opacity-60 uppercase tracking-widest">
                            {`Laatste update: 28 december 2024 — Moral Knight Responsible AI`}
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
                            <p className="mb-4">{`Wij verzamelen gegevens via twee hoofdwegen op deze website:`}</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>{`Contactformulier:`}</strong> {` De door u verstrekte naam, e-mailadres en optionele organisatiedetails worden uitsluitend gebruikt om op uw verzoek contact met u op te nemen.`}</li>
                                <li><strong>{`MK Meldpunt (AI Misstanden):`}</strong> {` Gegevens over AI-systemen en omschrijvingen van misstanden worden gebruikt voor ons onderzoek naar verantwoorde AI. Deze meldingen kunnen geanonimiseerd worden opgenomen in rapportages aan toezichthouders of publieke publicaties.`}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-l-4 border-green-800 pl-4 py-1" style={{ color: COLORS.PRIMARY_GREEN }}>
                                {`3. Dataminimalisatie & Opslag`}
                            </h2>
                            <p>
                                {`Conform onze Responsible AI-principes verzamelen wij alleen de strikt noodzakelijke gegevens. Bestanden die u lokaal via \`drag & drop\` in de applicatie gebruikt, worden uitsluitend in uw eigen browser verwerkt en nooit naar onze servers verzonden. Gegevens uit formulieren worden veilig verzonden via een versleutelde SMTP-verbinding (SSL/TLS).`}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-l-4 border-green-800 pl-4 py-1" style={{ color: COLORS.PRIMARY_GREEN }}>
                                {`4. Uw Rechten`}
                            </h2>
                            <p>
                                {`U heeft te allen tijde het recht op inzage, correctie of verwijdering van uw persoonsgegevens. Daarnaast kunt u bezwaar maken tegen de verwerking of verzoeken om gegevensoverdraagbaarheid. Neem hiervoor contact op via het contactformulier.`}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-l-4 border-green-800 pl-4 py-1" style={{ color: COLORS.PRIMARY_GREEN }}>
                                {`5. Beveiliging`}
                            </h2>
                            <p>
                                {`Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen. Dit omvat onder meer het gebruik van moderne encryptie en het minimaliseren van menselijke toegang tot verzamelde data. Onze website is beveiligd tegen bots middels honeypot-technologie om spambelastingen te voorkomen.`}
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
