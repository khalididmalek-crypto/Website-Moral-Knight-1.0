/**
 * TileBase Component
 * 
 * SINGLE SOURCE OF TRUTH for all tile visual properties:
 * - Border: 1px black border (border border-black)
 * - Border radius: rounded-sm (2px)
 * - Padding: Consistent spacing system via SPACING constants
 * - Typography: font-mono for labels, consistent sizing
 * - Background: THEME.colors.tileDefault or tileHighlight
 * - Layout: Label top-left (16px inset), Icon top-right (16px inset)
 * - Content area: Full width/height with proper z-index layering
 * 
 * This component ensures ALL tiles (homepage, subtiles, Contact page) share
 * one unified rectangular visual language.
 */
import React, { ReactNode } from 'react';
import { THEME, SPACING } from '../constants';

export interface TileBaseProps {
  /** Unique identifier for the tile */
  id: string;
  /** Background color override, falls back to theme defaults */
  fillColor?: string;
  /** Whether to disable highlight on hover */
  disableHighlight?: boolean;
  /** Whether typing animation is complete */
  typingComplete?: boolean;
  /** Preview or fullscreen mode */
  mode?: 'preview' | 'fullscreen';
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Keyboard event handler */
  onKeyDown?: (e: React.KeyboardEvent) => void;
  /** Focus handler */
  onFocus?: () => void;
  /** Label content (top-left) */
  label: ReactNode;
  /** Icon content (top-right) */
  icon?: ReactNode;
  /** Main content area */
  children: ReactNode;
  /** Additional className for the tile container */
  className?: string;
  /** Special border variant (e.g., animated border for tile-1) */
  borderVariant?: 'default' | 'animated';
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Whether to disable pointer events (for fullscreen content) */
  disablePointerEvents?: boolean;
  /** Whether to use reduced 25% lift effect (for Contact tile) */
  reducedLift?: boolean;
  /** Whether to completely disable hover lift/transform effects (for static popups) */
  disableHoverEffects?: boolean;
  /** Whether the tile is currently active/selected (for tabbed views) */
  isActive?: boolean;
}

export const TileBase: React.FC<TileBaseProps> = ({
  id,
  fillColor,
  disableHighlight = false,
  typingComplete = false,
  mode = 'preview',
  onClick,
  onKeyDown,
  onFocus,
  label,
  icon,
  children,
  className = '',
  borderVariant = 'default',
  ariaLabel,
  disablePointerEvents = false,
  reducedLift = false,
  disableHoverEffects = false,
  isActive = false,
}) => {
  const isPreview = mode === 'preview';

  // Background color logic: isActive > fillColor > highlight > default
  const backgroundColor = isActive
    ? THEME.colors.tileHighlight
    : fillColor
      ? fillColor
      : typingComplete && !disableHighlight
        ? THEME.colors.tileHighlight
        : THEME.colors.tileDefault;

  // Border styling: consistent 1px black border with rounded-sm (2px radius)
  // Active tiles get a slightly thicker border or shadow effect
  // FIX: Using explicit inline styles to ensure border stability and prevent disappearance
  const isAnimatedBorder = borderVariant === 'animated';

  const hoverLiftClass = reducedLift ? 'tile-hover-lift-reduced' : 'tile-hover-lift';
  const shouldApplyHover = onClick && !disablePointerEvents && !disableHoverEffects;

  return (
    <div
      data-tile-id={id}
      style={{
        backgroundColor,
        // Apply border directly to container if not animated
        // This ensures content can NEVER cover the border
        ...(isAnimatedBorder ? {} : {
          borderWidth: isActive ? '2.2px' : '1.1px',
          borderColor: '#061424',
          borderStyle: 'solid',
          boxShadow: isActive ? '4px 4px 0px 0px rgba(0,0,0,0.1)' : 'none',
        })
      }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      className={`
        group relative
        ${isPreview ? 'w-full aspect-video overflow-hidden' : 'w-full h-auto min-h-[200px] overflow-visible'}
        rounded-sm
        transition-all duration-200 ease-out
        ${shouldApplyHover ? `cursor-pointer tile-hover-gradient ${hoverLiftClass} will-change-transform` : ''}
        ${isActive ? 'z-20 scale-[1.02]' : 'z-10'}
        hover:bg-accent-light
        focus-ring-enhanced
        min-h-[44px] min-w-[44px]
        ${className}
      `}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel || (onClick ? `Open tile: ${id}` : undefined)}
    >
      {/* Border Layer - Always consistent: 1px black border, rounded-sm (2px radius) - Wired to z-[40] and forced inline styles for stability */}
      {/* Animated Border Layer - Only rendered if needed, sits on top */}
      {isAnimatedBorder && (
        <div className="absolute inset-0 z-[40] rounded-sm pointer-events-none animate-buggy-static-border bg-subtle-tv-noise" />
      )}

      {/* Overhead Projector Effect (Hover) - Subtle spotlight glow */}
      <div
        className={`
          absolute inset-0 z-[5] pointer-events-none 
          opacity-0 ${shouldApplyHover ? 'group-hover:opacity-100' : ''} transition-opacity duration-500 ease-in-out
          bg-[radial-gradient(circle_at_50%_30%,_rgba(255,255,255,0.3)_0%,_rgba(255,255,255,0.1)_40%,_transparent_70%)]
          mix-blend-hard-light
        `}
        aria-hidden="true"
      />

      {/* Label Container - Top Left: 16px inset from edges */}
      <div className={`absolute ${SPACING.TILE_INSET_TOP} ${SPACING.TILE_INSET_LEFT} z-20`}>
        {label}
      </div>

      {/* Icon Container - Top Right: 16px inset from edges */}
      {icon && (
        <div className={`absolute ${SPACING.TILE_INSET_TOP} ${SPACING.TILE_INSET_RIGHT} z-30 flex items-center justify-end`}>
          {icon}
        </div>
      )}

      {/* Content Area - Full width/height, padding handled by child components (ContentRenderer, ContactForm) */}
      <div className={`w-full ${isPreview ? 'h-full' : 'h-auto'} relative z-10`}>
        {children}
      </div>
    </div>
  );
};

