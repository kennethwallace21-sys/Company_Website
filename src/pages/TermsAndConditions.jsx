import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import { fadeUp, staggerContainer, staggerItem } from '@/hooks/useFluidReveal';
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
                description="Terms of service, privacy policy, and legal information for Catalyst Applied AI."
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
                    <p className="text-slate-400">Legal information for catalystappliedai.com</p>
                </motion.div>
            </section>

            {/* Content */}
            <section className="py-12 px-4 pb-24">
                <div className="max-w-4xl mx-auto">
                    {/* Quick Nav */}
                    <motion.div
                        className="mb-12 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0.15}
                    >
                        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Quick Navigation</h3>
                        <div className="flex flex-wrap gap-3">
                            <a href="#terms-of-service" className="text-slate-300 hover:text-blue-400 text-sm transition-colors hover:translate-x-0.5 inline-block">Terms of Service</a>
                            <span className="text-slate-600">|</span>
                            <a href="#privacy-policy" className="text-slate-300 hover:text-blue-400 text-sm transition-colors hover:translate-x-0.5 inline-block">Privacy Policy</a>
                            <span className="text-slate-600">|</span>
                            <a href="#ip-assignment" className="text-slate-300 hover:text-blue-400 text-sm transition-colors hover:translate-x-0.5 inline-block">IP Assignment</a>
                            <span className="text-slate-600">|</span>
                            <a href="#nda" className="text-slate-300 hover:text-blue-400 text-sm transition-colors hover:translate-x-0.5 inline-block">NDA</a>
                        </div>
                    </motion.div>

                    {/* TERMS OF SERVICE */}
                    <Section id="terms-of-service" title="TERMS OF SERVICE">
                        <p className="text-slate-400 text-sm mb-6">Last Updated: February 2, 2026</p>

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

                    {/* PRIVACY POLICY */}
                    <Section id="privacy-policy" title="PRIVACY POLICY" delay={0.05}>
                        <p className="text-slate-400 text-sm mb-6">Last Updated: February 2, 2026</p>

                        <SubSection title="1. Who We Are">
                            <p>Catalyst Applied AI, LLC ("we," "us," or "our") provides AI consulting and workflow automation services. This Privacy Policy explains how we collect, use, and protect information when you visit our website catalystappliedai.com (the "Site").</p>
                        </SubSection>

                        <SubSection title="2. Information We Collect">
                            <p>We may collect:</p>
                            <ul className="list-disc list-inside ml-2 space-y-1 mt-2">
                                <li><strong>Contact Information:</strong> name, email address, phone number, company, and any information you submit via contact forms.</li>
                                <li><strong>Usage Data:</strong> IP address, browser type, pages visited, and other usage information collected through cookies or similar technologies.</li>
                                <li><strong>Communications:</strong> information you provide when you communicate with us.</li>
                            </ul>
                        </SubSection>

                        <SubSection title="3. How We Use Information">
                            <p>We use information to:</p>
                            <ul className="list-disc list-inside ml-2 space-y-1">
                                <li>Respond to inquiries and provide our services;</li>
                                <li>Operate, maintain, and improve the Site;</li>
                                <li>Communicate with you about our services, updates, or marketing (you can opt out at any time);</li>
                                <li>Comply with legal obligations.</li>
                            </ul>
                        </SubSection>

                        <SubSection title="4. Cookies and Analytics">
                            <p>We may use cookies or similar technologies to understand how visitors use the Site and to improve it. You can control cookies through your browser settings, but disabling cookies may affect your experience on the Site.</p>
                        </SubSection>

                        <SubSection title="5. Sharing of Information">
                            <p>We do not sell your personal information. We may share information with:</p>
                            <ul className="list-disc list-inside ml-2 space-y-1 mt-2">
                                <li>Service providers who help us operate the Site or provide services (e.g., hosting, analytics, email);</li>
                                <li>As required by law or to protect rights, safety, or property.</li>
                            </ul>
                        </SubSection>

                        <SubSection title="6. Data Security">
                            <p>We use reasonable administrative, technical, and physical safeguards to protect your information. However, no method of transmission or storage is 100% secure.</p>
                        </SubSection>

                        <SubSection title="7. International Visitors">
                            <p>If you access the Site from outside the United States, you acknowledge that your information may be processed in the United States, which may have different data protection laws than your country.</p>
                        </SubSection>

                        <SubSection title="8. Your Choices">
                            <p>You may:</p>
                            <ul className="list-disc list-inside ml-2 space-y-1">
                                <li>Request that we stop sending you marketing emails by using the unsubscribe link in such emails;</li>
                                <li>Contact us to update or correct your contact information.</li>
                            </ul>
                        </SubSection>

                        <SubSection title="9. Children's Privacy">
                            <p>Our Site is not directed to children under 13, and we do not knowingly collect information from children under 13.</p>
                        </SubSection>

                        <SubSection title="10. Contact Us">
                            <p>If you have questions about this Privacy Policy, contact us at:</p>
                            <p className="mt-2">Catalyst Applied AI, LLC<br />Email: sales@catalystappliedai.com<br />Phone: 502-416-8342</p>
                        </SubSection>

                        <SubSection title="11. Changes to This Policy">
                            <p>We may update this Privacy Policy from time to time. The "Last Updated" date at the top indicates the latest revision.</p>
                        </SubSection>
                    </Section>

                    {/* IP ASSIGNMENT */}
                    <Section id="ip-assignment" title="INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT" delay={0.1}>
                        <p className="text-slate-400 text-sm mb-6">Standalone IP Assignment for one-off contributors</p>

                        <SubSection title="Parties">
                            <p>This Intellectual Property Assignment Agreement ("Agreement") is made as of [Date] between:</p>
                            <p className="mt-2">Catalyst Applied AI, LLC, a Kentucky limited liability company ("Company"), and [Name] ("Assignor").</p>
                        </SubSection>

                        <SubSection title="1. Work Product">
                            <p>"Work Product" means all ideas, inventions, discoveries, code, scripts, prompts, models, documentation, designs, works of authorship, processes, and other materials created or developed by Assignor for or on behalf of the Company.</p>
                        </SubSection>

                        <SubSection title="2. Assignment">
                            <p>Assignor hereby irrevocably assigns to the Company all right, title, and interest in and to the Work Product, including all intellectual property rights (copyrights, trade secrets, etc.), worldwide and in perpetuity.</p>
                        </SubSection>

                        <SubSection title="3. Further Assurances">
                            <p>Assignor agrees to execute any documents and take reasonable steps the Company may request to confirm or enforce the Company's ownership rights.</p>
                        </SubSection>

                        <SubSection title="4. Moral Rights">
                            <p>To the extent permitted by law, Assignor waives any moral rights or similar rights in the Work Product.</p>
                        </SubSection>

                        <SubSection title="5. No Obligation to Use">
                            <p>The Company is not obligated to use the Work Product.</p>
                        </SubSection>

                        <SubSection title="6. Governing Law">
                            <p>This Agreement is governed by the laws of the Commonwealth of Kentucky.</p>
                        </SubSection>
                    </Section>

                    {/* NDA */}
                    <Section id="nda" title="MUTUAL NON-DISCLOSURE AGREEMENT" delay={0.15}>
                        <p className="text-slate-400 text-sm mb-6">Contractor / Partner NDA (Standalone, generic)</p>

                        <SubSection title="Parties">
                            <p>This Mutual Non-Disclosure Agreement ("Agreement") is made as of [Date] between:</p>
                            <p className="mt-2">Catalyst Applied AI, LLC, a Kentucky limited liability company ("Company"), and [Name/Company] ("Counterparty").</p>
                        </SubSection>

                        <SubSection title="1. Purpose">
                            <p>The Parties may disclose certain confidential and proprietary information to explore or carry out a potential or existing business relationship ("Purpose").</p>
                        </SubSection>

                        <SubSection title="2. Confidential Information">
                            <p>"Confidential Information" means any non-public information disclosed by either Party, whether oral, written, electronic, or otherwise, including business plans, pricing, client lists, technology, source code, models, processes, and documentation.</p>
                        </SubSection>

                        <SubSection title="3. Obligations">
                            <p>The receiving Party shall:</p>
                            <ul className="list-disc list-inside ml-2 space-y-1 mt-2">
                                <li>(a) use Confidential Information solely for the Purpose;</li>
                                <li>(b) not disclose it to any third party except employees/contractors/advisors with a need to know and who are bound by confidentiality obligations; and</li>
                                <li>(c) protect it using at least reasonable care.</li>
                            </ul>
                        </SubSection>

                        <SubSection title="4. Exclusions">
                            <p>Confidential Information does not include information that:</p>
                            <ul className="list-disc list-inside ml-2 space-y-1 mt-2">
                                <li>(a) is or becomes public through no fault of the receiving Party;</li>
                                <li>(b) was lawfully known before disclosure;</li>
                                <li>(c) is received from a third party without breach of confidentiality; or</li>
                                <li>(d) is independently developed without use of Confidential Information.</li>
                            </ul>
                        </SubSection>

                        <SubSection title="5. Required Disclosure">
                            <p>If a Party is required by law to disclose Confidential Information, it may do so after providing notice (if legally permitted) to allow the other Party to seek protective measures.</p>
                        </SubSection>

                        <SubSection title="6. No License">
                            <p>No intellectual property rights are granted by this Agreement except the limited right to use Confidential Information for the Purpose.</p>
                        </SubSection>

                        <SubSection title="7. Term">
                            <p>This Agreement begins on the date above and continues for three (3) years, and confidentiality obligations survive for three (3) years after the last disclosure, except trade secrets, which are protected as long as they remain trade secrets.</p>
                        </SubSection>

                        <SubSection title="8. Remedies">
                            <p>The Parties acknowledge that unauthorized disclosure may cause irreparable harm and that injunctive relief may be appropriate in addition to other remedies.</p>
                        </SubSection>

                        <SubSection title="9. Governing Law">
                            <p>This Agreement is governed by the laws of the Commonwealth of Kentucky.</p>
                        </SubSection>
                    </Section>
                </div>
            </section>

            <Footer />
        </div>
    );
}
