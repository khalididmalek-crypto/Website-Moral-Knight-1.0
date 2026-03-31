import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { GlitchIntro } from '../components/GlitchIntro';

interface VisualProps {
    content: string;
}

export const getStaticProps: GetStaticProps<VisualProps> = async () => {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'precheck_tekst.md');
        const content = fs.readFileSync(filePath, 'utf8');
        return { props: { content } };
    } catch (e) {
        return { props: { content: "" } };
    }
};

export default function VisualPage({ content }: VisualProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    // De "Bouwstenen" definiëren
    const bouwstenen = [
        { id: 'intro', title: 'I. Strategie & Rol', subtitle: 'De rol van AI binnen de organisatie' },
        { id: 'reflectie', title: 'II. Reflectie', subtitle: '12 Kritische Toetsstenen' },
        { id: 'matrix', title: 'III. Prioriteit', subtitle: 'De Prioriteiten-matrix' },
        { id: 'advies', title: 'IV. Advies', subtitle: 'De eerste concrete stap' },
        { id: 'scan', title: 'V. Analyse', subtitle: 'De socio-technische scan' },
        { id: 'fundering', title: 'VI. Fundering', subtitle: 'De vier grondrechtenclusters' },
    ];

    // Helper om sectie content te filteren
    const getSectionContent = (id: string) => {
        const sections = content.split('## ');
        switch(id) {
            case 'intro': return '## ' + sections[1];
            case 'reflectie': return '## ' + sections[2];
            case 'matrix': return '## ' + sections[3];
            case 'advies': return '## ' + sections[4];
            case 'scan': return '## ' + (sections[5] ? sections[5].split('### 2.')[0] : "");
            case 'fundering': return '### 2. ' + (sections[5] ? sections[5].split('### 2.')[1] : "");
            default: return "";
        }
    };

    return (
        <>
            <Head>
                <title>MK Visual: Bouwstenen AI Oriëntatie</title>
                <link rel="icon" href="data:," />
            </Head>

            <div className="min-h-screen py-10 px-6 md:px-0 bg-[#FAFAFA] text-[#222222] selection:bg-[#8B1A3D]/10">
                <GlitchIntro duration={800} />
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header Nav */}
                    <div className="mb-10 flex justify-between items-center">
                        <Link href="/precheck" className="font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-[#8B1A3D] transition-colors">
                            ← Naar Volledige Pre-check
                        </Link>
                        <div className="font-mono font-bold uppercase tracking-widest text-[#194D25] text-sm flex items-center gap-2">
                             Moral Knight
                        </div>
                    </div>

                    {/* Titel en Intro */}
                    {!activeSection ? (
                        <div className="mb-20 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
                            <h1 className="font-mono text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-6">
                                De Bouwstenen
                            </h1>
                            <div className="h-1 w-20 bg-[#8B1A3D] mx-auto mb-6"></div>
                            <p className="text-gray-500 font-mono text-xs md:text-sm uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
                                Een interactief overzicht van de AI Oriëntatie Pre-check
                            </p>
                        </div>
                    ) : (
                        <div className="mb-12 animate-in fade-in duration-500">
                            <button 
                                onClick={() => setActiveSection(null)}
                                className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#8B1A3D]"
                            >
                                <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Terug naar het overzicht
                            </button>
                        </div>
                    )}

                    {/* Visual Grid of Content View */}
                    <main>
                        {!activeSection ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                {bouwstenen.map((b, index) => (
                                    <div 
                                        key={b.id}
                                        onClick={() => setActiveSection(b.id)}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                        className="group cursor-pointer bg-white border border-gray-100 p-10 hover:border-[#8B1A3D] transition-all duration-500 hover:shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[220px] animate-in fade-in slide-in-from-bottom-4"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[5rem] font-mono leading-none select-none text-[#8B1A3D]">+</span>
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="font-mono font-bold text-xl mb-3 group-hover:text-[#8B1A3D] transition-colors duration-300 uppercase tracking-tight">{b.title}</h3>
                                            <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.2em] leading-tight font-medium">{b.subtitle}</p>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#8B1A3D] group-hover:w-full transition-all duration-700"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-8 md:p-16 border border-gray-100 shadow-2xl animate-in zoom-in-95 fade-in duration-500 relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-[#8B1A3D]"></div>
                                <div className="prose prose-sm md:prose-base max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-bold mb-10 pb-4 border-b border-gray-100 text-[#194D25] tracking-tight" {...props} />,
                                            h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-12 mb-4 text-gray-900 border-l-4 border-[#8B1A3D] pl-4 italic" {...props} />,
                                            p: ({node, ...props}) => <p className="text-base leading-loose mb-8 text-gray-700 font-light" {...props} />,
                                            strong: ({node, ...props}) => <strong className="font-bold text-[#8B1A3D]" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-none pl-0 space-y-4 mb-8" {...props} />,
                                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-5 mb-8 text-gray-700" {...props} />,
                                            li: (({node, ...props}) => {
                                                const isListDisc = (node as any).parent?.tagName === 'ul';
                                                return (
                                                    <li className={`text-gray-700 leading-relaxed ${isListDisc ? 'relative pl-6 before:content-["→"] before:absolute before:left-0 before:text-[#8B1A3D] before:font-bold' : ''}`} {...props} />
                                                );
                                            }) as any,
                                            table: ({node, ...props}) => (
                                                <div className="overflow-x-auto my-12 rounded-lg border border-gray-100 shadow-sm">
                                                    <table className="min-w-full text-sm" {...props} />
                                                </div>
                                            ),
                                            th: ({node, ...props}) => <th className="bg-gray-50 p-5 font-mono uppercase text-[10px] tracking-widest text-[#194D25] text-left border-b border-gray-200" {...props} />,
                                            td: ({node, ...props}) => <td className="p-5 border-t border-gray-50 text-gray-600 align-top" {...props} />,
                                        }}
                                    >
                                        {getSectionContent(activeSection)}
                                    </ReactMarkdown>
                                </div>
                                <div className="mt-16 pt-8 border-t border-gray-50 flex justify-between items-center">
                                    <button 
                                        onClick={() => setActiveSection(null)}
                                        className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors border border-gray-200 px-6 py-3 rounded-full"
                                    >
                                        Sluit bouwsteen
                                    </button>
                                    <Link href="/precheck" className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8B1A3D] hover:underline">
                                        Bekijk Volledig Document
                                    </Link>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Minimal Footer */}
                    {!activeSection && (
                        <div className="mt-24 text-center">
                            <p className="font-mono text-[9px] text-gray-300 uppercase tracking-[0.5em]">
                                MK Strategic Visual Interface &copy; 2026
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
