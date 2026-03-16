import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Eye, Lightbulb, Users, Shield, Zap, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerItem, scaleUp } from '@/hooks/useFluidReveal';
import SEOHead from '../components/SEOHead';

const values = [
    {
        icon: Lightbulb,
        title: 'Innovation',
        description: 'We stay at the forefront of AI technology, continuously exploring new solutions to solve complex business challenges.'
    },
    {
        icon: Users,
        title: 'Partnership',
        description: 'We work alongside our clients as true partners, invested in their success and committed to long-term relationships.'
    },
    {
        icon: Shield,
        title: 'Integrity',
        description: 'We operate with transparency and honesty, delivering realistic expectations and measurable results.'
    },
    {
        icon: Zap,
        title: 'Impact',
        description: 'Every solution we build is designed to create tangible business value and meaningful operational improvements.'
    }
];

const team = [
    {
        name: 'Kenny Wallace',
        role: 'Founder & CEO',
        bio: 'Dynamic executive with 10+ years of leadership experience across Fortune 500 environments (Chewy, Amazon, Wayfair). Expert in high-impact strategies and organizational development.',
        image: '/kenny-wallace.png',
        linkedin: 'https://www.linkedin.com/in/kennethwallace21/',
        color: 'from-blue-400 to-indigo-500'
    },
    {
        name: 'Michael Deason',
        role: 'Vice President, Operations',
        bio: 'Global E-Commerce leader with deep expertise in M&A, expansion, and organizational development. guiding executive teams at companies like Amazon, Chewy, and Gopuff.',
        image: '/michael-deason.png',
        linkedin: 'https://www.linkedin.com/in/michael-deason-coss-804352143/',
        color: 'from-green-500 to-emerald-600'
    },
    {
        name: 'Andrew Welch',
        role: 'Vice President, Sales & Marketing',
        bio: 'Strategic executive focused on driving growth and building lasting client relationships across global markets.',
        image: ''
    },
    {
        name: 'Harsha Kolla',
        role: 'Director, Software Engineering',
        bio: 'Experienced engineering leader specializing in building scalable software systems and high-performing technical teams.',
        image: '/harshakolla.jpg',
        color: 'from-blue-500 to-blue-600',
        imageClass: 'object-top scale-110 brightness-110 contrast-110 saturate-110',
        addBorder: true
    }
];

const milestones = [
    {
        year: '2019',
        title: 'Company Founded',
        description: 'Catalyst Applied AI was founded with a mission to make AI accessible and practical for businesses of all sizes.'
    },
    {
        year: '2020',
        title: 'First Enterprise Client',
        description: 'Secured our first Fortune 500 client, delivering a workflow automation solution that saved $2M annually.'
    },
    {
        year: '2021',
        title: 'Team Expansion',
        description: 'Grew to 25 team members and opened our second office. Launched our training and enablement practice.'
    },
    {
        year: '2022',
        title: '100th Project Milestone',
        description: 'Completed our 100th successful AI implementation with a 95% client satisfaction rate.'
    },
    {
        year: '2023',
        title: 'Generative AI Leadership',
        description: 'Became early adopters and implementers of enterprise generative AI solutions, helping 50+ companies adopt LLMs safely.'
    },
    {
        year: '2024',
        title: 'Industry Recognition',
        description: 'Named a top AI consulting firm by industry analysts. Expanded to serve clients across 12 countries.'
    }
];

export default function About() {
    const [showNav, setShowNav] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowNav(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#060a14]">
            <SEOHead
                title="About Us"
                description="Meet the team behind Catalyst Applied AI. We're experts, engineers, and strategists dedicated to helping organizations harness AI to drive real business results."
                path="/About"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'AboutPage',
                    name: 'About Catalyst Applied AI',
                    description: 'Learn about our mission, vision, team, and values.',
                    url: 'https://catalystappliedai.com/About',
                    mainEntity: {
                        '@type': 'Organization',
                        name: 'Catalyst Applied AI',
                        foundingDate: '2019',
                    }
                }}
            />
            <Navbar showNav={showNav} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-transparent to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                    >
                        <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">About Us</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
                            Transforming Business Through{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
                                Practical AI
                            </span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            We're a team of AI experts, engineers, and strategists dedicated to helping organizations
                            harness the power of artificial intelligence to drive real business results.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            variants={fadeLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            custom={0}
                            whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.3)' }}
                            className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/15 transition-colors"
                        >
                            <div className="w-14 h-14 rounded-xl bg-blue-500/15 flex items-center justify-center mb-6">
                                <Target className="w-7 h-7 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                            <p className="text-slate-300 leading-relaxed">
                                To democratize AI by helping organizations of all sizes identify, design, and implement
                                practical AI solutions that create measurable business value. We bridge the gap between
                                AI's potential and real-world performance.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            custom={0.1}
                            whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.3)' }}
                            className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/15 transition-colors"
                        >
                            <div className="w-14 h-14 rounded-xl bg-blue-500/15 flex items-center justify-center mb-6">
                                <Eye className="w-7 h-7 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
                            <p className="text-slate-300 leading-relaxed">
                                A world where every business, regardless of size or industry, can leverage AI to work
                                smarter, serve customers better, and compete effectively. We envision AI as an accessible
                                tool for growth, not a barrier to entry.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 px-4 bg-[#0d1425]/30">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        custom={0}
                    >
                        <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">What Drives Us</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">Our Core Values</h2>
                    </motion.div>

                    <motion.div
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                whileHover={{
                                    y: -6,
                                    borderColor: 'rgba(59, 130, 246, 0.35)',
                                    transition: { duration: 0.25 },
                                }}
                                className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 transition-colors cursor-default"
                            >
                                <motion.div
                                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/15 flex items-center justify-center mb-4"
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <value.icon className="w-6 h-6 text-blue-400" />
                                </motion.div>
                                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                                <p className="text-slate-400 text-sm">{value.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Team Section - commented out
            <section className="py-20 px-4">
                ...
            </section>
            */}

            {/* Timeline */}
            <section className="py-20 px-4 bg-[#0d1425]/30">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        custom={0}
                    >
                        <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">Our Journey</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">Company Milestones</h2>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-700 md:-translate-x-1/2" />

                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    variants={index % 2 === 0 ? fadeLeft : fadeRight}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-60px' }}
                                    custom={index * 0.05}
                                    className={`relative flex items-start gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Timeline dot */}
                                    <motion.div
                                        className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#060a14] md:-translate-x-1/2 z-10"
                                        whileInView={{ scale: [0.5, 1.3, 1] }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.08 }}
                                    />

                                    {/* Content */}
                                    <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                                        <span className="text-blue-400 font-bold text-lg">{milestone.year}</span>
                                        <h3 className="text-xl font-semibold text-white mt-1">{milestone.title}</h3>
                                        <p className="text-slate-400 mt-2">{milestone.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <motion.div
                    className="max-w-3xl mx-auto text-center"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    custom={0}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Work with Us?
                    </h2>
                    <p className="text-slate-300 text-lg mb-8">
                        Let's discuss how our team can help transform your business with AI.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button
                                onClick={() => window.location.href = 'mailto:sales@catalystappliedai.com?subject=Partnership%20Inquiry'}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-shadow"
                            >
                                Get in Touch
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                        <Link to="/#services">
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    className="bg-white text-slate-900 hover:bg-slate-200 px-8 py-6 text-lg rounded-xl w-full"
                                >
                                    Explore Our Services
                                </Button>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
