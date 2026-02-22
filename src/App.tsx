/**
 * Main App Component
 * 
 * Layout spacing follows consistent system:
 * - Container padding: px-6 (24px) horizontal, py-10 (40px) vertical
 * - Section gaps: gap-10 (40px) between major sections
 * - Footer margin: mt-10 (40px) consistent with section gaps
 * - Grid intro text: px-6 (24px) matches container padding
 * - Fixed elements: bottom-8 right-8 (32px) consistent with grid gap
 * 
 * All spacing values come from SPACING constants in constants.ts
 */
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import { TileData, TextContent } from './types';

import { INITIAL_TILES, THEME, COLORS, SPACING } from './constants';
import { Grid } from './components/Grid';
import { ProjectorOverlay } from './components/ProjectorOverlay';
import { Dashboard } from './components/Dashboard';
import { Meldpunt } from './components/Meldpunt';
import { Kennisbank } from './components/Kennisbank';
import { useToast } from './components/Toast';
import { CONFIG } from './lib/config';
import { loadTiles, saveTiles } from './lib/storage';
import { FlowingText } from './components/FlowingText';
// mkLogo import removed

import { TileStateProvider } from './contexts/TileStateContext';

import { FullscreenView } from './components/FullscreenView';

interface AppProps {
  posts?: import('./types').BlogPost[];
  problemTileContent?: string;
  solutionTileContent?: string;
  approachTileContent?: string;
  servicesTileContent?: string;
  initialMeldpuntOpen?: boolean;
  initialDashboardOpen?: boolean;
  initialKennisbankOpen?: boolean;
  initialActiveTileId?: string | null;
  initialActiveBlogSlug?: string | null;
}


