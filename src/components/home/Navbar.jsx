import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
    Menu, X, ChevronDown, ChevronRight, 
    Search, GraduationCap, Cpu, Database, 
    Wrench, Zap, Layout, Bot, Box 
} from 'lucide-react';

const navItems = [
    {
        label: 'Services',
        featured: { label: 'All Services', path: '/#services' },
        columns: [
            {
                heading: 'Consulting',
                links: [
                    { label: 'Discovery & Diagnostic', path: '/ServiceDetail?service=discovery-diagnostic', description: 'AI opportunity audit', icon: Search },
                    { label: 'AI Strategy & Roadmap', path: '/ServiceDetail?service=discovery-diagnostic', description: 'Implementation path', icon: Layout },
                    { label: 'Training & Enablement', path: '/ServiceDetail?service=training-support', description: 'Team upskilling', icon: GraduationCap },
                ]
            },
            {
                heading: 'Engineering',
                links: [
                    { label: 'Custom AI Solutions', path: '/ServiceDetail?service=custom-ai-solutions', description: 'Bespoke AI models', icon: Cpu },
                    { label: 'Data Engineering', path: '/ServiceDetail?service=data-engineering', description: 'Data pipeline design', icon: Database },
                    { label: 'LLM Fine-tuning', path: '/ServiceDetail?service=custom-ai-solutions', description: 'Model optimization', icon: Zap },
                ]
            },
            {
                heading: 'Automation',
                links: [
                    { label: 'Workflow Automation', path: '/ServiceDetail?service=workflow-automation', description: 'Process streamlining', icon: Zap },
                    { label: 'RPA Implementation', path: '/ServiceDetail?service=workflow-automation', description: 'Task automation', icon: Bot },
                    { label: 'Process Mining', path: '/ServiceDetail?service=workflow-automation', description: 'Efficiency analysis', icon: Box },
                ]
            },
            {
                heading: 'Intelligence',
                links: [
                    { label: 'Predictive Analytics', path: '/ServiceDetail?service=data-engineering', description: 'Future-cast insights', icon: Database },
                    { label: 'Computer Vision', path: '/ServiceDetail?service=custom-ai-solutions', description: 'Visual data processing', icon: Cpu },
                    { label: 'Sentiment Analysis', path: '/ServiceDetail?service=custom-ai-solutions', description: 'Textual tone audit', icon: Search },
                ]
            }
        ]
    },
    {
        label: 'Products',
        featured: { label: 'Products overview', path: '/Products' },
        columns: [
            {
                heading: 'Platforms',
                links: [
                    { label: 'CAAi Command Center', path: '/Products', description: 'Agent orchestration', icon: Layout },
                    { label: 'CAAi CLERK', path: '/Products', description: 'Customer AI support', icon: Bot },
                    { label: 'CAAi AGENT', path: '/Products', description: 'Task-specific AI', icon: Cpu },
                ]
            },
            {
                heading: 'Models',
                links: [
                    { label: 'Catalyst Base Models', path: '/Products', description: 'Foundation intelligence', icon: Box },
                    { label: 'Domain Adapters', path: '/Products', description: 'Specialized tuning', icon: Database },
                ]
            },
            {
                heading: 'Safety',
                links: [
                    { label: 'AI Guardrails', path: '/Products', description: 'Ethics & safety rules', icon: Search },
                    { label: 'Compliance Monitoring', path: '/Products', description: 'Regulatory tracking', icon: Layout },
                ]
            },
            {
                heading: 'Integration',
                links: [
                    { label: 'API Gateway', path: '/Products', description: 'Seamless connectivity', icon: Zap },
                    { label: 'SDKs & Tools', path: '/Products', description: 'Developer resource', icon: Wrench },
                ]
            }
        ]
    },
    { label: 'Contact', path: '/Contact' }
];



