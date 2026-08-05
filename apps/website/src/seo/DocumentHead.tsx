import { useEffect } from 'react';
import { useBusiness, useSeo } from '@rdplatforms/hooks';

function setMetaTag(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * No react-helmet dependency needed for a single-page-per-business site —
 * this just imperatively syncs <title> and meta tags whenever SEO config
 * loads. Revisit if/when the platform needs per-route SEO.
 */
export function DocumentHead() {
  const { business } = useBusiness();
  const { data: seo } = useSeo(business?.id);

  useEffect(() => {
    if (!seo) {
      return;
    }
    document.title = seo.title;
    setMetaTag('description', seo.description);
    if (seo.keywords.length > 0) {
      setMetaTag('keywords', seo.keywords.join(', '));
    }
  }, [seo]);

  return null;
}
