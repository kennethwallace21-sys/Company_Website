import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Zap } from 'lucide-react';
import { fadeUp, scaleUp } from '@/hooks/useFluidReveal';

export default function CTASection() {
    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Background background with multiple gradients */}
            <div className="absolute inset-0 bg-[#060a14]">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-sky-600/5 blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    className="p-8 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 backdrop-blur-md relative overflow-hidden"
                    variants={scaleUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {/* Animated background particles effect */}
                    <div className="absolute inset-0 opacity-20">
                        <motion.div 
                            className="absolute top-10 right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                        <motion.div 
                            className="absolute bottom-10 left-10 w-40 h-40 bg-sky-500 rounded-full blur-3xl"
                            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
                            transition={{ duration: 5, repeat: Infinity }}
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mb-8"
                        >
                            <Zap className="w-8 h-8 text-blue-400" />
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Catalyze</span> Your Growth?
                        </h2>
                        
                        <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            Don't leave your AI transformation to chance. Join forward-thinking organizations using Catalyst Applied AI to automate, optimize, and scale.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <Link to={createPageUrl('Contact')}>
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-10 py-7 rounded-2xl text-lg font-bold shadow-2xl shadow-blue-500/20 group transition-all duration-300">
                                    Start Your ROI Assessment
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            
                            <a href="tel:+15024168342">
                                <Button variant="outline" className="border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 px-8 py-7 rounded-2xl text-lg font-semibold transition-all">
                                    <MessageSquare className="mr-2 w-5 h-5 text-blue-400" />
                                    Speak with an Expert
                                </Button>
                            </a>
                        </div>

                        <div className="mt-12 flex items-center gap-6 text-slate-500 text-sm font-medium">
                            <div className="flex -space-x-2">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0d1425] bg-slate-800 flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <span>Trusted by innovative teams worldwide</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
