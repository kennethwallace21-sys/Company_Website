import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveImageAccordion } from '../ui/interactive-image-accordion';
import { createPageUrl } from '@/utils';
import { fadeUp } from '@/hooks/useFluidReveal';

// Premium solid / subtle gradient panels (no stock photos)
const servicesData = [
    {
        id: 2,
        title: 'Custom AI Solutions',
        panelClass: 'bg-gradient-to-br from-[#0c1929] via-[#132f4c] to-[#0a1628]',
        linkTo: createPageUrl('ServiceDetail') + '?service=custom-ai-solutions'
    },
    {
        id: 3,
        title: 'Workflow Automation',
        panelClass: 'bg-gradient-to-br from-[#0d3d38] via-[#0f766e] to-[#0a2e2a]',
        linkTo: createPageUrl('ServiceDetail') + '?service=workflow-automation'
    },
    {
        id: 4,
        title: 'Data Engineering',
        panelClass: 'bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0c4a6e]',
        linkTo: createPageUrl('ServiceDetail') + '?service=data-engineering'
    },
    {
        id: 5,
        title: 'AI Implementation',
        panelClass: 'bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#1c1917]',
        linkTo: createPageUrl('ServiceDetail') + '?service=ai-implementation'
    },
    {
        id: 6,
        title: 'Enterprise Model Deployment',
        panelClass: 'bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#0f172a]',
        linkTo: createPageUrl('ServiceDetail') + '?service=custom-rag'
    },
    {
        id: 7,
        title: 'Voice & Conversational AI',
        panelClass: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]',
        linkTo: createPageUrl('ServiceDetail') + '?service=voice-ai'
    },
];

export default function ServicesAccordion() {
    return (
        <motion.section
            id="services"
            className="bg-[#060a14] text-white"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            custom={0}
        >
            <InteractiveImageAccordion
                items={servicesData}
                title={
                    <>
                        Practical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">AI Solutions</span> for Your Business
                    </>
                }
                subtitle="We bridge the gap between potential and performance. From discovery to deployment, our comprehensive services transform how you work with AI. Click any service to learn more."
                ctaText="Book Your ROI Assessment"
                ctaHref="mailto:sales@catalystappliedai.com?subject=Request%20for%20Information"
                defaultActiveIndex={0}
                className="bg-[#060a14] text-white"
            />
        </motion.section>
    );
}
