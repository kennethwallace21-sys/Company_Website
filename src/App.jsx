import React, { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster"
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollToTop from '@/components/ScrollToTop';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SHOW_SERVICES } from '@/config/features';

// Lazy-load chatbot: not needed on first paint
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

const AppRoutes = () => {
    const location = useLocation();

    return (
        <ErrorBoundary resetKey={`${location.pathname}${location.search}`}>
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
                        <Route path="/Team" element={<Navigate to="/" replace />} />
                        <Route path="/team" element={<Navigate to="/" replace />} />
                        {!SHOW_SERVICES && (
                            <>
                                <Route path="/ServiceDetail" element={<Navigate to="/Products" replace />} />
                                <Route path="/servicedetail" element={<Navigate to="/Products" replace />} />
                            </>
                        )}
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
        </ErrorBoundary>
    );
};

function App() {
    return (
        <HelmetProvider>
            <Router>
                <ScrollToTop />
                <AppRoutes />
                <Suspense fallback={null}>
                    <FaqChatbot />
                </Suspense>
            </Router>
            <Toaster />
        </HelmetProvider>
    )
}

export default App
