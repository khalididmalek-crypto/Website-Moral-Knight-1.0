import React, { createContext, useContext, useState } from 'react';

// Define the shape of our context state
interface TileStateContextType {
    visitedTiles: Set<string>;
    markAsVisited: (id: string) => void;
    resetVisited: () => void;
}

// Create the context
const TileStateContext = createContext<TileStateContextType | undefined>(undefined);

// Provider component
export const TileStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visitedTiles, setVisitedTiles] = useState<Set<string>>(new Set());

    const markAsVisited = (id: string) => {
        setVisitedTiles((prev) => {
            // Create new set to trigger re-render
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    };

    const resetVisited = () => {
        setVisitedTiles(new Set());
    };

    return (
        <TileStateContext.Provider value={{ visitedTiles, markAsVisited, resetVisited }}>
            {children}
        </TileStateContext.Provider>
    );
};

// Custom hook for consuming the context
export const useTileState = () => {
    const context = useContext(TileStateContext);
    if (context === undefined) {
        throw new Error('useTileState must be used within a TileStateProvider');
    }
    return context;
};
