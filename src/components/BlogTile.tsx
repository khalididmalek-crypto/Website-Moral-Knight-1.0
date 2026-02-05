/**
 * BlogTile Component
 * 
 * Individual blog post tile that visually resembles the homepage tiles
 * but is sized for use within the blog detail view.
 * 
 * Uses TileBase for consistent styling with homepage tiles.
 */
import React from 'react';
import { BlogPost } from '../types';
import { THEME, A11Y_COLORS } from '../constants';

interface BlogTileProps {
  post: BlogPost;
  onClick: (slug: string) => void;
}

export const BlogTile: React.FC<BlogTileProps> = ({ post, onClick }) => {
  const handleClick = () => {
    onClick(post.slug);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(post.slug);
    }
  };

  return (
    <article
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Lees artikel: ${post.title}`}
      className="
        group relative
        w-full 
        aspect-auto md:aspect-[5/4]
        bg-white
        border
        rounded-sm
        transition-all duration-200 ease-out
        cursor-pointer
        hover:shadow-sm hover:bg-accent-light
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#194D25]
        flex flex-col
        overflow-hidden
        hover-scale-blog
      "
      style={{ backgroundColor: THEME.colors.tileDefault, borderWidth: '1.3px', borderColor: '#061424', borderStyle: 'solid' }}
    >
      {/* Content Container */}
      <div className="p-4 md:p-6 flex-1 flex flex-col justify-between h-full">
        {/* Top: Tag and Date */}
        <div className="flex items-center gap-3 text-[10px] md:text-xs font-mono uppercase tracking-widest mb-2">
          {post.tag && (
            <span
              className="px-1.5 py-0.5 rounded-sm border border-black -ml-2"
              style={{
                backgroundColor: A11Y_COLORS.BADGE_BACKGROUND,
                color: A11Y_COLORS.BADGE_TEXT
              }}
            >
              {post.tag}
            </span>
          )}
          <time
            dateTime={post.date}
            className="text-gray-500 whitespace-nowrap"
          >
            {new Date(post.date).toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </time>
        </div>

        {/* Middle: Title (Centered) */}
        <div className="flex flex-col justify-center my-auto">
          <h3
            className="font-mono font-medium tracking-tight"
            style={{
              color: '#226632',
              fontSize: 'clamp(0.88rem, 0.9vw + 0.66rem, 1.05rem)',
              lineHeight: '1.35'
            }}
          >
            {post.title}
          </h3>
        </div>

        {/* Bottom: Read More Indicator */}
        <div
          className="mt-2 text-[10px] md:text-xs font-mono uppercase tracking-widest transition-all group-hover:translate-x-1 text-[#194D25] hover:text-black"
        >
          Lees meer →
        </div>
      </div>
    </article>
  );
};

