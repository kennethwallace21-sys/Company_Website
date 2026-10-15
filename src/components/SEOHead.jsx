import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.catalystappliedai.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-cover.png`;

// Head tags that index.html ships statically for non-JS crawlers. Helmet only
// removes tags it created itself (marked with data-rh), so once React is
// running these would sit next to the Helmet output as duplicates.
const STATIC_DUPLICATE_SELECTOR = [
    'link[rel="canonical"]',
    'meta[name="description"]',
    'meta[name="robots"]',
    'meta[name="title"]',
    'meta[property^="og:"]',
    'meta[property^="twitter:"]',
].map((selector) => `${selector}:not([data-rh])`).join(', ');

/**
 * SEOHead: Dynamic per-page SEO meta tags.
 *
 * Usage:
 *   <SEOHead
 *     title="About Us"
 *     description="Learn about Catalyst Applied AI..."
 *     path="/About"
 *     noindex        // optional: emits robots noindex, nofollow
 *   />
 */
export default function SEOHead({
    title,
    description,
    path = '',
    image = DEFAULT_IMAGE,
    type = 'website',
    noindex = false,
    jsonLd = null,
}) {
    const fullTitle = title
        ? `${title} | Catalyst Applied AI`
        : 'Catalyst Applied AI | Production AI Deployed in Your Environment';

    const canonicalUrl = `${SITE_URL}${path}`;
    const isDefaultImage = image === DEFAULT_IMAGE;

    // Remove the static index.html duplicates so Helmet is the single source.
    useEffect(() => {
        document.head
            .querySelectorAll(STATIC_DUPLICATE_SELECTOR)
            .forEach((node) => node.remove());
    }, [path]);

    return (
        <Helmet>
            {/* Primary */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            {description && <meta name="description" content={description} />}
            <meta
                name="robots"
                content={noindex
                    ? 'noindex, nofollow'
                    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
            />

            {/* Canonical (omitted on noindex pages) */}
            {!noindex && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            {!noindex && <meta property="og:url" content={canonicalUrl} />}
            <meta property="og:title" content={fullTitle} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:image" content={image} />
            {isDefaultImage && <meta property="og:image:width" content="1200" />}
            {isDefaultImage && <meta property="og:image:height" content="630" />}
            {isDefaultImage && (
                <meta property="og:image:alt" content="Catalyst Applied AI: production AI deployed inside your environment" />
            )}
            <meta property="og:site_name" content="Catalyst Applied AI" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            {!noindex && <meta property="twitter:url" content={canonicalUrl} />}
            <meta property="twitter:title" content={fullTitle} />
            {description && <meta property="twitter:description" content={description} />}
            <meta property="twitter:image" content={image} />

            {/* JSON-LD */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
}
