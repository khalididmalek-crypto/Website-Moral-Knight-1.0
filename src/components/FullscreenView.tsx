import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';
import { TileData, TextContent, ContentType } from '../types';
import { X } from 'lucide-react';
import { Tile } from './Tile';
import { Typewriter } from './Typewriter';
import { EMPTY_SUB_TILES, THEME, COLORS, SPACING, BLOG_POSTS, PROBLEM_TILES, SOLUTION_TILES, HOW_TILES, SERVICES_TILES, SERVICES_DETAILS, ANIMATION_DELAYS } from '../constants';
import { sanitizeHTML } from '../lib/sanitize';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { LoadingSpinner } from './LoadingSpinner';
import { TileNavigationArrows } from './TileNavigationArrows';
import { ProgressiveImage } from './ProgressiveImage';


// Lazy load BlogGrid for better performance (only loads when blog tile is opened)
const BlogGrid = lazy(() => import('./BlogGrid').then(module => ({ default: module.BlogGrid })));

interface FullscreenViewProps {
  tile: TileData;
  onClose: () => void;
  posts?: import('../types').BlogPost[];
  allTiles?: TileData[];
  onNavigate?: (tileId: string) => void;
  onOpenMeldpunt?: () => void;
}

export const FullscreenView: React.FC<FullscreenViewProps> = ({ tile, onClose, posts = [], allTiles = [], onNavigate, onOpenMeldpunt }) => {
  // Focus trap for accessibility
  const modalRef = useFocusTrap(true);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  const [showSecret, setShowSecret] = useState(false);
  const [activeSubTile, setActiveSubTile] = useState<TileData | null>(null);

  // View types
  const isBlogView = tile.type === ContentType.BLOG;
  const isProblemView = tile.id === 'tile-1';
  const isSolutionView = tile.id === 'tile-2';
  const isHowView = tile.id === 'tile-3';
  const isServicesView = tile.id === 'tile-4';

  // Main tile navigation
  const currentIndex = allTiles.findIndex(t => t.id === tile.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allTiles.length - 1;
  const previousTile = hasPrevious ? allTiles[currentIndex - 1] : null;
  const nextTile = hasNext ? allTiles[currentIndex + 1] : null;

  const handlePrevious = useCallback(() => {
    if (previousTile && onNavigate) {
      onNavigate(previousTile.id);
    }
  }, [previousTile, onNavigate]);

  const handleNext = useCallback(() => {
    if (nextTile && onNavigate) {
      onNavigate(nextTile.id);
    }
  }, [nextTile, onNavigate]);

  // Handler for sub-tile clicks
  const handleSubTileClick = () => {
    // Sub-tile click handler - can be extended later
  };

  // Navigation for activeSubTile
  const subTileGroup = useMemo(() => isProblemView
    ? PROBLEM_TILES
    : isSolutionView
      ? SOLUTION_TILES
      : isHowView
        ? HOW_TILES
        : isServicesView
          ? SERVICES_TILES
          : [], [isProblemView, isSolutionView, isHowView, isServicesView]);

  const activeSubIndex = activeSubTile ? subTileGroup.findIndex(t => t.id === activeSubTile.id) : -1;
  const hasPrevSub = activeSubIndex > 0;
  const hasNextSub = activeSubIndex >= 0 && activeSubIndex < subTileGroup.length - 1;

  const handlePrevSub = useCallback(() => {
    if (hasPrevSub) {
      const prevSub = subTileGroup[activeSubIndex - 1];
      if (isServicesView) {
        const detailContent = SERVICES_DETAILS[prevSub.id];
        setActiveSubTile(detailContent ? { ...prevSub, content: { text: detailContent } as TextContent } : prevSub);
      } else {
        setActiveSubTile(prevSub);
      }
    }
  }, [hasPrevSub, subTileGroup, activeSubIndex, isServicesView]);

  const handleNextSub = useCallback(() => {
    if (hasNextSub) {
      const nextSub = subTileGroup[activeSubIndex + 1];
      if (isServicesView) {
        const detailContent = SERVICES_DETAILS[nextSub.id];
        setActiveSubTile(detailContent ? { ...nextSub, content: { text: detailContent } as TextContent } : nextSub);
      } else {
        setActiveSubTile(nextSub);
      }
    }
  }, [hasNextSub, subTileGroup, activeSubIndex, isServicesView]);

  // Touch gesture handlers for mobile swipe navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeSubTile) {
        if (hasNextSub) handleNextSub();
      } else {
        if (hasNext) handleNext();
      }
    },
    onSwipedRight: () => {
      if (activeSubTile) {
        if (hasPrevSub) handlePrevSub();
      } else {
        if (hasPrevious) handlePrevious();
      }
    },
    trackMouse: false, // Only touch, not mouse drag
    delta: 50, // Minimum distance for swipe
  });

  // Keyboard handler for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeSubTile) {
          setActiveSubTile(null);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeSubTile) {
          if (hasPrevSub) handlePrevSub();
        } else if (hasPrevious) {
          handlePrevious();
        }
      } else if (e.key === 'ArrowRight') {
        if (activeSubTile) {
          if (hasNextSub) handleNextSub();
        } else if (hasNext) {
          handleNext();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, activeSubTile, hasPrevious, hasNext, hasPrevSub, hasNextSub, handlePrevious, handleNext, handlePrevSub, handleNextSub]);

  // Focus close button when modal opens and prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Focus close button after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, []);



  // For all tiles, create a consistent sub-tile structure
  // This ensures all subtiles have the same dimensions and properties
  const displayTile: TileData = (() => {
    if (tile.type === ContentType.CONTACT) {
      return {
        ...EMPTY_SUB_TILES[0],
        id: `${tile.id}-sub-1`,
        title: 'WEET ONS TE VINDEN',
        type: ContentType.CONTACT,
        content: tile.content,
        fillColor: '#FFFFFF',
        disableHighlight: true,
      };
    }


    const LOREM_IPSUM = '';

    let subTileContent = '';
    let subTileTitle = '';

    switch (tile.id) {
      case 'tile-1':
        subTileTitle = 'AI die mensen schaadt';
        subTileContent = '';
        break;
      case 'tile-2':
        subTileTitle = 'AI met een moreel kompas';
        subTileContent = '';
        break;
      case 'tile-3':
        subTileTitle = 'Toetsing & Borging';
        subTileContent = '';
        break;
      case 'tile-4':
        subTileTitle = 'Onafhankelijke AI-Toetsing';
        subTileContent = '';
        break;
      default:
        subTileTitle = tile.title.toUpperCase();
        subTileContent = LOREM_IPSUM;
    }

    return {
      ...EMPTY_SUB_TILES[0],
      id: `${tile.id}-sub-1`,
      title: subTileTitle,
      fillColor: '#FFFFFF',
      content: {
        text: sanitizeHTML(subTileContent)
      } as TextContent,
    };
  })();

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` : hex;
  };

  // Use special background color for blog or problem view
  const baseColor = isBlogView
    ? COLORS.BLOG_BACKGROUND
    : tile.fillColor || THEME.colors.background;

  // Use 0.10 opacity as requested
  let alphaValue = 0.30; // Default opacity

  if (tile.id === 'tile-5' || tile.id === 'tile-6') { // Check for Contact or Blog tiles
    alphaValue = 0.40; // 30% more intense (0.30 * 1.30 = 0.39, rounded to 0.40)
  }

  const backgroundColor = hexToRgba(baseColor, alphaValue);

  return (
    <div
      {...swipeHandlers}
      ref={modalRef}
      className={`fixed inset-0 z-[200] flex flex-col items-center ${activeSubTile ? 'overflow-hidden' : 'overflow-y-auto'} touch-pan-y backdrop-blur-xl supports-[backdrop-filter]:bg-opacity-10`}
      style={{ backgroundColor, color: THEME.colors.text }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Hidden description for screen readers */}
      <span id="modal-description" className="sr-only">
        Volledig scherm weergave. Druk op Escape of klik op de sluitknop om terug te gaan.
      </span>

      {/* Header / Navigation Bar simulation */}
      <div className={`w-full max-w-[1400px] ${SPACING.MODAL_HEADER_PADDING} flex justify-between items-center`}>
        <div className="flex items-center gap-3">

          <h2 id="modal-title" className="font-mono uppercase tracking-widest" style={{ color: COLORS.PRIMARY_GREEN }}>
            <button
              onClick={onClose}
              className="hover:underline transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#194D25] cursor-pointer"
              aria-label="Terug naar hoofdpagina"
              style={{ color: THEME.colors.text, fontSize: '110%' }}
            >
              Moral Knight
            </button>
            {' / '}
            {tile.title}
          </h2>
        </div>
        <button
          ref={closeButtonRef}
          data-modal-close
          onClick={onClose}
          className="group p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#194D25] min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Sluit venster"
        >
          <X
            size={24}
            strokeWidth={1.5}
            className="text-[#194D25] group-hover:text-[#8B1A3D] transition-colors duration-200"
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Main Content Area - Blog Grid or Single Tile */}
      <main className={`relative flex-1 w-full max-w-[1400px] ${SPACING.MODAL_CONTENT_PADDING} ${isBlogView ? '' : SPACING.MODAL_BOTTOM_SPACING} flex flex-col items-center ${(isHowView || isServicesView) ? 'justify-center' : 'justify-start pt-20 md:pt-28'}`}>

        <div className={`w-full flex flex-col items-center justify-center transition-opacity duration-300 ${activeSubTile ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {isBlogView ? (
            // Blog Grid View
            <div className="w-full flex items-center justify-center p-4 md:p-8">
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" aria-label="Blog artikelen laden" />
                </div>
              }>
                <BlogGrid
                  posts={posts.length > 0 ? posts : BLOG_POSTS}
                  introContent={
                    <p className="font-mono text-sm md:text-base leading-relaxed text-[#194D25]">
                      AI-systemen kunnen menselijk overkomen, terwijl ze eigenlijk slechts patronen volgen.
                      <br />
                      Dat wordt ook wel het <a href="https://www.smithsonianmag.com/history/why-the-computer-scientist-behind-the-worlds-first-chatbot-dedicated-his-life-to-publicizing-the-threat-posed-by-ai-180987971/" target="_blank" rel="noopener noreferrer" className="text-[#8B1A3D] no-underline hover:underline">ELIZA-effect</a> genoemd. Mensen projecteren dan onterecht menselijke gevoelens, gedachten en empathie op een computerprogramma. Ondanks de voordelen van technologische vooruitgang, leidt het ELIZA-effect ook tot risico&apos;s.
                      <br /><br />
                      Binnenkort begint hier ons blog waarbij we op zoek gaan naar de veelzijdigheid van menselijke projectie en de noodzaak tot onafhankelijke toetsing.
                    </p>
                  }
                />
              </Suspense>
            </div>
          ) : (isProblemView || isSolutionView) ? (
            <>
              {/* Problem & Solution Grid View (4 tiles) */}
              <div className="w-full max-w-4xl min-h-[520px] relative shadow-2xl animate-fade-in duration-300">

                {isProblemView && (
                  <div className="absolute bottom-full left-0 mb-6 md:mb-8 bg-white border border-black px-3 py-1.5">
                    <h3 className="font-mono text-[16px] font-semibold uppercase tracking-widest m-0 text-gray-900">
                      AI die mensen schaadt
                    </h3>
                  </div>
                )}
                {isSolutionView && (
                  <div className="absolute bottom-full left-0 mb-6 md:mb-8 bg-white border border-black px-3 py-1.5">
                    <h3 className="font-mono text-[16px] font-semibold uppercase tracking-widest m-0 text-gray-900">
                      AI-ethiek
                    </h3>
                  </div>
                )}

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 auto-rows-fr ${activeSubTile ? 'pointer-events-none' : ''}`}>
                  {(isProblemView ? PROBLEM_TILES : SOLUTION_TILES).map((gridTile) => (
                    <div key={gridTile.id} className="min-h-[240px] h-full">
                      <Tile
                        data={gridTile}
                        onClick={() => setActiveSubTile(gridTile)}
                        typingComplete={true}
                        disableHoverEffects={!!activeSubTile}
                      />
                    </div>
                  ))}
                </div>
              </div>


            </>
          ) : (isHowView || isServicesView) ? (
            // How & Services View (3 tiles horizontal row)
            <div className="w-[95%] md:w-[90%] max-w-6xl flex flex-col relative gap-1">
              <div className="absolute bottom-full left-0 mb-6 md:mb-8 bg-white border border-black px-3 py-1.5">
                <h3
                  className="font-mono text-[16px] font-semibold uppercase tracking-widest m-0 text-gray-900"
                >
                  {isServicesView ? 'Onafhankelijke AI-Toetsing' : 'Onze aanpak'}
                </h3>
              </div>
              <div className={`grid grid-cols-1 ${isServicesView ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 md:gap-6`}>
                {(isServicesView ? SERVICES_TILES : HOW_TILES).map((tileData) => (
                  <div key={tileData.id} className="h-60">
                    <Tile
                      data={tileData}
                      onClick={() => {
                        const detailContent = SERVICES_DETAILS[tileData.id];
                        if (detailContent) {
                          setActiveSubTile({
                            ...tileData,
                            content: { text: detailContent } as TextContent
                          });
                        } else {
                          setActiveSubTile(tileData);
                        }
                      }}
                      typingComplete={true}
                      disableHoverEffects={!!activeSubTile}
                    />
                  </div>
                ))}
              </div>

              {isServicesView && (
                <p
                  className="font-mono text-sm md:text-base text-left"
                  style={{ color: COLORS.PRIMARY_GREEN }}
                >
                  Wilt u een geheel vrijblijvend en inhoudelijk gesprek over onze manier van toetsing? Weet ons te vinden en stuur een{' '}
                  <button
                    onClick={() => onNavigate?.('tile-5')}
                    className="font-bold transition-colors duration-300 cursor-pointer align-baseline hover:text-[#6D1430]"
                    aria-label="Ga naar contact pagina"
                  >
                    bericht
                  </button>
                  .
                </p>
              )}
            </div>
          ) : (
            // Regular Tile View
            <div className="w-[90%] md:w-[75%] max-w-6xl flex flex-col gap-12">
              {/* Directie Section - Separate Block */}
              {tile.type === ContentType.CONTACT && (
                <div className="w-full max-w-5xl mx-auto">
                  <div className="inline-block bg-white border border-black px-3 py-1.5 mb-8">
                    <h3
                      className="font-mono text-[13.2px] font-semibold uppercase tracking-widest m-0 text-gray-900"
                    >
                      <Typewriter
                        text="WIE ZIJN DE OPRICHTERS?"
                        buggy
                        speed={ANIMATION_DELAYS.TYPEWRITER_TITLE_SPEED}
                      />
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Directielid 1 */}
                    <div className="flex flex-col border border-black bg-white h-full transition-all duration-200 hover:border-[#194D25]">
                      <div className="aspect-square bg-white relative border-b border-black cursor-pointer p-2" onClick={() => setShowSecret(true)}>
                        <ProgressiveImage
                          src="/images/team/bear-yellow.png"
                          alt="Lola Velvet"
                          onClick={() => setShowSecret(true)}
                          className="object-cover w-full h-full no-hover animate-beam-in"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 p-4 bg-white">
                        <h4 className="font-mono text-xs md:text-sm font-semibold uppercase tracking-widest text-[#111111]">
                          Lola Velvet
                        </h4>
                        <p className="font-mono text-[11px] md:text-xs text-[#37422F] tracking-wide">
                          Technologie Baas
                        </p>
                      </div>
                    </div>

                    {/* Directielid 2 */}
                    <div className="flex flex-col border border-black bg-white h-full transition-all duration-200 hover:border-[#194D25]">
                      <div className="aspect-square bg-white relative border-b border-black cursor-pointer p-2" onClick={() => setShowSecret(true)}>
                        <ProgressiveImage
                          src="/images/team/bear-red.png"
                          alt="Zuri Nexus"
                          onClick={() => setShowSecret(true)}
                          className="object-cover w-full h-full no-hover animate-beam-in"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 p-4 bg-white">
                        <h4 className="font-mono text-xs md:text-sm font-semibold uppercase tracking-widest text-[#111111]">
                          Zuri Nexus
                        </h4>
                        <p className="font-mono text-[11px] md:text-xs text-[#37422F] tracking-wide">
                          Moraalridder
                        </p>
                      </div>
                    </div>

                    {/* Directielid 3 */}
                    <div className="flex flex-col border border-black bg-white h-full transition-all duration-200 hover:border-[#194D25]">
                      <div className="aspect-square bg-white relative border-b border-black cursor-pointer p-2" onClick={() => setShowSecret(true)}>
                        <ProgressiveImage
                          src="/images/team/bear-blue.png"
                          alt="Kito Kivuli"
                          onClick={() => setShowSecret(true)}
                          className="object-cover w-full h-full no-hover animate-beam-in"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 p-4 bg-white">
                        <h4 className="font-mono text-xs md:text-sm font-semibold uppercase tracking-widest text-[#111111]">
                          Kito Kivuli
                        </h4>
                        <p className="font-mono text-[11px] md:text-xs text-[#37422F] tracking-wide">
                          Blinde Pier
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <Tile
                data={displayTile}
                onClick={handleSubTileClick}
                onClose={onClose}
                typingComplete
                mode="fullscreen"
              />
            </div>
          )}
        </div>

        {/* Active Sub-Tile Overlay - Centered relative to the tiles */}
        {activeSubTile && (
          <div
            className="absolute inset-0 z-[250] flex items-center justify-center p-4 animate-modal-pop overflow-hidden"
            style={{ backgroundColor: 'transparent' }}
            onClick={() => setActiveSubTile(null)}
          >


            <div
              className={`relative z-10 w-[90vw] md:max-w-4xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <Tile
                data={
                  (activeSubTile.id.startsWith('prob-') ||
                    activeSubTile.id.startsWith('serv-') ||
                    activeSubTile.id.startsWith('how-'))
                    ? { ...activeSubTile, fillColor: '#E1EBF5' }
                    : activeSubTile
                }
                onClick={() => { }}
                typingComplete={true}
                mode="fullscreen"
                className={`max-h-[80vh] overflow-y-auto rounded-sm border border-black p-6 shadow-2xl ${isProblemView ? 'h-[400px]' : 'min-h-[300px]'} [scrollbar-gutter:stable]`}
                disableHoverEffects={true}
              />
              <button
                onClick={() => setActiveSubTile(null)}
                className="absolute top-[-40px] right-0 md:top-3 md:right-3 p-2 bg-transparent transition-colors z-[260] group"
                aria-label="Sluit detail"
              >
                <X size={24} strokeWidth={1.5} className="text-gray-900 group-hover:text-[#194D25] transition-colors" />
              </button>

              {/* CTA for Problem Tiles */}
              {(isProblemView || activeSubTile.id.startsWith('prob-')) && (
                <div className="mt-8 border-t border-black/10 pt-8 pb-4">
                  <h3 className="font-mono text-[1.1rem] uppercase tracking-widest font-bold mb-4" style={{ color: COLORS.PRIMARY_GREEN }}>
                    Twijfels over AI?
                  </h3>
                  <p className="font-mono text-[15px] leading-relaxed max-w-2xl text-gray-600">
                    Heb je als burger of werknemer twijfels over AI en ethiek in jouw dagelijkse of professionele leven?{' '}
                    <button
                      onClick={() => {
                        if (onOpenMeldpunt) onOpenMeldpunt();
                      }}
                      className="font-bold underline hover:opacity-75 transition-opacity"
                      style={{ color: COLORS.BORDEAUX_RED }}
                    >
                      Stuur je zorgen op naar ons meldpunt.
                    </button>
                  </p>
                </div>
              )}

              {/* CTA for Solution Tiles */}
              {(isSolutionView || activeSubTile.id.startsWith('sol-')) && (
                <div className="mt-8 border-t border-black/10 pt-8 pb-4">
                  <h3 className="font-mono text-[1.1rem] uppercase tracking-widest font-bold mb-4" style={{ color: COLORS.PRIMARY_GREEN }}>
                    Heeft u behoefte aan onafhankelijke toetsing?
                  </h3>
                  <p className="font-mono text-[15px] leading-relaxed max-w-2xl text-gray-600">
                    U kunt ons benaderen voor een vrijblijvend inhoudelijk gesprek over onze werkwijze en het toetsen van publieke AI.{' '}
                    <button
                      onClick={() => onNavigate?.('tile-5')}
                      className="font-bold underline hover:opacity-75 transition-opacity"
                      style={{ color: COLORS.BORDEAUX_RED }}
                    >
                      Benader ons via het contactformulier.
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>



      {showSecret && (
        <div
          className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4 cursor-pointer animate-fade-in"
          onClick={() => setShowSecret(false)}
        >
          <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
            <Image
              src="/images/geordi.png"
              alt="Secret"
              className="object-contain"
              fill
              sizes="100vw"
            />
          </div>
        </div>
      )}

      {/* Navigation Arrows (Globally positioned for consistency) */}
      {(activeSubTile || (allTiles.length > 0 && onNavigate)) && (
        <TileNavigationArrows
          onPrevious={activeSubTile ? (hasPrevSub ? handlePrevSub : undefined) : (hasPrevious ? handlePrevious : (isProblemView ? onClose : undefined))}
          onNext={activeSubTile ? (hasNextSub ? handleNextSub : undefined) : (hasNext ? handleNext : undefined)}
          showPrevious={activeSubTile ? hasPrevSub : (hasPrevious || isProblemView)}
          showNext={activeSubTile ? hasNextSub : hasNext}
          backgroundColor={backgroundColor}
          className="z-[300]"
        />
      )}


    </div>
  );
};


