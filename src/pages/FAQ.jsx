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
import { SHOW_SERVICES } from '@/config/features';

const allFaqs = [
    {
        category: "General",
        items: [
            {
                question: "What exactly does Catalyst Applied AI do?",
                answer: "We build production AI systems and deploy them inside your environment. That includes automating a tedious document review process, extracting intelligence from internal records, and building custom platforms that manage your company's internal knowledge."
            },
            {
                question: "What makes you different from a generic software agency?",
                answer: "We focus on Applied AI. Unlike general agencies, we understand the specific nuances of 'grounded' AI: reducing hallucinations by constraining answers to retrieved sources, keeping your data in an environment you control, and tying every tool we build to a measurable Return on Investment (ROI) target."
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
                answer: "It's a short scoping engagement. We look at your current manual workflows, find where humans are slowed down by repetitive data tasks, and hand you a concrete build plan for the AI features that will pay off first."
            },
            {
                question: "How do your Custom AI Solutions work?",
                answer: "We build bespoke tools from the ground up tailored to your specific business logic. This isn't just a basic wrapper around ChatGPT; it's a secure, integrated system that understands your unique documents and decision-making processes."
            },
            {
                question: "What does Workflow Automation involve?",
                answer: "We deploy AI agents that can handle end-to-end tasks like triaging emails, summarizing legal documents, or extracting data from invoices. This frees your human team to focus on high-value, creative work."
            }
        ]
    },
    {
        category: "Products",
        items: [
            {
                question: "What are your Agentic AI Assistants?",
                answer: "Custom autonomous agents (like AIVA for HR) featuring duplex voice capabilities. We build agents that execute multi-step workflows, manage complex tasks, and coordinate with internal systems to reduce repetitive operational overhead."
            },
            {
                question: "What is Signals & Intelligence?",
                answer: "An operational intelligence system that turns raw enterprise data into actionable narratives, predictive insights, and automated recommendations for executive decision-making."
            },
            {
                question: "What are Custom RAG Systems?",
                answer: "Tailor-made Retrieval-Augmented Generation systems that connect securely to your proprietary documents. Your team gets grounded answers with citations to your source documents, which reduces but does not eliminate incorrect output."
            }
        ]
    },
    {
        category: "Security & Deployment",
        items: [
            {
                question: "Can you deploy in AWS GovCloud, on-premise, or air-gapped environments?",
                answer: "Yes. We support three deployment models: managed secure cloud, client cloud tenant (including AWS GovCloud and Azure Government), and air-gapped on-premises hardware (such as NVIDIA NIM/DGX). In client-tenant and on-premises deployments, your proprietary data stays in the environment you operate. In the managed option, your data is processed in infrastructure that Catalyst operates under your contract terms; in the other two it stays in the environment you operate."
            },
            {
                question: "What government registrations and compliance standards do you meet?",
                answer: "Catalyst is an NVIDIA Inception Program member. We deploy into environments our customers control, including customer-owned AWS GovCloud (US) and Azure Government tenants and on-premises or air-gapped hardware, so the system boundary and its authorization remain with your organization. Tell us which framework applies (for example NIST SP 800-53 or SP 800-171) and we will map controls during scoping."
            },
            {
                question: "Is my data used to train public models like ChatGPT?",
                answer: "Customer data is not used to train public foundation models. In customer-tenant and on-premises deployments your data stays in the environment you operate; in a managed deployment it is processed in infrastructure under your contract terms, and nothing is shared with third-party model providers without your written approval."
            },
            {
                question: "How do you reduce AI hallucinations?",
                answer: "We use grounded AI architectures with retrieval verification. Answers are constrained to excerpts from your indexed internal records and carry citations so reviewers can check them against the source. Guardrails reduce incorrect output but cannot eliminate it, so we recommend human review for consequential decisions."
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

    // Open state is keyed by category + question text so it survives search filtering.
    const faqKey = (category, question) => `${category}::${question}`;

    const toggleFaq = (category, question) => {
        const key = faqKey(category, question);
        setOpenIndices(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const filteredFaqs = allFaqs.filter(cat => SHOW_SERVICES || cat.category !== 'Services').map(cat => ({
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
                            {filteredFaqs.map((category) => (
                                <motion.div
                                    key={category.category}
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-40px' }}
                                >
                                    <h2 className="text-xl font-bold text-blue-400 mb-8 border-l-4 border-blue-500 pl-4 uppercase tracking-widest">
                                        {category.category}
                                    </h2>
                                    <div className="space-y-4">
                                        {category.items.map((item) => {
                                            const isOpen = openIndices[faqKey(category.category, item.question)];
                                            return (
                                                <motion.div
                                                    key={item.question}
                                                    variants={staggerItem}
                                                    className={`rounded-2xl border transition-all duration-300 ${
                                                        isOpen 
                                                            ? 'bg-[#0d1425]/80 border-blue-500/30' 
                                                            : 'bg-[#0d1425]/40 border-blue-500/10 hover:border-blue-500/20'
                                                    }`}
                                                >
                                                    <button
                                                        onClick={() => toggleFaq(category.category, item.question)}
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
