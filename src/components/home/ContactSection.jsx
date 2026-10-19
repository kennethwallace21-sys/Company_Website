import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle } from 'lucide-react';
import { fadeUp, fadeLeft, fadeRight } from '@/hooks/useFluidReveal';
import { submitLead } from '@/lib/submitLead';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

const MAX_TOPIC = 80;
const TURNSTILE_LOAD_TIMEOUT_MS = 8000;
const TURNSTILE_SCRIPT_ID = 'cf-turnstile-api';
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SALES_EMAIL = 'sales@catalystappliedai.com';

const topicMessage = (topic) => (topic ? `I'm interested in: ${topic}\n\n` : '');

// Renders the server message as plain text. When the message already names the sales
// address, that address becomes the mailto link; otherwise a link is appended.
function ErrorMessage({ error }) {
    const link = (
        <a href={`mailto:${SALES_EMAIL}`} className="underline underline-offset-2 hover:text-red-300">
            {SALES_EMAIL}
        </a>
    );
    if (!error.showEmailFallback) return <>{error.message}</>;

    const idx = error.message.indexOf(SALES_EMAIL);
    if (idx === -1) return <>{error.message} {link}</>;
    return (
        <>
            {error.message.slice(0, idx)}
            {link}
            {error.message.slice(idx + SALES_EMAIL.length)}
        </>
    );
}

