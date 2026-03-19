import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface PrecheckProps {
    content: string;
}

export const getStaticProps: GetStaticProps<PrecheckProps> = async () => {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'precheck_tekst.md');
        console.log("Reading precheck text from:", filePath);

        if (!fs.existsSync(filePath)) {
            console.error("File not found:", filePath);
            return {
                props: {
                    content: "Error: Precheck text file not found.",
                },
            };
        }

        const content = fs.readFileSync(filePath, 'utf8');
        console.log("Read content length:", content.length);

        if (!content) {
            console.error("File is empty:", filePath);
            return {
                props: {
                    content: "Error: Precheck text file is empty.",
                },
            };
        }

        return {
            props: {
                content,
            },
        };
    } catch (e) {
        console.error("Error reading precheck text:", e);
        return {
            props: {
                content: `Error loading precheck text: ${(e as any).message}`,
            },
        };
    }
};

export default function PrecheckPage({ content }: PrecheckProps) {
    const handlePrint = () => {
        window.print();
    };

    // Colors
    const BG_COLOR = "#FAFAFA";
    const TEXT_COLOR = "#222222";
    const ACCENT_COLOR = "#8B1A3D"; // Moral Knight Red

    return (
        <>
            <Head>
                <title>MK Pre-check: AI Oriëntatie</title>
                <link rel="icon" href="data:," />
                <style>{`
                    /* Screen-only hiding (prevents Chrome from skipping these during PDF generation) */
                    @media screen {
                        #print-header, 
                        #print-title {
                            display: none !important;
                        }
                    }

                    @media print {
                        @page { 
                            margin: 1.5cm;
                            size: A4 portrait;
                        }
                        body { 
                            background-color: white !important; 
                            color: #000000 !important;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        * {
                            text-shadow: none !important;
                            box-shadow: none !important;
                            background: transparent !important;
                        }
                        .print-white-bg, #print-header, body, html, main, footer {
                            background-color: white !important;
                            background-image: none !important;
                        }
                        nav, footer, .no-print, hr, button { display: none !important; }
                        
                        main { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; }
                        
                        #print-header { 
                            display: flex !important; 
                            margin-bottom: 2rem; 
                            border: none !important;
                            border-bottom: 1px solid #8B1A3D !important;
                            padding: 0 0 1rem 0 !important;
                            box-shadow: none !important;
                        }
                        #print-title { display: block !important; margin-bottom: 2rem; }

                        a { text-decoration: none !important; color: #000000 !important; }
                        h1, h2, h3, h4 {
                            page-break-after: avoid !important;
                            break-after: avoid !important;
                        }
                        h1, h2, h3, h4, p, li, tr { 
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        .page-break { break-before: page; }
                    }
                `}</style>
            </Head>

            <div className="min-h-screen py-10 px-6 md:px-0 relative print-white-bg" style={{ backgroundColor: BG_COLOR, color: TEXT_COLOR }}>
                <div className="max-w-3xl mx-auto">
                    {/* Print-only Header */}
                    <div id="print-header" className="mb-8 flex flex-nowrap justify-between items-center bg-white">
                        <div className="font-mono font-bold uppercase tracking-widest text-[#194D25] whitespace-nowrap text-sm md:text-base leading-none flex items-center">
                            <span style={{ color: '#194D25' }}>/</span>
                            <span style={{ color: "#194D25" }}> Moral Knight</span>
                        </div>
                        <span className="font-mono text-gray-400 whitespace-nowrap pl-4 text-sm md:text-xs leading-none flex items-center">CONCEPT 2026</span>
                    </div>

                    {/* Document Title for Print */}
                    <div id="print-title" className="mb-12 text-left">
                        <h1 className="font-mono text-base md:text-2xl font-bold tracking-[0.2em] uppercase text-[#222222]">
                            MK Pre-check: AI Oriëntatie
                        </h1>
                        <p className="font-mono text-[11px] mt-1 uppercase tracking-widest" style={{ color: '#8B1A3D' }}>
                            Onderwijsinstellingen | Conceptueel kader
                        </p>
                    </div>

                    {/* Header (Nav) - Screen Only */}
                    <div className="mb-[26px] no-print text-left">
                        <Link href="/aanpak" className="font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                            ← Terug naar onze aanpak
                        </Link>
                    </div>

                    <div className="mb-8 flex flex-nowrap justify-between items-center bg-white p-4 border border-[#8B1A3D] shadow-sm no-print">
                        <Link href="/" className="font-mono font-bold uppercase tracking-widest transition-colors duration-300 whitespace-nowrap text-sm md:text-base leading-none flex items-center">
                            <span style={{ color: '#194D25' }}>/</span>
                            <span className="hover:text-[#8B1A3D] transition-colors duration-300" style={{ color: "#194D25" }}> Moral Knight</span>
                        </Link>
                        <span className="font-mono text-gray-400 whitespace-nowrap pl-4 text-sm md:text-xs leading-none flex items-center">PRE-CHECK 2026</span>
                    </div>

                    {/* Document Title - Screen Only */}
                    <div className="no-print mb-12 text-left">
                        <h1 className="font-mono text-base md:text-2xl font-bold tracking-[0.2em] uppercase" style={{ color: TEXT_COLOR }}>
                            MK Pre-check: AI Oriëntatie
                        </h1>
                        <p className="font-mono text-[11px] mt-1 uppercase tracking-widest" style={{ color: '#8B1A3D' }}>
                            Onderwijsinstellingen | Conceptueel kader
                        </p>
                    </div>

                    {/* Main Content */}
                    <main className="max-w-none">
                        <div>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-3xl md:text-3xl font-bold mb-6 tracking-normal print:text-xl print:mb-4" style={{ color: TEXT_COLOR }} {...props} />,
                                    h2: ({ node, ...props }) => {
                                        return (
                                            <h2
                                                className="text-base md:text-xl font-bold mt-2 mb-3 tracking-normal border-b border-[#8B1A3D] pb-2 print:text-[16px] print:mt-2 print:mb-2"
                                                style={{ color: "#194D25", letterSpacing: "-0.01em" }}
                                            >
                                                {props.children}
                                            </h2>
                                        );
                                    },
                                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-10 mb-2 print:text-sm print:mt-6 print:mb-2 tracking-normal" style={{ color: "#333" }} {...props} />,
                                    p: ({ node, ...props }) => <p className="text-base leading-relaxed mb-6 print:text-[15px] print:mb-4 outline-none" style={{ color: "#333" }} {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-bold print:text-black" style={{ color: ACCENT_COLOR }} {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-4 mb-6 print:text-base" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-4 mb-6 print:text-base" {...props} />,
                                    li: ({ node, ...props }) => <li className="text-base leading-relaxed print:text-[15px] break-inside-avoid print:break-inside-avoid shadow-none" {...props} />,
                                    table: ({ node, ...props }) => (
                                        <div className="mb-10 mt-6 rounded-sm overflow-hidden border border-[#194D25]/20 shadow-sm print:border-[#194D25] print:shadow-none print:bg-white">
                                            <table className="min-w-full text-left border-collapse print:text-[12px]" {...props} />
                                        </div>
                                    ),
                                    thead: ({ node, ...props }) => (
                                        <thead className="bg-[#f2f5f3] text-[#194D25] print:bg-[#f2f5f3] print:text-[#194D25] border-b-2 border-[#194D25]" {...props} />
                                    ),
                                    tbody: ({ node, ...props }) => (
                                        <tbody className="divide-y divide-gray-200 print:divide-gray-300" {...props} />
                                    ),
                                    tr: ({ node, ...props }) => (
                                        <tr className="bg-white print:bg-white" {...props} />
                                    ),
                                    th: ({ node, ...props }) => (
                                        <th className="px-5 py-4 font-mono font-bold uppercase tracking-widest text-xs" {...props} />
                                    ),
                                    td: ({ node, ...props }) => (
                                        <td className="px-5 py-4 text-gray-800 align-top" {...props} />
                                    ),
                                    div: ({ node, className, ...props }) => {
                                        if (className === 'page-break') {
                                            return <div className="page-break my-12" {...props} />;
                                        }
                                        return <div className={className} {...props} />;
                                    }
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    </main>

                    {/* Footer / Downloads - Screen Only */}
                    <footer className="mt-16 pt-8 border-t border-[#8B1A3D] grid gap-6 no-print">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <button
                                onClick={handlePrint}
                                className="group flex items-center gap-2 font-mono font-bold uppercase tracking-wider text-sm transition-colors hover:opacity-75"
                                style={{ color: ACCENT_COLOR }}
                            >
                                <span>↓ Download PDF</span>
                            </button>
                        </div>
                        <div className="text-left mt-4">
                            <Link href="/aanpak" className="font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                ← Terug naar onze aanpak
                            </Link>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
