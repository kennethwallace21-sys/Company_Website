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
                description="We help organizations identify, design, and implement practical AI solutions that drive real business value. AI consulting, workflow automation, custom AI tools, and data engineering."
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
