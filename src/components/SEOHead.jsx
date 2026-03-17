import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://catalystappliedai.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo1.png`;

/**
 * SEOHead — Dynamic per-page SEO meta tags.
 * 
 * Usage:
 *   <SEOHead 
 *     title="About Us"
 *     description="Learn about Catalyst Applied AI..."
 *     path="/About"
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
        : 'Catalyst Applied AI | Practical AI Solutions for Business';

    const canonicalUrl = `${SITE_URL}${path}`;

    return (
        <Helmet>
            {/* Primary */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            {description && <meta name="description" content={description} />}
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Canonical */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalUrl} />
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
