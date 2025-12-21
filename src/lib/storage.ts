import { TileData, ContentType } from '../types';

const STORAGE_KEY = 'overhead_tiles_v1';
const STORAGE_VERSION = 1;

interface StoredTiles {
  version: number;
  tiles: TileData[];
  timestamp: number;
}

/**
 * Validates that loaded data matches expected TileData structure
 */
const validateTileData = (data: unknown): data is TileData[] => {
  if (!Array.isArray(data)) return false;
  
  return data.every((tile) => {
    return (
      typeof tile === 'object' &&
      tile !== null &&
      typeof tile.id === 'string' &&
      typeof tile.index === 'number' &&
      typeof tile.title === 'string' &&
      Object.values(ContentType).includes(tile.type) &&
      typeof tile.content === 'object' &&
      tile.content !== null
    );
  });
};

/**
 * Migrates old storage format to current format if needed
 */
const migrateStorageData = (data: unknown): TileData[] | null => {
  // If it's already an array (old format), validate and return
  if (Array.isArray(data) && validateTileData(data)) {
    return data;
  }
  
  // If it's the new format with version
  if (typeof data === 'object' && data !== null && 'tiles' in data) {
    const stored = data as StoredTiles;
    if (validateTileData(stored.tiles)) {
      return stored.tiles;
    }
  }
  
  return null;
};

export const saveTiles = (tiles: TileData[]): boolean => {
  try {
    // Validate tiles before saving
    if (!validateTileData(tiles)) {
      console.warn('Invalid tile data structure, skipping save');
      return false;
    }

    const storageData: StoredTiles = {
      version: STORAGE_VERSION,
      tiles,
      timestamp: Date.now(),
    };

    const serialized = JSON.stringify(storageData);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (e) {
    // Handle quota exceeded or other storage errors
    if (e instanceof DOMException) {
      if (e.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded. Consider clearing old data.');
      } else if (e.name === 'SecurityError') {
        console.warn('Storage access denied (e.g., private browsing mode).');
      }
    } else {
      console.error('Failed to save tiles:', e);
    }
    return false;
  }
};

export const loadTiles = (): TileData[] | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return null;
    }

    const parsed = JSON.parse(saved);
    const migrated = migrateStorageData(parsed);
    
    if (migrated) {
      return migrated;
    }
    
    // If migration fails, clear corrupted data
    console.warn('Corrupted storage data detected, clearing...');
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch (e) {
    console.error('Failed to load tiles:', e);
    // Clear potentially corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors when clearing
    }
    return null;
  }
};

/**
 * Clears all stored tiles (useful for reset/debugging)
 */
export const clearTiles = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear tiles:', e);
  }
};


