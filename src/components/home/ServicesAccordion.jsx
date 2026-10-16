import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveImageAccordion } from '../ui/interactive-image-accordion';
import { contactUrl } from '@/utils';
import { offerings, serviceDetailPath } from '@/data/offerings';
import { fadeUp } from '@/hooks/useFluidReveal';

// One accordion panel per offering (src/data/offerings.js).
const servicesData = offerings.map((o) => ({
    id: o.slug,
    title: o.title,
    imageUrl: o.image,
    linkTo: serviceDetailPath(o.slug),
}));

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
                subtitle="We scope it, build it, and deploy it in your environment. Choose any service to learn more."
                ctaText="Book Your ROI Assessment"
                ctaHref={contactUrl('ROI Assessment')}
                defaultActiveIndex={1}
                className="bg-[#060a14] text-white"
            />
        </motion.section>
    );
}
