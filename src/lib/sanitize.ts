/**
 * Simple HTML sanitization utility
 * For production, consider using DOMPurify library
 */

const ALLOWED_TAGS = ['p', 'br', 'span', 'div', 'strong', 'em', 'b', 'i', 'u', 'section', 'article', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'];
const ALLOWED_ATTRIBUTES = ['class'];

/**
 * Sanitizes HTML string by removing potentially dangerous tags and attributes
 * This is a basic implementation - for production use DOMPurify
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: return as-is (will be sanitized on client)
    return html;
  }

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
      if (!ALLOWED_ATTRIBUTES.includes(attr.name)) {
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

