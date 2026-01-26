"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <section className="min-h-[85vh] flex flex-col justify-center items-start pt-10" id="home">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-medium text-orange-400 mb-6"
            >
                <Sparkles size={12} className="text-orange-500" />
                <span>Results-Driven Marketing</span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6"
            >
                Welcome to our <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 text-glow">
                    Digital Marketing Agency
                </span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-neutral-400 max-w-xl mb-10 leading-relaxed"
            >
                Unlock your business's potential with our digital marketing expertise. From app promotion to social media management and business branding, we drive results that matter.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-4"
            >
                <a href="#services" className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/30">
                    <span className="relative flex items-center gap-2">
                        Get Started <ArrowRight size={18} />
                    </span>
                </a>

                <a href="#contact" className="px-8 py-4 border border-white/10 rounded-full font-medium hover:bg-white/5 transition-colors">
                    Contact Us
                </a>
            </motion.div>

        </section>
    );
};

export default Hero;
