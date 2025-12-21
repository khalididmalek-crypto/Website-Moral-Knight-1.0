import { BlogPost } from '../types';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

// if (!WORDPRESS_API_URL) {
//     throw new Error('WORDPRESS_API_URL is not defined in .env.local');
// }

export interface WPPost {
    id: number;
    date: string;
    slug: string;
    title: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    _embedded?: {
        'wp:featuredmedia'?: Array<{
            source_url: string;
            alt_text: string;
        }>;
        'wp:term'?: Array<Array<{
            name: string;
            taxonomy: string;
        }>>;
    };
}

export async function fetchPosts(): Promise<BlogPost[]> {
    if (!WORDPRESS_API_URL) {
        console.warn('WORDPRESS_API_URL is not defined, returning empty posts list.');
        return [];
    }

    try {
        const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/posts?_embed`);

        if (!res.ok) {
            console.error('Failed to fetch posts');
            return [];
        }

        const wpPosts: WPPost[] = await res.json();

        return wpPosts.map((post) => {
            // Extract category or tag if available
            const terms = post._embedded?.['wp:term']?.flat() || [];
            const category = terms.find(t => t.taxonomy === 'category' || t.taxonomy === 'post_tag')?.name || 'BLOG';

            return {
                id: post.id.toString(),
                slug: post.slug,
                title: post.title.rendered,
                excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ''), // Strip HTML from excerpt
                date: post.date,
                tag: category.toUpperCase(),
                content: post.content.rendered,
            };
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!WORDPRESS_API_URL) {
        console.warn('WORDPRESS_API_URL is not defined, returning null for post.');
        return null;
    }

    try {
        const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`);

        if (!res.ok) {
            console.error('Failed to fetch post');
            return null;
        }

        const posts: WPPost[] = await res.json();

        if (posts.length === 0) {
            return null;
        }

        const post = posts[0];
        const terms = post._embedded?.['wp:term']?.flat() || [];
        const category = terms.find(t => t.taxonomy === 'category' || t.taxonomy === 'post_tag')?.name || 'BLOG';

        return {
            id: post.id.toString(),
            slug: post.slug,
            title: post.title.rendered,
            excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ''),
            date: post.date,
            tag: category.toUpperCase(),
            content: post.content.rendered,
        };
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
}
