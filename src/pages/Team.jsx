import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import { fadeUp, staggerContainer, staggerItem } from '@/hooks/useFluidReveal';
import SEOHead from '../components/SEOHead';

const teamMembers = [
    {
        name: 'Kenneth Wallace',
        role: 'CEO & Founder',
        initials: 'KW',
        photo: '/kenny-wallace.png',
        email: 'KennyWallace@catalystappliedai.com',
        linkedin: 'https://www.linkedin.com/in/kennethwallace21/',
        bio: 'Kenny started CAAi because he saw too many businesses being sold on AI that never delivered. With over a decade of experience supporting multi-national teams through complex people and change environments, he sets the company\'s direction, closes the deals, and makes sure every product and engagement ties back to one thing — real, measurable results for the client.',
        responsibilities: ['Company vision & strategy', 'Client partnerships', 'Product roadmap', 'Business development'],
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        name: 'Harsha Kolla',
        role: 'Director, Software Engineering',
        initials: 'HK',
        photo: '/harshakolla.jpg',
        photoPosition: 'object-[50%_8%]',
        email: 'harsha@catalystappliedai.com',
        linkedin: 'https://www.linkedin.com/in/harsha-kolla-357a211a8/',
        bio: 'Harsha leads engineering at CAAi, turning product ideas into production-ready platforms. He brings hands-on experience building microservices and AI-assisted systems for multi-national engineering environments—driving the technical architecture behind Command Center and Custom Models with a focus on security, reliability, and scale.',
        responsibilities: ['Platform architecture', 'Full-stack development', 'AI/ML pipelines', 'DevOps & infrastructure'],
        gradient: 'from-blue-600 to-blue-400',
    },
    {
        name: 'Mike Deason',
        role: 'Vice President, Operations',
        initials: 'MD',
        photo: '/michael-deason.png',
        email: 'mikedeason@catalystappliedai.com',
        linkedin: 'https://www.linkedin.com/in/michael-deason-coss-804352143/',
        bio: 'Mike keeps CAAi moving. With global people-operations and organizational development experience from working with large multi-national organizations, he owns project delivery and operations—making sure client work ships on time, teams have what they need, and nothing falls through the cracks. As the company grows, he\'s the one building the systems to scale with it.',
        responsibilities: ['Project delivery', 'Resource planning', 'Process optimization', 'Client success'],
        gradient: 'from-sky-500 to-blue-500',
    },
    {
        name: 'Jessa Sailor',
        role: 'Director of AI Public Sector Strategy',
        initials: 'JS',
        photo: '/jessa-sailor.jpg',
        email: 'jessa.sailor@catalystappliedai.com',
        linkedin: 'https://www.linkedin.com/in/jessasailor/',
        bio: 'Jessa is CAAi\'s bridge to government. She works directly with public sector and large organizations to identify where AI can cut through bureaucratic bottlenecks—and led the strategy behind CAAi CLERK, our document automation platform built for compliance-heavy environments.',
        responsibilities: ['Public sector strategy', 'Government partnerships', 'Compliance & security', 'CAAi CLERK product'],
        responsibilitiesGrid: true,
        gradient: 'from-blue-400 to-sky-400',
    },
];

