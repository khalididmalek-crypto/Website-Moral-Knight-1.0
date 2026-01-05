import fs from 'fs';
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
    const problemTilePath = path.join(process.cwd(), 'probleem_tekst.md');
    const problemTileContent = fs.readFileSync(problemTilePath, 'utf8');

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
    return (
        <>
            <Head>
                <title>Moral Knight - Mensgerichte AI in het publieke domein</title>
            </Head>

            {/* Mobile View - Stabiel en zonder verspringen */}
            <div className="relative z-10 block md:hidden min-h-[100dvh] overscroll-behavior-y-none bg-[#f8fafc]">
                <MobileHome problemTileContent={problemTileContent} />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <App posts={posts} />
            </div>
        </>
    )
}
