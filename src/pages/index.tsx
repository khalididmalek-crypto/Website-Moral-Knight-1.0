import Head from 'next/head'
import dynamic from 'next/dynamic'
import { GetStaticProps } from 'next'
import { BlogPost } from '../types'
import { MobileHome } from '../components/MobileHome'

// Dynamically import App to avoid SSR issues with window/document usage in the existing React app
const App = dynamic(() => import('../App'), { ssr: false })

interface HomeProps {
    posts: BlogPost[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    // Local mode: Return empty posts array to use static data from constants
    const posts: BlogPost[] = [];

    return {
        props: {
            posts,
        },
        revalidate: 60, // ISR: Revalidate every 60 seconds
    };
};

export default function Home({ posts }: HomeProps) {
    return (
        <>
            <Head>
                <title>Moral Knight - Mensgerichte AI in het publieke domein</title>
            </Head>

            {/* Mobile View - Stabiel en zonder verspringen */}
            <div className="relative z-10 block md:hidden min-h-[100dvh] overscroll-behavior-y-none bg-[#f8fafc]">
                <MobileHome />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <App posts={posts} />
            </div>
        </>
    )
}
