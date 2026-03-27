import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerItem } from '@/hooks/useFluidReveal';
import SEOHead from '../components/SEOHead';

const servicesData = {
    'discovery-diagnostic': {
        title: 'Discovery & Diagnostic',
        subtitle: 'Find your fastest ROI opportunities and build a roadmap that pays for itself',
        heroPanelClass: 'bg-gradient-to-br from-[#0b1d30] via-[#163a5f] to-[#0a1a2d]',
        description: 'Our Discovery & Diagnostic service helps you identify the highest-impact AI opportunities in your organization. We analyze your workflows, data, and processes to create a clear roadmap for AI implementation.',
        benefits: [
            'Identify top ROI opportunities in your workflows',
            'Get a tailored AI readiness assessment',
            'Forecast impact: time saved, costs reduced',
            'Receive a clear, actionable strategy aligned with your goals'
        ],
        process: [
            { step: 1, title: 'Assessment', description: 'We conduct in-depth interviews and process analysis' },
            { step: 2, title: 'Analysis', description: 'Our team identifies automation opportunities and ROI potential' },
            { step: 3, title: 'Roadmap', description: 'You receive a prioritized implementation plan' },
            { step: 4, title: 'Presentation', description: 'We present findings with clear recommendations' }
        ],
        stats: [
            { value: 'Efficiency', label: 'Cost optimization focus' },
            { value: 'Speed', label: 'Rapid assessment process' },
            { value: 'Quality', label: 'Client-centered approach' }
        ]
    },
    'custom-ai-solutions': {
        title: 'Custom AI Solutions',
        subtitle: 'Turn complex problems into practical AI tools that work',
        heroPanelClass: 'bg-gradient-to-br from-[#0c1929] via-[#132f4c] to-[#0a1628]',
        description: 'We build bespoke AI solutions tailored to your specific business challenges. From generative AI applications to predictive models, we create tools that integrate seamlessly with your existing workflows.',
        benefits: [
            'Build generative AI apps for content & insights',
            'Develop predictive models for forecasting',
            'Create AI agents for repetitive tasks',
            'Engineer solutions tailored to your workflows'
        ],
        process: [
            { step: 1, title: 'Discovery', description: 'Deep dive into your specific requirements' },
            { step: 2, title: 'Design', description: 'Architecture and solution design' },
            { step: 3, title: 'Development', description: 'Agile build with regular demos' },
            { step: 4, title: 'Deployment', description: 'Production rollout with training' }
        ],
        stats: [
            { value: 'Custom', label: 'Tailored solutions' },
            { value: 'Agile', label: 'Flexible development' },
            { value: 'Excellence', label: 'Quality-driven results' }
        ]
    },
    'workflow-automation': {
        title: 'Workflow Automation',
        subtitle: 'Faster processes, fewer mistakes, and more time for growth',
        heroPanelClass: 'bg-gradient-to-br from-[#0d3d38] via-[#0f766e] to-[#0a2e2a]',
        description: 'Transform your business operations with intelligent workflow automation. We embed AI into your existing tools to eliminate manual tasks, reduce errors, and accelerate your processes.',
        benefits: [
            'Embed AI into CRM, ERP, and tools you use',
            'Automate email, ticketing, and scheduling',
            'Orchestrate multi-step workflows',
            'Reduce manual errors and speed up cycles'
        ],
        process: [
            { step: 1, title: 'Mapping', description: 'Document current workflows and pain points' },
            { step: 2, title: 'Design', description: 'Create optimized automation architecture' },
            { step: 3, title: 'Integration', description: 'Connect systems and implement automations' },
            { step: 4, title: 'Optimization', description: 'Monitor and continuously improve' }
        ],
        stats: [
            { value: 'Efficiency', label: 'Time-saving focus' },
            { value: 'Scale', label: 'Comprehensive automation' },
            { value: 'Precision', label: 'Accuracy-driven' }
        ]
    },
    'data-engineering': {
        title: 'Data Engineering',
        subtitle: 'Build the foundation for reliable, usable data powering every AI decision',
        heroPanelClass: 'bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0c4a6e]',
        description: 'Strong AI requires strong data foundations. We design and build the data infrastructure that enables reliable AI solutions, from secure architecture to real-time dashboards.',
        benefits: [
            'Design secure, scalable data architecture',
            'Create ETL/ELT pipelines and API integrations',
            'Clean, structure, and label data for accuracy',
            'Implement dashboards for real-time insights'
        ],
        process: [
            { step: 1, title: 'Audit', description: 'Assess current data infrastructure' },
            { step: 2, title: 'Architecture', description: 'Design scalable data systems' },
            { step: 3, title: 'Build', description: 'Implement pipelines and integrations' },
            { step: 4, title: 'Validate', description: 'Ensure data quality and governance' }
        ],
        stats: [
            { value: 'Scalable', label: 'Enterprise-ready' },
            { value: 'Robust', label: 'Reliable platforms' },
            { value: 'Secure', label: 'High availability' }
        ]
    },
    'ai-implementation': {
        title: 'AI Tools Implementation',
        subtitle: 'Deploy safe, scalable enterprise-grade AI tools with confidence',
        heroPanelClass: 'bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#1c1917]',
        description: 'Leverage leading AI platforms without the complexity. We implement enterprise AI tools with proper security, compliance, and governance guardrails built in from day one.',
        benefits: [
            'Integrate leading AI platforms into your stack',
            'Configure security and compliance guardrails',
            'Build prompt libraries and workflow templates',
            'Ensure seamless adoption without disruption'
        ],
        process: [
            { step: 1, title: 'Selection', description: 'Choose the right AI tools for your needs' },
            { step: 2, title: 'Configuration', description: 'Set up security and compliance' },
            { step: 3, title: 'Integration', description: 'Connect with existing systems' },
            { step: 4, title: 'Rollout', description: 'Phased deployment with support' }
        ],
        stats: [
            { value: 'Proven', label: 'Successful implementations' },
            { value: 'Compliant', label: 'Full regulatory adherence' },
            { value: 'Swift', label: 'Rapid deployment' }
        ]
    },
    'custom-rag': {
        title: 'Enterprise Model Deployment',
        subtitle: 'Fine-tune, host, and manage custom LLMs on your infrastructure with built-in trust and governance',
        heroPanelClass: 'bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#0f172a]',
        description: 'We deploy and manage enterprise-grade AI models tailored to your business — from fine-tuning open-source LLMs on your proprietary data to building production RAG pipelines with our CAAi Trust Layer. Whether on-prem, hybrid, or cloud, you get accurate, governed AI that stays under your control.',
        benefits: [
            'Fine-tune open-source LLMs on your proprietary data for domain-specific accuracy',
            'Deploy on-prem, hybrid, or cloud with full infrastructure control',
            'Built-in CAAi Trust Layer for governance, compliance, and safety guardrails',
            'Managed MLOps — monitoring, versioning, scaling, and continuous improvement'
        ],
        process: [
            { step: 1, title: 'Assessment', description: 'Evaluate your data, infrastructure, and model requirements' },
            { step: 2, title: 'Model Selection & Tuning', description: 'Choose and fine-tune the right base model for your domain' },
            { step: 3, title: 'Pipeline Build', description: 'Set up RAG, inference endpoints, Trust Layer, and integrations' },
            { step: 4, title: 'Deploy & Manage', description: 'Production rollout with monitoring dashboards and ongoing optimization' }
        ],
        stats: [
            { value: 'Governed', label: 'Trust Layer built in' },
            { value: 'Flexible', label: 'On-prem, hybrid, or cloud' },
            { value: 'Managed', label: 'Full MLOps included' }
        ]
    },
    'voice-ai': {
        title: 'Voice & Conversational AI',
        subtitle: 'Replace hold queues and rigid IVRs with intelligent voice agents that actually understand',
        heroPanelClass: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]',
        description: 'We design, build, and deploy AI-powered voice and conversational agents that handle real calls, answer complex questions, and take action — all while sounding natural. Whether you need to modernize a call center, automate appointment scheduling, or build a multilingual front-desk assistant, we deliver production-ready voice AI grounded in your business logic.',
        benefits: [
            'Deploy voice agents that handle inbound and outbound calls 24/7',
            'Replace legacy IVR trees with natural language understanding',
            'Automate appointment booking, order status, and FAQ resolution',
            'Integrate with your CRM, calendar, and ticketing systems in real time'
        ],
        process: [
            { step: 1, title: 'Use-Case Mapping', description: 'Identify call flows, intents, and integration points' },
            { step: 2, title: 'Agent Design', description: 'Build conversation scripts, fallback logic, and persona tuning' },
            { step: 3, title: 'Build & Test', description: 'Develop the voice pipeline with STT, LLM, and TTS components' },
            { step: 4, title: 'Deploy & Optimize', description: 'Go live with monitoring, call analytics, and continuous improvement' }
        ],
        applications: [
            {
                title: 'Call Center Automation',
                description: 'Handle tier-1 support calls — order tracking, password resets, billing inquiries — without human agents, escalating only when needed.'
            },
            {
                title: 'Appointment Scheduling',
                description: 'Patients, clients, or customers call in and book, reschedule, or cancel appointments through a natural voice conversation synced to your calendar.'
            },
            {
                title: 'Front-Desk & Receptionist',
                description: 'A virtual receptionist that greets callers, routes them to the right department, takes messages, and answers common questions about your business.'
            },
            {
                title: 'Outbound Campaigns',
                description: 'AI agents make outbound calls for appointment reminders, payment follow-ups, survey collection, and lead qualification at scale.'
            },
            {
                title: 'Multilingual Support',
                description: 'Serve customers in multiple languages without hiring multilingual staff — the voice agent detects and switches languages in real time.'
            },
            {
                title: 'Internal Helpdesk',
                description: 'Employees call an AI helpdesk to reset passwords, check PTO balances, submit IT tickets, or get answers from company policies — hands-free.'
            }
        ],
        stats: [
            { value: '24/7', label: 'Always-on availability' },
            { value: 'Natural', label: 'Human-like conversations' },
            { value: 'Fast', label: 'Sub-second response time' }
        ]
    },
    'training-support': {
        title: 'Training & Enablement',
        subtitle: 'Empower your team to use and lead with AI confidently',
        heroPanelClass: 'bg-gradient-to-br from-[#1f2937] via-[#1e3a8a] to-[#0f172a]',
        description: 'Technology is only as good as the people using it. Our training programs demystify AI and give your team the skills and confidence to leverage AI in their daily work.',
        benefits: [
            'Plain-language training that demystifies AI',
            'Step-by-step workshops for daily work',
            'Confidence building for your entire team',
            'Live sessions with Q&A and ongoing support'
        ],
        process: [
            { step: 1, title: 'Assessment', description: 'Evaluate current skill levels' },
            { step: 2, title: 'Curriculum', description: 'Design role-based training programs' },
            { step: 3, title: 'Delivery', description: 'Interactive workshops and hands-on labs' },
            { step: 4, title: 'Support', description: 'Ongoing coaching and resources' }
        ],
        stats: [
            { value: 'Expert', label: 'Professional training' },
            { value: 'Trusted', label: 'Highly recommended' },
            { value: 'Rated', label: 'Top-tier quality' }
        ]
    }
};

