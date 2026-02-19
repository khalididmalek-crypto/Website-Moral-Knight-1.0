import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { MobileHome } from '../components/MobileHome'
import App from '../App'
import { getSharedStaticProps, SharedPageProps } from '../lib/staticProps'

export const getStaticProps: GetStaticProps<SharedPageProps> = getSharedStaticProps;

export default function Home({ posts, problemTileContent, solutionTileContent, approachTileContent, servicesTileContent }: SharedPageProps) {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Prevent hydration mismatch by not rendering until we know if it's mobile
    if (isMobile === null) {
        return <div className="min-h-screen bg-[#f8fafc]" />;
    }

    return (
        <>
            <Head>
                <title>Moral Knight: De onafhankelijke waakhond van publieke AI</title>
            </Head>

            {isMobile ? (
                /* Mobile View */
                <div className="relative z-10 block min-h-[100dvh] bg-[#f8fafc]">
                    <MobileHome
                        problemTileContent={problemTileContent}
                        solutionTileContent={solutionTileContent}
                        approachTileContent={approachTileContent}
                        servicesTileContent={servicesTileContent}
                        posts={posts}
                    />
                </div>
            ) : (
                /* Desktop View */
                <div className="block">
                    <App
                        posts={posts}
                        problemTileContent={problemTileContent}
                        solutionTileContent={solutionTileContent}
                        approachTileContent={approachTileContent}
                        servicesTileContent={servicesTileContent}
                    />
                </div>
            )}
        </>
    )
}
