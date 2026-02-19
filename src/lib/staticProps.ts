import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';
import { BlogPost } from '../types';

export interface SharedPageProps {
    posts: BlogPost[];
    problemTileContent: string;
    solutionTileContent: string;
    approachTileContent: string;
    servicesTileContent: string;
}

export const getSharedStaticProps: GetStaticProps<SharedPageProps> = async () => {
    // Read Markdown files
    let problemTileContent = '';
    let solutionTileContent = '';
    let approachTileContent = '';
    let servicesTileContent = '';

    try {
        const dataDir = path.join(process.cwd(), 'src', 'data');

        // Helper to safely read file
        const safelyReadFile = (filename: string): string => {
            try {
                const filePath = path.join(dataDir, filename);
                if (fs.existsSync(filePath)) {
                    return fs.readFileSync(filePath, 'utf8');
                }
            } catch (e) {
                console.warn(`Failed to read ${filename}:`, e);
            }
            return '';
        };

        // Read problem text
        problemTileContent = safelyReadFile('probleem_tekst.md');

        // Read solution text
        solutionTileContent = safelyReadFile('oplossing_tekst.md');

        // Read approach text
        approachTileContent = safelyReadFile('aanpak_tekst.md');

        // Read services text
        servicesTileContent = safelyReadFile('diensten_tekst.md');

    } catch (error) {
        console.error('Critical error in getSharedStaticProps:', error);
        // Fallback to empty strings acts as safety net
    }

    // Fetch blog posts from local file system
    const { getSortedPostsData } = await import('./blog');
    const posts = getSortedPostsData();

    return {
        props: {
            posts,
            problemTileContent,
            solutionTileContent,
            approachTileContent,
            servicesTileContent,
        },
        revalidate: 60, // ISR: Revalidate every 60 seconds
    };
};
