import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { generateEmailHtml } from '../utils/emailTemplate';

// MOCK DATA
const MOCK_DATA = {
    contact: {
        formType: 'contact',
        name: 'Jan de Vries',
        email: 'jan@voorbeeld.nl',
        organisation: 'Stichting Voorbeeld',
        message: 'Ik heb een vraag over jullie toetsingskader. Kunnen we een afspraak maken?',
        privacyConsent: true,
    } as import('../utils/emailTemplate').EmailTemplateData,
    report: {
        formType: 'report',
        name: 'Anonieme Melder',
        email: 'melder@voorbeeld.nl',
        organisation: 'Gemeente X',
        aiSystem: 'Fraudebestrijding Systeem Y',
        description: 'Dit systeem lijkt automatisch mensen met een bepaalde postcode te selecteren voor controle.',
        privacyConsent: true,
        file: 'bewijs.pdf'
    } as import('../utils/emailTemplate').EmailTemplateData
};

const EmailPreview = () => {
    const [activeTab, setActiveTab] = useState<'visitor' | 'admin'>('visitor');
    const [activeType, setActiveType] = useState<'contact' | 'report'>('contact');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const data = activeType === 'contact' ? MOCK_DATA.contact : MOCK_DATA.report;
    const isForUser = activeTab === 'visitor';
    const isReport = activeType === 'report';
    const reportId = 'MK-2026-TEST';
    const dateStr = new Date().toLocaleDateString('nl-NL');

    // Use Shared Utility
    let htmlContent = generateEmailHtml(data, isForUser, isReport, reportId, dateStr);

    // REPLACE CID WITH LOCAL URL FOR PREVIEW
    htmlContent = htmlContent.replace('src="cid:logo"', 'src="/images/mail-logo.png"');

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <Head>
                <title>Email Preview - Moral Knight</title>
            </Head>

            <div className="bg-white border-b border-gray-200 p-4 shadow-sm z-10">
                <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-xl font-bold font-mono text-[#194D25]">EMAIL PREVIEW TOOL</h1>

                    <div className="flex gap-4">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setActiveType('contact')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeType === 'contact' ? 'bg-white shadow text-[#194D25]' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Contactformulier
                            </button>
                            <button
                                onClick={() => setActiveType('report')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeType === 'report' ? 'bg-white shadow text-[#194D25]' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Meldpunt
                            </button>
                        </div>

                        <div className="w-px bg-gray-300 h-8 self-center"></div>

                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('visitor')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'visitor' ? 'bg-white shadow text-[#194D25]' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Wat de Bezoeker ziet
                            </button>
                            <button
                                onClick={() => setActiveTab('admin')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-white shadow text-[#194D25]' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Wat de Beheerder ziet
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex max-w-6xl w-full mx-auto gap-8 p-8">
                <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                        srcDoc={htmlContent}
                        className="w-full h-full border-none"
                        title="Email Preview"
                    />
                </div>

                <div className="w-80 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800">
                        <p className="font-bold mb-2">Instructies:</p>
                        <p>Dit is een <strong>live preview</strong> van de email templates.</p>
                        <p className="mt-2">Om de inhoud of stijl aan te passen:</p>
                        <ol className="list-decimal list-inside mt-1 space-y-1">
                            <li>Open <code>src/pages/api/contact.ts</code></li>
                            <li>Bewerk de HTML string in de <code>getHtml</code> functie</li>
                            <li>Update dan deze preview pagina code (copy-paste) om het resultaat te zien.</li>
                        </ol>
                        (We gebruiken nu een gedeelde utility `src/utils/emailTemplate.ts`, dus wijzigingen zijn direct zichtbaar!)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailPreview;
