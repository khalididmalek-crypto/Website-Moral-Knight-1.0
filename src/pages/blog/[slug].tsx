import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSortedPostsData, getPostData } from '../../lib/blog';
import { BlogPost } from '../../types';
import { BlogPostDetail } from '../../components/BlogGrid';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface BlogPostPageProps {
    post: BlogPost | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = getSortedPostsData();

    const paths = posts.map((post) => ({
        params: { slug: post.slug },
    }));

    return {
        paths,
        fallback: true, // Enable fallback for new posts not yet generated
    };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
    const slug = params?.slug as string;
    const post = await getPostData(slug);

    if (!post) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            post,
        },
        revalidate: 60, // ISR: Revalidate every 60 seconds
    };
};

export default function BlogPostPage({ post }: BlogPostPageProps) {
    const router = useRouter();

    if (router.isFallback) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
                <LoadingSpinner size="lg" aria-label="Artikel laden..." />
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <>
            <Head>
                <title>{post.title} - Moral Knight</title>
                <meta name="description" content={post.excerpt} />
            </Head>
            <div className="min-h-screen bg-[#F7F7F7] p-4 md:p-8">
                <BlogPostDetail
                    post={post}
                    onClose={() => router.push('/')}
                />
            </div>
        </>
    );
}
