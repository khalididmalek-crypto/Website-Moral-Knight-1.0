
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X } from 'lucide-react';

interface VisieProps {
    content: string;
}

const SOURCES = [
    "Bengio, Y., Clare, S., Prunkl, C., Murray, M., Andriushchenko, M., Bucknall, B., ... & Mindermann, S. (2026). *International AI Safety Report 2026* (DSIT 2026/001). Department for Science, Innovation and Technology. https://internationalaisafetyreport.org",
    "Bleher, H., & Braun, M. (2023). Reflections on putting AI ethics into practice: How three AI ethics approaches conceptualize theory and practice. *Science and Engineering Ethics*, 29(3), 21. https://doi.org/10.1007/s11948-023-00443-3",
    "Dignum, V. (2022). *Responsible artificial intelligence – from principles to practice*. Paper based on keynote at the Web Conference 2022. Umeå University. https://www.umu.se/en/research/groups/human-centered-ai/",
    "Gerards, J., Muis, I., Straatman, J., Vankan, A., & Boiten, M. (2026). *IAMA Versie 2: Impact Assessment Mensenrechten en Algoritmes*. Universiteit Utrecht in opdracht van het Ministerie van Binnenlandse Zaken en Koninkrijksrelaties. https://www.government.nl/documents/publications/2021/02/25/impact-assessment-fundamental-rights-and-algorithms",
    "Herzog, C., & Blank, S. (2024). A systemic perspective on bridging the principles-to-practice gap in creating ethical artificial intelligence solutions – a critique of dominant narratives and proposal for a collaborative way forward. *Journal of Responsible Innovation*, 11(1), 2431350. https://doi.org/10.1080/23299460.2024.2431350",
    "OECD. (2024). *Governing with artificial intelligence: Are governments ready?* OECD Publishing. https://doi.org/10.1787/e0b636be-en",
    "Ratti, E. (2025). Three Kinds of AI Ethics. [Preprint]. arXiv. https://doi.org/10.48550/arXiv.2503.18842",
    "Yeung, K., & Li, W. (2025). From ‘wild west’ to ‘responsible’ AI testing ‘in-the-wild’: Lessons from live facial recognition testing by law enforcement authorities in Europe. *Data & Policy*, 7(e59). https://doi.org/10.1017/dap.2025.10019"
];

export const getStaticProps: GetStaticProps<VisieProps> = async () => {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'visie_tekst.md');
        console.log("Reading visie text from:", filePath);

        if (!fs.existsSync(filePath)) {
            console.error("File not found:", filePath);
            return {
                props: {
                    content: "Error: Vision text file not found.",
                },
            };
        }

        const content = fs.readFileSync(filePath, 'utf8');
        console.log("Read content length:", content.length);

        if (!content) {
            console.error("File is empty:", filePath);
            return {
                props: {
                    content: "Error: Vision text file is empty.",
                },
            };
        }

        return {
            props: {
                content,
            },
        };
    } catch (e) {
        console.error("Error reading visie text:", e);
        return {
            props: {
                content: `Error loading vision text: ${(e as any).message}`,
            },
        };
    }
};