const App: React.FC<AppProps> = ({
  posts = [],
  problemTileContent = '',
  solutionTileContent = '',
  approachTileContent = '',
  servicesTileContent = '',
  initialMeldpuntOpen = false,
  initialDashboardOpen = false,
  initialKennisbankOpen = false,
  initialActiveTileId = null,
  initialActiveBlogSlug = null,
}) => {
  const [tiles, setTiles] = useState<TileData[]>(() => {
    return INITIAL_TILES.map(tile => {
      if (tile.id === 'tile-1' && problemTileContent) {
        return { ...tile, content: { ...tile.content, text: problemTileContent } as TextContent };
      }
      if (tile.id === 'tile-2' && solutionTileContent) {
        return { ...tile, content: { ...tile.content, text: solutionTileContent } as TextContent };
      }
      if (tile.id === 'tile-3' && approachTileContent) {
        return { ...tile, content: { ...tile.content, text: approachTileContent } as TextContent };
      }
      if (tile.id === 'tile-4' && servicesTileContent) {
        return { ...tile, content: { ...tile.content, text: servicesTileContent } as TextContent };
      }
      return tile;
    });
  });

  const [activeTileId, setActiveTileId] = useState<string | null>(() => {
    if (initialActiveTileId) {
      return initialActiveTileId;
    }
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('activeTileId');
    }
    return null;
  });

  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(() => {
    if (initialActiveBlogSlug) return initialActiveBlogSlug;
    return null;
  });
  const typingComplete = true;
  const [subtitleHover, setSubtitleHover] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(() => {
    if (initialDashboardOpen) return true;
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('dashboardOpen') === 'true';
    }
    return false;
  });
  const [meldpuntOpen, setMeldpuntOpen] = useState(() => {
    if (initialMeldpuntOpen) return true;
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('meldpuntOpen') === 'true';
    }
    return false;
  });
  const [kennisbankOpen, setKennisbankOpen] = useState(() => {
    if (initialKennisbankOpen) return true;
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('kennisbankOpen') === 'true';
    }
    return false;
  });
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Toast notifications
  const { showToast, ToastContainer } = useToast();

  const handleTileClick = (tileId: string) => {
    setActiveTileId(tileId);
  };

  // Router for shallow routing
  const router = useRouter();

  // Load persistence with error handling (Tiles only)
  useEffect(() => {
    try {
      const saved = loadTiles();
      if (saved && saved.length > 0) {
        setTiles(saved);
      }
    } catch (error) {
      console.error('Error loading tiles:', error);
      showToast('Laden van opgeslagen gegevens mislukt. Standaard instellingen worden gebruikt.', 'error');
      setTiles(INITIAL_TILES);
    }
  }, [showToast]);

  // Sync states to sessionStorage
  useEffect(() => {
    if (activeTileId) {
      sessionStorage.setItem('activeTileId', activeTileId);
    } else {
      sessionStorage.removeItem('activeTileId');
    }

    sessionStorage.setItem('meldpuntOpen', String(meldpuntOpen));
    sessionStorage.setItem('dashboardOpen', String(dashboardOpen));
    sessionStorage.setItem('kennisbankOpen', String(kennisbankOpen));
  }, [activeTileId, meldpuntOpen, dashboardOpen, kennisbankOpen]);


  // --- Shallow Routing Logic ---

  // 1. Sync State -> URL
  // When state changes, update the URL without reloading (shallow)
  useEffect(() => {
    if (!router.isReady) return;

    const currentPath = router.asPath.split('?')[0]; // Ignore query params for now
    let targetPath = '/';

    if (activeBlogSlug) targetPath = `/blog/${activeBlogSlug}`;
    else if (meldpuntOpen) targetPath = '/meldpunt';
    else if (dashboardOpen) targetPath = '/dashboard';
    else if (kennisbankOpen) targetPath = '/kennisbank';
    else if (activeTileId === 'tile-1') targetPath = '/probleem';
    else if (activeTileId === 'tile-2') targetPath = '/oplossing';
    else if (activeTileId === 'tile-3') targetPath = '/aanpak';
    else if (activeTileId === 'tile-4') targetPath = '/diensten';
    else if (activeTileId === 'tile-5') targetPath = '/contact';
    else if (activeTileId === 'tile-6') targetPath = '/blog';

    // Only push if different to avoid redundant history entries
    if (currentPath !== targetPath) {
      router.push(targetPath, undefined, { shallow: true });
    }
  }, [activeTileId, meldpuntOpen, dashboardOpen, kennisbankOpen, activeBlogSlug, router]);

  // 2. Sync URL -> State (Handle Back/Forward navigation)
  useEffect(() => {
    if (!router.isReady) return;

    const handleRouteChange = (url: string) => {
      const path = url.split('?')[0];

      // If we navigate to a modal, only update the modal state and keep the background (tile) state
      const isMeldpunt = path === '/meldpunt';
      const isDashboard = path === '/dashboard';
      const isKennisbank = path === '/kennisbank';

      if (isMeldpunt || isDashboard || isKennisbank) {
        setMeldpuntOpen(isMeldpunt);
        setDashboardOpen(isDashboard);
        setKennisbankOpen(isKennisbank);
        // Specifically DO NOT reset activeTileId or activeBlogSlug here
        return;
      }

      // For non-modal paths, reset modals and update the tile/blog state
      let newMeldpuntOpen = false;
      let newDashboardOpen = false;
      let newKennisbankOpen = false;
      let newActiveTileId: string | null = null;
      let newActiveBlogSlug: string | null = null;

      if (path.startsWith('/blog/') && path.length > 6) {
        newActiveTileId = 'tile-6';
        newActiveBlogSlug = path.replace('/blog/', '');
      } else if (path === '/blog') {
        newActiveTileId = 'tile-6';
      } else if (path === '/meldpunt') newMeldpuntOpen = true;
      else if (path === '/dashboard') newDashboardOpen = true;
      else if (path === '/kennisbank') newKennisbankOpen = true;
      else if (path === '/probleem') newActiveTileId = 'tile-1';
      else if (path === '/oplossing') newActiveTileId = 'tile-2';
      else if (path === '/aanpak') newActiveTileId = 'tile-3';
      else if (path === '/diensten') newActiveTileId = 'tile-4';
      else if (path === '/contact') newActiveTileId = 'tile-5';

      setMeldpuntOpen(newMeldpuntOpen);
      setDashboardOpen(newDashboardOpen);
      setKennisbankOpen(newKennisbankOpen);
      setActiveTileId(newActiveTileId);
      setActiveBlogSlug(newActiveBlogSlug);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.isReady, router.events]);


  // Prevent body scroll when modals are open
  useEffect(() => {
    if (meldpuntOpen || dashboardOpen || kennisbankOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [meldpuntOpen, dashboardOpen, kennisbankOpen]);



  // Save persistence with feedback
  useEffect(() => {
    if (tiles.length > 0) {
      try {
        const success = saveTiles(tiles);
        if (success) {
          // Optionally show success toast for manual actions
          // showToast('Wijzigingen opgeslagen', 'success');
        }
      } catch (error) {
        console.error('Error saving tiles:', error);
        showToast('Opslaan mislukt. Wijzigingen kunnen verloren gaan.', 'error');
      }
    }
  }, [tiles, showToast]);

  // Track currently focused tile for keyboard navigation
  const [focusedTileId, setFocusedTileId] = useState<string | null>(null);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Close modal with Escape
    if (e.key === 'Escape' && activeTileId) {
      setActiveTileId(null);
      return;
    }

    // Only handle arrow keys when modal is closed and typing is complete
    if (activeTileId || !typingComplete) return;

    const currentIndex = focusedTileId
      ? tiles.findIndex((t) => t.id === focusedTileId)
      : -1;
    let nextIndex = currentIndex >= 0 ? currentIndex : 0;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = currentIndex < tiles.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tiles.length - 1;
        break;
      case 'ArrowDown':
        // Move to next row (assuming 3 columns)
        nextIndex = Math.min(currentIndex + 3, tiles.length - 1);
        break;
      case 'ArrowUp':
        // Move to previous row
        nextIndex = Math.max(currentIndex - 3, 0);
        break;
      default:
        return;
    }

    if (nextIndex !== currentIndex && tiles[nextIndex]) {
      e.preventDefault();
      const nextTile = tiles[nextIndex];
      setFocusedTileId(nextTile.id);
      // Focus the tile element
      setTimeout(() => {
        const tileElement = document.querySelector(`[data-tile-id="${nextTile.id}"]`) as HTMLElement;
        tileElement?.focus();
      }, 0);
    }
  }, [activeTileId, tiles, typingComplete, focusedTileId]);

  // Global keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Focus management for modal
  const previousTileIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeTileId) {
      previousTileIdRef.current = activeTileId;
      // Focus the close button when modal opens
      setTimeout(() => {
        const closeButton = document.querySelector('[data-modal-close]') as HTMLElement;
        closeButton?.focus();
      }, 100);
    } else if (previousTileIdRef.current) {
      // Return focus to previously focused tile when modal closes
      setTimeout(() => {
        const previousTile = document.querySelector(`[data-tile-id="${previousTileIdRef.current}"]`) as HTMLElement;
        previousTile?.focus();
      }, 100);
    }
  }, [activeTileId]);

  const activeTile = useMemo(
    () => tiles.find((t) => t.id === activeTileId),
    [tiles, activeTileId],
  );

  return (
    <TileStateProvider>
      {/* Mobile Construction Overlay */}



      <div
        ref={mainContainerRef}
        className="app-main-wrapper min-h-screen w-full font-sans flex flex-col items-center relative overflow-y-auto overflow-x-hidden"
        style={{ color: THEME.colors.text }}
      >
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-to-main">
          Spring naar hoofdinhoud
        </a>

        <ProjectorOverlay active />

        {/* Layout Container */}
        <div className={`w-full max-w-7xl ${SPACING.CONTAINER_X} ${SPACING.CONTAINER_Y} flex flex-col ${SPACING.SECTION_GAP} z-10`}>
          {/* Top Section: Logo and Title */}
          <div className="flex items-end gap-[2.9rem] overflow-visible">
            {/* Logo - Aligned with Grid edge */}
            <div className="flex-shrink-0 mb-1" style={{ transform: 'translate(4px, 57px)' }}>
              <img
                src="/favicon.svg"
                alt="Moral Knight Logo"
                className="h-[5.9rem] w-auto"
                style={{ display: 'block' }}
              />
            </div>

            {/* Title Column - Shifted to the right */}
            <div className="flex-1 min-w-0" style={{ transform: 'translate(-2px, 7px)' }}>
              <header className="flex justify-between items-end pb-[11px] relative w-full overflow-visible">
                {/* Animated Pen Stroke */}
                <div className="absolute bottom-0 left-0 w-full overflow-visible pointer-events-none" style={{ height: '2px', transform: 'translate(-13px, 5px)' }}>
                  <svg
                    width="100%"
                    height="30"
                    viewBox="0 0 1000 30"
                    preserveAspectRatio="none"
                    style={{ position: 'absolute', bottom: '-2px', left: 0, overflow: 'visible' }}
                  >
                    <path
                      d="M 0,25 L 992,25 L 1000,5"
                      fill="none"
                      stroke="#A31F47"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                      style={{
                        strokeDasharray: 2000,
                        strokeDashoffset: 2000,
                        animation: 'drawPath 1.8s ease-out forwards'
                      }}
                    />
                  </svg>
                  <style jsx>{`
                    @keyframes drawPath {
                      to { stroke-dashoffset: 0; }
                    }
                  `}</style>
                </div>
                <div className="flex items-end gap-3 overflow-visible">
                  <h1
                    className="hero-title font-medium tracking-tight font-mono leading-none"
                    style={{ color: THEME.colors.text }}
                  >
                    {CONFIG.organisation}
                  </h1>
                </div>
              </header>
            </div>
          </div>

          {/* Grid Area */}
          <main id="main-content" className="relative" role="main" style={{ transform: 'translate(-4px, 14px)' }}>
            {/* Subtitle area - Shifted to match Title start (Logo 5rem + Gap 3rem) */}
            <div className="w-full max-w-[1400px] mb-10 pl-[calc(5.9rem+2.9rem)] -mt-10" style={{ transform: 'translate(-42px, 20px)' }}>
              <div>
                <h2 className="sr-only">Onze aanpak</h2>
                <p
                  className={`font-mono text-[1.1rem] uppercase tracking-widest font-normal transition-opacity duration-200 delay-50 text-left cursor-default ${typingComplete ? 'opacity-100' : 'opacity-0'
                    }`}
                  style={{ color: COLORS.PRIMARY_GREEN }}
                  onMouseEnter={() => setSubtitleHover(true)}
                  onMouseLeave={() => setSubtitleHover(false)}
                >
                  {subtitleHover ? (
                    <FlowingText
                      text="De onafhankelijke waakhond van publieke AI"
                      baseColor={COLORS.PRIMARY_GREEN}
                    />
                  ) : (
                    'De onafhankelijke waakhond van publieke AI'
                  )}
                </p>
              </div>
            </div>

            {/* Grid - Naturally aligns with Logo at container boundary */}
            <div ref={gridRef} className="mb-6">
              <Grid
                tiles={tiles}
                onTileClick={handleTileClick}
                typingComplete={typingComplete}
                onTileFocus={setFocusedTileId}
              />
            </div>

            {/* ToastContainer for notifications */}
            <ToastContainer />
          </main>

          {/* Footer */}
          <footer className={`-mt-8 flex justify-between items-center text-[12px] text-gray-400`} style={{ transform: 'translate(0px, 6px)' }}>
            <span className="font-mono uppercase tracking-widest" style={{ fontSize: 'clamp(10px, 1.1vw, 14.4px)' }}>
              <FlowingText
                text={`/ ${CONFIG.organisation} since 2025 - Auditing public AI`}
                baseColor={COLORS.SECONDARY_GREEN}
              />
            </span>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setMeldpuntOpen(true)}
                className="font-mono font-bold antialiased uppercase tracking-widest hover:opacity-75 transition-opacity focus:outline-none"
                style={{ color: '#8B1A3D', fontSize: '14.4px' }}
              >
                / MK Meldpunt
              </button>
              <button
                onClick={() => setDashboardOpen(true)}
                className="font-mono font-bold antialiased uppercase tracking-widest hover:opacity-75 transition-opacity focus:outline-none"
                style={{ color: '#8B1A3D', fontSize: '14.4px' }}
              >
                / MK Dashboard
              </button>
              <button
                onClick={() => setKennisbankOpen(true)}
                className="font-mono font-bold antialiased uppercase tracking-widest hover:opacity-75 transition-opacity focus:outline-none"
                style={{ color: '#8B1A3D', fontSize: '14.4px' }}
              >
                / MK Kennisbank
              </button>
            </div>
          </footer>
        </div>

        {/* Fullscreen Modal */}
        {activeTile && (
          <FullscreenView
            tile={activeTile}
            onClose={() => {
              setActiveTileId(null);
            }}
            posts={posts}
            allTiles={tiles}
            onNavigate={handleTileClick}
            onOpenMeldpunt={() => setMeldpuntOpen(true)}
            activeBlogSlug={activeBlogSlug}
            onSelectBlogPost={setActiveBlogSlug}
          />
        )}

        {/* Dashboard Modal */}
        {dashboardOpen && (
          <Dashboard onClose={() => setDashboardOpen(false)} />
        )}

        {/* Meldpunt Modal */}
        {meldpuntOpen && (
          <Meldpunt onClose={() => setMeldpuntOpen(false)} />
        )}

        {/* Kennisbank Modal */}
        {kennisbankOpen && (
          <Kennisbank onClose={() => setKennisbankOpen(false)} />
        )}
      </div>
    </TileStateProvider>
  );
};

export default App;
