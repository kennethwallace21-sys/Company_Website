import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, Search, MessageCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import { fadeUp, staggerContainer, staggerItem } from '@/hooks/useFluidReveal';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";

const allFaqs = [
    {
        category: "General",
        items: [
            {
                question: "What exactly does Catalyst Applied AI do?",
                answer: "We are a practical AI partner. We help businesses cut through the hype to find, design, and build AI tools that actually solve problems—whether that's automating a tedious document review process or building a custom platform to manage your company's internal knowledge."
            },
            {
                question: "What makes you different from a generic software agency?",
                answer: "We focus exclusively on Applied AI. Unlike general agencies, we understand the specific nuances of 'grounded' AI—ensuring your models don't hallucinate, your data stays private, and every tool we build has a measurable Return on Investment (ROI)."
            },
            {
                question: "Do you work with small businesses?",
                answer: "Yes. While we work with larger enterprises, we also help growing businesses implement AI 'starter' projects that provide immediate value without requiring a multi-million dollar budget."
            }
        ]
    },
    {
        category: "Services",
        items: [
            {
                question: "What is the 'Discovery & Diagnostic' service?",
                answer: "It is our high-impact audit. We look at your current manual workflows, identify where humans are slowed down by repetitive data tasks, and give you a prioritized roadmap of which AI features will give you the most 'bang for your buck' first."
            },
            {
                question: "How do your Custom AI Solutions work?",
                answer: "We build bespoke tools from the ground up tailored to your specific business logic. This isn't just a basic wrapper around ChatGPT; it's a secure, integrated system that understands your unique documents and decision-making processes."
            },
            {
                question: "What does Workflow Automation involve?",
                answer: "We deploy AI agents that can handle end-to-end tasks like triaging emails, summarizing legal documents, or extracting data from invoices. This frees your human team to focus on high-value, creative work."
            },
            {
                question: "What is Enterprise Model Deployment?",
                answer: "We fine-tune, host, and manage custom LLMs on your own infrastructure — on-prem, hybrid, or cloud. Using our CAAi Trust Layer, we ensure every model is governed with safety guardrails, compliance controls, and full MLOps (monitoring, versioning, scaling). Think of it as having your own private AI model, fully managed by us."
            },
            {
                question: "What is Voice & Conversational AI?",
                answer: "We build and deploy AI-powered voice agents that handle real phone calls — inbound and outbound. Whether you need to replace a legacy IVR, automate appointment scheduling, or stand up a 24/7 multilingual support line, we deliver natural-sounding voice AI integrated with your CRM, calendar, and ticketing systems."
            },
            {
                question: "What kinds of calls can a voice agent handle?",
                answer: "Our voice agents handle a wide range: tier-1 support (order tracking, password resets, billing), appointment booking and reminders, FAQ resolution, outbound campaigns (surveys, payment follow-ups, lead qualification), and internal helpdesk queries like IT tickets and PTO balances."
            },
            {
                question: "Can I use Enterprise Model Deployment with my own data?",
                answer: "Yes — that's the entire point. We fine-tune open-source LLMs on your proprietary documents and workflows so the model understands your domain. Your data never leaves your environment, and you retain full ownership and control."
            }
        ]
    },
    {
        category: "Products",
        items: [
            {
                question: "What is the CAAi Command Center?",
                answer: "It is a unified dashboard for the enterprise. It allows you to monitor, manage, and orchestrate all your custom AI agents in one place, giving you visibility into their performance and the data they are processing."
            },
            {
                question: "What is CAAi CLERK?",
                answer: "CAAi CLERK (County Language Engine for Records and Knowledge) is our specialized product for government and large administrative offices. it helps triage FOIA requests, summarize public meetings, and review permit packets with high security."
            },
            {
                question: "What are Catalyst Custom Models?",
                answer: "These are fully managed AI deployments. We handle the infrastructure, the model tuning (using NVIDIA-powered technologies), and the security layers so you can have enterprise-grade AI that is grounded entirely in your company's own private data."
            }
        ]
    },
    {
        category: "Security & Trust",
        items: [
            {
                question: "Is my data secure?",
                answer: "Absolutely. We are NVIDIA Inception partners and follow enterprise-grade security standards. We use private cloud architectures and RAG (Retrieval-Augmented Generation) to ensure your data stays within your control and is never used to train public AI models."
            },
            {
                question: "How do you prevent AI from 'hallucinating' (making things up)?",
                answer: "We use our proprietary CAAi Trust Layer and Grounded AI techniques. By forcing the AI to reference only your specific verified documents, we ensure that every answer it provides is accurate and citeable."
            }
        ]
    }
];

