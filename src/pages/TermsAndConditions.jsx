import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import { fadeUp } from '@/hooks/useFluidReveal';
import SEOHead from '../components/SEOHead';

export default function TermsAndConditions() {
    const [showNav, setShowNav] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowNav(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const Section = ({ id, title, children, delay = 0 }) => (
        <motion.section
            id={id}
            className="mb-12 scroll-mt-24"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            custom={delay}
        >
            <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-blue-500/30">{title}</h2>
            <div className="text-slate-300 leading-relaxed space-y-4">{children}</div>
        </motion.section>
    );

    const SubSection = ({ title, children }) => (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">{title}</h3>
            <div className="text-slate-300 space-y-2">{children}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#060a14]">
            <SEOHead
                title="Terms & Conditions"
                description="Terms of Service for catalystappliedai.com, operated by Catalyst Applied AI, LLC."
                path="/TermsAndConditions"
                noindex={true}
            />
            <Navbar showNav={showNav} />

            {/* Hero */}
            <section className="relative pt-32 pb-12 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
                <motion.div
                    className="relative z-10 max-w-4xl mx-auto px-4"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-slate-400">Terms of Service for catalystappliedai.com</p>
                </motion.div>
            </section>

            {/* Content */}
            <section className="py-12 px-4 pb-24">
                <div className="max-w-4xl mx-auto">
                    {/* TERMS OF SERVICE */}
                    <Section id="terms-of-service" title="TERMS OF SERVICE">
                        <p className="text-slate-400 text-sm mb-6">Effective date: October 14, 2026</p>

                        <SubSection title="1. Acceptance of Terms">
                            <p>By accessing or using catalystappliedai.com (the "Site"), you agree to these Terms of Service ("Terms"). If you do not agree, do not use the Site.</p>
                        </SubSection>

                        <SubSection title="2. Use of the Site">
                            <p>You may use the Site only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                            <ul className="list-disc list-inside ml-2 space-y-1">
                                <li>Use the Site in any way that violates applicable law;</li>
                                <li>Attempt to gain unauthorized access to the Site or its systems;</li>
                                <li>Interfere with the operation or security of the Site.</li>
                            </ul>
                        </SubSection>

                        <SubSection title="3. No Professional Advice">
                            <p>Content on the Site is for general informational purposes only and does not constitute legal, tax, or professional advice. You should consult appropriate professionals before relying on any information.</p>
                        </SubSection>

                        <SubSection title="4. Intellectual Property">
                            <p>All content on the Site, including text, graphics, logos, and software, is owned by or licensed to Catalyst Applied AI, LLC and is protected by intellectual property laws. You may not copy, modify, or distribute Site content without our prior written consent.</p>
                        </SubSection>

                        <SubSection title="5. Third-Party Links">
                            <p>The Site may contain links to third-party websites. We are not responsible for the content or practices of those sites.</p>
                        </SubSection>

                        <SubSection title="6. Disclaimer of Warranties">
                            <p>The Site is provided "as is" and "as available" without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
                        </SubSection>

                        <SubSection title="7. Limitation of Liability">
                            <p>To the maximum extent permitted by law, Catalyst Applied AI, LLC shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of the Site.</p>
                        </SubSection>

                        <SubSection title="8. Indemnification">
                            <p>You agree to indemnify and hold harmless Catalyst Applied AI, LLC from any claims, damages, or expenses arising from your use of the Site or violation of these Terms.</p>
                        </SubSection>

                        <SubSection title="9. Governing Law">
                            <p>These Terms are governed by the laws of the Commonwealth of Kentucky, without regard to conflict of law principles.</p>
                        </SubSection>

                        <SubSection title="10. Changes to Terms">
                            <p>We may update these Terms from time to time. Continued use of the Site after changes are posted constitutes your acceptance of the revised Terms.</p>
                        </SubSection>

                        <SubSection title="11. Contact">
                            <p>If you have questions about these Terms, contact us at:</p>
                            <p className="mt-2">Catalyst Applied AI, LLC<br />sales@catalystappliedai.com<br />502-416-8342</p>
                        </SubSection>
                    </Section>

                    <p className="text-slate-300">
                        Our Privacy Policy is at{' '}
                        <Link to="/Privacy" className="text-blue-300 hover:text-blue-200 underline underline-offset-4">/Privacy</Link>.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
