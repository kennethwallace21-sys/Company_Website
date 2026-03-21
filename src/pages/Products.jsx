import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, BarChart3, Building2, Server, Shield } from 'lucide-react';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import { fadeUp, staggerContainer, staggerItem } from '@/hooks/useFluidReveal';
import SEOHead from '../components/SEOHead';

// Lazy iframe — only loads when scrolled into view, with error fallback
function LazyIframe({ src, title, onError }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '200px' });
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!isInView) return;
        // Timeout fallback — if iframe hasn't loaded in 8s, mark as failed
        const timer = setTimeout(() => {
            if (!loaded) {
                setFailed(true);
                onError?.();
            }
        }, 8000);
        return () => clearTimeout(timer);
    }, [isInView, loaded]);

    if (failed) return null; // parent will show icon fallback

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
                    onError={() => { setFailed(true); onError?.(); }}
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

// Featured product — shown as a full-width hero card
const featuredProduct = {
    id: 'command-center',
    name: 'CAAi Command Center',
    tagline: 'AI-Powered Business Intelligence Platform',
    description: 'A comprehensive command center that brings all your AI tools, analytics, and workflows into one unified dashboard. Cross-store briefing, fast routing, and manager summaries — all powered by the CAAi Trust Layer.',
    status: 'In Development',
    url: 'https://commandcenter.catalystappliedai.com/',
    icon: BarChart3,
    hasPreview: true
};

// Remaining products — displayed in a 3-column grid
const products = [
    {
        id: 'scci',
        name: 'SCCI',
        tagline: 'Supply Chain Compliance Intelligence',
        description: 'AI-driven supply chain compliance platform that streamlines auditing, risk assessment, and regulatory adherence across your entire supply chain network.',
        status: 'Live',
        url: 'https://scci.catalystappliedai.com/login',
        icon: Shield,
        hasPreview: true
    },
    {
        id: 'custom-models',
        name: 'Catalyst Custom Models',
        tagline: 'Managed Enterprise AI Deployments',
        description: 'Grounded AI deployments built around your documents, workflows, and decision context with Nemotron 3 Nano, secure RAG, and CAAi Trust Layer.',
        status: 'Live',
        url: 'https://custom-models.catalystappliedai.com/',
        icon: Server,
        hasPreview: true
    },
    {
        id: 'caai-clerk',
        name: 'CAAi CLERK',
        tagline: 'County Language Engine for Records and Knowledge',
        description: 'Government document workflows with secure RAG and trust-layer controls. Helps county offices triage FOIA requests, summarize meetings, and review permit packets.',
        status: 'Preview Release',
        url: 'https://gov-products.catalystappliedai.com/',
        icon: Building2,
        hasPreview: true
    }
];

