import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '../types';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
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
            // Read markdown file as string
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents);

            // Generate slug based on the title in the frontmatter
            const title = matterResult.data.title || fileName.replace(/\.md$/, '');
            const slug = generateSlug(title);
            const id = slug; // Keep id aligned with slug for consistency

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
        if (!fs.existsSync(postsDirectory)) {
            return null;
        }

        const fileNames = fs.readdirSync(postsDirectory);

        // Loop through all files to find the one where the generated slug from the title matches the requested slug
        for (const fileName of fileNames) {
            if (!fileName.endsWith('.md')) continue;

            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const matterResult = matter(fileContents);

            const title = matterResult.data.title || fileName.replace(/\.md$/, '');
            const generatedSlug = generateSlug(title);

            if (generatedSlug === slug) {
                return {
                    id: generatedSlug,
                    slug: generatedSlug,
                    title: matterResult.data.title,
                    date: matterResult.data.date?.toString() || null,
                    tag: matterResult.data.tag,
                    excerpt: matterResult.data.excerpt,
                    content: matterResult.content,
                    ...matterResult.data,
                } as BlogPost;
            }
        }

        console.warn(`No blog post found for slug: ${slug}`);
        return null;
    } catch (err) {
        console.error(`Error getting post data for ${slug}:`, err);
        return null; // Ensure we return null on error
    }
}
// ... existing getPostData ...

export async function getAllPostsWithHtml(): Promise<BlogPost[]> {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = await Promise.all(fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map(async (fileName: string) => {
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const matterResult = matter(fileContents);

            const title = matterResult.data.title || fileName.replace(/\.md$/, '');
            const slug = generateSlug(title);
            const id = slug;

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
