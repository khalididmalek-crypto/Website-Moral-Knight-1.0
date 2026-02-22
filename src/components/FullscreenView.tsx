import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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


// Lazy load BlogGrid for better performance (only loads when blog tile is opened)
const BlogGrid = lazy(() => import('./BlogGrid').then(module => ({ default: module.BlogGrid })));

interface FullscreenViewProps {
  tile: TileData;
  onClose: () => void;
  posts?: import('../types').BlogPost[];
  allTiles?: TileData[];
  onNavigate?: (tileId: string) => void;
  onOpenMeldpunt?: () => void;
  activeBlogSlug?: string | null;
  onSelectBlogPost?: (slug: string | null) => void;
}

export const FullscreenView: React.FC<FullscreenViewProps> = ({ tile, onClose, posts = [], allTiles = [], onNavigate, onOpenMeldpunt, activeBlogSlug, onSelectBlogPost }) => {
  // Focus trap for accessibility
  const modalRef = useFocusTrap(true);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);


  const [activeSubTile, setActiveSubTile] = useState<TileData | null>(null);

  // Reset active sub-tile when main tile changes
  useEffect(() => {
    setActiveSubTile(null);
  }, [tile.id]);

  // View types
  const isBlogView = tile.type === ContentType.BLOG;
  const isProblemView = tile.id === 'tile-1';
  const isSolutionView = tile.id === 'tile-2';
  const isHowView = tile.id === 'tile-3';
  const isServicesView = tile.id === 'tile-4';

  // State for glitch effect on Contact tile scroll
  const [contactGlitchActive, setContactGlitchActive] = useState(false);
  const [glitchPlayed, setGlitchPlayed] = useState(false);

  // Auto-scroll for Contact tile
  useEffect(() => {
    if (tile.type === ContentType.CONTACT) {
      const modal = modalRef.current;
      if (!modal) return;

      const targetScroll = 600; // Approximate distance to contact form
      const startScroll = modal.scrollTop;
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);

        if (modal) {
          modal.scrollTo(0, startScroll + (targetScroll * ease(progress)));
        }

        // Trigger glitch "mid-way" (approx 1s in) - only if not played yet
        if (!glitchPlayed && progress > 0.45 && progress < 0.55) {
          setContactGlitchActive(true);
        } else {
          setContactGlitchActive(false);
        }

        if (progress < 1) {
          // Check if still in contact view
          if (tile.type === ContentType.CONTACT) {
            requestAnimationFrame(animate);
          } else {
            setContactGlitchActive(false);
          }
        } else {
          setContactGlitchActive(false);
          setGlitchPlayed(true); // Mark as played
        }
      };

      // Slight delay to allow render
      const animationTimer = setTimeout(() => requestAnimationFrame(animate), 500);

      return () => {
        clearTimeout(animationTimer);
        setContactGlitchActive(false);
      };
    } else {
      setGlitchPlayed(false); // Reset when switching away from contact
    }
  }, [tile.type, modalRef, glitchPlayed]);

  // Safety reset for glitch state
  useEffect(() => {
    if (tile.type !== ContentType.CONTACT) {
      setContactGlitchActive(false);
    }
  }, [tile.type]);

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
  const baseColor = tile.fillColor || THEME.colors.background;

  // Use 0.10 opacity as requested
  let alphaValue = 0.30; // Default opacity

  if (tile.id === 'tile-5' || tile.id === 'tile-6') { // Check for Contact or Blog tiles
    alphaValue = 0.40; // 30% more intense (0.30 * 1.30 = 0.39, rounded to 0.40)
  }

  const backgroundColor = hexToRgba(baseColor, alphaValue);

  return (
    <>
      <style jsx global>{`
        @keyframes border-noise {
          0% { border-color: rgba(139, 26, 61, 0.4); box-shadow: inset 0 0 0 2px rgba(139, 26, 61, 0.4), 0 0 10px rgba(139, 26, 61, 0.2); }
          20% { border-color: rgba(139, 26, 61, 0.6); box-shadow: inset 0 0 0 4px rgba(139, 26, 61, 0.5), 0 0 20px rgba(139, 26, 61, 0.3); }
          40% { border-color: rgba(139, 26, 61, 0.3); box-shadow: inset 0 0 0 1px rgba(139, 26, 61, 0.3), 0 0 5px rgba(139, 26, 61, 0.1); }
          60% { border-color: rgba(139, 26, 61, 0.7); box-shadow: inset 0 0 0 5px rgba(139, 26, 61, 0.6), 0 0 25px rgba(139, 26, 61, 0.4); }
          80% { border-color: rgba(139, 26, 61, 0.5); box-shadow: inset 0 0 0 3px rgba(139, 26, 61, 0.4), 0 0 15px rgba(139, 26, 61, 0.2); }
          100% { border-color: rgba(139, 26, 61, 0.4); box-shadow: inset 0 0 0 2px rgba(139, 26, 61, 0.4), 0 0 10px rgba(139, 26, 61, 0.2); }
        }
      `}</style>
      <div
        {...swipeHandlers}
        ref={modalRef}
        className={`fixed inset-0 z-[200] flex flex-col items-center ${activeSubTile ? 'overflow-hidden' : 'overflow-y-auto'} touch-pan-y backdrop-blur-xl supports-[backdrop-filter]:bg-opacity-10 ${contactGlitchActive ? 'glitch-effect' : ''}`}
        style={{
          backgroundColor,
          color: THEME.colors.text,
          ...(contactGlitchActive ? {
            textShadow: '3px 0 #ff0000, -3px 0 #00ff00',
            transform: 'skewX(-5deg) translateX(5px)',
            filter: 'contrast(1.5) brightness(1.2)',
            animation: 'border-noise 0.2s infinite',
            borderLeft: '4px solid rgba(139, 26, 61, 0.5)',
            borderRight: '4px solid rgba(139, 26, 61, 0.5)'
          } : {})
        }}
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
        <div
          className={`w-full max-w-[1400px] ${SPACING.MODAL_HEADER_PADDING} flex justify-between items-center`}
          style={{ filter: contactGlitchActive ? 'grayscale(100%)' : 'none' }}
        >
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
        <main
          className={`relative flex-1 w-full max-w-[1400px] ${SPACING.MODAL_CONTENT_PADDING} ${isBlogView ? '' : SPACING.MODAL_BOTTOM_SPACING} flex flex-col items-center ${(isHowView || isServicesView) ? 'justify-center' : 'justify-start pt-20 md:pt-28'}`}
          style={{ filter: contactGlitchActive ? 'grayscale(100%)' : 'none' }}
        >
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
                    onOpenMeldpunt={onOpenMeldpunt}
                    introContent={
                      <p className="font-mono text-sm md:text-base leading-relaxed text-[#194D25]">
                        AI-systemen kunnen menselijk overkomen, terwijl ze eigenlijk slechts patronen volgen.
                        <br />
                        Dat wordt ook wel het <a href="https://www.smithsonianmag.com/history/why-the-computer-scientist-behind-the-worlds-first-chatbot-dedicated-his-life-to-publicizing-the-threat-posed-by-ai-180987971/" target="_blank" rel="noopener noreferrer" className="text-[#8B1A3D] no-underline hover:underline">ELIZA-effect</a> genoemd. Mensen projecteren dan onterecht menselijke gevoelens, gedachten en empathie op een computerprogramma. Ondanks de voordelen van technologische vooruitgang, leidt het ELIZA-effect ook tot risico&apos;s.
                        <br /><br />
                        Binnenkort begint hier ons blog waarbij we op zoek gaan naar de veelzijdigheid van menselijke projectie en de noodzaak tot onafhankelijke toetsing.
                      </p>
                    }
                    activeSlug={activeBlogSlug}
                    onSelectSlug={onSelectBlogPost}
                  />
                </Suspense>
              </div>
            ) : (isProblemView || isSolutionView) ? (
              <>
                {/* Problem & Solution Grid View (4 tiles) */}
                <div className="w-full max-w-4xl relative animate-fade-in duration-300">

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
                    {(isProblemView ? PROBLEM_TILES : SOLUTION_TILES).map((gridTile, index) => (
                      <div key={gridTile.id} className={`min-h-[240px] h-full animate-fade-in-up stagger-${(index % 4) + 1}`}>
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
                    <div key={tileData.id} className="min-h-[240px]">
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
                  <div className="mt-8 border-t border-black/10 pt-8 pb-4">
                    <h3 className="font-mono text-[1.1rem] uppercase tracking-widest font-bold mb-4" style={{ color: COLORS.PRIMARY_GREEN }}>
                      HEEFT U BEHOEFTE AAN ONAFHANKELIJKE TOETSING?
                    </h3>
                    <p className="font-mono text-[15px] leading-relaxed max-w-2xl text-gray-600">
                      Wilt u een geheel vrijblijvend en inhoudelijk gesprek over onze manier van toetsing? Weet ons te vinden en stuur een{' '}
                      <button
                        onClick={() => onNavigate?.('tile-5')}
                        className="font-bold underline transition-colors duration-300 cursor-pointer align-baseline hover:opacity-75"
                        aria-label="Ga naar contact pagina"
                        style={{ color: COLORS.BORDEAUX_RED }}
                      >
                        bericht
                      </button>
                      .
                    </p>
                  </div>
                )}

                {/* Vision CTA - Rendered underneath sub-tiles */}
                {isHowView && (
                  <div className="mt-8 border-t border-black/10 pt-8 pb-4">
                    <h3 className="font-mono text-[1.1rem] uppercase tracking-widest font-bold mb-4" style={{ color: COLORS.PRIMARY_GREEN }}>
                      Onze Visie
                    </h3>
                    <p className="font-mono text-[15px] leading-relaxed max-w-2xl text-gray-600">
                      Meer weten over de filosofie achter onze werkwijze?{' '}
                      <Link href="/visie" passHref legacyBehavior>
                        <a
                          className="font-bold underline transition-colors duration-300 cursor-pointer align-baseline hover:opacity-75"
                          aria-label="Ga naar visie pagina"
                          style={{ color: COLORS.BORDEAUX_RED }}
                        >
                          Lees meer over onze visie
                        </a>
                      </Link>
                      .
                    </p>
                  </div>
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
                          text="OPRICHTER"
                          buggy
                          speed={ANIMATION_DELAYS.TYPEWRITER_TITLE_SPEED}
                        />
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[34%_1fr] gap-4 md:gap-4">
                      {/* Photo Tile */}
                      <div className="flex flex-col border border-black bg-white h-full p-2 transition-all duration-300 hover:border-[#fed48b] hover:border-[1.3px] group relative">
                        <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 bg-gray-100">
                          <Image
                            src="/images/team/founder.jpg"
                            alt="Oprichter"
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>

                      {/* Bio Tile */}
                      <div className="flex flex-col border border-black bg-white h-full p-6 md:p-8 justify-center">
                        <h4 className="font-mono text-lg font-bold uppercase tracking-wider mb-4 text-[#194D25]">
                          Khalid Idmalek
                        </h4>
                        <div className="font-mono text-sm leading-relaxed text-gray-800 space-y-4">
                          <p>
                            Met ruime ervaring in het onderwijs als filosoof, docent levensbeschouwing en ethiek, ben ik gedreven door een gezonde portie democratisch idealisme. Met een creatief brein dat filosofische principes vertaalt naar praktische toepassingen, focus ik mij op het tegengaan van digitale uitsluiting en misstanden.
                          </p>
                          <p>
                            Vanuit de overtuiging dat technologie transparant en verantwoordelijk moet zijn, help ik organisaties door middel van onafhankelijke toetsing. Als externe &apos;third party&apos; voer ik gevraagd en ongevraagd kritische toetsingen uit van AI-systemen, waarbij wet- en regelgeving, normen en waarden, en maatschappelijke impact centraal staan.
                          </p>
                          <p>
                            Alle verschillende opvattingen die tegenwoordig over AI de ronde gaan, soms lijkt het op intellectueel confetti. Uiteindelijk is het cruciaal om simpelweg te toetsen wat AI feitelijk in het publieke domein teweegbrengt.
                          </p>
                          <p>
                            Door de combinatie van mijn educatieve achtergrond en praktische expertise maak ik mij hard voor het bouwen van bruggen tussen technologische ontwikkeling en het publieke belang.
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
                  onSuccess={() => {
                    // Scroll back to top after 2.5s on desktop too
                    setTimeout(() => {
                      modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 2500);
                  }}
                />

                {/* Direct Email CTA */}
                {tile.type === ContentType.CONTACT && (
                  <div className="w-full relative mt-4">
                    <div className="w-full border-t border-black/10 pt-8 pb-4 text-left">
                      <h3 className="font-mono text-[1.1rem] uppercase tracking-widest font-bold mb-4" style={{ color: COLORS.PRIMARY_GREEN }}>
                        Liever direct mailen?
                      </h3>
                      <p className="font-mono text-[15px] leading-relaxed max-w-2xl text-gray-600">
                        Stuur dan een bericht naar{' '}
                        <a
                          href="mailto:info@moralknight.nl"
                          className="font-bold transition-colors duration-300 cursor-pointer align-baseline inline-flex items-baseline border-b border-[#8B1A3D] hover:opacity-75 leading-tight"
                          aria-label="Stuur een email naar info@moralknight.nl"
                          style={{ color: COLORS.BORDEAUX_RED, textDecoration: 'none' }}
                        >
                          <span>info</span><span className="mx-1">@</span><span>moralknight.nl</span>
                        </a>
                        . We reageren zo snel mogelijk.
                      </p>
                    </div>
                  </div>
                )}
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

                {/* CTA or Vision for Solution Tiles or How Tiles */}
                {(isSolutionView || activeSubTile?.id.startsWith('sol-')) && (
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

                {(isHowView || activeSubTile?.id.startsWith('how-')) && (
                  <div className="mt-8 border-t border-black/10 pt-8 pb-4">
                    <h3 className="font-mono text-[1.1rem] uppercase tracking-widest font-bold mb-4" style={{ color: COLORS.PRIMARY_GREEN }}>
                      Onze Visie
                    </h3>
                    <p className="font-mono text-[15px] leading-relaxed max-w-2xl text-gray-600">
                      Meer weten over de filosofie achter onze werkwijze?{' '}
                      <Link href="/visie" passHref legacyBehavior>
                        <a
                          className="font-bold underline transition-colors duration-300 cursor-pointer align-baseline hover:opacity-75"
                          aria-label="Ga naar visie pagina"
                          style={{ color: COLORS.BORDEAUX_RED }}
                        >
                          Lees meer over onze visie
                        </a>
                      </Link>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>




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
    </>
  );
};


