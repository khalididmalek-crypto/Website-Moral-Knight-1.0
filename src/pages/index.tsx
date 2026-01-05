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
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    // Read Markdown file
    let problemTileContent = '';
    try {
        // Check root first, then 'Teksten Mobile' directory
        let problemTilePath = path.join(process.cwd(), 'probleem_tekst.md');
        if (!fs.existsSync(problemTilePath)) {
            problemTilePath = path.join(process.cwd(), 'Teksten Mobile', 'probleem_tekst.md');
        }

        if (fs.existsSync(problemTilePath)) {
            problemTileContent = fs.readFileSync(problemTilePath, 'utf8');
        }
    } catch (error) {
        console.error('Error reading problem_tekst.md:', error);
    }

    // Local mode: Return empty posts array to use static data from constants
    const posts: BlogPost[] = [];

    return {
        props: {
            posts,
            problemTileContent,
        },
        revalidate: 60, // ISR: Revalidate every 60 seconds
    };
};

export default function Home({ posts, problemTileContent }: HomeProps) {
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
                <title>Moral Knight - Mensgerichte AI in het publieke domein</title>
            </Head>

            {isMobile ? (
                /* Mobile View */
                <div className="relative z-10 block min-h-[100dvh] bg-[#f8fafc]">
                    <MobileHome problemTileContent={problemTileContent} />
                </div>
            ) : (
                /* Desktop View */
                <div className="block">
                    <App posts={posts} problemTileContent={problemTileContent} />
                </div>
            )}
        </>
    )
}
