import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Mail, MapPin, Linkedin, Phone, Facebook, Instagram } from 'lucide-react';
import { staggerContainer, staggerItem, scaleUp } from '@/hooks/useFluidReveal';

const XIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </svg>
);

export default function Footer() {
    return (
        <motion.footer
            className="py-12 px-4 bg-[#060a14] border-t border-blue-500/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                >
                    {/* Logo & Description */}
                    <motion.div variants={staggerItem} className="md:col-span-1">
                        <Link 
                            to={createPageUrl('Home')} 
                            className="flex items-center gap-3 hover:opacity-90 transition-opacity mb-4 group"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <img src="/logo.jpg" alt="Catalyst Applied AI" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Catalyst Applied AI
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm">
                            AI that runs where your data lives. Governed. Auditable. Yours.
                        </p>
                        <div role="navigation" aria-label="Social media" className="flex items-center gap-3 mt-4">
                            <a
                                href="https://www.linkedin.com/company/catalyst-applied-ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="text-slate-300 hover:text-blue-400 transition-colors"
                            >
                                <Linkedin className="w-6 h-6" />
                            </a>
                            <a
                                href="https://x.com/CatalystApplied"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="X"
                                className="text-slate-300 hover:text-blue-400 transition-colors"
                            >
                                <XIcon className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.facebook.com/Catalystappliedai"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="text-slate-300 hover:text-blue-400 transition-colors"
                            >
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.instagram.com/catalystappliedai/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="text-slate-300 hover:text-blue-400 transition-colors"
                            >
                                <Instagram className="w-6 h-6" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Services Links */}
                    <motion.div variants={staggerItem}>
                        <h4 className="text-white font-semibold mb-4">Services</h4>
                        <ul className="space-y-2">
                            {[
                                { label: 'Discovery & Diagnostic', service: 'discovery-diagnostic' },
                                { label: 'Custom AI Solutions', service: 'custom-ai-solutions' },
                                { label: 'Workflow Automation', service: 'workflow-automation' },
                                { label: 'Data Engineering', service: 'data-engineering' },
                                { label: 'AI Tools Implementation', service: 'ai-implementation' },
                                { label: 'Training & Enablement', service: 'training-support' },
                            ].map(item => (
                                <li key={item.service}>
                                    <Link
                                        to={createPageUrl('ServiceDetail') + `?service=${item.service}`}
                                        className="text-slate-400 hover:text-blue-400 transition-colors text-sm inline-block hover:translate-x-1 transition-transform duration-200"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Company Links */}
                    <motion.div variants={staggerItem}>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            {[
                                { label: 'Home', page: 'Home' },
                                { label: 'Products', page: 'Products' },
                                { label: 'FAQ', page: 'FAQ' },
                                { label: 'Terms & Conditions', page: 'TermsAndConditions' },
                            ].map(item => (
                                <li key={item.page}>
                                    <Link
                                        to={createPageUrl(item.page)}
                                        className="text-slate-400 hover:text-blue-400 transition-colors text-sm inline-block hover:translate-x-1 transition-transform duration-200"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div variants={staggerItem}>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="mailto:sales@catalystappliedai.com" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2 group">
                                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    sales@catalystappliedai.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+15024168342" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2 group">
                                    <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    +1-502-416-8342
                                </a>
                            </li>
                            <li className="text-slate-400 text-sm flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                Kentucky, USA
                            </li>
                        </ul>
                        
                    </motion.div>
                </motion.div>

                {/* NVIDIA Inception Partner Badge */}
                <motion.div
                    className="flex justify-center my-8"
                    variants={scaleUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    custom={0}
                >
                    <motion.div
                        className="flex items-center bg-black rounded-lg overflow-hidden"
                        whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(118, 185, 0, 0.15)' }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {/* Company Logo Side */}
                        <div className="flex items-center justify-center px-4 py-3 bg-black">
                            <img src="/logo.jpg" alt="Catalyst Applied AI" className="h-10 object-contain" loading="lazy" />
                        </div>
                        {/* NVIDIA Badge Side */}
                        <div className="bg-white px-4 py-3">
                            <img 
                                src="/nvidia-inception-badge.png" 
                                alt="Member of NVIDIA Inception" 
                                className="h-10 object-contain"
                                loading="lazy"
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Copyright & Legal */}
                <motion.div
                    className="pt-8 border-t border-slate-800 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <p className="text-slate-400 text-sm">
                        Copyright © {new Date().getFullYear()} Catalyst Applied AI - All Rights Reserved.
                    </p>
                    <div className="flex justify-center gap-4 mt-2">
                        <p className="text-slate-500 text-xs">
                            © {new Date().getFullYear()} NVIDIA, the NVIDIA logo, and NVIDIA Inception are trademarks and/or registered trademarks of NVIDIA Corporation in the U.S. and other countries.
                        </p>
                        <a 
                            href="/sitemap.xml" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-blue-500 transition-colors text-xs underline underline-offset-2"
                        >
                            Sitemap
                        </a>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
}
