
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';
import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';

interface VisieProps {
    content: string;
}

const SOURCES = [
    "Bengio, Y., Clare, S., Prunkl, C., Murray, M., Andriushchenko, M., Bucknall, B., ... & Mindermann, S. (2026). *International AI Safety Report 2026* (DSIT 2026/001). Department for Science, Innovation and Technology. https://internationalaisafetyreport.org",
    "Bleher, H., & Braun, M. (2023). Reflections on putting AI ethics into practice: How three AI ethics approaches conceptualize theory and practice. *Science and Engineering Ethics*, 29(3), 21. https://doi.org/10.1007/s11948-023-00443-3",
    "Dignum, V. (2022). *Responsible artificial intelligence – from principles to practice*. Paper based on keynote at the Web Conference 2022. Umeå University.",
    "Gerards, J., Muis, I., Straatman, J., Vankan, A., & Boiten, M. (2026). *IAMA Versie 2: Impact Assessment Mensenrechten en Algoritmes*. Universiteit Utrecht in opdracht van het Ministerie van Binnenlandse Zaken en Koninkrijksrelaties.",
    "Herzog, C., & Blank, S. (2024). A systemic perspective on bridging the principles-to-practice gap in creating ethical artificial intelligence solutions – a critique of dominant narratives and proposal for a collaborative way forward. *Journal of Responsible Innovation*, 11(1), 2431350. https://doi.org/10.1080/23299460.2024.2431350",
    "OECD. (2024). *Governing with artificial intelligence: Are governments ready?* OECD Publishing.",
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
                        @page { margin: 2cm; }
                        body { background-color: #FAFAFA !important; color: #222222 !important; }
                        nav, footer, .no-print { display: none !important; }
                        .print-only { display: block !important; }
                        main { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; }
                        a { text-decoration: none !important; color: #222222 !important; }
                    }
                `}</style>
            </Head>

            <div className="min-h-screen py-10 px-6 md:px-0 relative" style={{ backgroundColor: BG_COLOR, color: TEXT_COLOR }}>
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-12 flex justify-between items-center bg-white p-4 border border-black shadow-sm no-print">
                        <Link href="/" className="font-mono font-bold uppercase tracking-widest transition-colors duration-300 hover:text-[#8B1A3D]" style={{ color: "#194D25" }}>
                            / Moral Knight
                        </Link>
                        <span className="font-mono text-xs text-gray-400">VISIE 2026</span>
                    </div>

                    {/* Main Content */}
                    <main className="prose prose-slate max-w-none font-sans">
                        <div style={{ fontFamily: 'system-ui, sans-serif' }}>
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-bold mb-6 font-mono uppercase tracking-tight" style={{ color: TEXT_COLOR }} {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4 font-mono uppercase tracking-wide border-b border-black pb-2" style={{ color: "#194D25" }} {...props} />,
                                    p: ({ node, ...props }) => <p className="text-lg leading-relaxed mb-6" style={{ color: "#333" }} {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-bold" style={{ color: ACCENT_COLOR }} {...props} />,
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    </main>

                    {/* Footer / Downloads */}
                    <footer className="mt-16 pt-8 border-t border-black grid gap-6 no-print">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <button
                                onClick={() => window.print()}
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
                        <div className="text-center mt-12">
                            <Link href="/" className="font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                terug naar home
                            </Link>
                        </div>
                    </footer>
                </div>

                {/* Sources Modal */}
                {showSources && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm no-print" onClick={() => setShowSources(false)}>
                        <div
                            className="bg-white w-full max-w-[550px] max-h-[90vh] overflow-y-auto p-6 relative shadow-xl border-t-4"
                            style={{ borderTopColor: MK_BLUE }}
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
                                <ul className="space-y-4">
                                    {SOURCES.map((source, index) => (
                                        <li key={index} className="pl-4 border-l-2" style={{ borderColor: MK_BLUE }}>
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ node, ...props }) => <p {...props} className="m-0" />
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
