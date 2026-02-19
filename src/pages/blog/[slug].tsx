import { GetStaticProps, GetStaticPaths } from 'next';
import { getSortedPostsData } from '../../lib/blog';
import { getSharedStaticProps, SharedPageProps } from '../../lib/staticProps';
import App from '../../App';

interface BlogPostPageProps extends SharedPageProps {
    initialActiveTileId: string;
    initialActiveBlogSlug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = getSortedPostsData();

    const paths = posts.map((post) => ({
        params: { slug: post.slug },
    }));

    return {
        paths,
        fallback: false, // Fallback false because we know all paths at build time
    };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async (context) => {
    // Get shared props (posts, content)
    const sharedPropsResult = await getSharedStaticProps(context);

    if (!('props' in sharedPropsResult)) {
        return { notFound: true };
    }

    const startProps = await sharedPropsResult.props;
    const slug = context.params?.slug as string;

    // Verify the slug exists in the posts (optional but good practice)
    // The sharedProps has all posts with HTML content now
    const postExists = startProps.posts.some(p => p.slug === slug);

    if (!postExists) {
        return { notFound: true };
    }

    return {
        props: {
            ...startProps,
            initialActiveTileId: 'tile-6',
            initialActiveBlogSlug: slug,
        },
        revalidate: 60,
    };
};

export default function BlogPostPage(props: BlogPostPageProps) {
    return <App {...props} />;
}
