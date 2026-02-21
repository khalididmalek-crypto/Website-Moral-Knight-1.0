import React from 'react';
import Head from 'next/head';
import { ProjectorOverlay } from '../components/ProjectorOverlay';
import { COLORS } from '../constants';
import { ArrowLeft, Database, ShieldAlert, BookOpen, Fingerprint } from 'lucide-react';

export default function ArchitectuurPage() {
    return (
        <div className="min-h-screen w-full font-sans flex flex-col items-center relative overflow-x-hidden bg-[#F0F4F7]">
            <Head>
                <title>Systeem Architectuur - Moral Knight</title>
                <meta name="robots" content="noindex" />
            </Head>

            <ProjectorOverlay active />

            <div className="w-full max-w-5xl px-6 py-12 md:py-20 z-10 flex flex-col gap-10">
                {/* Navigation & Actions */}
                <div className="flex border-b border-black pb-4 print:hidden no-print">
                    <button
                        onClick={() => {
                            if (window.history.length > 1) {
                                window.history.back();
                            } else {
                                window.location.href = '/';
                            }
                        }}
                        className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-[#8B1A3D] transition-colors cursor-pointer bg-transparent border-none p-0"
                        style={{ color: COLORS.PRIMARY_GREEN }}
                    >
                        <ArrowLeft size={16} />
                        Terug naar Home
                    </button>
                </div>

                {/* Content */}
                <main className="bg-white border border-black p-8 md:p-12 shadow-sm font-mono text-sm leading-relaxed print:shadow-none print:border-none print:p-0">
                    <header className="mb-12 border-b border-gray-100 pb-8">
                        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-2" style={{ color: COLORS.PRIMARY_GREEN }}>
                            {`Systeem Architectuur & Identiteit`}
                        </h1>
                        <p className="text-[10px] opacity-60 uppercase tracking-widest">
                            {`Classificatie: Intern Document — Moral Knight Responsible AI`}
                        </p>
                    </header>

                    <div className="space-y-12 text-gray-800">
                        {/* Section 1: Identiteit & Grondwet */}
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-l-4 border-green-800 pl-4 py-1 flex items-center gap-3" style={{ color: COLORS.PRIMARY_GREEN }}>
                                <Fingerprint size={20} />
                                {`1. De Root & Identiteit`}
                            </h2>
                            <div className="bg-[#EBF0E8] p-6 border border-black mb-4">
                                <p className="mb-4">
                                    {`De root van het project bevat het "geheugen" en de "grondwet" van de AI Agent. Dit zorgt ervoor dat de Strategisch Adviseur (AI) altijd handelt volgens de ART-principes van Dignum.`}
                                </p>
                                <pre className="font-mono text-xs text-black whitespace-pre-wrap">
                                    {`Moral Knight - Audit/
├── .agent/
│   └── skills/
│       └── moral-knight/
│           └── SKILL.md         <-- De identiteit en gedragsregels van de AI
├── MK_Master_Rules.md           <-- De hiërarchie van waarheid & grondwet
└── Inhoudelijke Richtlijn/      <-- Theoretisch kader (Dignum) & templates`}
                                </pre>
                            </div>
                        </section>

                        {/* Section 2: Repository Architectuur */}
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-l-4 border-green-800 pl-4 py-1 flex items-center gap-3" style={{ color: COLORS.PRIMARY_GREEN }}>
                                <Database size={20} />
                                {`2. Repository Structuur (Website)`}
                            </h2>
                            <div className="bg-[#F0F4F7] p-6 border border-black mb-4 overflow-x-auto">
                                <p className="mb-4">
                                    {`De Next.js applicatie is opgebouwd als een hybride systeem: statische landingpagina gecombineerd met dynamische componenten voor het Meldpunt.`}
                                </p>
                                <pre className="font-mono text-xs text-black whitespace-pre-wrap">
                                    {`MK Responsible AI 1.0/
├── archive/                     <-- Opgeschoonde legacy bestanden (vroeger WordPress)
├── public/                      <-- Statische assets (logo, font, Simple Analytics img)
└── src/
    ├── components/              <-- React componenten (Grid, Tiles, Meldpunt)
    ├── content/blog/            <-- Lokale Markdown blogposts (beheerd via NotebookLM)
    ├── data/                    <-- Statische Tile-teksten (probleem, oplossing, etc)
    ├── lib/                     <-- Utilities en opslag (storage.ts)
    └── pages/                   <-- Next.js App Router
        ├── _app.tsx             <-- Entry point, Context Providers, Simple Analytics script
        ├── index.tsx            <-- Hoofdpagina (laadt Tiles via getStaticProps)
        ├── privacy.tsx          <-- Privacy-verklaring
        └── architectuur.tsx     <-- Dit document`}
                                </pre>
                            </div>
                        </section>

                        {/* Section 3: Kernfunctionaliteiten */}
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-l-4 border-green-800 pl-4 py-1 flex items-center gap-3" style={{ color: COLORS.PRIMARY_GREEN }}>
                                <ShieldAlert size={20} />
                                {`3. Kernfunctionaliteiten`}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Feature 1 */}
                                <div className="border border-black p-5 relative overflow-hidden group hover:border-[#8B1A3D] transition-colors">
                                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <ShieldAlert size={24} color="#8B1A3D" />
                                    </div>
                                    <h3 className="font-bold uppercase tracking-wider mb-2 text-sm">{`Meldpunt Anonimiteit`}</h3>
                                    <p className="text-xs opacity-80 mb-3">{`Bescherming van klokkenluiders is de kerntaak.`}</p>
                                    <ul className="text-xs space-y-2 list-disc pl-4">
                                        <li>{`Optionele persoonsgegevens`}</li>
                                        <li>{`Geen traceerbare bevestigingsmails (Inbox Trace Prevention)`}</li>
                                        <li>{`Versleutelde SMTP (TLS) met strikte certificaat-validatie`}</li>
                                        <li>{`Directe referentiecode op scherm`}</li>
                                    </ul>
                                </div>

                                {/* Feature 2 */}
                                <div className="border border-black p-5 relative overflow-hidden group hover:border-[#194D25] transition-colors">
                                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <BookOpen size={24} color="#194D25" />
                                    </div>
                                    <h3 className="font-bold uppercase tracking-wider mb-2 text-sm">{`NotebookLM Blog Workflow`}</h3>
                                    <p className="text-xs opacity-80 mb-3">{`Geen zware CMS meer nodig. Volledig AI-gedreven.`}</p>
                                    <ul className="text-xs space-y-2 list-disc pl-4">
                                        <li>{`Auteur schrijft in Google NotebookLM`}</li>
                                        <li>{`AI Agent leest notitie en converteert naar Markdown`}</li>
                                        <li>{`Bestand wordt geplaatst in src/content/blog/`}</li>
                                        <li>{`Automatische deployment via Vercel na GitHub push`}</li>
                                    </ul>
                                </div>

                                {/* Feature 3 */}
                                <div className="border border-black p-5 relative overflow-hidden group hover:border-black transition-colors md:col-span-2 bg-[#F7F7F7]">
                                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <Fingerprint size={24} color="#111111" />
                                    </div>
                                    <h3 className="font-bold uppercase tracking-wider mb-2 text-sm">{`Privacy-First Analytics`}</h3>
                                    <p className="text-xs opacity-80 mb-3">{`Practicing what we preach: Transparantie.`}</p>
                                    <ul className="text-xs space-y-2 list-disc pl-4">
                                        <li>{`100% Cookieloos via Simple Analytics`}</li>
                                        <li>{`Geen profiling, geen IP opslag`}</li>
                                        <li>{`Data gehost op Europese servers`}</li>
                                        <li>{`Voldoet aan AVG (Geen cookiebanner nodig)`}</li>
                                        <li>{`Fallback image tracker voor non-JS bezoekers`}</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                {/* Footer Copy */}
                <footer className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest opacity-40 pb-10">
                    <span>Moral Knight / 2026</span>
                    <span>CLASSIFICATION: PUBLIC</span>
                </footer>
            </div>

            <style jsx global>{`
                ::selection {
                    background: #EBF0E8; /* PRIMARY_GREEN but very light */
                    color: #194D25;      /* PRIMARY_GREEN */
                }
            `}</style>
        </div>
    );
}
