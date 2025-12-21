/**
 * Grid Component
 * 
 * Displays tiles in a responsive grid layout with consistent spacing.
 * Uses SPACING.GRID_GAP for consistent gap between tiles (32px).
 * Grid container has max-w-[1400px] to align with other content containers.
 * 
 * Spacing System:
 * - Grid gap: 32px (gap-8) - consistent spacing between tiles
 * - Container alignment: max-w-[1400px] matches intro text container
 */
import React from 'react';
import { TileData } from '../types';
import { Tile } from './Tile';
import { ANIMATION_DELAYS } from '../constants';

interface GridProps {
  tiles: TileData[];
  onTileClick: (id: string, event?: React.MouseEvent) => void;
  typingComplete: boolean;
  onTileFocus?: (id: string) => void;
}

export const Grid: React.FC<GridProps> = ({ tiles, onTileClick, typingComplete, onTileFocus }) => {
  return (
    <div className="w-full max-w-[1400px]" role="grid" aria-label="Content tiles">
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full`}>
        {tiles.map((tile, index) => (
          <Tile
            key={tile.id}
            data={tile}
            onClick={onTileClick}
            onFocus={onTileFocus}
            typingComplete={typingComplete}
            // Stagger animation on load
            delay={tile.version ? 0 : tile.index * ANIMATION_DELAYS.TILE_STAGGER}
            className={`animate-fade-in-up stagger-${(index % 6) + 1}`}
          />
        ))}
      </div>
    </div>
  );
};