export default function ServiceDetail() {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const serviceId = urlParams.get('service') || 'discovery-diagnostic';
    const service = servicesData[serviceId] || servicesData['discovery-diagnostic'];

    const serviceKeys = Object.keys(servicesData);
    const currentIndex = serviceKeys.indexOf(serviceId);
    const prevService = currentIndex > 0 ? serviceKeys[currentIndex - 1] : null;
    const nextService = currentIndex < serviceKeys.length - 1 ? serviceKeys[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-[#060a14]">
            <SEOHead
                title={service.title}
                description={service.subtitle}
                path={`/ServiceDetail?service=${serviceId}`}
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Service',
                    name: service.title,
                    description: service.subtitle,
                    provider: {
                        '@type': 'Organization',
                        name: 'Catalyst Applied AI'
                    },
                    url: `https://catalystappliedai.com/ServiceDetail?service=${serviceId}`
                }}
            />
            <Navbar showNav={true} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {service.heroPanelClass ? (
                        <motion.div
                            className={`w-full h-full ${service.heroPanelClass}`}
                            initial={{ scale: 1.04, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                            key={serviceId}
                        />
                    ) : (
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
                    )}
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
            <section className="bg-[#0d1425]/50 border-y border-blue-500/10">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <motion.div
                        className="grid grid-cols-3 gap-8"
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
                        Book a free discovery call to discuss how we can help transform your business with AI.
                    </p>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                        <Button
                            onClick={() => window.location.href = `mailto:sales@catalystappliedai.com?subject=${encodeURIComponent(service.title)} Inquiry`}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-10 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-shadow"
                        >
                            Schedule a Discovery Call
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Navigation */}
            <section className="py-8 px-4 border-t border-blue-500/10">
                <div className="max-w-7xl mx-auto flex justify-between">
                    {prevService ? (
                        <Link
                            to={createPageUrl('ServiceDetail') + `?service=${prevService}`}
                            className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {servicesData[prevService].title}
                        </Link>
                    ) : <div />}
                    {nextService && (
                        <Link
                            to={createPageUrl('ServiceDetail') + `?service=${nextService}`}
                            className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group"
                        >
                            {servicesData[nextService].title}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
