import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, staggerItem } from '@/hooks/useFluidReveal';

const stats = [
    { label: 'Enterprise Deployments', value: '50+', suffix: '', subtext: 'Successfully delivered AI solutions' },
    { label: 'Average ROI', value: '75', suffix: '%', subtext: 'Cost reduction & efficiency gains' },
    { label: 'Data Points Processed', value: '200', suffix: 'M+', subtext: 'Powering intelligence & insights' },
    { label: 'Client Satisfaction', value: '98', suffix: '%', subtext: 'Committed to long-term success' }
];

export default function StatisticsSection() {
    return (
        <section className="py-24 px-4 relative overflow-hidden bg-[#060a14]">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={staggerItem}
                            className="relative group p-8 rounded-3xl bg-[#0d1425]/40 border border-blue-500/10 hover:border-blue-500/25 transition-all duration-500 backdrop-blur-sm"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                            
                            <div className="relative">
                                <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors">
                                    {stat.value}
                                    <span className="text-blue-500">{stat.suffix}</span>
                                </div>
                                <div className="text-lg font-semibold text-slate-200 mb-2">{stat.label}</div>
                                <div className="text-sm text-slate-400 leading-relaxed">{stat.subtext}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
