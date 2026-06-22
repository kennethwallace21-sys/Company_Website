import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            // Slight delay to allow content to render, then retry a few times
            let retries = 0;
            const scroll = () => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                } else if (retries < 15) {
                    retries++;
                    setTimeout(scroll, 50);
                }
            };
            setTimeout(scroll, 50);
            return;
        }

        // For standard page changes, use a silky smooth scroll to the top
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [pathname, hash]);

    return null;
}
