import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Accordion Item Component ---
// Every item is its own Link (a focusable element without one), so keyboard and
// touch users can reach every service, not only the one the mouse expanded.
// Focus expands an item the same way hover does; a tap follows the link.
const AccordionItem = ({ item, isActive, onActivate, linkTo }) => {
    const className = `
        relative block h-[450px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060a14]
    `;
    const style = {
        flex: isActive ? '6 1 0%' : '1 1 0%',
        minWidth: isActive ? '0' : '50px',
    };

    const content = (
        <>
            {/* Background Image (decorative: the item title is the accessible name) */}
            <img
                src={item.imageUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                    transform: isActive ? 'scale(1)' : 'scale(1.15)',
                }}
            />
            {/* Dark overlay */}
            <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                    backgroundColor: isActive ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.55)',
                }}
            />

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Learn More indicator for active */}
            {isActive && linkTo && (
                <motion.div
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 text-cyan-400 text-sm font-medium whitespace-nowrap"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    key={item.id + '-hint'}
                    aria-hidden="true"
                >
                    Learn more →
                </motion.div>
            )}

            {/* Caption Text */}
            <span
                className={`
                    absolute text-white text-lg font-semibold whitespace-nowrap
                    transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${isActive
                        ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0 opacity-100'
                        : 'bottom-24 left-1/2 -translate-x-1/2 rotate-90 opacity-80 origin-center'
                    }
                `}
            >
                {item.title}
            </span>
        </>
    );

    if (linkTo) {
        return (
            <Link
                to={linkTo}
                className={`group ${className}`}
                style={style}
                onMouseEnter={onActivate}
                onFocus={onActivate}
            >
                {content}
            </Link>
        );
    }

    return (
        <div
            tabIndex={0}
            className={className}
            style={style}
            onMouseEnter={onActivate}
            onFocus={onActivate}
        >
            {content}
        </div>
    );
};

// --- Main Component ---
export function InteractiveImageAccordion({
    items,
    title,
    subtitle,
    ctaText,
    ctaHref,
    defaultActiveIndex = 0,
    className = ""
}) {
    const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

    return (
        <div className={`font-sans ${className}`}>
            <section className="container mx-auto px-4 py-12 md:py-24">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Left Side: Text Content */}
                    <motion.div
                        className="w-full lg:w-1/2 text-center lg:text-left"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                            {title}
                        </h2>
                        <p className="mt-6 text-lg opacity-80 max-w-xl mx-auto lg:mx-0">
                            {subtitle}
                        </p>
                        {ctaText && ctaHref && (
                            <motion.div
                                className="mt-8"
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="inline-block"
                                >
                                    <Link
                                        to={ctaHref}
                                        className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-shadow"
                                    >
                                        {ctaText}
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Right Side: Image Accordion */}
                    <motion.div
                        className="w-full lg:w-1/2"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="flex flex-row items-stretch gap-2 p-2">
                            {items.map((item, index) => (
                                <AccordionItem
                                    key={item.id}
                                    item={item}
                                    isActive={index === activeIndex}
                                    onActivate={() => setActiveIndex(index)}
                                    linkTo={item.linkTo}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default InteractiveImageAccordion;
