import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { createPageUrl, contactUrl } from '@/utils';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerItem } from '@/hooks/useFluidReveal';
import SEOHead from '../components/SEOHead';
import { offerings, getOffering, DEFAULT_SERVICE_SLUG, serviceDetailPath } from '@/data/offerings';

export default function ServiceDetail() {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const requestedId = urlParams.get('service');

    // Only slugs defined in src/data/offerings.js are valid. Anything else (missing,
    // unknown, or inherited names like "constructor") redirects to the default
    // service so the canonical URL and JSON-LD always point at a real page.
    const offering = getOffering(requestedId);
    if (!offering) {
        return <Navigate to={serviceDetailPath(DEFAULT_SERVICE_SLUG)} replace />;
    }

    const serviceId = offering.slug;
    const service = { title: offering.title, subtitle: offering.blurb, ...offering.detail };

    const currentIndex = offerings.indexOf(offering);
    const prevService = currentIndex > 0 ? offerings[currentIndex - 1] : null;
    const nextService = currentIndex < offerings.length - 1 ? offerings[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-[#060a14]">
            <SEOHead
                title={service.title}
                description={service.subtitle}
                path={serviceDetailPath(serviceId)}
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Service',
                    name: service.title,
                    description: service.subtitle,
                    provider: {
                        '@type': 'Organization',
                        name: 'Catalyst Applied AI'
                    },
                    url: `https://www.catalystappliedai.com${serviceDetailPath(serviceId)}`
                }}
            />
            <Navbar showNav={true} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.img
                        src={service.heroImage}
                        alt={service.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        key={serviceId}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#060a14] via-[#060a14]/95 to-[#060a14]/80" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Link
                            to={createPageUrl('Home')}
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 mb-8 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0.1}
                        key={serviceId}
                    >
                        <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">Our Services</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">{service.title}</h1>
                        <p className="text-xl text-slate-300 max-w-2xl">{service.subtitle}</p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            {service.stats?.length >= 2 && (
                <section className="bg-[#0d1425]/50 border-y border-blue-500/10">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <motion.div
                            className={`grid gap-8 ${service.stats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {service.stats.map((stat, index) => (
                                <motion.div
                                    key={`${serviceId}-stat-${index}`}
                                    variants={staggerItem}
                                    className="text-center"
                                >
                                    <div className="text-3xl md:text-4xl font-bold text-blue-400">{stat.value}</div>
                                    <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Description & Benefits */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <motion.div
                            variants={fadeLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            custom={0}
                        >
                            <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-8">{service.description}</p>

                            <h3 className="text-xl font-semibold text-white mb-4">What You Get</h3>
                            <motion.ul
                                className="space-y-3"
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-60px' }}
                            >
                                {service.benefits.map((benefit, index) => (
                                    <motion.li key={index} className="flex items-start gap-3" variants={staggerItem}>
                                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                                        <span className="text-slate-300">{benefit}</span>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </motion.div>

                        {/* Process */}
                        <motion.div
                            variants={fadeRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            custom={0.1}
                        >
                            <h2 className="text-3xl font-bold text-white mb-6">Our Process</h2>
                            <motion.div
                                className="space-y-6"
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-60px' }}
                            >
                                {service.process.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        variants={staggerItem}
                                        className="flex gap-4 group"
                                        whileHover={{ x: 6, transition: { duration: 0.2 } }}
                                    >
                                        <motion.div
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shrink-0 text-white font-bold shadow-lg shadow-blue-500/20"
                                            whileHover={{ scale: 1.15, rotate: 10 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {item.step}
                                        </motion.div>
                                        <div>
                                            <h4 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                            <p className="text-slate-400">{item.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
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
                        Ready to Get Started with {service.title}?
                    </h2>
                    <p className="text-slate-300 text-lg mb-8">
                        Tell us what you are trying to automate. We will show you what we would build.
                    </p>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                        <Button
                            asChild
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-10 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-shadow"
                        >
                            <Link to={contactUrl(`${service.title} Demo`)}>
                                Book a Demo
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </motion.div>
                    <p className="mt-4 text-sm text-slate-400">
                        Prefer to write first?{' '}
                        <Link to={contactUrl(`${service.title} Inquiry`)} className="text-blue-300 hover:text-blue-200 underline underline-offset-4">
                            Send us a message
                        </Link>
                        {' '}or email sales@catalystappliedai.com.
                    </p>
                </motion.div>
            </section>

            {/* Navigation */}
            <section className="py-8 px-4 border-t border-blue-500/10">
                <div className="max-w-7xl mx-auto flex justify-between">
                    {prevService ? (
                        <Link
                            to={serviceDetailPath(prevService.slug)}
                            className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {prevService.title}
                        </Link>
                    ) : <div />}
                    {nextService && (
                        <Link
                            to={serviceDetailPath(nextService.slug)}
                            className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group"
                        >
                            {nextService.title}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
