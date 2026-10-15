export function createPageUrl(pageName) {
    return '/' + pageName.replace(/ /g, '-');
}

/**
 * Builds a link to the Contact page with an optional topic that pre-fills the
 * contact form. Use this for every primary CTA instead of mailto: links, which
 * do nothing on machines without a configured mail client.
 *
 * @param {string} [topic] - e.g. "ROI Assessment", "Custom RAG Systems demo".
 * @returns {string}
 */
export function contactUrl(topic) {
    const base = createPageUrl('Contact');
    return topic ? `${base}?topic=${encodeURIComponent(topic)}#contact-form` : `${base}#contact-form`;
}
