/**
 * TileLabel Component
 * 
 * Consistent label styling for all tiles.
 * Provides white background with border, consistent padding, and typography.
 */
import React from 'react';
import { SPACING } from '../constants';

interface TileLabelProps {
  /** Label text content */
  children: React.ReactNode;
  /** Whether to apply text noise filter */
  applyNoise?: boolean;
  /** Additional className */
  className?: string;
  /** Whether typing is complete (affects border color) */
  typingComplete?: boolean;
}

export const TileLabel: React.FC<TileLabelProps> = ({
  children,
  applyNoise = false,
  className = '',
  typingComplete = false,
}) => {
  return (
    <div
      className={`
        ${SPACING.TILE_LABEL_PADDING_X} 
        ${SPACING.TILE_LABEL_PADDING_Y} 
        bg-white 
        border-[1.8px] 
        transition-colors 
        ${typingComplete ? 'border-[#194D25]' : 'border-gray-300'}
        ${className}
      `}
    >
      <div
        className={`
          font-mono 
          text-[13.2px] 
          font-semibold 
          uppercase 
          tracking-widest 
          text-gray-900
          ${applyNoise ? 'filter-text-noise' : ''}
        `}
      >
        {children}
      </div>
    </div>
  );
};

