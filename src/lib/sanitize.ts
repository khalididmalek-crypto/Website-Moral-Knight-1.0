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

  // 1. Server-side or SSR protection (Aggressive Regex Fallback)
  // Remove script, style, iframe, object, embed tags and their content
  let sanitized = html.replace(/<(script|style|iframe|object|embed|form|input|button|meta|link)[^>]*>[\s\S]*?<\/\1>/gi, '');
  
  // Remove all other tags except allowed ones (simplified regex approach)
  // Note: This is a backup for the server side to prevent initial XSS
  sanitized = sanitized.replace(/<(?!\/?(p|br|span|div|strong|em|b|i|u|section|article|h1|h2|h3|h4|h5|h6|ul|ol|li|blockquote)\b)[^>]+>/gi, '');

  // Remove dangerous attributes (onmessage, onclick, etc.)
  sanitized = sanitized.replace(/\s+on\w+="[^"]*"/gi, '');
  sanitized = sanitized.replace(/\s+on\w+='[^']*'/gi, '');
  sanitized = sanitized.replace(/javascript:[^"']*/gi, '');

  // 2. Client-side protection (DOM-based refinement)
  if (typeof window !== 'undefined') {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitized;

      // Remove disallowed attributes from all elements
      const allElements = tempDiv.querySelectorAll('*');
      allElements.forEach((el) => {
        Array.from(el.attributes).forEach((attr) => {
          if (!ALLOWED_ATTRIBUTES.includes(attr.name.toLowerCase())) {
            el.removeAttribute(attr.name);
          }
        });
      });

      return tempDiv.innerHTML;
    } catch (e) {
      console.error('[SECURITY] Client-side refinement failed:', e);
    }
  }

  return sanitized;
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

