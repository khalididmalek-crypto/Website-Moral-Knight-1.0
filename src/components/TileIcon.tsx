/**
 * TileIcon Component
 * 
 * Consistent icon rendering for tiles.
 * Handles intro animations and hover states uniformly.
 * Icons are always positioned in the top-right corner via TileBase.
 */
import React, { useState, useEffect } from 'react';
import { ReactNode } from 'react';
import { COLORS } from '../constants';

interface TileIconProps {
  /** Icon element to render */
  children: ReactNode;
  /** Animation variant: 'cross' for subtle intro, 'arrow' for wandering intro */
  variant?: 'cross' | 'arrow' | 'default';
  /** Whether to show intro animation */
  showIntro?: boolean;
  /** Color override */
  color?: string;
  /** Hover color override */
  hoverColor?: string;
  /** Hover animation type: 'color-only' for just color change, 'rotate' for color + rotation, 'move-left' for move left + darker green */
  hoverType?: 'color-only' | 'rotate' | 'move-left';
  /** Callback when intro animation completes */
  onIntroComplete?: () => void;
}

export const TileIcon: React.FC<TileIconProps> = ({
  children,
  variant = 'default',
  showIntro = true,
  color,
  hoverColor,
  hoverType = 'color-only',
  onIntroComplete,
}) => {
  const [introComplete, setIntroComplete] = useState(!showIntro);
  const [isBeingHovered, setIsBeingHovered] = useState(false);

  useEffect(() => {
    if (!showIntro) {
      setIntroComplete(true);
    }
  }, [showIntro]);

  const handleAnimationEnd = () => {
    setIntroComplete(true);
    onIntroComplete?.();
  };

  const iconColor = color || (variant === 'cross' ? COLORS.PRIMARY_GREEN : undefined);
  const iconColorClass = !iconColor || iconColor.startsWith('#') ? '' : iconColor;
  const iconColorStyle = iconColor && iconColor.startsWith('#') ? { color: iconColor } : undefined;

  // Intro animation
  if (showIntro && !introComplete) {
    const animationClass = variant === 'cross'
      ? 'animate-cross-intro'
      : variant === 'arrow'
        ? 'animate-arrow-intro'
        : 'animate-cross-intro'; // Default to cross intro

    return (
      <div
        className={`${animationClass} pointer-events-none ${iconColorClass} ${variant === 'arrow' ? 'tile-icon-arrow' : 'tile-icon-cross'}`}
        style={iconColorStyle}
        onAnimationEnd={handleAnimationEnd}
      >
        {children}
      </div>
    );
  }

  // Post-intro hover state
  const hoverClass = hoverColor
    ? (hoverType === 'rotate' ? 'icon-hover-bordeaux'
      : hoverType === 'move-left' ? 'icon-hover-move-left'
        : 'icon-hover-custom')
    : '';

  // Only apply arrow-hover animation if there's no special hover animation
  const animationClass = hoverColor ? '' : 'animate-arrow-hover';

  // For custom hover color, pass it as a CSS variable
  const styleWithVar = (hoverColor && hoverType === 'color-only')
    ? { ...iconColorStyle, '--icon-hover-color': hoverColor } as React.CSSProperties
    : undefined;

  const finalStyle = hoverColor
    ? styleWithVar
    : (isBeingHovered ? { color: hoverColor || iconColor } : iconColorStyle);

  return (
    <div
      className={`
        opacity-0 group-hover:opacity-100 
        transition-all duration-200 
        ${animationClass} 
        pointer-events-none 
        ${iconColorClass} 
        ${hoverClass}
        ${variant === 'arrow' ? 'tile-icon-arrow' : 'tile-icon-cross'}
      `}
      style={finalStyle}
      onMouseEnter={() => setIsBeingHovered(true)}
      onMouseLeave={() => setIsBeingHovered(false)}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};
