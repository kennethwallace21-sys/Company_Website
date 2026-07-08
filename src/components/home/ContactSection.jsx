import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, ArrowRight, CheckCircle, Linkedin, Phone } from 'lucide-react';
import { fadeUp, fadeLeft, fadeRight } from '@/hooks/useFluidReveal';
import { submitLead } from '@/lib/submitLead';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: '',
        website: '', // Honeypot field — bots fill this, humans don't see it
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [turnstileToken, setTurnstileToken] = useState(null);
    const turnstileRef = useRef(null);
    const widgetIdRef = useRef(null);

    useEffect(() => {
        if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return undefined;

        const interval = window.setInterval(() => {
            if (window.turnstile && turnstileRef.current && widgetIdRef.current === null) {
                widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
                    sitekey: TURNSTILE_SITE_KEY,
                    theme: 'dark',
                    callback: (token) => setTurnstileToken(token),
                    'expired-callback': () => setTurnstileToken(null),
                    'error-callback': () => setTurnstileToken(null),
                });
                window.clearInterval(interval);
            }
        }, 200);

        return () => window.clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (TURNSTILE_SITE_KEY && !turnstileToken) {
            setError('Please complete the verification check.');
            return;
        }

        setIsLoading(true);
        try {
            const { ok, message } = await submitLead({
                ...formData,
                'cf-turnstile-response': turnstileToken,
                turnstileEnabled: Boolean(TURNSTILE_SITE_KEY),
            });
            if (!ok) {
                setError(message || 'Something went wrong. Please try again or email us directly.');
                if (window.turnstile && widgetIdRef.current !== null) {
                    window.turnstile.reset(widgetIdRef.current);
                    setTurnstileToken(null);
                }
                return;
            }
            setIsSubmitted(true);
            setFormData({ name: '', email: '', company: '', message: '', website: '' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="py-24 px-4 bg-[#060a14] relative overflow-hidden">
            {/* Background decoration */}
            <motion.div
                className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.45, 0.2] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    custom={0}
                    className="text-center mb-16"
                >
                    <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">Get In Touch</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                        Contact Us
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Ready to unlock AI for your business? Book your ROI assessment today
                        and discover how much time and money you can save.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        variants={fadeLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        custom={0.1}
                        className="space-y-8"
                    >
                        {/* CTA Card */}
                        <motion.div
                            className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/15"
                            whileHover={{ borderColor: 'rgba(59, 130, 246, 0.35)' }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="text-2xl font-bold text-white mb-4">
                                See How Much Time You Can Save!
                            </h3>
                            <p className="text-slate-300 mb-6">
                                Schedule a free ROI assessment and get a personalized report
                                on the potential impact AI can have on your business.
                            </p>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-shadow"
                                    onClick={() => window.location.href = 'mailto:sales@catalystappliedai.com?subject=Request%20for%20Information'}
                                >
                                    Book Your ROI Assessment
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    className="mt-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-xl w-full sm:w-auto shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/30 transition-shadow"
                                    onClick={() => window.location.href = 'mailto:sales@catalystappliedai.com?subject=Speak%20with%20a%2024%2F7%20Agent'}
                                >
                                    Speak with a 24/7 Agent
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Contact Details */}
                        <div className="space-y-4">
                            <motion.a
                                href="mailto:sales@catalystappliedai.com"
                                className="flex items-center gap-4 p-4 rounded-xl bg-[#0d1425]/50 border border-blue-500/10 group"
                                whileHover={{
                                    y: -3,
                                    borderColor: 'rgba(59, 130, 246, 0.35)',
                                    transition: { duration: 0.25 },
                                }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400">Email us at</div>
                                    <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                        sales@catalystappliedai.com
                                    </div>
                                </div>
                            </motion.a>

                            <motion.a
                                href="tel:+15024168342"
                                className="flex items-center gap-4 p-4 rounded-xl bg-[#0d1425]/50 border border-blue-500/10 group"
                                whileHover={{
                                    y: -3,
                                    borderColor: 'rgba(59, 130, 246, 0.35)',
                                    transition: { duration: 0.25 },
                                }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    <Phone className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400">Call us at</div>
                                    <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                        +1-502-416-8342
                                    </div>
                                </div>
                            </motion.a>

                            <motion.a
                                href="https://www.linkedin.com/company/catalyst-applied-ai/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-xl bg-[#0d1425]/50 border border-blue-500/10 group"
                                whileHover={{
                                    y: -3,
                                    borderColor: 'rgba(59, 130, 246, 0.35)',
                                    transition: { duration: 0.25 },
                                }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    <Linkedin className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400">Follow us on</div>
                                    <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                        LinkedIn
                                    </div>
                                </div>
                            </motion.a>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        variants={fadeRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        custom={0.2}
                        className="h-full"
                    >
                        {isSubmitted ? (
                            <motion.div
                                className="h-full flex items-center justify-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <div className="text-center">
                                    <motion.div
                                        className="w-16 h-16 rounded-full bg-blue-500/15 flex items-center justify-center mx-auto mb-4"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                                    >
                                        <CheckCircle className="w-8 h-8 text-blue-400" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                                    <p className="text-slate-400">
                                        We've received your message and will get back to you shortly.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="h-full p-8 rounded-2xl bg-[#0d1425]/50 border border-blue-500/10 flex flex-col gap-6">
                                {/* Honeypot — hidden from real users, bots auto-fill it */}
                                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
                                    <label htmlFor="website">Website</label>
                                    <input
                                        id="website"
                                        name="website"
                                        type="text"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4 flex-shrink-0">
                                    <div>
                                        <label className="text-sm text-slate-400 mb-2 block font-medium">Name</label>
                                        <Input
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 transition-all duration-300 h-12"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-400 mb-2 block font-medium">Email</label>
                                        <Input
                                            type="email"
                                            placeholder="you@company.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 transition-all duration-300 h-12"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <label className="text-sm text-slate-400 mb-2 block font-medium">Company</label>
                                    <Input
                                        placeholder="Your company name"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 transition-all duration-300 h-12"
                                    />
                                </div>
                                <div className="flex-grow flex flex-col min-h-[160px]">
                                    <label className="text-sm text-slate-400 mb-2 block font-medium">Message</label>
                                    <Textarea
                                        placeholder="Tell us about your project and how we can help..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="flex-grow bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 transition-all duration-300 resize-none p-4"
                                        required
                                    />
                                </div>
                                {TURNSTILE_SITE_KEY && (
                                    <div ref={turnstileRef} className="flex-shrink-0 min-h-[65px]" />
                                )}
                                {error && (
                                    <motion.p
                                        className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 flex-shrink-0"
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {error}
                                    </motion.p>
                                )}
                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="flex-shrink-0">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-6 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all text-base font-semibold"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Send Message
                                                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
