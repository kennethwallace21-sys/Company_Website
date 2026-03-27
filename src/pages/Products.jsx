import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import SEOHead from '../components/SEOHead';

export default function Products() {
    return (
        <div className="min-h-screen bg-[#060a14] overflow-hidden flex flex-col">
            <SEOHead
                title="AI Products"
                description="Our AI-powered products are coming soon. Stay tuned for updates."
                path="/Products"
            />
            <Navbar showNav={true} />

            <div className="flex-1 flex items-center justify-center px-4">
                <motion.div
                    className="text-center max-w-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.div
                        className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Rocket className="w-10 h-10 text-blue-400" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Coming Soon
                    </h1>
                    <p className="text-slate-400 text-lg mb-8">
                        We're building something exciting. Our AI-powered products are currently in development and will be available soon.
                    </p>
                    <motion.a
                        href="mailto:sales@catalystappliedai.com?subject=Product Updates Subscription"
                        className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium px-8 py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Get Notified When We Launch
                    </motion.a>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
