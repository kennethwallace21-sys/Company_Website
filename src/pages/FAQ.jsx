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
                question: "What services do you offer?",
                answer: "We offer AI Discovery & Diagnostic, Custom AI Solutions, Workflow Automation, Data Engineering, AI Tools Implementation, and Training & Enablement services."
            },
            {
                question: "What makes Catalyst Applied AI different?",
                answer: "We focus on practical, ROI-driven AI solutions rather than hype. Our team has hands-on experience implementing AI at scale, and we prioritize your specific business outcomes."
            },
            {
                question: "Do you work with small businesses?",
                answer: "Yes! We work with businesses of all sizes, from startups to large enterprises. Our solutions are tailored to fit your specific needs, budget, and scale."
            },
            {
                question: "Where are you located?",
                answer: "We are based in Kentucky, USA, but we work with clients globally. Our team is equipped to work remotely or on-site depending on the project scope."
            }
        ]
    },
    {
        category: "Process & Timeline",
        items: [
            {
                question: "How do you determine which AI solutions are best for my business?",
                answer: "We begin with our proprietary Discovery & Diagnostic process. We analyze your existing workflows, identify manual bottlenecks, and assess your data readiness before recommending a clear ROI-centered roadmap."
            },
            {
                question: "How long does a typical project take?",
                answer: "Timeline varies by scope. Discovery projects typically take a few weeks, while full custom AI integrations can range over several months depending on complexity."
            },
            {
                question: "What if AI isn't the right fit for our use case?",
                answer: "We assessment feasibility first. If AI isn't the right solution for your specific problem, we'll tell you honestly and suggest alternative optimizations."
            },
            {
                question: "How do you measure project success?",
                answer: "We define clear KPIs upfront—such as time saved, accuracy improvements, or revenue impact. We track these metrics throughout the engagement to ensure value delivery."
            }
        ]
    },
    {
        category: "Security & Integration",
        items: [
            {
                question: "Is my company data secure with you?",
                answer: "Security is our top priority. We sign NDAs, follow industry best practices, and implement enterprise-grade security. We ensure your data remains your property and is handled with strict confidentiality."
            },
            {
                question: "Can you integrate AI with our existing systems?",
                answer: "Yes! We specialize in integrating AI with your existing tech stack, including CRMs (like Salesforce or HubSpot), ERPs, and common business tools, ensuring seamless adoption."
            },
            {
                question: "Is our data used to train public AI models?",
                answer: "No. We implement private instances and architectures like RAG. Your company data is never used to train or inform external, public AI models."
            }
        ]
    },
    {
        category: "Pricing & Support",
        items: [
            {
                question: "What is your pricing model?",
                answer: "We offer flexible models including project-based, retainer, and hourly. We recommend the best approach based on your specific requirements during the initial consultation."
            },
            {
                question: "Do you offer ongoing support?",
                answer: "Absolutely. We provide long-term partnerships through maintenance and optimization packages to help you scale and refine your AI solutions over time."
            },
            {
                question: "Do you provide training for our team?",
                answer: "Yes. Our Training & Enablement service includes workshops, hands-on labs, and coaching to ensure your team effectively uses and leads with your new AI tools."
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
