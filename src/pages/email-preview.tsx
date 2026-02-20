import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { generateEmailHtml } from '../utils/emailTemplate';

type ViewType = 'admin-contact' | 'user-contact' | 'admin-report' | 'user-report';

export default function EmailPreview() {
    const [html, setHtml] = useState<string>('');
    const [view, setView] = useState<ViewType>('admin-contact');
    const [isMobilePreview, setIsMobilePreview] = useState(false);

    useEffect(() => {
        const dummyData: any = {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            organisation: 'Test Corp',
            message: 'Dit is een heel belangrijk testbericht. We willen graag de uitlijning van het logo en de datum controleren.',
            aiSystem: 'Algoritme X',
            description: 'Dit is een melding over een risicovol AI systeem dat van invloed is op burgers.',
            fileName: 'bewijs.pdf',
            newsletter: true,
            privacyConsent: true
        };

        const isReport = view.includes('report');
        const isForUser = view.includes('user');
        const reportId = 'MK-2026-TEST';
        const dateStr = new Date().toLocaleDateString('nl-NL');

        const generatedHtml = generateEmailHtml(dummyData, isForUser, isReport, reportId, dateStr);
        setHtml(generatedHtml);
    }, [view]);

    const buttons: { key: ViewType; label: string }[] = [
        { key: 'admin-contact', label: 'Contact (Admin)' },
        { key: 'user-contact', label: 'Contact (Bezoeker)' },
        { key: 'admin-report', label: 'Meldpunt (Admin)' },
        { key: 'user-report', label: 'Meldpunt (Bezoeker)' },
    ];

    // Desktop email clients render at ~600px. Mobile email clients are ~375px.
    const iframeWidth = isMobilePreview ? 375 : 750;
    const iframeHeight = 900;

    return (
        <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#d1d5db', minHeight: '100vh' }}>
            <Head>
                <title>Moral Knight – Email Preview</title>
            </Head>

            <h2 style={{ margin: '0 0 16px 0', color: '#1e293b', fontSize: '18px', fontWeight: 700 }}>
                📧 Email Template Preview
            </h2>

            {/* Template selector */}
            <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {buttons.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setView(key)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: view === key ? '#194D25' : '#e2e8f0',
                            color: view === key ? 'white' : '#1e293b',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: view === key ? 700 : 400,
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Desktop / Mobile toggle */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    onClick={() => setIsMobilePreview(false)}
                    style={{
                        padding: '6px 14px',
                        backgroundColor: !isMobilePreview ? '#061424' : '#e2e8f0',
                        color: !isMobilePreview ? 'white' : '#1e293b',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                    }}
                >
                    🖥️ Desktop (650px)
                </button>
                <button
                    onClick={() => setIsMobilePreview(true)}
                    style={{
                        padding: '6px 14px',
                        backgroundColor: isMobilePreview ? '#061424' : '#e2e8f0',
                        color: isMobilePreview ? 'white' : '#1e293b',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                    }}
                >
                    📱 Mobiel (375px)
                </button>
            </div>

            {/* Email preview */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #94a3b8',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    width: `${iframeWidth}px`,
                    transition: 'width 0.3s ease',
                }}>
                    <iframe
                        key={`${view}-${iframeWidth}`}
                        srcDoc={html}
                        style={{ width: `${iframeWidth}px`, height: `${iframeHeight}px`, border: 'none', display: 'block' }}
                        title="email-preview"
                    />
                </div>
            </div>

            <p style={{ textAlign: 'center', marginTop: '16px', color: '#475569', fontSize: '12px' }}>
                Schakel tussen Desktop en Mobiel om te zien hoe e-mails er in elke emailclient uitzien.
            </p>
        </div>
    );
}
