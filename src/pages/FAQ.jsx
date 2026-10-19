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
                question: "What does Catalyst Applied AI do?",
                answer: "We build three kinds of AI systems for enterprise and public sector organizations: assistants that carry out multi-step work (Agentic AI Assistants), plain-language reporting on operational data (Operational Intelligence), and answers from your own documents with citations (Custom RAG Systems). We can deploy them in your cloud tenant, in AWS GovCloud or Azure Government, on premises, or in a managed environment we operate."
            },
            {
                question: "How does an engagement start?",
                answer: "With a short scoping step. You tell us the use case, the data involved and where the system has to run, and we return a written build plan with scope, timeline and cost. Pricing is set per engagement from that plan."
            },
            {
                question: "How is this different from a general software firm?",
                answer: "We build AI systems only, and we build them to run in the environment you choose. Answers are grounded in your own documents and carry citations, and each build is tied to a measurable goal agreed during scoping."
            },
            {
                question: "Who is Catalyst Applied AI?",
                answer: "Catalyst Applied AI, LLC is based in Louisville, Kentucky, and is a member of the NVIDIA Inception program for startups. We do not list customers or case studies on this site. Contact us to discuss what is possible."
            },
            {
                question: "Do you work with small businesses?",
                answer: "Yes. Our products are designed for enterprise and public sector teams, and we also take on smaller, well-defined projects for growing businesses."
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
        category: "Security & Deployment",
        items: [
            {
                question: "Can you deploy in AWS GovCloud, on-premise, or air-gapped environments?",
                answer: "Yes. We support three deployment models: your own cloud tenant (including AWS GovCloud and Azure Government), on-premises or air-gapped hardware (such as NVIDIA NIM/DGX), and a managed secure cloud that Catalyst operates. In your tenant or on premises, your proprietary data stays in the environment you operate. In the managed option, your data is processed in infrastructure that Catalyst operates under your contract terms."
            },
            {
                question: "Do you hold FedRAMP, CMMC, SOC 2 or other certifications?",
                answer: "This site does not claim any certification or authorization. We deploy into environments your organization controls, such as your own AWS GovCloud (US) or Azure Government tenant or on-premises and air-gapped hardware, so the system boundary and its authorization stay with you. Tell us which framework applies (for example NIST SP 800-53 or SP 800-171) and we will map controls to it during scoping."
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
    },
    {
        category: "Products",
        items: [
            {
                question: "What are your Agentic AI Assistants?",
                answer: "Assistants that take a request and work through the steps across your internal systems, such as AIVA, our HR assistant, with optional two-way voice. Each agent is scoped to the systems and permissions you approve."
            },
            {
                question: "What is Operational Intelligence?",
                answer: "Plain-language reporting on your operational data. It reads the records you connect and writes up what changed: summaries, trends, flagged exceptions and suggested next steps for program and operations leaders."
            },
            {
                question: "What are Custom RAG Systems?",
                answer: "Retrieval-augmented generation over your own documents and records. Your team gets answers that cite the passages they came from, which reduces but does not eliminate incorrect output."
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
                description="Answers on deployment models, data handling, certifications, pricing and the three Catalyst Applied AI products."
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
                        FAQ
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Frequently asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">questions</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                        Where our systems run, how your data is handled, what we do and do not claim, and how an engagement starts.
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
                                Send us your question or describe the system you need, and a person on our team will reply.
                            </p>
                            <Link to={createPageUrl('Contact')}>
                                <Button className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-6 rounded-2xl text-lg font-bold group">
                                    Contact us
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
