import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveImageAccordion } from '../ui/interactive-image-accordion';
import { createPageUrl } from '@/utils';
import { fadeUp } from '@/hooks/useFluidReveal';

// Catalyst Applied AI Services with relevant images and links
const servicesData = [
    {
        id: 1,
        title: 'Discovery & Diagnostic',
        imageUrl: '/services/discovery-diagnostic.jpg',
        linkTo: createPageUrl('ServiceDetail') + '?service=discovery-diagnostic'
    },
    {
        id: 2,
        title: 'Custom AI Solutions',
        imageUrl: '/services/custom-ai-solutions.jpg',
        linkTo: createPageUrl('ServiceDetail') + '?service=custom-ai-solutions'
    },
    {
        id: 3,
        title: 'Workflow Automation',
        imageUrl: '/services/workflow-automation.jpg',
        linkTo: createPageUrl('ServiceDetail') + '?service=workflow-automation'
    },
    {
        id: 4,
        title: 'Data Engineering',
        imageUrl: '/services/data-engineering.jpg',
        linkTo: createPageUrl('ServiceDetail') + '?service=data-engineering'
    },
    {
        id: 5,
        title: 'AI Implementation',
        imageUrl: '/services/ai-implementation.jpg',
        linkTo: createPageUrl('ServiceDetail') + '?service=ai-implementation'
    },
    {
        id: 6,
        title: 'Training & Support',
        imageUrl: '/services/training-support.jpg',
        linkTo: createPageUrl('ServiceDetail') + '?service=training-support'
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
                        Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">AI Systems</span> for Your Business
                    </>
                }
                subtitle="We scope it, build it, and deploy it in your environment. Click any service to learn more."
                ctaText="Book Your ROI Assessment"
                ctaHref="mailto:sales@catalystappliedai.com?subject=Request%20for%20Information"
                defaultActiveIndex={1}
                className="bg-[#060a14] text-white"
            />
        </motion.section>
    );
}
