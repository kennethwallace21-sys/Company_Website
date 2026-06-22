import { useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * A hook that provides fluid scroll-triggered reveal states.
 *
 * Usage:
 *   const { ref, isInView } = useFluidReveal({ margin: "-80px", once: true });
 *   <div ref={ref} style={{ opacity: isInView ? 1 : 0 }} />
 */
export function useFluidReveal({ margin = '-100px', once = true } = {}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin, once });
    return { ref, isInView };
}

// ─── Reusable animation variants for framer-motion ───

/** Fade up for sections, cards, etc. */
export const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.65,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

/** Fade in from left */
export const fadeLeft = {
    hidden: { opacity: 0, x: -50, filter: 'blur(4px)' },
    visible: (delay = 0) => ({
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.65,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

/** Fade in from right */
export const fadeRight = {
    hidden: { opacity: 0, x: 50, filter: 'blur(4px)' },
    visible: (delay = 0) => ({
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.65,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

/** Scale up – good for cards and icons */
export const scaleUp = {
    hidden: { opacity: 0, scale: 0.85, filter: 'blur(6px)' },
    visible: (delay = 0) => ({
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 0.55,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

/** Container that staggers its children */
export const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.15,
        },
    },
};

/** Item for stagger children */
export const staggerItem = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};
