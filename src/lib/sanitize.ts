/**
 * Simple HTML sanitization utility
 * For production, consider using DOMPurify library
 */

const ALLOWED_TAGS = ['p', 'br', 'span', 'div', 'strong', 'em', 'b', 'i', 'u', 'section', 'article', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'];
const ALLOWED_ATTRIBUTES = ['class'];

/**
 * Sanitizes HTML string by removing potentially dangerous tags and attributes.
 * Works on both server and client side.
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';

  // Server-side fallback: just escape basic dangerous characters
  if (typeof window === 'undefined') {
    return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
  }

  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove script tags and event handlers
    const scripts = tempDiv.querySelectorAll('script, style, iframe, object, embed');
    scripts.forEach((el) => el.remove());

    // Remove dangerous attributes
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach((el) => {
      // Remove all attributes except allowed ones
      Array.from(el.attributes).forEach((attr) => {
        if (!ALLOWED_ATTRIBUTES.includes(attr.name.toLowerCase())) {
          el.removeAttribute(attr.name);
        }
      });

      // Remove disallowed tags (keep only text content)
      if (!ALLOWED_TAGS.includes(el.tagName.toLowerCase())) {
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
          }
          parent.removeChild(el);
        }
      }
    });

    return tempDiv.innerHTML;
  } catch (e) {
    console.error('[SECURITY] Sanitization failed:', e);
    return '';
  }
};

/**
 * Escapes HTML special characters
 */
export const escapeHTML = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};
