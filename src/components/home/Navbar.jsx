import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
    Menu, X, ChevronDown, ChevronRight,
    Search, GraduationCap, Cpu, Database,
    Zap, Layout, Mic, FileSearch
} from 'lucide-react';

const navItems = [
    {
        label: 'Solutions',
        featured: { label: 'All Services', path: '/#services' },
        compact: true,
        columns: [
            {
                heading: 'Strategy',
                links: [
                    { label: 'AI Tools Implementation', path: '/ServiceDetail?service=ai-implementation', icon: Layout },
                ]
            },
            {
                heading: 'Engineering',
                links: [
                    { label: 'Custom AI Solutions', path: '/ServiceDetail?service=custom-ai-solutions', icon: Cpu },
                    { label: 'Data Engineering', path: '/ServiceDetail?service=data-engineering', icon: Database },
                ]
            },
            {
                heading: 'Automation',
                links: [
                    { label: 'Workflow Automation', path: '/ServiceDetail?service=workflow-automation', icon: Zap },
                    { label: 'Voice & Conversational AI', path: '/ServiceDetail?service=voice-ai', icon: Mic },
                ]
            },
            {
                heading: 'Intelligence',
                links: [
                    { label: 'Enterprise Model Deployment', path: '/ServiceDetail?service=custom-rag', icon: FileSearch },
                ]
            }
        ]
    },
    { label: 'Products', path: '/Products' },
    { label: 'Contact', path: '/Contact' }
];