export default function VisiePage({ content }: VisieProps) {
    const [showSources, setShowSources] = useState(false);

    // Lock body scroll when sources modal is open
    React.useEffect(() => {
        if (showSources) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showSources]);

    // Force desktop viewport before printing so md: breakpoints activate on mobile
    const handlePrint = () => {
        const metaViewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement | null;
        const originalContent = metaViewport?.getAttribute('content') ?? '';
        if (metaViewport) {
            metaViewport.setAttribute('content', 'width=900');
        }
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                if (metaViewport) {
                    metaViewport.setAttribute('content', originalContent || 'width=device-width, initial-scale=1');
                }
            }, 1000);
        }, 100);
    };

    // Colors
    const BG_COLOR = "#FAFAFA";
    const TEXT_COLOR = "#222222";
    const ACCENT_COLOR = "#8B1A3D"; // Moral Knight Red
    const MK_BLUE = "#B0C4D4"; // Services blue/grey

    return (
        <>
            <Head>
                <title>Onze Visie - Moral Knight</title>
                <style>{`
                    @media print {
                        @page { 
                            margin: 2cm 2cm 2cm 2cm;
                            size: A4 portrait;
                        }
                        body { 
                            background-color: white !important; 
                            color: #222222 !important;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .print-white-bg {
                            background-color: white !important;
                        }
                        nav, footer, .no-print { display: none !important; }
                        .print-only { display: block !important; }
                        main { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; }
                        /* Keep source links visible and underlined in PDF */
                        .source-list a { color: #194D25 !important; text-decoration: underline !important; font-size: 10px !important; }
                        a { text-decoration: none !important; color: #222222 !important; }
                        h1, h2, h3, h4 { page-break-after: avoid; }
                        .page-break { break-before: page; }
                    }
                `}</style>
            </Head>

            <div className="min-h-screen py-10 px-6 md:px-0 relative print-white-bg" style={{ backgroundColor: BG_COLOR, color: TEXT_COLOR }}>
                <div className="max-w-3xl mx-auto">
                    {/* Print-only Header (Matches Website Header Style) */}
                    <div className="hidden print:block mb-8 bg-white p-4 border border-[#8B1A3D] text-left">
                        <div className="font-mono font-bold uppercase tracking-widest text-[#194D25]">
                            <span style={{ color: '#194D25' }}>/</span> Moral Knight
                        </div>
                    </div>

                    {/* Document Title for Print */}
                    <div className="hidden print:block mb-12 text-left">
                        <h1 className="font-mono text-xl font-bold tracking-[0.2em] uppercase text-black">
                            Visie op Onafhankelijke Toetsing
                        </h1>
                        <p className="font-mono text-[10px] mt-1 uppercase tracking-widest" style={{ color: '#8B1A3D' }}>
                            Theoretisch Kader | 2026
                        </p>
                    </div>

                    {/* Header (Nav) - Screen Only */}
                    <div className="mb-8 flex justify-between items-center bg-white p-4 border border-[#8B1A3D] shadow-sm no-print">
                        <Link href="/" className="font-mono font-bold uppercase tracking-widest transition-colors duration-300">
                            <span style={{ color: '#194D25' }}>/</span>
                            <span className="hover:text-[#8B1A3D] transition-colors duration-300" style={{ color: "#194D25" }}> Moral Knight</span>
                        </Link>
                        <span className="font-mono text-xs text-gray-400">VISIE 2026</span>
                    </div>

                    {/* Document Title - Screen Only */}
                    <div className="no-print mb-12 text-left">
                        <h1 className="font-mono text-xl md:text-2xl font-bold tracking-[0.2em] uppercase" style={{ color: TEXT_COLOR }}>
                            Visie op Onafhankelijke Toetsing
                        </h1>
                        <p className="font-mono text-[11px] mt-1 uppercase tracking-widest" style={{ color: '#8B1A3D' }}>
                            Theoretisch Kader | 2026
                        </p>
                    </div>

                    {/* Main Content */}
                    <main className="prose prose-slate max-w-none font-sans">
                        <div style={{ fontFamily: 'system-ui, sans-serif' }}>
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-bold mb-6 font-mono uppercase tracking-tight print:text-xl print:mb-4" style={{ color: TEXT_COLOR }} {...props} />,
                                    h2: ({ node, ...props }) => {
                                        const isContextH2 = props.children && String(props.children).includes("CONTEXT EN MENSENRECHTEN");
                                        // Shorten the first H2 title: remove subtitle after colon
                                        let children = props.children;
                                        if (typeof children === 'string' && children.includes('Een theoretisch kader')) {
                                            children = 'Van principe naar praktijk';
                                        } else if (Array.isArray(children)) {
                                            children = children.map(c =>
                                                typeof c === 'string' && c.includes('Een theoretisch kader') ? 'Van principe naar praktijk' : c
                                            );
                                        }
                                        return (
                                            <h2
                                                className={`text-xl md:text-2xl font-bold mt-10 mb-4 font-mono uppercase tracking-wide border-b border-[#8B1A3D] pb-2 print:text-[14px] print:mt-8 print:mb-2 ${isContextH2 ? 'page-break' : ''}`}
                                                style={{ color: "#194D25" }}
                                            >
                                                {children}
                                            </h2>
                                        );
                                    },
                                    p: ({ node, ...props }) => <p className="text-lg leading-relaxed mb-6 print:text-base print:mb-4" style={{ color: "#333" }} {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-bold print:text-black" style={{ color: ACCENT_COLOR }} {...props} />,
                                }}
                            >
                                {content}
                            </ReactMarkdown>

                            {/* Scientific Sources - Print Only */}
                            <div className="hidden print:block mt-12 pt-8 page-break">
                                <h2 className="text-[14px] font-bold font-mono uppercase tracking-widest mb-6 border-b border-[#8B1A3D] pb-2 text-[#194D25]">
                                    Literatuurlijst
                                </h2>
                                <ul className="source-list space-y-4 font-mono text-xs text-gray-700">
                                    {SOURCES.map((source, index) => (
                                        <li key={index} className="pl-4 border-l-2 border-[#194D25]/20">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    p: ({ node, ...props }) => <p {...props} className="m-0" />,
                                                    a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: '#194D25', textDecoration: 'underline' }} />
                                                }}
                                            >
                                                {source}
                                            </ReactMarkdown>
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
                                <span>↓ Download PDF (Visie)</span>
                            </button>

                            <button
                                className="font-mono text-sm text-gray-400 hover:text-gray-600 underline decoration-dotted"
                                onClick={() => setShowSources(true)}
                            >
                                Wetenschappelijke Bronnen
                            </button>
                        </div>
                        <div className="text-left mt-4">
                            <Link href="/" className="font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                ← Terug naar Home
                            </Link>
                        </div>
                    </footer>
                </div>

                {/* Sources Modal */}
                {showSources && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm no-print"
                        onClick={() => setShowSources(false)}
                        style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
                    >
                        <div
                            className="bg-white w-full max-w-[550px] max-h-[90vh] overflow-y-auto p-6 relative shadow-xl border-t-4"
                            style={{ borderTopColor: MK_BLUE, overscrollBehavior: 'contain', touchAction: 'pan-y' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowSources(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-6">
                                <div className="inline-block px-3 py-1.5 bg-[#F0F4F8] text-[#194D25] font-mono text-xs font-bold uppercase tracking-widest mb-2">
                                    Bronnen
                                </div>
                                <h2 className="text-2xl font-bold font-mono text-[#194D25]">Wetenschappelijke basis</h2>
                            </div>

                            <div className="space-y-4 font-mono text-sm text-gray-600">
                                <p className="italic mb-6 text-gray-400">
                                    Onderstaande literatuur vormt de theoretische basis voor onze visie op onafhankelijke AI-toetsing.
                                </p>
                                <ul className="source-list space-y-4">
                                    {SOURCES.map((source, index) => (
                                        <li key={index} className="pl-4 border-l-2" style={{ borderColor: MK_BLUE }}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    p: ({ node, ...props }) => <p {...props} className="m-0" />,
                                                    a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: '#194D25', textDecoration: 'underline' }} />
                                                }}
                                            >
                                                {source}
                                            </ReactMarkdown>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