export default function Team() {
    return (
        <div className="min-h-screen bg-[#060a14]">
            <SEOHead
                title="Our Team"
                description="Meet the team behind Catalyst Applied AI. Our experienced leaders drive practical AI solutions for businesses and the public sector."
                path="/Team"
            />
            <Navbar showNav={true} />

            <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/15 via-transparent to-transparent" />

                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Section Header */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        className="text-center mb-16"
                    >
                        <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
                            Who We Are
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 mb-4 sm:mb-6">
                            Meet Our{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
                                Team
                            </span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
                            A focused team of operators, engineers, and strategists with expertise built through work with multi-national companies—building AI products that solve real problems.
                        </p>
                    </motion.div>

                    {/* Founder — featured large card */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="mb-12"
                    >
                        <motion.div
                            variants={staggerItem}
                            whileHover={{ y: -6 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="group"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 p-6 sm:p-8 md:p-10 rounded-2xl bg-[#0d1425]/60 border border-blue-500/10 hover:border-blue-500/25 transition-all duration-500 backdrop-blur-sm hover:shadow-[0_8px_40px_rgba(59,130,246,0.06)]">
                                <div className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br ${teamMembers[0].gradient} p-[3px] shrink-0 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-shadow duration-500`}>
                                    <img
                                        src={teamMembers[0].photo}
                                        alt={teamMembers[0].name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                        {teamMembers[0].name}
                                    </h3>
                                    <p className={`text-sm font-semibold mt-1.5 text-transparent bg-clip-text bg-gradient-to-r ${teamMembers[0].gradient} tracking-wide uppercase`}>
                                        {teamMembers[0].role}
                                    </p>
                                    <p className="text-slate-400 text-sm sm:text-[15px] leading-relaxed mt-3 sm:mt-4 max-w-lg">
                                        {teamMembers[0].bio}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                                        {teamMembers[0].responsibilities.map((r) => (
                                            <span key={r} className="text-[11px] font-medium px-3 py-1 rounded-full bg-blue-500/[0.08] border border-blue-500/15 text-blue-300/80">
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 mt-5 justify-center md:justify-start">
                                        <a
                                            href={`mailto:${teamMembers[0].email}`}
                                            className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-blue-600 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300"
                                            aria-label={`Email ${teamMembers[0].name}`}
                                        >
                                            <Mail className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                                        </a>
                                        <a
                                            href={teamMembers[0].linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-blue-600 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300"
                                            aria-label={`${teamMembers[0].name} LinkedIn profile`}
                                        >
                                            <Linkedin className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Rest of the team — 3-column grid */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {teamMembers.slice(1).map((member) => (
                            <motion.div
                                key={member.name}
                                variants={staggerItem}
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="group flex flex-col items-center text-center"
                            >
                                <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1425]/60 border border-blue-500/10 hover:border-blue-500/25 transition-all duration-500 backdrop-blur-sm hover:shadow-[0_8px_40px_rgba(59,130,246,0.06)] w-full">
                                    {/* Photo */}
                                    <div className={`relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-br ${member.gradient} p-[3px] mb-5 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-shadow duration-500`}>
                                        {member.photo ? (
                                            <img
                                                src={member.photo}
                                                alt={member.name}
                                                className={`w-full h-full rounded-full object-cover ${member.photoPosition || ''}`}
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-white">{member.initials}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Name & Role */}
                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className={`text-xs font-semibold mt-1 text-transparent bg-clip-text bg-gradient-to-r ${member.gradient} tracking-wide uppercase`}>
                                        {member.role}
                                    </p>

                                    {/* Intro label */}
                                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/[0.08] border border-blue-500/15">
                                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                                        <span className="text-[11px] font-semibold text-blue-200/90">
                                            Team expertise built for enterprise delivery
                                        </span>
                                    </div>

                                    {/* Bio */}
                                    <div className="mt-3 p-4 rounded-xl bg-[#0d1425]/60 border border-white/[0.06]">
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {member.bio}
                                        </p>
                                    </div>

                                    {/* Responsibilities */}
                                    <div className={`${member.responsibilitiesGrid ? 'grid grid-cols-2' : 'flex flex-wrap justify-center'} gap-1.5 mt-4`}>
                                        {member.responsibilities.map((r) => (
                                            <span key={r} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-blue-500/[0.08] border border-blue-500/15 text-blue-300/80 text-center">
                                                {r}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Links */}
                                    <div className="flex gap-3 mt-5 justify-center">
                                        <a
                                            href={`mailto:${member.email}`}
                                            className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-blue-600 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300"
                                            aria-label={`Email ${member.name}`}
                                        >
                                            <Mail className="w-3.5 h-3.5 text-slate-400 hover:text-white transition-colors" />
                                        </a>
                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-blue-600 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300"
                                            aria-label={`${member.name} LinkedIn profile`}
                                        >
                                            <Linkedin className="w-3.5 h-3.5 text-slate-400 hover:text-white transition-colors" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
