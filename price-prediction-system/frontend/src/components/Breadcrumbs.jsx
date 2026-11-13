import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumbs Component with visual navigation and inline BreadcrumbList JSON-LD schema.
 * @param {Array} items - Array of objects { label: string, path?: string }
 */
export default function Breadcrumbs({ items = [] }) {
  // Inject BreadcrumbList JSON-LD schema into head dynamically
  useEffect(() => {
    if (!items.length) return;

    const schemaId = 'breadcrumb-jsonld-schema';
    let scriptTag = document.getElementById(schemaId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.path ? `https://pricespy.com${item.path}` : undefined
      }))
    };

    scriptTag.textContent = JSON.stringify(breadcrumbSchema);

    return () => {
      const el = document.getElementById(schemaId);
      if (el) el.remove();
    };
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs font-mono text-gray-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index === 0 && <Home className="w-3.5 h-3.5 text-gray-500" />}
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="hover:text-white hover:underline transition-colors text-gray-400"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-white font-medium truncate max-w-[240px] sm:max-w-md" aria-current="page">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
