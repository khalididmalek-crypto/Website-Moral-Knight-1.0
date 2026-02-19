import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { MobileHome } from '../components/MobileHome';
import App from '../App';
import { getSharedStaticProps, SharedPageProps } from '../lib/staticProps';

export const getStaticProps: GetStaticProps<SharedPageProps> = getSharedStaticProps;

export default function OplossingPage(props: SharedPageProps) {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile === null) {
        return <div className="min-h-screen bg-[#f8fafc]" />;
    }

    return (
        <>
            <Head>
                <title>Wat is de Oplossing? - Moral Knight</title>
            </Head>

            {isMobile ? (
                <div className="relative z-10 block min-h-[100dvh] bg-[#f8fafc]">
                    <MobileHome {...props} />
                </div>
            ) : (
                <div className="block">
                    <App {...props} initialActiveTileId="tile-2" />
                </div>
            )}
        </>
    );
}
