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
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[200] bg-[#0b0f1a]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-5"
                >
                    <button
                        onClick={decline}
                        className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <p className="text-sm text-slate-300 mb-4 pr-6">
                        We use cookies and analytics to improve your experience. By continuing, you agree to our{' '}
                        <Link to="/TermsAndConditions" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                            Privacy Policy
                        </Link>.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={accept}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-medium py-2 px-4 rounded-xl transition-all"
                        >
                            Accept
                        </button>
                        <button
                            onClick={decline}
                            className="flex-1 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 text-sm font-medium py-2 px-4 rounded-xl transition-all"
                        >
                            Decline
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
