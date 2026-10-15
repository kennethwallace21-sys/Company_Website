import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Phone, Lock, Eye, FileText } from 'lucide-react';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import SEOHead from '../components/SEOHead';
import { fadeUp } from '@/hooks/useFluidReveal';

function Section({ id, title, icon: Icon, children }) {
    return (
        <motion.div
            id={id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="mb-12 p-8 rounded-2xl bg-[#0d1425]/50 border border-blue-500/10 hover:border-blue-500/20 transition-colors"
        >
            <div className="flex items-center gap-3 mb-6">
                {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                {children}
            </div>
        </motion.div>
    );
}

export default function Privacy() {
    return (
        <div className="min-h-screen bg-[#060a14]">
            <SEOHead
                title="Privacy Policy"
                description="Privacy Policy for Catalyst Applied AI, LLC. What we collect through catalystappliedai.com, how we use it, and the service providers involved."
                path="/Privacy"
            />
            <Navbar showNav={true} />

            <main className="pt-32 pb-24 px-4 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
                        Legal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Effective date: October 14, 2026 · Catalyst Applied AI, LLC
                    </p>
                </div>

                {/* Content */}
                <Section id="overview" title="1. Who We Are" icon={ShieldCheck}>
                    <p>
                        Catalyst Applied AI, LLC ("we," "us," or "our") is based in Louisville, Kentucky. We build and deploy
                        AI software, agentic systems, and workflow automation. This Privacy Policy explains what information
                        we collect when you visit <strong className="text-white">catalystappliedai.com</strong> (the "Site"),
                        how we use it, and the service providers involved. You can reach us at{' '}
                        <a href="mailto:sales@catalystappliedai.com" className="text-blue-300 hover:text-blue-200 underline">
                            sales@catalystappliedai.com
                        </a>.
                    </p>
                    <p>
                        This policy covers the Site only. Data that we process on behalf of a customer under a services
                        agreement is governed by that agreement, not by this policy.
                    </p>
                </Section>

                <Section id="collection" title="2. What We Collect" icon={Eye}>
                    <ul className="list-disc list-inside ml-2 space-y-2">
                        <li>
                            <strong className="text-white">Contact form submissions:</strong> the name, email address, company, and message you enter when you submit the contact form.
                        </li>
                        <li>
                            <strong className="text-white">Server logs:</strong> our hosting provider, Cloudflare, records request logs for the Site, including your IP address, user agent, and request metadata (such as the page requested and the time of the request).
                        </li>
                    </ul>
                    <p>
                        We do not collect anything else through the Site. The Site does not set cookies and does not run
                        analytics or advertising trackers. Our FAQ assistant runs entirely in your browser. It does not
                        transmit or store the questions you type.
                    </p>
                </Section>

                <Section id="use" title="3. How We Use It" icon={FileText}>
                    <ul className="list-disc list-inside ml-2 space-y-2">
                        <li>To respond to your inquiries, including scheduling assessments and scoping requests;</li>
                        <li>To operate and secure the Site, including preventing spam and abuse.</li>
                    </ul>
                    <p>We do not sell or rent your personal information.</p>
                </Section>

                <Section id="providers" title="4. Service Providers">
                    <ul className="list-disc list-inside ml-2 space-y-2">
                        <li>
                            <strong className="text-white">Cloudflare:</strong> hosts the Site, provides security services, and keeps request logs. The contact form is received by a Cloudflare Worker.
                        </li>
                        <li>
                            <strong className="text-white">Resend:</strong> delivers contact form submissions to us by email. We do not store submissions in a separate database.
                        </li>
                        <li>
                            <strong className="text-white">Cloudflare Turnstile:</strong> bot protection on the contact form, when enabled.
                        </li>
                        <li>
                            <strong className="text-white">Unsplash:</strong> images on some pages may be loaded from Unsplash (images.unsplash.com). Unsplash receives your IP address when those images load.
                        </li>
                    </ul>
                    <p>
                        We may also disclose information when required by law or to protect rights, safety, or property.
                    </p>
                </Section>

                <Section id="retention" title="5. Retention">
                    <p>
                        Contact submissions are retained in our business email for as long as needed to respond and for
                        business records. Server logs are retained according to Cloudflare's retention practices.
                    </p>
                </Section>

                <Section id="rights" title="6. Your Rights">
                    <p>
                        You may request access to, correction of, or deletion of the personal information we hold about you
                        by emailing{' '}
                        <a href="mailto:sales@catalystappliedai.com" className="text-blue-300 hover:text-blue-200 underline">
                            sales@catalystappliedai.com
                        </a>. We honor requests within 30 days where feasible. California residents and residents of the
                        EU and UK may have additional rights under applicable law, and we will respect those rights when you
                        contact us.
                    </p>
                    <p>
                        If you access the Site from outside the United States, your information may be processed in the
                        United States, which may have different data protection laws than your country.
                    </p>
                </Section>

                <Section id="children" title="7. Children">
                    <p>
                        The Site is not directed to children under 13, and we do not knowingly collect personal information
                        from children under 13.
                    </p>
                </Section>

                <Section id="security" title="8. Security" icon={Lock}>
                    <p>
                        We use industry-standard measures to protect information, including TLS encryption in transit. No
                        method of transmission or storage is perfectly secure, and we cannot guarantee absolute security.
                    </p>
                </Section>

                <Section id="changes" title="9. Changes to This Policy">
                    <p>
                        We may update this Privacy Policy from time to time. The effective date at the top of this page
                        shows the latest revision.
                    </p>
                </Section>

                <Section id="contact" title="10. Contact" icon={Mail}>
                    <p>
                        Questions about this Privacy Policy:
                    </p>
                    <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-slate-200">
                        <p><strong className="text-white">Catalyst Applied AI, LLC</strong></p>
                        <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <a href="mailto:sales@catalystappliedai.com" className="text-blue-300 hover:text-blue-200 underline">
                                sales@catalystappliedai.com
                            </a>
                        </p>
                        <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-400" />
                            <span>+1-502-416-8342</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                            Louisville, Kentucky, USA
                        </p>
                    </div>
                    <p className="mt-4">
                        Vendor and procurement questions:{' '}
                        <a href="mailto:sales@catalystappliedai.com" className="text-blue-300 hover:text-blue-200 underline">
                            sales@catalystappliedai.com
                        </a>
                    </p>
                </Section>
            </main>

            <Footer />
        </div>
    );
}
