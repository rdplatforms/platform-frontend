const LINK_ID_PREFIX = 'rdplatforms-font-';

function hrefToId(href: string): string {
  return `${LINK_ID_PREFIX}${href.length}-${href.replace(/[^a-zA-Z0-9]/g, '').slice(0, 40)}`;
}

/**
 * Injects a Google Fonts <link> into <head> if it isn't there already —
 * idempotent so switching between businesses (or re-rendering) never piles
 * up duplicate <link> tags. This is the fix for a gap where BusinessTheme
 * declared font family names that were never actually loaded anywhere.
 */
export function loadGoogleFont(href: string | undefined): void {
  if (!href || typeof document === 'undefined') {
    return;
  }
  const id = hrefToId(href);
  if (document.getElementById(id)) {
    return;
  }
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}
