import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Zap, Target, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { fadeLeft, fadeRight, staggerContainer, staggerItem } from '@/hooks/useFluidReveal';

const capabilities = [
    {
        icon: Zap,
        title: "Automation",
        description: "Removing bottlenecks and streamlining operations"
    },
    {
        icon: Users,
        title: "Customer Experience",
        description: "Enhancing interactions at scale"
    },
    {
        icon: TrendingUp,
        title: "Data Intelligence",
        description: "Turning information into decisions"
    },
    {
        icon: Target,
        title: "Operational Efficiency",
        description: "Reducing costs and increasing speed"
    }
];

export default function AboutSection() {
    return (
        <section className="py-24 px-4 bg-gradient-to-b from-[#080e1c]/50 to-[#060a14] relative overflow-hidden">
            {/* Decorative elements */}
            <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        variants={fadeLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        custom={0}
                    >
                        <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
                            Who We Are
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6 leading-tight">
                            Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">AI Solutions</span>
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed mb-8">
                            Catalyst Applied AI helps organizations identify, design, and implement practical AI solutions.
                            We bridge the gap between potential and performance, unlocking opportunities that drive real business value.
                        </p>

                        {/* Values */}
                        <motion.div
                            className="grid grid-cols-3 gap-3 sm:gap-6 mb-8"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                        >
                            {['Innovation', 'Quality', 'Trust'].map((val, i) => (
                                <motion.div
                                    key={val}
                                    variants={staggerItem}
                                    whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.3)' }}
                                    className="text-center p-3 sm:p-4 rounded-xl bg-[#0d1425]/60 border border-blue-500/10 transition-all duration-300"
                                >
                                    <div className="text-lg sm:text-2xl font-bold text-blue-400">{val}</div>
                                    <div className="text-xs sm:text-sm text-slate-400 mt-1">
                                        {val === 'Innovation' ? 'Cutting-Edge Solutions' : val === 'Quality' ? 'Excellence in Delivery' : 'Client-Focused Approach'}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

// AboutSection simplified (Full About page removed)
                    </motion.div>

                    {/* Right Content - Capabilities */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {capabilities.map((cap, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                whileHover={{
                                    y: -6,
                                    borderColor: 'rgba(59, 130, 246, 0.35)',
                                    backgroundColor: 'rgba(13, 20, 37, 0.7)',
                                    transition: { duration: 0.3 },
                                }}
                                className="group p-6 rounded-2xl bg-[#0d1425]/40 border border-blue-500/10 transition-all duration-300 cursor-default"
                            >
                                <motion.div
                                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/15 flex items-center justify-center mb-4"
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <cap.icon className="w-6 h-6 text-blue-400" />
                                </motion.div>
                                <h3 className="text-lg font-semibold text-white mb-2">{cap.title}</h3>
                                <p className="text-slate-400 text-sm">{cap.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
