import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { fadeUp, staggerContainer, staggerItem } from '@/hooks/useFluidReveal';

const faqs = [
    {
        question: "How do you determine which AI solutions are best for my business?",
        answer: "We start with a short Discovery & Diagnostic scoping engagement. We map your existing workflows, find the manual bottlenecks, and assess your data readiness, then hand you a build plan with a clear, measurable ROI forecast."
    },
    {
        question: "How long does it typically take to see results?",
        answer: "While full custom deployments can take 2-4 months, most of our clients see initial 'quick win' results from workflow automations within the first 30 days of implementation."
    },
    {
        question: "Do you integrate with our existing software stack?",
        answer: "Yes. We specialize in building 'applied' AI, which means our tools are designed to live inside your existing CRMs (like Salesforce or HubSpot), ERPs, and project management tools rather than requiring you to learn a new platform."
    },
    {
        question: "Is our company data used to train public AI models?",
        answer: "No. We implement private, secure instances and RAG (Retrieval-Augmented Generation) architectures. Your intellectual property and company data remain entirely within your secure environment and are never used to train external models."
    },
    {
        question: "Do we need an in-house data science team to work with you?",
        answer: "No. That's the point of working with us: we build and deploy the AI systems, so you don't need an in-house AI team to get value from them. We stay involved from the build through long-term support."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-24 px-4 bg-[#0d1425]/20">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="text-center mb-16"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Common Questions
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Expertise Explained</h2>
                    <p className="text-slate-400 text-lg">Everything you need to know about working with Catalyst Applied AI.</p>
                </motion.div>

                <motion.div
                    className="space-y-4"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                >
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            variants={staggerItem}
                            className={`rounded-2xl border transition-all duration-300 ${
                                openIndex === index 
                                    ? 'bg-[#0d1425]/80 border-blue-500/30' 
                                    : 'bg-[#0d1425]/40 border-blue-500/10 hover:border-blue-500/20'
                            }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                className="w-full px-6 py-6 flex items-center justify-between text-left group"
                            >
                                <span className={`text-lg font-semibold transition-colors ${openIndex === index ? 'text-blue-400' : 'text-white group-hover:text-blue-300'}`}>
                                    {faq.question}
                                </span>
                                <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                                    openIndex === index ? 'bg-blue-600 border-blue-500 rotate-0' : 'border-slate-700 rotate-90'
                                }`}>
                                    {openIndex === index ? (
                                        <Minus className="w-4 h-4 text-white" />
                                    ) : (
                                        <Plus className="w-4 h-4 text-slate-400" />
                                    )}
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
