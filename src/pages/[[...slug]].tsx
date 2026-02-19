import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'
import { MobileHome } from '../components/MobileHome'
import App from '../App'
import { getSharedStaticProps, SharedPageProps } from '../lib/staticProps'

interface PageProps extends SharedPageProps {
    initialMeldpuntOpen?: boolean;
    initialDashboardOpen?: boolean;
    initialKennisbankOpen?: boolean;
    initialActiveTileId?: string | null;
    initialActiveBlogSlug?: string | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
    // Define the paths we want to handle statically
    const paths = [
        { params: { slug: [] } }, // /
        { params: { slug: ['meldpunt'] } },
        { params: { slug: ['dashboard'] } },
        { params: { slug: ['kennisbank'] } },
        { params: { slug: ['probleem'] } },
        { params: { slug: ['oplossing'] } },
        { params: { slug: ['aanpak'] } },
        { params: { slug: ['diensten'] } },
        { params: { slug: ['contact'] } },
        { params: { slug: ['blog'] } },
    ];

    return {
        paths,
        fallback: 'blocking', // Allow new paths (like blog posts) to be generated on demand
    };
};

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
    try {
        const sharedPropsResult = await getSharedStaticProps(context);

        if (!('props' in sharedPropsResult)) {
            console.log('Shared props not found');
            return { notFound: true };
        }

        const startProps = await sharedPropsResult.props;
        const slug = context.params?.slug as string[] | undefined;

        let props: PageProps = {
            ...startProps,
            initialMeldpuntOpen: false,
            initialDashboardOpen: false,
            initialKennisbankOpen: false,
            initialActiveTileId: null,
            initialActiveBlogSlug: null,
        };

        if (slug) {
            const firstSegment = slug[0];

            // Handle Blog Posts: /blog/[slug]
            if (slug.length === 2 && slug[0] === 'blog') {
                const postSlug = slug[1];
                // verify post exists
                const postExists = startProps.posts.some(p => p.slug === postSlug);
                if (postExists) {
                    props.initialActiveTileId = 'tile-6';
                    props.initialActiveBlogSlug = postSlug;
                } else {
                    console.log(`Blog post slug not found: ${postSlug}`);
                    return { notFound: true };
                }
            }
            // Handle /blog (the tile itself)
            else if (slug.length === 1 && slug[0] === 'blog') {
                props.initialActiveTileId = 'tile-6';
            }
            // Handle Top Level Routes
            else if (firstSegment === 'meldpunt') props.initialMeldpuntOpen = true;
            else if (firstSegment === 'dashboard') props.initialDashboardOpen = true;
            else if (firstSegment === 'kennisbank') props.initialKennisbankOpen = true;
            else if (firstSegment === 'probleem') props.initialActiveTileId = 'tile-1';
            else if (firstSegment === 'oplossing') props.initialActiveTileId = 'tile-2';
            else if (firstSegment === 'aanpak') props.initialActiveTileId = 'tile-3';
            else if (firstSegment === 'diensten') props.initialActiveTileId = 'tile-4';
            else if (firstSegment === 'contact') props.initialActiveTileId = 'tile-5';
        }

        return {
            props,
            revalidate: 60,
        };
    } catch (error) {
        console.error('Error in [[...slug]].tsx getStaticProps:', error);
        return { notFound: true };
    }
};

export default function Page(props: PageProps) {
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
                        problemTileContent={props.problemTileContent}
                        solutionTileContent={props.solutionTileContent}
                        approachTileContent={props.approachTileContent}
                        servicesTileContent={props.servicesTileContent}
                        posts={props.posts}
                    />
                </div>
            ) : (
                /* Desktop View */
                <div className="block">
                    <App {...props} />
                </div>
            )}
        </>
    )
}
