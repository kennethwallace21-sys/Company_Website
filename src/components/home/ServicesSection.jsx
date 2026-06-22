import React from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Cpu,
    GitBranch,
    Database,
    Settings,
    GraduationCap,
    ArrowRight
} from 'lucide-react';

const services = [
    {
        icon: Search,
        title: "Discovery & Diagnostic",
        description: "Find your fastest ROI opportunities and build a roadmap that pays for itself",
        features: [
            "Spot top ROI opportunities in workflows",
            "Forecast impact (time saved, cost reduced)",
            "Get a tailored AI readiness score",
            "Clear, actionable strategy aligned with goals"
        ],
        gradient: "from-blue-400 to-blue-500"
    },
    {
        icon: Cpu,
        title: "Custom AI Solutions",
        description: "Turn complex problems into practical AI tools that work",
        features: [
            "Build generative AI apps for content & insights",
            "Develop predictive models for forecasting",
            "Create AI agents for repetitive tasks",
            "Engineer solutions tailored to workflows"
        ],
        gradient: "from-blue-500 to-blue-600"
    },
    {
        icon: GitBranch,
        title: "Workflow Automation",
        description: "Faster processes, fewer mistakes, and more time for growth",
        features: [
            "Embed AI into CRM, ERP, and tools you use",
            "Automate email, ticketing, and scheduling",
            "Orchestrate multi-step workflows",
            "Reduce manual errors and speed up cycles"
        ],
        gradient: "from-blue-500 to-sky-500"
    },
    {
        icon: Database,
        title: "Data Engineering",
        description: "Build the foundation for reliable, usable data powering every AI decision",
        features: [
            "Design secure, scalable data architecture",
            "Create ETL/ELT pipelines and API integrations",
            "Clean, structure, and label data for accuracy",
            "Implement dashboards for real-time insights"
        ],
        gradient: "from-blue-600 to-blue-700"
    },
    {
        icon: Settings,
        title: "AI Tools Implementation",
        description: "Deploy safe, scalable enterprise-grade AI tools with confidence",
        features: [
            "Integrate leading AI platforms into your stack",
            "Configure security and compliance guardrails",
            "Build prompt libraries and workflow templates",
            "Ensure seamless adoption without disruption"
        ],
        gradient: "from-sky-500 to-blue-500"
    },
    {
        icon: GraduationCap,
        title: "Training & Enablement",
        description: "Empower your team to use and lead with AI confidently",
        features: [
            "Plain-language training that demystifies AI",
            "Step-by-step workshops for daily work",
            "Confidence building for your entire team",
            "Live sessions with Q&A and ongoing support"
        ],
        gradient: "from-blue-400 to-sky-400"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

export default function ServicesSection() {
    return (
        <section className="py-24 px-4 bg-[#060a14] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/15 via-transparent to-transparent" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">What We Offer</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                        Our Services
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Comprehensive AI solutions designed to transform your business operations
                        and drive measurable results.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative"
                        >
                            <div className="h-full p-8 rounded-2xl bg-[#0d1425]/60 border border-blue-500/10 hover:border-blue-500/30 transition-all duration-500 hover:bg-[#0d1425]/80 backdrop-blur-sm">
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} p-0.5 mb-6`}>
                                    <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
                                        <service.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* Learn More Link */}
                                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>Learn more</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
