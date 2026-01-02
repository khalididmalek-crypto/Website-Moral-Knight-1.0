/**
 * Progressive Image Component
 * 
 * Displays images with blur-up loading technique for better perceived performance.
 * Shows a low-res placeholder that transitions to high-res when loaded.
 */
import React, { useState } from 'react';
import Image from 'next/image';

interface ProgressiveImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholderSrc?: string;
    onClick?: () => void;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
    src,
    alt,
    className = '',
    placeholderSrc,
    onClick,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Generate a tiny placeholder if none provided
    const blurDataUrl = placeholderSrc || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='1 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter='url(%23b)' x='0' y='0' height='100%25' width='100%25' href='${src}'/%3E%3C/svg%3E`;

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <Image
                src={src}
                alt={alt}
                fill
                className={`
          transition-all duration-500 ease-out
          ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}
          ${onClick && !className?.includes('no-hover') ? 'cursor-pointer hover:scale-105 transition-transform duration-300' : ''}
          ${onClick && className?.includes('no-hover') ? 'cursor-pointer' : ''}
          ${className?.replace('no-hover', '').trim() || 'object-cover'}
        `}
                onLoad={() => setIsLoaded(true)}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                onClick={onClick}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Loading skeleton overlay - maintained as fallback/initial state visual if needed, 
                though next/image placeholder handles most of it. 
                Keep consistent with previous behavior for now till load completes. */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 skeleton-loader" aria-hidden="true" />
            )}
        </div>
    );
};
