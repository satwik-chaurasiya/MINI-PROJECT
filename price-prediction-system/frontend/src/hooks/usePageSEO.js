import { useEffect } from 'react';

/**
 * Custom hook to dynamically manage head SEO tags for client-side rendered pages.
 * Supports: title, meta description, canonical link, Open Graph, Twitter Cards, and robots meta.
 */
export default function usePageSEO({
  title,
  description,
  canonicalUrl,
  ogImage = 'https://pricespy.com/og-preview.png',
  ogType = 'website',
  noIndex = false,
}) {
  useEffect(() => {
    // 1. Update Title Tag (Essential #4)
    if (title) {
      document.title = title;
    }

    // Helper to get or create a <meta> tag
    const setMetaTag = (attributeName, attributeValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Update Meta Description (Essential #5)
    if (description) {
      setMetaTag('name', 'description', description);
    }

    // 3. Update Canonical Tag (Essential #7)
    const canonicalHref = canonicalUrl || window.location.href.split('?')[0];
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalHref);

    // 4. Update Open Graph Meta Tags (Essential #8)
    setMetaTag('property', 'og:title', title || document.title);
    setMetaTag('property', 'og:description', description || '');
    setMetaTag('property', 'og:url', canonicalHref);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);

    // 5. Update Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title || document.title);
    setMetaTag('name', 'twitter:description', description || '');
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. Robots Meta (for private dashboard/admin pages)
    if (noIndex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow');
    }
  }, [title, description, canonicalUrl, ogImage, ogType, noIndex]);
}
