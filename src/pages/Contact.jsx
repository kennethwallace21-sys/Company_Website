import React from 'react';
import Navbar from '../components/home/Navbar';
import ContactSection from '../components/home/ContactSection';
import Footer from '../components/home/Footer';
import SEOHead from '../components/SEOHead';

export default function Contact() {
    return (
        <div className="min-h-screen bg-[#060a14]">
            <SEOHead
                title="Contact Us"
                description="Contact Catalyst Applied AI about building and deploying AI in your environment, or email sales@catalystappliedai.com."
                path="/Contact"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'ContactPage',
                    name: 'Contact Catalyst Applied AI',
                    description: 'Get in touch about building and deploying AI in your environment.',
                    url: 'https://www.catalystappliedai.com/Contact',
                    mainEntity: {
                        '@type': 'Organization',
                        name: 'Catalyst Applied AI',
                        email: 'sales@catalystappliedai.com',
                        telephone: '+1-502-416-8342'
                    }
                }}
            />
            <Navbar showNav={true} />
            <ContactSection />
            <Footer />
        </div>
    );
}
