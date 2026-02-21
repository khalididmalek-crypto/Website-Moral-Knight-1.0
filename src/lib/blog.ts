import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '../types';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

function slugify(text: string): string {
    return text
        .toString()
        .normalize('NFD')                   // split an accented letter into the base letter and the accent
        .replace(/[\u0300-\u036f]/g, '')   // remove all accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')               // replace spaces with -
        .replace(/[^\w-]+/g, '')            // remove all non-word chars
        .replace(/--+/g, '-');              // replace multiple - with single -
}

export function getSortedPostsData(): BlogPost[] {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName: string) => {
            // Remove ".md" from file name to get id
            const id = fileName.replace(/\.md$/, '');

            // Read markdown file as string
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents);
            const slug = slugify(matterResult.data.title || id);

            // Combine the data with the id
            return {
                id,
                slug,
                title: matterResult.data.title,
                date: matterResult.data.date?.toString() || null,
                tag: matterResult.data.tag,
                excerpt: matterResult.data.excerpt,
                content: matterResult.content,
                // Allow any other frontmatter fields
                ...matterResult.data,
            } as BlogPost;
        });

    // Sort posts by date
    return allPostsData.sort((a: BlogPost, b: BlogPost) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export async function getPostData(slug: string): Promise<BlogPost | null> {
    try {
        // We need to find the file that matches the slug
        // Since slug is generated from title, we can't just join directory with slug
        const posts = getSortedPostsData();
        const post = posts.find(p => p.slug === slug);

        if (!post) {
            return null;
        }

        return post;
    } catch (err) {
        console.error(`Error getting post data for ${slug}:`, err);
        return null; // Ensure we return null on error
    }
}

export async function getAllPostsWithHtml(): Promise<BlogPost[]> {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = await Promise.all(fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map(async (fileName: string) => {
            const id = fileName.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const matterResult = matter(fileContents);
            const slug = slugify(matterResult.data.title || id);

            return {
                id,
                slug,
                title: matterResult.data.title,
                date: matterResult.data.date?.toString() || null,
                tag: matterResult.data.tag,
                excerpt: matterResult.data.excerpt,
                content: matterResult.content,
                ...matterResult.data,
            } as BlogPost;
        }));

    return allPostsData.sort((a: BlogPost, b: BlogPost) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}
