/**
 * Dark Mode Context
 * 
 * Provides dark mode state and toggle functionality with localStorage persistence
 * and system preference detection.
 */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface DarkModeContextType {
    isDark: boolean;
    toggleDarkMode: () => void;
    setDarkMode: (dark: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode must be used within DarkModeProvider');
    }
    return context;
};

interface DarkModeProviderProps {
    children: ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        // Initialize from localStorage or system preference during initial render
        if (typeof window === 'undefined') return false;

        const stored = localStorage.getItem('darkMode');
        if (stored !== null) {
            return stored === 'true';
        }

        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Apply dark mode class immediately
    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDark]);

    // Listen for system preference changes
    useEffect(() => {
        if (typeof window === 'undefined') return; // Ensure this runs only on the client

        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handler = (e: MediaQueryListEvent) => {
            // Only update if user hasn't set a preference
            if (localStorage.getItem('darkMode') === null) {
                setIsDark(e.matches);
            }
        };

        darkModeQuery.addEventListener('change', handler);
        return () => darkModeQuery.removeEventListener('change', handler);
    }, []);

    const toggleDarkMode = () => {
        setIsDark((prev) => {
            const next = !prev;
            localStorage.setItem('darkMode', String(next));
            return next;
        });
    };

    const setDarkMode = (dark: boolean) => {
        setIsDark(dark);
        localStorage.setItem('darkMode', String(dark));
    };

    return (
        <DarkModeContext.Provider value={{ isDark, toggleDarkMode, setDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};
