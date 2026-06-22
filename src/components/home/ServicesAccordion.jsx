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
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        linkTo: createPageUrl('ServiceDetail') + '?service=discovery-diagnostic'
    },
    {
        id: 2,
        title: 'Custom AI Solutions',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        linkTo: createPageUrl('ServiceDetail') + '?service=custom-ai-solutions'
    },
    {
        id: 3,
        title: 'Workflow Automation',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
        linkTo: createPageUrl('ServiceDetail') + '?service=workflow-automation'
    },
    {
        id: 4,
        title: 'Data Engineering',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        linkTo: createPageUrl('ServiceDetail') + '?service=data-engineering'
    },
    {
        id: 5,
        title: 'AI Implementation',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        linkTo: createPageUrl('ServiceDetail') + '?service=ai-implementation'
    },
    {
        id: 6,
        title: 'Training & Support',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
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
                        Practical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">AI Solutions</span> for Your Business
                    </>
                }
                subtitle="We bridge the gap between potential and performance. From discovery to deployment, our comprehensive services transform how you work with AI. Click any service to learn more."
                ctaText="Book Your ROI Assessment"
                ctaHref="mailto:sales@catalystappliedai.com?subject=Request%20for%20Information"
                defaultActiveIndex={1}
                className="bg-[#060a14] text-white"
            />
        </motion.section>
    );
}
