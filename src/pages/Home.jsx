import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import CTASection from '../components/home/CTASection';
import Footer from '../components/home/Footer';
import SEOHead from '../components/SEOHead';
import { SHOW_SERVICES } from '@/config/features';

// Lazy and flag-gated so the Services accordion is not built into the bundle while hidden.
const ServicesAccordion = SHOW_SERVICES ? lazy(() => import('../components/home/ServicesAccordion')) : null;

export default function Home() {
    const [showNav, setShowNav] = useState(false);

    useEffect(() => {
        // Show navbar after a short delay for smooth entry
        const timer = setTimeout(() => setShowNav(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#060a14]">
            <SEOHead
                title={null}
                description="AI assistants, operational reporting and RAG systems for enterprise and public sector teams, deployed in your cloud tenant, AWS GovCloud, on premises or a managed environment."
                path="/"
            />
            {/* Navbar */}
            <Navbar showNav={showNav} />

            {/* Hero Section */}
            <HeroSection />

            {/* Services Section */}
            {SHOW_SERVICES && (
                <Suspense fallback={null}>
                    <ServicesAccordion />
                </Suspense>
            )}

            {/* About Section */}
            <div id="about">
                <AboutSection />
            </div>

            {/* CTA Section */}
            <CTASection />

            {/* Footer */}
            <Footer />
        </div>
    );
}
