import { useEffect } from 'react';

interface HeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}

const BASE_URL = 'https://clauding.dev';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.webp`;

export function useHead({ title, description, canonical, ogImage }: HeadProps) {
  useEffect(() => {
    document.title = title;

    const image = ogImage ?? DEFAULT_OG_IMAGE;
    const fullCanonical = canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`;

    const tags: Record<string, { attr: string; value: string; content: string }> = {
      description: { attr: 'name', value: 'description', content: description },
      'og:title': { attr: 'property', value: 'og:title', content: title },
      'og:description': { attr: 'property', value: 'og:description', content: description },
      'og:url': { attr: 'property', value: 'og:url', content: fullCanonical },
      'og:image': { attr: 'property', value: 'og:image', content: image },
      'twitter:title': { attr: 'name', value: 'twitter:title', content: title },
      'twitter:description': { attr: 'name', value: 'twitter:description', content: description },
      'twitter:url': { attr: 'name', value: 'twitter:url', content: fullCanonical },
      'twitter:image': { attr: 'name', value: 'twitter:image', content: image },
    };

    for (const [, tag] of Object.entries(tags)) {
      let el = document.querySelector(`meta[${tag.attr}="${tag.value}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(tag.attr, tag.value);
        document.head.appendChild(el);
      }
      el.setAttribute('content', tag.content);
    }

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', fullCanonical);
  }, [title, description, canonical, ogImage]);
}
