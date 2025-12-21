/**
 * Skeleton Loader Component
 * 
 * Displays loading placeholders for tiles and content.
 */
import React from 'react';

interface SkeletonProps {
    variant?: 'tile' | 'text' | 'image' | 'card';
    className?: string;
    count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'tile',
    className = '',
    count = 1,
}) => {
    const renderSkeleton = () => {
        switch (variant) {
            case 'tile':
                return (
                    <div className={`skeleton-loader border border-gray-200 rounded-sm p-6 h-[280px] md:h-[400px] bg-gray-50 ${className}`}>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="space-y-3 mt-8">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                        </div>
                    </div>
                );

            case 'text':
                return (
                    <div className={`space-y-2 ${className}`}>
                        <div className="h-4 bg-gray-200 rounded skeleton-loader"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 skeleton-loader"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6 skeleton-loader"></div>
                    </div>
                );

            case 'image':
                return (
                    <div className={`aspect-video bg-gray-200 rounded skeleton-loader ${className}`}></div>
                );

            case 'card':
                return (
                    <div className={`border border-gray-200 rounded-sm p-6 ${className}`}>
                        <div className="aspect-[3/4] bg-gray-200 rounded skeleton-loader mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 skeleton-loader mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 skeleton-loader"></div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index}>{renderSkeleton()}</div>
            ))}
        </>
    );
};

export const TileSkeleton: React.FC = () => <Skeleton variant="tile" />;
export const TextSkeleton: React.FC = () => <Skeleton variant="text" />;
export const ImageSkeleton: React.FC = () => <Skeleton variant="image" />;
export const CardSkeleton: React.FC = () => <Skeleton variant="card" />;
