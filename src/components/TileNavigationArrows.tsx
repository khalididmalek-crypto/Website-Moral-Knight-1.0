/**
 * TileNavigationArrows Component
 * 
 * Provides left/right navigation arrows for navigating between tiles in fullscreen mode.
 * Arrows are white with a thicker stroke on dark backgrounds, green on light backgrounds.
 */
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TileNavigationArrowsProps {
    onPrevious?: () => void;
    onNext?: () => void;
    showPrevious?: boolean;
    showNext?: boolean;
    backgroundColor?: string;
    className?: string;
}



export const TileNavigationArrows: React.FC<TileNavigationArrowsProps> = ({
    onPrevious,
    onNext,
    showPrevious = true,
    showNext = true,
    className = '',
}) => {
    return (
        <div
            className={`fixed inset-0 z-50 pointer-events-none hidden xl:flex items-center justify-center ${className}`}
        >
            <div className="w-full max-w-[1600px] relative h-full flex items-center pointer-events-none px-4 md:px-8">
                {/* Left Arrow */}
                {showPrevious && onPrevious && (
                    <button
                        onClick={onPrevious}
                        className="absolute left-2 md:left-6 pointer-events-auto group p-2 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Vorige tegel"
                    >
                        <ChevronLeft
                            size={window.innerWidth < 768 ? 32 : 44}
                            strokeWidth={2}
                            className="text-[#194D25] drop-shadow-md group-hover:drop-shadow-xl transition-all duration-200"
                            aria-hidden="true"
                        />
                    </button>
                )}

                {/* Right Arrow */}
                {showNext && onNext && (
                    <button
                        onClick={onNext}
                        className="absolute right-2 md:right-6 pointer-events-auto group p-2 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Volgende tegel"
                    >
                        <ChevronRight
                            size={window.innerWidth < 768 ? 32 : 44}
                            strokeWidth={2}
                            className="text-[#194D25] drop-shadow-md group-hover:drop-shadow-xl transition-all duration-200"
                            aria-hidden="true"
                        />
                    </button>
                )}
            </div>
        </div>
    );
};