export default function Navbar({ showNav }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const location = useLocation();
    const timeoutRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDropdown = (item) => {
        if (!item.columns) return;
        if (activeItem?.label === item.label) {
            setActiveItem(null);
        } else {
            setActiveItem(item);
        }
    };

    // Global click-outside listener to close menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeItem && !event.target.closest('nav') && !event.target.closest('[role="menu"]')) {
                setActiveItem(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeItem]);

    const allMobileLinks = (item) => {
        if (!item.columns) return [];
        return item.columns.flatMap(col => col.links);
    };

    const isLinkActive = (path) => location.pathname === path;

    return (
        <>
            <AnimatePresence>
                {showNav && (
                    <motion.nav
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed top-4 left-4 right-4 z-[110] transition-all duration-500 rounded-2xl ${isScrolled
                            ? 'bg-[#060a14]/90 backdrop-blur-xl border border-white/[0.08] shadow-lg shadow-black/20'
                            : 'bg-[#060a14]/40 backdrop-blur-md border border-white/[0.05]'
                            }`}
                    >
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex items-center justify-between h-20">
                                {/* Left — Logo */}
                                <Link 
                                    to="/" 
                                    className="flex items-center gap-3 group" 
                                    onClick={() => {
                                        setActiveItem(null);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <img src="/logo.jpg" alt="Catalyst Applied AI" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xl font-bold text-white hidden sm:block">
                                        Catalyst Applied AI
                                    </span>
                                </Link>

                                {/* Right — Nav + CTA grouped */}
                                <div className="hidden md:flex items-center gap-1 bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-full px-2 py-1.5">
                                    {navItems.map((item) => (
                                        <div
                                            key={item.label}
                                            className="relative"
                                        >
                                            {item.columns ? (
                                                <button
                                                    onClick={() => toggleDropdown(item)}
                                                    className={`flex items-center gap-1.5 text-sm font-medium py-2 px-1 mx-3 transition-all duration-200 relative z-10 ${activeItem?.label === item.label ? 'text-white' : 'text-slate-300 hover:text-white'}`}
                                                >
                                                    {item.label}
                                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeItem?.label === item.label ? 'rotate-180' : ''}`} />
                                                    
                                                    {activeItem?.label === item.label && (
                                                        <motion.div
                                                            layoutId="nav-underline"
                                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                        />
                                                    )}
                                                </button>
                                            ) : (
                                                <Link
                                                    to={item.path}
                                                    className={`relative text-sm font-medium py-2 px-1 mx-3 z-10 block transition-all duration-200 ${isLinkActive(item.path) ? 'text-white' : 'text-slate-300 hover:text-white'}`}
                                                    onClick={() => setActiveItem(null)}
                                                >
                                                    {item.label}
                                                    {isLinkActive(item.path) && (
                                                        <motion.div
                                                            layoutId="nav-underline"
                                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                        />
                                                    )}
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                    <div className="w-px h-6 bg-white/10 mx-1" />
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative group/btn"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-0 group-hover/btn:opacity-40 transition-opacity duration-300" />
                                        <Button
                                            onClick={() => { window.location.href = 'mailto:sales@catalystappliedai.com?subject=Request%20for%20Information'; }}
                                            className="relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full px-5 py-2 text-sm shadow-xl shadow-blue-500/20"
                                        >
                                            Book ROI Assessment
                                        </Button>
                                    </motion.div>
                                </div>

                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="md:hidden p-2 text-white"
                                >
                                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Content Remains Standard */}
                        <AnimatePresence>
                            {isMobileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="md:hidden bg-[#060a14]/95 backdrop-blur-xl border-t border-white/[0.05] rounded-b-2xl"
                                >
                                    <div className="px-4 py-4 space-y-1">
                                        {navItems.map((item) => (
                                            <div key={item.label}>
                                                {item.columns ? (
                                                    <>
                                                        <button
                                                            onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                                                            className="flex items-center justify-between w-full text-left text-slate-300 hover:text-white transition-colors py-3"
                                                        >
                                                            {item.label}
                                                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                                                        </button>
                                                        <AnimatePresence>
                                                            {mobileExpanded === item.label && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="pl-4 pb-2 space-y-1 border-l border-blue-500/15 ml-2">
                                                                        {allMobileLinks(item).map((link) => (
                                                                            <Link
                                                                                key={link.label}
                                                                                to={link.path}
                                                                                className="block text-slate-400 hover:text-blue-400 transition-colors py-2 text-sm"
                                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                            >
                                                                                {link.label}
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </>
                                                ) : (
                                                    <Link
                                                        to={item.path}
                                                        className="block w-full text-left text-slate-300 hover:text-blue-400 transition-colors py-3"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                        <div className="pt-3">
                                            <Button
                                                onClick={() => { window.location.href = 'mailto:sales@catalystappliedai.com?subject=Request%20for%20Information'; }}
                                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl"
                                            >
                                                Book ROI Assessment
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* FULL WIDTH MEGA MENU - Rendered outside the pill container to break out of transforms */}
            <AnimatePresence>
                {activeItem && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed top-0 left-0 right-0 w-screen h-screen z-[100] pointer-events-none"
                        role="menu"
                    >
                        {/* Semi-transparent Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                        />

                        {/* Menu Content */}
                        <div className="absolute top-[80px] left-0 right-0 bg-[#0b0f1a] border-t border-white/[0.05] shadow-[0_50px_100px_rgba(0,0,0,0.9)] pointer-events-auto">
                            <div className="w-full px-12 lg:px-24 py-16 pb-24">
                                <div className="max-w-[1800px] mx-auto">
                                    {/* Brand Header */}
                                    <div className="flex items-center gap-4 mb-16 group/title cursor-default w-fit">
                                        <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                                            {activeItem.label === 'Services' ? 'What we do' : activeItem.label}
                                        </h2>
                                        <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center">
                                            <ChevronRight className="w-6 h-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Links Grid */}
                                    <div className="grid grid-cols-12 gap-x-12 gap-y-12">
                                        {activeItem.columns.map((col) => (
                                            <div key={col.heading} className="col-span-12 md:col-span-6 lg:col-span-3">
                                                <h4 className="text-[12px] uppercase tracking-[0.3em] font-extrabold text-blue-500/80 mb-8 border-b border-white/[0.05] pb-3">
                                                    {col.heading}
                                                </h4>
                                                <ul className="space-y-6">
                                                    {col.links.map((link) => (
                                                        <li key={link.label}>
                                                            <Link
                                                                to={link.path}
                                                                className="group/link flex items-start gap-4 p-2 -m-2 rounded-xl hover:bg-white/[0.04] transition-all duration-300"
                                                                onClick={() => setActiveItem(null)}
                                                            >
                                                                {/* Icon Container - Small Graphics */}
                                                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:border-blue-400 group-hover/link:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all duration-300">
                                                                    {link.icon && <link.icon className="w-5 h-5 text-blue-400 group-hover/link:text-white transition-colors" />}
                                                                </div>

                                                                <div className="flex flex-col gap-0.5">
                                                                    <span className="text-[16px] font-bold text-slate-200 group-hover/link:text-white transition-colors">
                                                                        {link.label}
                                                                    </span>
                                                                    {link.description && (
                                                                        <span className="text-[12px] text-slate-500 group-hover/link:text-slate-400 transition-colors">
                                                                            {link.description}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

