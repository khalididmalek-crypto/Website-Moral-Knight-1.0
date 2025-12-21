/**
 * URL validation and security utilities
 */

/**
 * Validates if a string is a valid URL
 */
export const isValidURL = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return ['http:', 'https:', 'data:'].includes(url.protocol);
  } catch {
    return false;
  }
};

/**
 * Checks if a URL is external (not same origin)
 */
export const isExternalURL = (urlString: string): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    const url = new URL(urlString, window.location.href);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
};

/**
 * Sanitizes URL for safe use in iframes and links
 * Returns null if URL is invalid or unsafe
 */
export const sanitizeURL = (urlString: string): string | null => {
  if (!urlString || typeof urlString !== 'string') {
    return null;
  }

  // Allow data URLs for images and blobs
  if (urlString.startsWith('data:') || urlString.startsWith('blob:')) {
    return urlString;
  }

  // Validate URL format
  if (!isValidURL(urlString)) {
    return null;
  }

  try {
    const url = new URL(urlString);
    
    // Only allow http, https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
};

/**
 * Creates safe link attributes for external links
 */
export const getExternalLinkProps = (url: string) => {
  return {
    rel: 'noopener noreferrer',
    target: '_blank',
    'aria-label': `${url} (opent in nieuw venster)`,
  };
};

