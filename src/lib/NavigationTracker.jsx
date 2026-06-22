import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function NavigationTracker() {
    const location = useLocation();

    useEffect(() => {
        // Tracker placeholder
        // console.log("Navigated to:", location.pathname);
    }, [location]);

    return null;
}
