import React from 'react';
import Head from 'next/head';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Head>
                <title>Dashboard | Moral Knight</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </Head>

            <main className="max-w-4xl mx-auto px-4 py-12 md:py-24">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Actuele Status</h2>
                    <div className="overflow-x-auto">
                        <p className="text-slate-500">Geen actuele meldingen om weer te geven.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
