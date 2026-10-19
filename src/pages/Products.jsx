import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, BarChart3, Server, Database, Users, BrainCircuit, ShieldCheck, Briefcase } from 'lucide-react';
import { contactUrl } from '@/utils';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import { fadeUp, staggerContainer, staggerItem } from '@/hooks/useFluidReveal';
import SEOHead from '../components/SEOHead';

// Lazy iframe: only loads when scrolled into view
function LazyIframe({ src, title }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '200px' });
    const [loaded, setLoaded] = useState(false);

    return (
        <div ref={ref} className="aspect-[16/10] w-full bg-slate-900 overflow-hidden relative">
            {isInView && (
                <iframe
                    src={src}
                    title={title}
                    loading="lazy"
                    className="w-full h-full scale-[0.4] origin-top-left"
                    style={{ border: 'none', width: '250%', height: '250%', opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
                    onLoad={() => setLoaded(true)}
                />
            )}
            {(!isInView || !loaded) && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}

const products = [
    {
        id: 'agentic-aiva',
        name: 'Agentic AI Assistants',
        tagline: 'Assistants that carry out multi-step work',
        description: 'Assistants that take a request and work through the steps across your internal systems, such as AIVA, our HR assistant, with optional two-way voice. Each agent is scoped to the systems and permissions you approve.',
        status: 'In Development',
        url: null,
        icon: Users,
        hasPreview: false
    },
    {
        id: 'operational-intelligence',
        name: 'Operational Intelligence',
        tagline: 'Plain-language reporting on operational data',
        description: 'Reads your operational data and writes up what changed: summaries, trends, flagged exceptions and suggested next steps, so program and operations leaders can act without building a report by hand.',
        status: 'In Development',
        url: null,
        icon: BarChart3,
        hasPreview: false
    },
    {
        id: 'custom-rag',
        name: 'Custom RAG Systems',
        tagline: 'Cited answers from your documents',
        description: 'Retrieval-augmented generation (RAG) over your own documents and records. Answers cite the passages they came from so reviewers can check them. Deployed in the environment you choose.',
        status: 'In Development',
        url: null,
        icon: Database,
        hasPreview: false
    }
];

export default function Products() {
    return (
        <div className="min-h-screen bg-[#060a14] overflow-hidden">
            <SEOHead
                title="AI Products"
                description="Agentic AI Assistants, Operational Intelligence and Custom RAG Systems, deployed in your cloud tenant, GovCloud, on premises or managed."
                path="/Products"
            />
            <Navbar showNav={true} />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-blue-500/5" />
                    <motion.div 
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/12 rounded-full blur-3xl"
                        animate={{ 
                            x: [0, 50, 0],
                            y: [0, 30, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div 
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                        animate={{ 
                            x: [0, -40, 0],
                            y: [0, -50, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div 
                        className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-400/6 rounded-full blur-3xl"
                        animate={{ 
                            x: [0, 60, 0],
                            y: [0, -30, 0],
                        }}
                        transition={{ 
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                    >
                        <motion.h1 
                            className="text-4xl md:text-6xl font-bold text-white mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            Three products,
                            <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent"> deployed where you choose</span>
                        </motion.h1>
                        <motion.p 
                            className="text-xl text-slate-300 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            Each one is built on your data and configured for your workflows. Deploy it in your cloud tenant,
                            in AWS GovCloud or Azure Government, on premises, or in a managed environment we operate.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-20 px-4 relative">
                {/* Floating background elements */}
                <motion.div 
                    className="absolute top-20 left-10 w-32 h-32 bg-blue-500/8 rounded-full blur-2xl"
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                    className="absolute bottom-40 right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"
                    animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div 
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                id={product.id}
                                variants={staggerItem}
                                whileHover={{ 
                                    y: -12,
                                    transition: { type: "spring", stiffness: 300, damping: 20 }
                                }}
                                className="group scroll-mt-40"
                            >
                                {/* Product Card */}
                                <div className="relative bg-gradient-to-b from-[#0d1425]/80 to-[#080e1c]/80 rounded-xl border border-blue-500/10 overflow-hidden h-full flex flex-col transition-all duration-500 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10">
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    {/* Product Preview or Icon */}
                                    {product.hasPreview && product.url ? (
                                        <div className="relative">
                                            <LazyIframe src={product.url} title={product.name} />
                                            {/* Overlay to prevent interaction */}
                                            <div 
                                                className="absolute inset-0 cursor-pointer"
                                                onClick={() => window.open(product.url, '_blank', 'noopener,noreferrer')}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 text-xs shadow-lg">
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        View Live Demo
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-32 sm:h-auto sm:aspect-[16/10] w-full bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-10">
                                                <div className="absolute inset-0" style={{
                                                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                                                    backgroundSize: '24px 24px'
                                                }} />
                                            </div>
                                            <div className="relative">
                                                <motion.div
                                                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/15 flex items-center justify-center group-hover:border-blue-400/30 transition-all duration-500"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    <product.icon className="w-12 h-12 text-slate-500 group-hover:text-blue-400 transition-colors duration-500" />
                                                </motion.div>
                                                <div className="absolute inset-0 bg-blue-500/15 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Details */}
                                    <div className="relative p-5 flex-1 flex flex-col">
                                        {/* Status Badge */}
                                        <div className="mb-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1.5 ${
                                                product.status === 'Live' 
                                                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400'
                                                    : product.status === 'Preview Release'
                                                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400'
                                                    : product.status === 'In Development'
                                                    ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 text-blue-400'
                                                    : 'bg-slate-800/80 border border-slate-600/50 text-slate-400'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    product.status === 'Live' ? 'bg-green-400 animate-pulse' 
                                                    : product.status === 'Preview Release' ? 'bg-purple-400 animate-pulse'
                                                    : product.status === 'In Development' ? 'bg-blue-400 animate-pulse' 
                                                    : 'bg-slate-500'
                                                }`} />
                                                {product.status}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors duration-300">{product.name}</h3>
                                        <p className="text-blue-400/70 text-xs font-medium mb-2">{product.tagline}</p>
                                        <p className="text-slate-400 text-xs mb-4 flex-1 leading-relaxed">{product.description}</p>

                                        {/* CTA Buttons */}
                                        <div className="flex gap-2">
                                            {product.url ? (
                                                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                                    <Button
                                                        onClick={() => window.open(product.url, '_blank', 'noopener,noreferrer')}
                                                        size="sm"
                                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 text-xs h-9"
                                                    >
                                                        Visit Product
                                                        <ExternalLink className="ml-1.5 w-3.5 h-3.5" />
                                                    </Button>
                                                </motion.div>
                                            ) : (
                                                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 text-xs h-9"
                                                    >
                                                        <Link to={contactUrl(`${product.name} Demo`)}>
                                                            Request a demo
                                                            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                                                        </Link>
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Functions Section */}
            <section className="py-20 px-4 relative z-10 border-y border-blue-500/10 bg-[#060a14]">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        className="text-center mb-16"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Built for these functions
                        </h2>
                        <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                            We configure each product for the records, rules and approvals of the team that uses it.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                        {[
                            { name: 'Human Resources', icon: Users },
                            { name: 'Tech & Engineering', icon: BrainCircuit },
                            { name: 'Finance', icon: BarChart3 },
                            { name: 'Procurement', icon: Briefcase },
                            { name: 'Government', icon: ShieldCheck },
                            { name: 'Program Management', icon: Server }
                        ].map((industry, i) => (
                            <motion.div 
                                key={industry.name}
                                className="p-6 rounded-xl bg-slate-900/50 border border-blue-500/10 hover:border-blue-500/30 transition-colors flex flex-col items-center justify-center gap-3"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <industry.icon className="w-8 h-8 text-blue-400" />
                                <span className="text-slate-300 text-sm font-medium">{industry.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Coming Soon Section */}
            <section className="py-20 px-4 bg-[#080e1c]/60 relative overflow-hidden">
                {/* Animated gradient line */}
                <motion.div 
                    className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
                    animate={{ 
                        backgroundPosition: ['200% 0', '-200% 0'],
                    }}
                    transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ backgroundSize: '200% 100%' }}
                />
                
                <motion.div 
                    className="max-w-4xl mx-auto text-center"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    custom={0}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Need something specific?
                    </h2>
                    <p className="text-slate-300 text-lg mb-8">
                        Tell us what you are building and we will scope it with you.
                    </p>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                        <Button
                            asChild
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-shadow"
                        >
                            <Link to={contactUrl('Product Inquiry')}>
                                Tell us what you need
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </motion.div>
                    <p className="mt-4 text-sm text-slate-400">
                        Or email us at{' '}
                        <a href="mailto:sales@catalystappliedai.com?subject=Product%20Inquiry" className="text-blue-300 hover:text-blue-200 underline underline-offset-4">
                            sales@catalystappliedai.com
                        </a>
                    </p>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
