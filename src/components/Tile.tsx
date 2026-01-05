/**
 * Tile Component
 * 
 * Individual tile component using TileBase for consistent aesthetics.
 * 
 * Refactored to use TileBase architecture:
 * - All tiles share the same base styling (white border, consistent layout)
 * - Icons are always positioned in top-right corner
 * - Labels are always positioned in top-left corner
 * - Content scales properly with consistent padding
 * - Responsive behavior is handled by TileBase
 */
import React, { useState, memo, useMemo } from 'react';
import { TileData } from '../types';
import { ContentRenderer } from './ContentRenderer';
import { Typewriter } from './Typewriter';
import { TileBase } from './TileBase';
import { TileLabel } from './TileLabel';
import { TileIcon } from './TileIcon';
import { ANIMATION_DELAYS, COLORS } from '../constants';
import { ArrowLeft, X, Cpu, Briefcase, FileText, Send } from 'lucide-react';
import { useTileState } from '../contexts/TileStateContext';

interface TileProps {
  data: TileData;
  onClick: (id: string, event?: React.MouseEvent<HTMLDivElement>) => void;
  onFocus?: (id: string) => void;
  onClose?: () => void;
  delay?: number;
  typingComplete?: boolean;
  mode?: 'preview' | 'fullscreen';
  className?: string;
  disableHoverEffects?: boolean;
  isActive?: boolean;
}

// Icon configuration per tile
const getIconConfig = (tileId: string) => {
  switch (tileId) {
    case 'tile-1':
      return { icon: <X size={24} strokeWidth={1.5} aria-hidden="true" />, variant: 'cross' as const, color: COLORS.PRIMARY_GREEN };
    case 'tile-2':
      return { icon: <ArrowLeft size={24} strokeWidth={1.5} aria-hidden="true" />, variant: 'arrow' as const };
    case 'tile-3':
      return { icon: <Cpu size={24} strokeWidth={1.5} aria-hidden="true" />, variant: 'cross' as const, color: COLORS.PRIMARY_GREEN };
    case 'tile-4':
      return { icon: <Briefcase size={24} strokeWidth={1.5} aria-hidden="true" />, variant: 'cross' as const, color: '#F1E1DB' };
    case 'tile-5':
      return { icon: <Send size={27} strokeWidth={1.05} aria-hidden="true" />, variant: 'cross' as const, color: '#888F93', hoverColor: '#020617' };
    case 'tile-6':
      return { icon: <FileText size={24} strokeWidth={1.5} aria-hidden="true" />, variant: 'cross' as const, color: COLORS.PRIMARY_GREEN };
    default:
      return null;
  }
};

export const Tile: React.FC<TileProps> = memo(({
  data,
  onClick,
  onFocus,
  onClose,
  delay = 0,
  typingComplete = false,
  mode = 'preview',
  className = '',
  disableHoverEffects = false,
  isActive = false,
}) => {
  // Tile 1 has static text, so it's "complete" immediately. Others wait for Typewriter.
  const [titleTypingComplete, setTitleTypingComplete] = useState(data.id === 'tile-1');

  const isPreview = mode === 'preview';

  // Consume global tile state
  const { visitedTiles, markAsVisited } = useTileState();
  const hasClicked = visitedTiles.has(data.id);

  const handleTileClick = (id: string, event?: React.MouseEvent<HTMLDivElement>) => {
    markAsVisited(id);
    onClick(id, event);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTileClick(data.id);
    }
  };

  const handleFocus = () => {
    // Track focus for keyboard navigation
    if (isPreview && onFocus) {
      onFocus(data.id);
    }
  };

  // Icon configuration
  const iconConfig = useMemo(() => getIconConfig(data.id), [data.id]);
  const shouldShowIcon = isPreview && iconConfig && titleTypingComplete;

  // Label content
  const labelContent = data.id === 'tile-1' || titleTypingComplete ? (
    data.title
  ) : (
    <Typewriter
      text={data.title}
      buggy
      delay={delay}
      speed={ANIMATION_DELAYS.TYPEWRITER_TITLE_SPEED}
      onComplete={() => setTitleTypingComplete(true)}
    />
  );

  return (
    <TileBase
      id={data.id}
      fillColor={data.fillColor}
      disableHighlight={data.disableHighlight}
      typingComplete={typingComplete}
      mode={mode}
      onClick={(event) => handleTileClick(data.id, event)}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      borderVariant="default"
      ariaLabel={`Open tile: ${data.title}`}
      className={className}
      reducedLift={data.id === 'tile-5'}
      disableHoverEffects={disableHoverEffects || hasClicked}
      isActive={isActive}
      label={
        <TileLabel
          applyNoise={data.id !== 'tile-1'}
          typingComplete={typingComplete}
        >
          {labelContent}
        </TileLabel>
      }
      icon={
        shouldShowIcon ? (
          <TileIcon
            variant={iconConfig.variant}
            color={iconConfig.color}
            hoverColor={iconConfig.hoverColor}
            showIntro={true}
          >
            {iconConfig.icon}
          </TileIcon>
        ) : undefined
      }
    >
      {/* Content - Hidden for Tile 1, Tile 2 and Sub-tiles (Prob/Sol/How) in preview mode */}
      {!(isPreview && (
        data.id === 'tile-1' ||
        data.id === 'tile-2' ||
        data.id.startsWith('prob-') ||
        data.id.startsWith('sol-') ||
        data.id.startsWith('how-')
      )) && (
          <div className="w-full h-full">
            <ContentRenderer
              data={data}
              mode={mode}
              typingComplete={typingComplete}
              onClose={onClose}
            />
          </div>
        )}
    </TileBase>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memoization
  return (
    prevProps.data.id === nextProps.data.id &&
    prevProps.data.version === nextProps.data.version &&
    prevProps.typingComplete === nextProps.typingComplete &&
    prevProps.mode === nextProps.mode &&
    prevProps.delay === nextProps.delay &&
    prevProps.isActive === nextProps.isActive
  );
});

Tile.displayName = 'Tile';


