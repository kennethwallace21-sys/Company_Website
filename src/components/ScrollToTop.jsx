import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HASH_WAIT_MS = 3000;

function findHashTarget(hash) {
    try {
        return document.querySelector(hash);
    } catch {
        // Malformed selector in the hash (for example "#1abc"): treat as missing.
        return null;
    }
}

export default function ScrollToTop() {
    const { pathname, search, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            return undefined;
        }

        // Lazy pages may not have rendered the target yet. Watch the DOM for up
        // to HASH_WAIT_MS, then fall back to the top of the page.
        let done = false;
        let observer = null;
        let timeoutId = null;

        const cleanup = () => {
            done = true;
            if (observer) observer.disconnect();
            if (timeoutId) clearTimeout(timeoutId);
        };

        const tryScroll = () => {
            if (done) return;
            const element = findHashTarget(hash);
            if (element) {
                cleanup();
                requestAnimationFrame(() => element.scrollIntoView({ behavior: 'smooth' }));
            }
        };

        tryScroll();
        if (done) return cleanup;

        observer = new MutationObserver(tryScroll);
        observer.observe(document.body, { childList: true, subtree: true });
        timeoutId = setTimeout(() => {
            if (done) return;
            cleanup();
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }, HASH_WAIT_MS);

        return cleanup;
    }, [pathname, search, hash]);

    return null;
}
