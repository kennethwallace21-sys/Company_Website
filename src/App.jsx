import React, { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { Analytics } from "@vercel/analytics/react"
import ScrollToTop from '@/components/ScrollToTop';

// Lazy-load chatbot — not needed on first paint
const FaqChatbot = lazy(() => import('@/components/FaqChatbot'));

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
    <Layout currentPageName={currentPageName}>{children}</Layout>
    : <>{children}</>;

// Minimal dark-themed loading spinner that matches the site
const PageLoader = () => (
    <div className="fixed inset-0 bg-[#060a14] flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
    </div>
);

import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
            duration: 0.5, 
            ease: [0.22, 1, 0.36, 1] // Silky smooth custom cubic-bezier
        }}
    >
        {children}
    </motion.div>
);

const AuthenticatedApp = () => {
    const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
    const location = useLocation();

    if (isLoadingPublicSettings || isLoadingAuth) {
        return <PageLoader />;
    }

    if (authError) {
        if (authError.type === 'user_not_registered') {
            return <UserNotRegisteredError />;
        } else if (authError.type === 'auth_required') {
            navigateToLogin();
            return null;
        }
    }

    return (
        <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={
                        <LayoutWrapper currentPageName={mainPageKey}>
                            <PageWrapper>
                                <MainPage />
                            </PageWrapper>
                        </LayoutWrapper>
                    } />
                    {Object.entries(Pages).map(([path, Page]) => (
                        <React.Fragment key={path}>
                            <Route
                                path={`/${path}`}
                                element={
                                    <LayoutWrapper currentPageName={path}>
                                        <PageWrapper>
                                            <Page />
                                        </PageWrapper>
                                    </LayoutWrapper>
                                }
                            />
                            {/* Fallback for lowercase URLs */}
                            <Route
                                path={`/${path.toLowerCase()}`}
                                element={
                                    <LayoutWrapper currentPageName={path}>
                                        <PageWrapper>
                                            <Page />
                                        </PageWrapper>
                                    </LayoutWrapper>
                                }
                            />
                        </React.Fragment>
                    ))}
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </AnimatePresence>
        </Suspense>
    );
};

function App() {
    return (
        <HelmetProvider>
            <AuthProvider>
                <QueryClientProvider client={queryClientInstance}>
                    <Router>
                        <ScrollToTop />
                        <NavigationTracker />
                        <AuthenticatedApp />
                        <Analytics />
                        <Suspense fallback={null}>
                            <FaqChatbot />
                        </Suspense>
                    </Router>
                    <Toaster />
                </QueryClientProvider>
            </AuthProvider>
        </HelmetProvider>
    )
}

export default App
