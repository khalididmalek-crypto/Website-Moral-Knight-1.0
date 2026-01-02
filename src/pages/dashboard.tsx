import React from 'react';
import Head from 'next/head';



export default function Dashboard() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Head>
                <title>Dashboard | Moral Knight</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </Head>

            {/* Mobiele Header - Simpel & Effectief */}
            <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 px-4 py-3 md:px-8">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <h1 className="text-lg font-bold text-indigo-700">Moral Knight</h1>
                    <button className="md:hidden p-2 text-slate-600">
                        {/* Simpel hamburger icoon */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow w-full max-w-5xl mx-auto px-2 pt-28 pb-28 md:px-8 md:pt-36 md:pb-36">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Dashboard Kaart 1: Status */}
                    <section className="col-span-1 md:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">Actuele Status</h2>
                        <div className="overflow-x-auto">
                            {/* Fallback voor data mapping */}
                            <p className="text-slate-500">Geen actuele meldingen om weer te geven.</p>
                        </div>
                    </section>

                    {/* Dashboard Kaart 2: Quick Links */}
                    <aside className="col-span-1 md:col-span-4 space-y-4">
                        <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-md">
                            <h3 className="font-bold mb-2">Hulp nodig?</h3>
                            <p className="text-sm opacity-90">Onze adviseurs staan voor u klaar.</p>
                        </div>
                    </aside>

                </div>
            </main>


        </div>
    );
}
