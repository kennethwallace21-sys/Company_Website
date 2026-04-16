import React, { useState, useEffect } from 'react';
import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';
import ServicesAccordion from '../components/home/ServicesAccordion';
import AboutSection from '../components/home/AboutSection';
import CTASection from '../components/home/CTASection';
import Footer from '../components/home/Footer';
import SEOHead from '../components/SEOHead';

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
                            description="We build production AI systems — RAG knowledge bases, agentic workflows, workforce intelligence, signal analytics, and domain-trained AI agents. Built. Deployed. Running."
                path="/"
            />
            {/* Navbar */}
            <Navbar showNav={showNav} />

            {/* Hero Section */}
            <HeroSection />

            {/* Services Section */}
            <ServicesAccordion />

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
