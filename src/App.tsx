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
import React, { useEffect, useState, useCallback, useRef, useMemo, Suspense, lazy } from 'react';
import { TileData } from './types';
import { INITIAL_TILES, THEME, COLORS, SPACING } from './constants';
import { Grid } from './components/Grid';
import { Typewriter } from './components/Typewriter';
import { ProjectorOverlay } from './components/ProjectorOverlay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Dashboard } from './components/Dashboard';
import { useToast } from './components/Toast';
import { CONFIG } from './lib/config';
import { loadTiles, saveTiles } from './lib/storage';
// mkLogo import removed

import { TileStateProvider } from './contexts/TileStateContext';

// Lazy load FullscreenView for better performance
const FullscreenView = lazy(() => import('./components/FullscreenView').then(module => ({ default: module.FullscreenView })));

interface AppProps {
  posts?: import('./types').BlogPost[];
}

const App: React.FC<AppProps> = ({ posts = [] }) => {
  const [tiles, setTiles] = useState<TileData[]>(INITIAL_TILES);
  const [activeTileId, setActiveTileId] = useState<string | null>(null);
  const [typingComplete, setTypingComplete] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Toast notifications
  const { showToast, ToastContainer } = useToast();

  const handleTileClick = (tileId: string) => {
    setActiveTileId(tileId);
  };

  // Load persistence with error handling
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
        id="mobile-construction-overlay"
        className="fixed inset-0 z-[10000] flex flex-col p-8 md:hidden overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #F0F4F7 0%, #E1E8ED 60%, #D0D9E0 100%)',
          backgroundColor: '#e5e7eb'
        }}
      >
        {/* Header */}
        <div className="w-full">
          <div className="flex flex-col gap-1 mb-4">
            <span className="font-mono font-medium text-2xl text-gray-900 tracking-tight">Moral Knight</span>
            <span className="font-mono text-green-700 text-[10px] uppercase tracking-widest">
              MENSWAARDIGE AI IN HET PUBLIEKE DOMEIN
            </span>
          </div>
          {/* Divider line */}
          <div className="w-full h-[1px] bg-gray-400 mb-8"></div>
        </div>

        {/* Content */}
        <div className="flex-grow flex items-center justify-center -mt-20">
          <p className="font-mono text-sm text-gray-900 uppercase tracking-widest whitespace-nowrap opacity-60">
            Please visit us on a desktop device.
          </p>
        </div>

        {/* Footer */}
        <div className="w-full flex justify-between items-end text-[9px] font-mono uppercase tracking-widest">
          <span className="text-gray-900">/ MORAL KNIGHT 2025</span>
          <span style={{ color: '#D6827A' }}>MK DASHBOARD</span>
        </div>
      </div>


      <div
        ref={mainContainerRef}
        className="app-main-wrapper min-h-screen w-full font-sans flex flex-col items-center relative overflow-hidden"
        style={{ color: THEME.colors.text }}
      >
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-to-main">
          Spring naar hoofdinhoud
        </a>

        <ProjectorOverlay active />

        {/* Layout Container */}
        <div className={`w-full max-w-7xl ${SPACING.CONTAINER_X} ${SPACING.CONTAINER_Y} flex flex-col ${SPACING.SECTION_GAP} z-10`}>
          {/* Header */}
          <header className="flex justify-between items-end border-b border-black pb-2">
            <div className="flex items-end gap-4">
              <div className="flex items-baseline gap-6 md:gap-12">
                <h1
                  className="hero-title font-medium tracking-tight font-mono"
                  style={{ color: THEME.colors.text }}
                >
                  {CONFIG.organisation}
                </h1>
                <div className="hero-subtitle font-mono font-bold uppercase tracking-widest h-6">
                  {!typingComplete ? (
                    <Typewriter
                      text="Menswaardige AI in het publieke domein"
                      speed={2}
                      buggy
                      onComplete={() => setTypingComplete(true)}
                      className="ral-6035-text"
                    />
                  ) : (
                    <span className="ral-6035-text">
                      <span>Menswaardige AI</span>
                      <span> in het publieke domein</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Grid Area */}
          <main id="main-content" className="relative" role="main">
            <div className="w-full max-w-[1400px] mb-10">
              <h2 className="sr-only">Onze aanpak</h2>
              <p
                className={`font-mono text-[1.1rem] uppercase tracking-widest font-normal transition-opacity duration-200 delay-50 text-left ml-2 ${typingComplete ? 'opacity-100' : 'opacity-0'
                  }`}
                style={{ color: COLORS.PRIMARY_GREEN }}
              >
                Wij zijn een onafhankelijke organisatie en bewaken dat AI functioneert volgens menselijke waarden
              </p>
            </div>

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
          {/* Footer */}
          <footer className={`-mt-8 flex justify-between items-center text-[12px] text-gray-400`}>
            <span className="font-mono uppercase tracking-widest" style={{ color: COLORS.SECONDARY_GREEN, fontSize: '14.4px' }}>
              / {CONFIG.organisation} 2025 — saving the human species from annihilation
            </span>
            <button
              onClick={() => setDashboardOpen(true)}
              className="font-mono font-bold antialiased uppercase tracking-widest hover:opacity-75 transition-opacity focus:outline-none"
              style={{ color: '#D6827A', fontSize: '14.4px' }} // Increased brightness/intensity (~30% feller)
            >
              MK Dashboard
            </button>
          </footer>
        </div>

        {/* Fullscreen Modal with Lazy Loading */}
        {activeTile && (
          <Suspense fallback={
            <div className="fixed inset-0 z-[200] bg-white flex items-center justify-center">
              <LoadingSpinner size="lg" aria-label="Laden..." />
            </div>
          }>
            <FullscreenView
              tile={activeTile}
              onClose={() => {
                setActiveTileId(null);
              }}
              posts={posts}
              allTiles={tiles}
              onNavigate={handleTileClick}
            />
          </Suspense>
        )}

        {/* Dashboard Modal */}
        {dashboardOpen && (
          <Dashboard onClose={() => setDashboardOpen(false)} />
        )}
      </div>
    </TileStateProvider>
  );
};

export default App;



