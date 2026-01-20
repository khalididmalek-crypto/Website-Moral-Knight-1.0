/**
 * BlogGrid Component
 * 
 * Displays a responsive grid of blog post tiles.
 * Adapts from single column on mobile to 2-3 columns on desktop.
 */
import React from 'react';
import { BlogPost } from '../types';
import { BlogTile } from './BlogTile';
import { SPACING, A11Y_COLORS } from '../constants';

interface BlogGridProps {
  posts: BlogPost[];
  introContent?: React.ReactNode;
}

export const BlogGrid: React.FC<BlogGridProps> = ({ posts, introContent }) => {
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);

  // Extract unique tags from posts
  const tags = React.useMemo(() => {
    const allTags = posts.map(p => p.tag).filter(Boolean);
    return Array.from(new Set(allTags));
  }, [posts]);

  const filteredPosts = React.useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter(p => p.tag === selectedTag);
  }, [posts, selectedTag]);

  // If a post is selected, show the detail view
  if (selectedPost) {
    return (
      <BlogPostDetail
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    );
  }

  return (
    <div
      className="flex flex-col gap-6 md:gap-8 mx-auto"
      style={{
        width: 'min(100% - 2rem, 1100px)',
        marginInline: 'auto',
      }}
    >
      {/* Header: Title Left (Outside Card) */}
      <div className="flex w-full">
        <div className="border border-black px-3 py-1.5 inline-block bg-white">
          <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-black leading-none">
            HOE WIJ NAAR AI KIJKEN
          </div>
        </div>
      </div>

      <div
        className="bg-white border border-black rounded-sm flex flex-col bg-white"
        style={{
          width: '100%',
          padding: 'clamp(20px, 4vw, 56px)',
          boxSizing: 'border-box'
        }}
      >
        {/* Blog Grid Content */}
        <div className="flex-1 flex flex-col">
          {/* Optional Introduction Content */}
          {introContent && (
            <div
              className="mb-8 md:mb-12 font-mono text-sm md:text-base leading-relaxed text-[#194D25]"
              style={{
                width: '100%',
                lineHeight: '1.6'
              }}
            >
              {introContent}
            </div>
          )}

          <h2 className="sr-only">Blog artikelen</h2>

          {/* Filters */}
          <div className="flex flex-wrap justify-start gap-2 mb-8">
            <button
              onClick={() => setSelectedTag(null)}
              className={`
              px-3 py-1 text-xs font-mono uppercase tracking-widest border border-black rounded-sm transition-colors
              ${!selectedTag ? 'bg-[#B6C3AC] text-black' : 'bg-white text-black hover:bg-gray-100'}
            `}
            >
              Alles
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`
                px-3 py-1 text-xs font-mono uppercase tracking-widest border border-black rounded-sm transition-colors
                ${selectedTag === tag ? 'bg-[#B6C3AC] text-black' : 'bg-white text-black hover:bg-gray-100'}
              `}
              >
                {tag}
              </button>
            ))}
          </div>

          <div
            className={`
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-4 md:gap-6
            w-full
            auto-rows-fr
          `}
          >
            {filteredPosts.slice(0, 6).map((post) => (
              <div key={post.id} className="block">
                <BlogTile post={post} onClick={() => setSelectedPost(post)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * BlogPostDetail Component
 * 
 * In-place view that displays the full blog post content.
 * Uses a buggy background and larger width as requested.
 */
interface BlogPostDetailProps {
  post: BlogPost;
  onClose: () => void;
}

export const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post, onClose }) => {
  // Focus trap for accessibility - still useful for the detail view area
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Scroll to top when opening
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-8 animate-fade-in bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white border border-black rounded-sm w-full max-w-3xl h-auto max-h-[80vh] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${SPACING.CONTENT_PADDING_LG} border-b border-gray-200 flex items-start justify-between gap-4 bg-white`}>
          <div className="flex-1">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest mb-3">
              <button
                onClick={onClose}
                className="flex items-center gap-2 hover:underline text-gray-600 hover:text-black mr-4"
              >
                ← Terug
              </button>
              {post.tag && (
                <span
                  className="px-2 py-1 rounded-sm border border-black"
                  style={{
                    backgroundColor: A11Y_COLORS.BADGE_BACKGROUND,
                    color: A11Y_COLORS.BADGE_TEXT
                  }}
                >
                  {post.tag}
                </span>
              )}
              <time dateTime={post.date} className="text-gray-500">
                {new Date(post.date).toLocaleDateString('nl-NL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <h3
              id="blog-post-title"
              className="font-mono text-xl md:text-2xl font-medium tracking-tight mt-2"
            >
              {post.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="group p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#194D25] min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
            aria-label="Sluit artikel"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#194D25] group-hover:text-[#8B1A3D] transition-colors duration-200"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div
            className={`${SPACING.CONTENT_PADDING_LG} max-w-5xl mx-auto`}
          >
            <div
              className="prose prose-sm md:prose-base font-mono max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