export default function ContactSection() {
    const [searchParams] = useSearchParams();
    const topic = (searchParams.get('topic') || '').trim().slice(0, MAX_TOPIC);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: topicMessage(topic),
        website: '', // Honeypot field: bots fill this, humans don't see it
    });
    const [messageTouched, setMessageTouched] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [turnstileToken, setTurnstileToken] = useState(null);
    const [turnstileFailed, setTurnstileFailed] = useState(false);
    const turnstileRef = useRef(null);
    const widgetIdRef = useRef(null);
    const successHeadingRef = useRef(null);

    // App routes are keyed by pathname only, so a changed ?topic= does not remount this
    // component. Re-sync the prefilled message unless the visitor has started typing.
    useEffect(() => {
        if (messageTouched) return;
        setFormData((prev) => (prev.message === topicMessage(topic) ? prev : { ...prev, message: topicMessage(topic) }));
    }, [topic, messageTouched]);

    // Move focus to the confirmation heading so keyboard and screen reader users land on it.
    useEffect(() => {
        if (isSubmitted) successHeadingRef.current?.focus();
    }, [isSubmitted]);

    useEffect(() => {
        if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return undefined;

        // Load the Turnstile API only when a site key is configured (and only once).
        if (!document.getElementById(TURNSTILE_SCRIPT_ID) && !window.turnstile) {
            const script = document.createElement('script');
            script.id = TURNSTILE_SCRIPT_ID;
            script.src = TURNSTILE_SCRIPT_SRC;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }

        let interval = null;
        let timeout = null;
        const stopWaiting = () => {
            window.clearInterval(interval);
            window.clearTimeout(timeout);
        };

        interval = window.setInterval(() => {
            if (window.turnstile && turnstileRef.current && widgetIdRef.current === null) {
                stopWaiting();
                widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
                    sitekey: TURNSTILE_SITE_KEY,
                    theme: 'dark',
                    callback: (token) => {
                        stopWaiting();
                        setTurnstileToken(token);
                    },
                    'expired-callback': () => setTurnstileToken(null),
                    'error-callback': () => {
                        setTurnstileToken(null);
                        setTurnstileFailed(true);
                    },
                });
            }
        }, 200);

        // If the Turnstile script never appears (blocked, offline), stop waiting and
        // tell the visitor how else to reach us.
        timeout = window.setTimeout(() => {
            window.clearInterval(interval);
            if (!window.turnstile) {
                setTurnstileFailed(true);
            }
        }, TURNSTILE_LOAD_TIMEOUT_MS);

        return stopWaiting;
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // If the widget could not load, let the Worker decide: it enforces Turnstile
        // whenever its secret is set and answers 403 with a clear message.
        if (TURNSTILE_SITE_KEY && !turnstileToken && !turnstileFailed) {
            setError({ message: 'Please complete the verification check.' });
            return;
        }

        setIsLoading(true);
        try {
            const { ok, message, showEmailFallback } = await submitLead({
                ...formData,
                'cf-turnstile-response': turnstileToken,
                turnstileEnabled: Boolean(TURNSTILE_SITE_KEY),
            });
            if (ok !== true) {
                setError({
                    message: message || 'Something went wrong. Please try again or email us directly.',
                    showEmailFallback: showEmailFallback === true,
                });
                if (window.turnstile && widgetIdRef.current !== null) {
                    window.turnstile.reset(widgetIdRef.current);
                    setTurnstileToken(null);
                }
                return;
            }
            setIsSubmitted(true);
            setFormData({ name: '', email: '', company: '', message: '', website: '' });
            setMessageTouched(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="pt-36 pb-24 px-4 bg-[#060a14] relative overflow-hidden">
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
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Contact us
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Tell us what you are working on and where AI could help, and we will get back to you.
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
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Email or call</h2>
                        <p className="text-slate-300 mb-6">
                            If you would rather not use the form, reach us directly.
                        </p>
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-sm text-slate-400">Email</dt>
                                <dd>
                                    <a href={`mailto:${SALES_EMAIL}`} className="text-white font-medium underline underline-offset-4 hover:text-blue-400 transition-colors">
                                        {SALES_EMAIL}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm text-slate-400">Phone</dt>
                                <dd>
                                    <a href="tel:+15024168342" className="text-white font-medium underline underline-offset-4 hover:text-blue-400 transition-colors">
                                        +1-502-416-8342
                                    </a>
                                </dd>
                            </div>
                        </dl>
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
                                role="status"
                                aria-live="polite"
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
                                    <h3
                                        ref={successHeadingRef}
                                        tabIndex={-1}
                                        className="text-xl font-bold text-white mb-2 outline-none"
                                    >
                                        Message sent
                                    </h3>
                                    <p className="text-slate-400">
                                        We received your message and will reply by email.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <form id="contact-form" onSubmit={handleSubmit} className="scroll-mt-32 h-full p-8 rounded-2xl bg-[#0d1425]/50 border border-blue-500/10 flex flex-col gap-6">
                                {/* Honeypot: hidden from real users, bots auto-fill it. The field name avoids
                                    browser autofill; the value is still sent under the JSON key "website". */}
                                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
                                    <label htmlFor="company_website_url">Leave this field empty</label>
                                    <input
                                        id="company_website_url"
                                        name="company_website_url"
                                        type="text"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        required={false}
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4 flex-shrink-0">
                                    <div>
                                        <label htmlFor="contact-name" className="text-sm text-slate-400 mb-2 block font-medium">Name</label>
                                        <Input
                                            id="contact-name"
                                            name="name"
                                            autoComplete="name"
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 transition-all duration-300 h-12"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="text-sm text-slate-400 mb-2 block font-medium">Email</label>
                                        <Input
                                            id="contact-email"
                                            name="email"
                                            autoComplete="email"
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
                                    <label htmlFor="contact-company" className="text-sm text-slate-400 mb-2 block font-medium">Company</label>
                                    <Input
                                        id="contact-company"
                                        name="company"
                                        autoComplete="organization"
                                        placeholder="Your company name"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 transition-all duration-300 h-12"
                                    />
                                </div>
                                <div className="flex-grow flex flex-col min-h-[160px]">
                                    <label htmlFor="contact-message" className="text-sm text-slate-400 mb-2 block font-medium">Message</label>
                                    <Textarea
                                        id="contact-message"
                                        name="message"
                                        placeholder="What do you need to build, what data is involved, and where must it run (your cloud tenant, GovCloud, on premises, air-gapped)?"
                                        value={formData.message}
                                        onChange={(e) => {
                                            setMessageTouched(true);
                                            setFormData({ ...formData, message: e.target.value });
                                        }}
                                        className="flex-grow bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 transition-all duration-300 resize-none p-4"
                                        required
                                    />
                                </div>
                                {TURNSTILE_SITE_KEY && (
                                    <div ref={turnstileRef} className="flex-shrink-0 min-h-[65px]" />
                                )}
                                {TURNSTILE_SITE_KEY && turnstileFailed && (
                                    <p
                                        role="status"
                                        className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 flex-shrink-0"
                                    >
                                        Verification could not load. Email us at{' '}
                                        <a
                                            href={`mailto:${SALES_EMAIL}`}
                                            className="underline underline-offset-2 hover:text-amber-200"
                                        >
                                            {SALES_EMAIL}
                                        </a>
                                    </p>
                                )}
                                {error && (
                                    <motion.p
                                        role="alert"
                                        className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 flex-shrink-0"
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <ErrorMessage error={error} />
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
                                                Send message
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
