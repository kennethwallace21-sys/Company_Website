import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Mail, MapPin, Phone } from 'lucide-react';
import { fadeUp, staggerContainer, staggerItem, scaleUp } from '@/hooks/useFluidReveal';

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
                                <img src="/logo1.png" alt="Catalyst Applied AI" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Catalyst Applied AI
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm">
                            Practical AI solutions that deliver real results.
                        </p>
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
                                { label: 'Enterprise Model Deployment', service: 'custom-rag' },
                                { label: 'Voice & Conversational AI', service: 'voice-ai' },
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
                                { label: 'Team', page: 'Team' },
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
                        <li className="pt-2">
                            <span className="text-slate-400 text-sm inline-flex items-center gap-2">
                                <span>Blogs</span>
                                <span className="text-[11px] font-semibold text-blue-300/80">Soon</span>
                            </span>
                        </li>
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

                {/* NVIDIA Inception Member Badge */}
                <motion.div
                    className="flex flex-col items-center gap-3 my-8"
                    variants={scaleUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    custom={0}
                >
                    <p className="text-slate-400 text-xs sm:text-sm text-center max-w-xl">
                        Catalyst Applied AI is a member of NVIDIA Inception.
                    </p>
                    <motion.div
                        className="flex items-center justify-center rounded-lg overflow-hidden"
                        whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(118, 185, 0, 0.15)' }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <img
                            src="/nvidia-inception-badge.png"
                            alt="NVIDIA Inception Partner badge for dark backgrounds"
                            className="h-16 object-contain"
                            loading="lazy"
                        />
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
