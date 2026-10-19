import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { contactUrl, createPageUrl } from '@/utils';
import { SHOW_SERVICES } from '@/config/features';
import { offerings, SERVICE_GROUPS, serviceDetailPath } from '@/data/offerings';
import {
    Menu, X, ChevronDown, ChevronRight,
    Search, GraduationCap, Cpu, Database,
    Zap, Layout, BarChart3, Users, MessageSquare
} from 'lucide-react';

// Built by a function that is only called when SHOW_SERVICES is true, so the menu and the
// offerings data are dropped from the production bundle while Services are hidden.
// One link per offering, grouped into columns by offering.group (src/data/offerings.js).
const OFFERING_ICONS = { Search, Layout, Cpu, Database, Zap, GraduationCap };

const servicesNavItem = () => ({
        label: 'Services',
        featured: { label: 'All Services', path: '/#services' },
        columns: SERVICE_GROUPS.map((group) => ({
            heading: group,
            links: offerings
                .filter((o) => o.group === group)
                .map((o) => ({
                    label: o.title,
                    path: serviceDetailPath(o.slug),
                    description: o.tagline,
                    icon: OFFERING_ICONS[o.icon],
                })),
        })),
});

const navItems = [
    ...(SHOW_SERVICES ? [servicesNavItem()] : []),
    {
        label: 'Products',
        featured: { label: 'Products overview', path: '/Products' },
        columns: [
            {
                heading: 'Products',
                links: [
                    { label: 'Agentic AI Assistants', path: '/Products#agentic-aiva', description: 'Assistants that carry out tasks', icon: Users },
                    { label: 'Operational Intelligence', path: '/Products#operational-intelligence', description: 'Reporting on operational data', icon: BarChart3 },
                    { label: 'Custom RAG Systems', path: '/Products#custom-rag', description: 'Cited answers from your documents', icon: Database },
                ]
            },
            {
                heading: 'Get Started',
                links: [
                    { label: 'Request a demo', path: contactUrl('Product demo'), description: 'Walk through a product with us', icon: MessageSquare },
                ]
            }
        ]
    },
    // Plain link (no dropdown): an item with a path and no columns renders as a link in both menus.
    { label: 'FAQ', path: createPageUrl('FAQ') },
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

    // Case-insensitive and trailing-slash tolerant: /faq and /FAQ/ are the same page.
    const normalizePath = (p) => (p || '').toLowerCase().replace(/\/+$/, '') || '/';
    const isLinkActive = (path) => normalizePath(location.pathname) === normalizePath(path);
    // On /Contact the form is already on screen, so the Contact us button would only point back at it.
    const showBookCta = location.pathname.toLowerCase() !== '/contact';

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
                                {/* Left: Logo */}
                                <Link 
                                    to="/" 
                                    className="flex items-center gap-3 group" 
                                    onClick={() => {
                                        setActiveItem(null);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <img src="/logo-mark-96.png" srcSet="/logo-mark-96.png 1x, /logo-mark-144.png 2x" width="48" height="48" alt="Catalyst Applied AI" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-lg sm:text-xl font-bold text-white">
                                        Catalyst Applied AI
                                    </span>
                                </Link>

                                {/* Right: Nav + CTA grouped */}
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
                                                    aria-current={isLinkActive(item.path) ? 'page' : undefined}
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
                                    {showBookCta && (
                                        <>
                                            <div className="w-px h-6 bg-white/10 mx-1" />
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="relative group/btn"
                                            >
                                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-0 group-hover/btn:opacity-40 transition-opacity duration-300" />
                                                <Button
                                                    asChild
                                                    className="relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full px-5 py-2 text-sm shadow-xl shadow-blue-500/20"
                                                >
                                                    <Link to={contactUrl()} onClick={() => setActiveItem(null)}>
                                                        Contact us
                                                    </Link>
                                                </Button>
                                            </motion.div>
                                        </>
                                    )}
                                </div>

                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
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
                                                        aria-current={isLinkActive(item.path) ? 'page' : undefined}
                                                        className={`block w-full text-left transition-colors py-3 ${isLinkActive(item.path) ? 'text-white' : 'text-slate-300 hover:text-blue-400'}`}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                        {showBookCta && (
                                            <div className="pt-3">
                                                <Button
                                                    asChild
                                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl"
                                                >
                                                    <Link to={contactUrl()} onClick={() => setIsMobileMenuOpen(false)}>
                                                        Contact us
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
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
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