export default function Navbar({ showNav }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const [compactMenuPos, setCompactMenuPos] = useState(null);
    const location = useLocation();
    const timeoutRef = useRef(null);
    const servicesButtonRef = useRef(null);

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
            setCompactMenuPos(null);
        } else {
            if (item.label === 'Solutions' && servicesButtonRef.current) {
                const rect = servicesButtonRef.current.getBoundingClientRect();
                const vw = window.innerWidth;
                const padding = 16;
                // Responsive menu width: shrink on smaller screens
                const menuWidth = vw < 900 ? Math.min(vw - padding * 2, 520) : 560;
                const idealLeft = rect.left + rect.width / 2 - menuWidth / 2;
                const clampedLeft = Math.max(padding, Math.min(idealLeft, vw - menuWidth - padding));
                setCompactMenuPos({
                    top: rect.bottom + 8,
                    left: clampedLeft,
                    width: menuWidth
                });
            } else {
                setCompactMenuPos(null);
            }
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
                                        <img src="/logo1.png" alt="Catalyst Applied AI" className="w-full h-full object-cover" />
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
                                                    ref={item.label === 'Solutions' ? servicesButtonRef : null}
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
                                                                            link.href ? (
                                                                                <a
                                                                                    key={link.label}
                                                                                    href={link.href}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="block text-slate-400 hover:text-blue-400 transition-colors py-2 text-sm"
                                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                                >
                                                                                    {link.label}
                                                                                </a>
                                                                            ) : (
                                                                                <Link
                                                                                    key={link.label}
                                                                                    to={link.path}
                                                                                    className="block text-slate-400 hover:text-blue-400 transition-colors py-2 text-sm"
                                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                                >
                                                                                    {link.label}{link.upcoming ? ' (Coming Soon)' : ''}
                                                                                </Link>
                                                                            )
                                                                        ))}
                                                                        {item.featured && (
                                                                            <Link
                                                                                to={item.featured.path}
                                                                                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors py-2 text-sm font-medium mt-1 border-t border-white/[0.05] pt-3"
                                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                            >
                                                                                View all {item.label.toLowerCase()}
                                                                                <ChevronRight className="w-3.5 h-3.5" />
                                                                            </Link>
                                                                        )}
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
                        <div className={`absolute top-[80px] left-0 right-0 ${activeItem.compact ? '' : 'bg-[#0b0f1a] border-t border-white/[0.05] shadow-[0_50px_100px_rgba(0,0,0,0.9)]'} pointer-events-auto`}>
                            {activeItem.compact ? (
                                /* Compact dropdown for Products */
                                <div className="max-w-7xl mx-auto px-4 flex justify-end">
                                    <div
                                        className={`${activeItem.label === 'Solutions' ? 'max-w-[560px]' : 'w-[360px]'} bg-[#0b0f1a]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-5 mt-2`}
                                        style={
                                            activeItem.label === 'Solutions' && compactMenuPos
                                                ? { position: 'fixed', top: compactMenuPos.top, left: compactMenuPos.left, width: compactMenuPos.width }
                                                : undefined
                                        }
                                    >
                                        <h4 className="text-[11px] uppercase tracking-[0.25em] font-extrabold text-blue-500/80 mb-4 pb-2 border-b border-white/[0.05]">
                                            {activeItem.label === 'Solutions' ? 'Solutions' : activeItem.columns[0].heading}
                                        </h4>
                                        <ul className={`${activeItem.label === 'Solutions' ? 'grid grid-cols-2 gap-1' : 'space-y-1'}`}>
                                            {activeItem.columns.flatMap((col) => col.links).map((link) => (
                                                <li key={link.label}>
                                                    {link.href ? (
                                                        <a
                                                            href={link.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group/link flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 hover:bg-white/[0.04]"
                                                            onClick={() => setActiveItem(null)}
                                                        >
                                                            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:border-blue-400 transition-all duration-300">
                                                                {link.icon && <link.icon className="w-4 h-4 text-blue-400 group-hover/link:text-white transition-colors" />}
                                                            </div>
                                                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                                                <span className="text-[14px] font-semibold text-slate-200 group-hover/link:text-white transition-colors">
                                                                    {link.label}
                                                                </span>
                                                                {link.description && (
                                                                    <span className="text-[11px] text-slate-500 group-hover/link:text-slate-400 transition-colors">
                                                                        {link.description}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </a>
                                                    ) : link.path ? (
                                                        <Link
                                                            to={link.path}
                                                            className={`group/link flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 hover:bg-white/[0.04] ${link.upcoming ? 'opacity-60' : ''}`}
                                                            onClick={() => setActiveItem(null)}
                                                        >
                                                            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:border-blue-400 transition-all duration-300">
                                                                {link.icon && <link.icon className="w-4 h-4 text-blue-400 group-hover/link:text-white transition-colors" />}
                                                            </div>
                                                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                                                <span className="text-[14px] font-semibold text-slate-200 group-hover/link:text-white transition-colors flex items-center gap-2">
                                                                    {link.label}
                                                                    {link.upcoming && (
                                                                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-400">
                                                                            Coming Soon
                                                                        </span>
                                                                    )}
                                                                </span>
                                                                {link.description && (
                                                                    <span className="text-[11px] text-slate-500 group-hover/link:text-slate-400 transition-colors">
                                                                        {link.description}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    ) : (
                                                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl opacity-60 cursor-default">
                                                            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                                                                {link.icon && <link.icon className="w-4 h-4 text-blue-400" />}
                                                            </div>
                                                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                                                <span className="text-[14px] font-semibold text-slate-200 flex items-center gap-2">
                                                                    {link.label}
                                                                    {link.upcoming && (
                                                                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-400">
                                                                            Coming Soon
                                                                        </span>
                                                                    )}
                                                                </span>
                                                                {link.description && (
                                                                    <span className="text-[11px] text-slate-500">
                                                                        {link.description}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                        {activeItem.label === 'Products' && (
                                            <div className="mt-3 pt-3 border-t border-white/[0.05]">
                                                <Link
                                                    to="/Products"
                                                    className="flex items-center justify-center gap-2 text-[13px] font-medium text-blue-400 hover:text-blue-300 transition-colors py-1.5"
                                                    onClick={() => setActiveItem(null)}
                                                >
                                                    View all products
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Full-width mega menu for Services */
                                <div className="bg-[#0b0f1a] border-t border-white/[0.05] shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
                                <div className="w-full px-12 lg:px-24 py-16 pb-24">
                                <div className="max-w-[1800px] mx-auto">
                                    {/* Brand Header */}
                                    <div className="flex items-center gap-4 mb-16 group/title cursor-default w-fit">
                                        <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                                            {activeItem.label === 'Solutions' ? 'What we do' : activeItem.label}
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
                                                                className="group/link flex items-start gap-4 p-2 -m-2 rounded-xl transition-all duration-300"
                                                                onClick={() => setActiveItem(null)}
                                                            >
                                                                {/* Icon Container - Small Graphics */}
                                                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:border-blue-400 group-hover/link:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all duration-300">
                                                                    {link.icon && <link.icon className="w-5 h-5 text-blue-400 group-hover/link:text-white transition-colors" />}
                                                                </div>

                                                                <div className="flex flex-col gap-0.5 relative pr-4">
                                                                    <span className="text-[16px] font-bold text-slate-200 group-hover/link:text-white transition-colors relative">
                                                                        {link.label}
                                                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover/link:w-full" />
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
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

