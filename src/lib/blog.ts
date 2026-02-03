import { remark } from 'remark';
import html from 'remark-html';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '../types';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export function getSortedPostsData(): BlogPost[] {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            // Remove ".md" from file name to get id
            const id = fileName.replace(/\.md$/, '');
            const slug = id; // Use filename as slug

            // Read markdown file as string
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents);

            // Combine the data with the id
            return {
                id,
                slug,
                title: matterResult.data.title,
                date: matterResult.data.date,
                tag: matterResult.data.tag,
                excerpt: matterResult.data.excerpt,
                content: matterResult.content,
                // Allow any other frontmatter fields
                ...matterResult.data,
            } as BlogPost;
        });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export async function getPostData(slug: string): Promise<BlogPost | null> {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);

        if (!fs.existsSync(fullPath)) {
            return null;
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Use remark to convert markdown into HTML string
        const processedContent = await remark()
            .use(html)
            .process(matterResult.content);
        const contentHtml = processedContent.toString();

        return {
            id: slug,
            slug,
            title: matterResult.data.title,
            date: matterResult.data.date,
            tag: matterResult.data.tag,
            excerpt: matterResult.data.excerpt,
            content: contentHtml,
            ...matterResult.data,
        } as BlogPost;
    } catch (err) {
        console.error(`Error getting post data for ${slug}:`, err);
        return null; // Ensure we return null on error
    }
}
