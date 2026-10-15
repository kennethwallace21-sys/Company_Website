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
                description="Privacy Policy for Catalyst Applied AI, LLC. How we protect and handle information across our website and enterprise AI implementations."
                path="/Privacy"
            />
            <Navbar showNav={true} />

            <main className="pt-32 pb-24 px-4 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
                        Legal & Compliance
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Last Updated: February 2, 2026 · Catalyst Applied AI, LLC
                    </p>
                </div>

                {/* Content */}
                <Section id="overview" title="1. Who We Are" icon={ShieldCheck}>
                    <p>
                        Catalyst Applied AI, LLC ("we," "us," or "our") builds and deploys production AI software,
                        agentic systems, and workflow automation. This Privacy Policy explains how we collect, use,
                        and safeguard information when you visit our website at <strong className="text-white">catalystappliedai.com</strong> or interact with our services.
                    </p>
                </Section>

                <Section id="collection" title="2. Information We Collect" icon={Eye}>
                    <p>We may collect the following categories of information:</p>
                    <ul className="list-disc list-inside ml-2 space-y-2">
                        <li>
                            <strong className="text-white">Contact & Inquiry Information:</strong> Name, professional email address, phone number, company name, and project scope details submitted through our contact forms or direct communications.
                        </li>
                        <li>
                            <strong className="text-white">Technical Usage Data:</strong> Anonymized or pseudonymous browser type, approximate geography, page view telemetry, and referrer headers to optimize site delivery and performance.
                        </li>
                        <li>
                            <strong className="text-white">Client Project Data:</strong> Data processed under client contracts is governed by standalone Master Services Agreements (MSAs), Business Associate Agreements (BAAs), and Non-Disclosure Agreements (NDAs). Enterprise client data is isolated to client-designated perimeters and is never used to train public models.
                        </li>
                    </ul>
                </Section>

                <Section id="use" title="3. How We Use Information" icon={FileText}>
                    <p>We use collected information solely to:</p>
                    <ul className="list-disc list-inside ml-2 space-y-2">
                        <li>Respond to inquiries, schedule ROI assessments, and scope deployment requirements;</li>
                        <li>Operate, secure, and monitor the performance of our website;</li>
                        <li>Comply with applicable legal and statutory reporting requirements.</li>
                    </ul>
                    <p className="mt-4 text-emerald-400 font-medium">
                        We do not sell, rent, or trade your personal information to third parties or data brokers.
                    </p>
                </Section>

                <Section id="security" title="4. Data Security & Storage" icon={Lock}>
                    <p>
                        We employ administrative, technical, and physical safeguards appropriate for sensitive commercial and government-adjacent workflows. Our cloud infrastructure leverages TLS encryption in transit and AES-256 encryption at rest.
                    </p>
                    <p>
                        For enterprise deployments, our models run within your tenant or on-premises environment (including AWS GovCloud and air-gapped hardware), ensuring zero data exfiltration beyond your boundary.
                    </p>
                </Section>

                <Section id="cookies" title="5. Cookies & Tracking">
                    <p>
                        We use minimal, privacy-preserving session cookies and Cloudflare security features (such as Turnstile) to protect our forms from spam and automated abuse without invasive cross-site profiling.
                    </p>
                </Section>

                <Section id="contact" title="6. Contact Our Compliance Team" icon={Mail}>
                    <p>
                        If you have questions regarding this Privacy Policy, procurement checklists, or vendor compliance documentation, please contact:
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
                            Louisville, Kentucky, USA · SAM.gov Registered (NAICS 541715, 541511)
                        </p>
                    </div>
                </Section>
            </main>

            <Footer />
        </div>
    );
}