export default function FAQ() {
    const [showNav, setShowNav] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndices, setOpenIndices] = useState({});

    useEffect(() => {
        const timer = setTimeout(() => setShowNav(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const toggleFaq = (category, index) => {
        const key = `${category}-${index}`;
        setOpenIndices(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const filteredFaqs = allFaqs.map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <div className="min-h-screen bg-[#060a14]">
            <SEOHead
                title="Frequently Asked Questions"
                description="Everything you need to know about working with Catalyst Applied AI. Find answers about our services, process, security, and more."
                path="/FAQ"
            />
            <Navbar showNav={showNav} />

            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
                <motion.div
                    className="relative z-10 max-w-4xl mx-auto px-4 text-center"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <HelpCircle className="w-4 h-4" />
                        Help Center
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Expertise <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">Explained</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                        Everything you need to know about navigating the AI landscape with Catalyst Applied AI.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your question here..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0d1425]/60 border border-blue-500/10 focus:border-blue-500/40 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Content */}
            <section className="py-12 px-4 pb-32">
                <div className="max-w-4xl mx-auto">
                    {filteredFaqs.length > 0 ? (
                        <div className="space-y-16">
                            {filteredFaqs.map((category, catIdx) => (
                                <motion.div
                                    key={catIdx}
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-40px' }}
                                >
                                    <h2 className="text-xl font-bold text-blue-400 mb-8 border-l-4 border-blue-500 pl-4 uppercase tracking-widest">
                                        {category.category}
                                    </h2>
                                    <div className="space-y-4">
                                        {category.items.map((item, idx) => {
                                            const isOpen = openIndices[`${catIdx}-${idx}`];
                                            return (
                                                <motion.div
                                                    key={idx}
                                                    variants={staggerItem}
                                                    className={`rounded-2xl border transition-all duration-300 ${
                                                        isOpen 
                                                            ? 'bg-[#0d1425]/80 border-blue-500/30' 
                                                            : 'bg-[#0d1425]/40 border-blue-500/10 hover:border-blue-500/20'
                                                    }`}
                                                >
                                                    <button
                                                        onClick={() => toggleFaq(catIdx, idx)}
                                                        className="w-full px-6 py-5 flex items-center justify-between text-left group"
                                                    >
                                                        <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>
                                                            {item.question}
                                                        </span>
                                                        <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                                                            isOpen ? 'bg-blue-600 border-blue-500 rotate-0' : 'border-slate-700 rotate-90'
                                                        }`}>
                                                            {isOpen ? (
                                                                <Minus className="w-4 h-4 text-white" />
                                                            ) : (
                                                                <Plus className="w-4 h-4 text-slate-400" />
                                                            )}
                                                        </div>
                                                    </button>
                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                                            >
                                                                <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                                                                    {item.answer}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[#0d1425]/40 rounded-3xl border border-dashed border-slate-700">
                            <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-white text-xl font-bold mb-2">No matching questions found</h3>
                            <p className="text-slate-500 mb-8">Try searching for something else or contact us directly.</p>
                            <Button className="bg-blue-600" onClick={() => setSearchQuery('')}>Clear Search</Button>
                        </div>
                    )}

                    {/* Final CTA */}
                    <motion.div
                        className="mt-32 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-700 text-center relative overflow-hidden"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Still have questions?</h2>
                            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                                Our team is ready to help you navigate the AI transformation process with confidence.
                            </p>
                            <Link to={createPageUrl('Contact')}>
                                <Button className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-6 rounded-2xl text-lg font-bold group">
                                    Get in Touch
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
