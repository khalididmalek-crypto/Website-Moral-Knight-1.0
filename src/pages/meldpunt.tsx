// @ts-nocheck
import React from 'react';
import Head from 'next/head';
import { ReportForm } from '../components/ReportForm';

export default function Meldpunt() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Head>
                <title>Meldpunt | Moral Knight</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </Head>

            <main className="max-w-4xl mx-auto px-4 py-12 md:py-24">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
                    <header className="mb-8 border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Meldpunt AI Misstanden</h2>
                        <p className="text-slate-500 mt-2">Hier kunt u (anoniem) misstanden met publieke AI-systemen melden.</p>
                    </header>

                    <div className="overflow-visible">
                        <ReportForm />
                    </div>
                </div>
            </main>
        </div>
    );
}
