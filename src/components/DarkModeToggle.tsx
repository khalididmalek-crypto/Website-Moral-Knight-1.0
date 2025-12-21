/**
 * Dark Mode Toggle Button
 * 
 * Compact toggle for header placement.
 */
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export const DarkModeToggle: React.FC = () => {
    const { isDark, toggleDarkMode } = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className="
        relative
        w-9 h-9
        border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        hover:bg-gray-50 dark:hover:bg-gray-700
        transition-all duration-300
        flex items-center justify-center
        group
      "
            aria-label={isDark ? 'Schakel over naar lichte modus' : 'Schakel over naar donkere modus'}
            title={isDark ? 'Lichte modus' : 'Donkere modus'}
            style={{ outline: 'none' }}
        >
            <Sun
                size={16}
                className={`
          absolute transition-all duration-300
          ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
          text-amber-500
        `}
            />
            <Moon
                size={16}
                className={`
          absolute transition-all duration-300
          ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
          text-blue-400
        `}
            />
        </button>
    );
};