// Shared product card component
function ProductCard({ product, featured = false }) {
    const [iframeFailed, setIframeFailed] = useState(false);
    const showPreview = product.hasPreview && product.url && !iframeFailed;

    return (
        <motion.div
            variants={staggerItem}
            whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            className="group"
        >
            <div className={`relative bg-gradient-to-b from-[#0d1425]/80 to-[#080e1c]/80 rounded-xl border border-blue-500/10 overflow-hidden h-full flex flex-col transition-all duration-500 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 ${featured ? 'md:flex-row' : ''}`}>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Product Preview or Icon */}
                {showPreview ? (
                    <div className={`relative ${featured ? 'md:w-3/5' : ''}`}>
                        <LazyIframe src={product.url} title={product.name} onError={() => setIframeFailed(true)} />
                        {/* Overlay to prevent interaction */}
                        <div 
                            className="absolute inset-0 cursor-pointer"
                            onClick={() => window.open(product.url, '_blank')}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 text-sm shadow-lg">
                                    <ExternalLink className="w-4 h-4" />
                                    View Live Demo
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`${featured ? 'aspect-[16/8]' : 'aspect-[16/10]'} w-full bg-gradient-to-br from-slate-800/60 via-[#0c1222] to-slate-900/60 flex items-center justify-center relative overflow-hidden ${featured ? 'md:w-3/5' : ''}`}>
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                                backgroundSize: '24px 24px'
                            }} />
                        </div>
                        {/* Animated accent rings */}
                        <motion.div
                            className={`absolute ${featured ? 'w-64 h-64' : 'w-40 h-40'} rounded-full border border-blue-500/10`}
                            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.15, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className={`absolute ${featured ? 'w-44 h-44' : 'w-28 h-28'} rounded-full border border-blue-400/8`}
                            animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.3, 0.2] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="relative">
                            <motion.div
                                className={`${featured ? 'w-28 h-28' : 'w-20 h-20'} rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/15 flex items-center justify-center group-hover:border-blue-400/30 transition-all duration-500`}
                                whileHover={{ scale: 1.1 }}
                            >
                                <product.icon className={`${featured ? 'w-14 h-14' : 'w-10 h-10'} text-slate-500 group-hover:text-blue-400 transition-colors duration-500`} />
                            </motion.div>
                            <div className="absolute inset-0 bg-blue-500/15 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                        </div>
                    </div>
                )}

                {/* Product Details */}
                <div className={`relative ${featured ? 'p-8 md:w-2/5 flex flex-col justify-center' : 'p-5'} flex-1 flex flex-col`}>
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

                    <h3 className={`${featured ? 'text-2xl md:text-3xl' : 'text-lg'} font-bold text-white mb-1 group-hover:text-blue-400 transition-colors duration-300`}>{product.name}</h3>
                    <p className={`text-blue-400/70 ${featured ? 'text-sm' : 'text-xs'} font-medium mb-2`}>{product.tagline}</p>
                    <p className={`text-slate-400 ${featured ? 'text-sm' : 'text-xs'} mb-6 flex-1 leading-relaxed`}>{product.description}</p>

                    {/* CTA Buttons */}
                    <div className="flex gap-2">
                        {product.url ? (
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    onClick={() => window.open(product.url, '_blank')}
                                    size={featured ? 'default' : 'sm'}
                                    className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 ${featured ? 'text-sm h-11' : 'text-xs h-9'}`}
                                >
                                    Visit Product
                                    <ExternalLink className={`ml-1.5 ${featured ? 'w-4 h-4' : 'w-3.5 h-3.5'}`} />
                                </Button>
                            </motion.div>
                        ) : (
                            <Button
                                disabled
                                size="sm"
                                className="bg-slate-800 text-slate-500 flex-1 cursor-not-allowed border border-slate-700 text-xs h-9"
                            >
                                Coming Soon
                            </Button>
                        )}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                            <Button
                                onClick={() => window.location.href = `mailto:sales@catalystappliedai.com?subject=${encodeURIComponent(product.name)} Inquiry`}
                                size={featured ? 'default' : 'sm'}
                                className={`bg-gradient-to-b from-slate-700 to-slate-800 border border-slate-600 text-slate-100 hover:from-slate-600 hover:to-slate-700 hover:border-slate-500 transition-all duration-300 ${featured ? 'text-sm h-11' : 'text-xs h-9'}`}
                            >
                                Inquire
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function Products() {
    return (
        <div className="min-h-screen bg-[#060a14] overflow-hidden">
            <SEOHead
                title="AI Products"
                description="Explore CAAi Command Center, SCCI, CAAi CLERK, and Catalyst Custom Models — AI-powered products built for real business impact."
                path="/Products"
            />
            <Navbar showNav={true} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
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
                        <motion.span 
                            className="text-blue-400 text-sm font-semibold tracking-widest uppercase inline-block"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Our Products
                        </motion.span>
                        <motion.h1 
                            className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            AI Products Built for
                            <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent"> Business Impact</span>
                        </motion.h1>
                        <motion.p 
                            className="text-xl text-slate-300 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            Explore our suite of AI-powered products designed to transform how businesses operate, 
                            make decisions, and drive growth.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Products Section */}
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

                <div className="max-w-6xl mx-auto relative z-10 space-y-8">
                    {/* Featured Product — Full Width */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <ProductCard product={featuredProduct} featured={true} />
                    </motion.div>

                    {/* Remaining Products — 3-Column Grid */}
                    <motion.div 
                        className="grid md:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </motion.div>
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
                        More Products Coming Soon
                    </h2>
                    <p className="text-slate-300 text-lg mb-8">
                        We're constantly building new AI-powered tools and platforms. 
                        Subscribe to be the first to know when we launch new products.
                    </p>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                        <Button
                            onClick={() => window.location.href = 'mailto:sales@catalystappliedai.com?subject=Product Updates Subscription'}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-shadow"
                        >
                            Get Notified
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
