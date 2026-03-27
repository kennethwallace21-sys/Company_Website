import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-[200] bg-[#0b0f1a]/95 backdrop-blur-xl border-t border-white/[0.08] shadow-[0_-4px_30px_rgba(0,0,0,0.5)]"
                >
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-sm text-slate-300 text-center sm:text-left">
                            We use cookies to customize experiences on our site. Additional information about data collection is available in our{' '}
                            <Link to="/TermsAndConditions" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                                privacy policy
                            </Link>.
                        </p>

                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={decline}
                                className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 text-sm font-medium py-2 px-5 rounded-lg transition-all whitespace-nowrap"
                            >
                                DO NOT SHARE MY INFORMATION
                            </button>
                            <button
                                onClick={accept}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-medium py-2 px-5 rounded-lg transition-all whitespace-nowrap"
                            >
                                ACCEPT COOKIES
                            </button>
                            <button
                                onClick={decline}
                                className="text-slate-500 hover:text-white transition-colors ml-1"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
