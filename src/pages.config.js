/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Performance: Non-home pages are lazy-loaded for faster initial load.
 */
import { lazy } from 'react';
import Home from './pages/Home';

// Lazy-load all non-home pages for code splitting
const Contact = lazy(() => import('./pages/Contact'));
const Products = lazy(() => import('./pages/Products'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const FAQ = lazy(() => import('./pages/FAQ'));

export const PAGES = {
    "Contact": Contact,
    "Home": Home,
    "Products": Products,
    "ServiceDetail": ServiceDetail,
    "TermsAndConditions": TermsAndConditions,
    "FAQ": FAQ,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};
