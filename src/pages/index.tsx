import fs from 'fs';
import React, { useState, useEffect } from 'react';


import path from 'path';
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { BlogPost } from '../types'
import { MobileHome } from '../components/MobileHome'
import App from '../App'

interface HomeProps {
    posts: BlogPost[];
    problemTileContent: string;
    solutionTileContent: string;
    approachTileContent: string;
    servicesTileContent: string;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    // Read Markdown files
    let problemTileContent = '';
    let solutionTileContent = '';
    let approachTileContent = '';
    let servicesTileContent = '';

    try {
        const dataDir = path.join(process.cwd(), 'src', 'data');

        // Helper to safely read file
        const safelyReadFile = (filename: string): string => {
            try {
                const filePath = path.join(dataDir, filename);
                if (fs.existsSync(filePath)) {
                    return fs.readFileSync(filePath, 'utf8');
                }
            } catch (e) {
                console.warn(`Failed to read ${filename}:`, e);
            }
            return '';
        };

        // Read problem text
        problemTileContent = safelyReadFile('probleem_tekst.md');

        // Read solution text
        solutionTileContent = safelyReadFile('oplossing_tekst.md');

        // Read approach text
        approachTileContent = safelyReadFile('aanpak_tekst.md');

        // Read services text
        servicesTileContent = safelyReadFile('diensten_tekst.md');

    } catch (error) {
        console.error('Critical error in getStaticProps:', error);
        // Fallback to empty strings acts as safety net
    }

    // Fetch blog posts from local file system
    const { getSortedPostsData } = await import('../lib/blog');
    const posts = getSortedPostsData();

    return {
        props: {
            posts,
            problemTileContent,
            solutionTileContent,
            approachTileContent,
            servicesTileContent,
        },
        revalidate: 60, // ISR: Revalidate every 60 seconds
    };
};

export default function Home({ posts, problemTileContent, solutionTileContent, approachTileContent, servicesTileContent }: HomeProps) {
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
