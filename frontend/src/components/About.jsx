"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const About = () => {
    return (
        <section className="py-20 relative z-10" id="about">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Abstract Visual representation of "Digital Marketing" instead of generic illustration */}
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 flex items-center justify-center p-8">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-blue-500/20 to-pink-500/20 animate-pulse" />
                        <img
                            src="/gs-about.png"
                            alt="About GS Agency"
                            className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold mb-6">About <span className="text-purple-400">Us</span></h2>
                    <p className="text-lg text-neutral-300 mb-6 leading-relaxed">
                        Hello there! We are <strong className="text-white">GS Agency</strong>, a passionate and results-driven digital marketer team with a proven track record of success.
                    </p>
                    <p className="text-neutral-400 mb-8 leading-relaxed">
                        With years of experience under our belt, our agency can promote your applications, businesses, social media accounts, and more. Our aim is to make projects successful through strategic and innovative marketing campaigns. If you deal with us, we run totally on quality works, affordable pricing, and commitments about our services.
                    </p>

                    <div className="space-y-4">
                        {["Quality Work", "Affordable Pricing", "Strategic Campaigns"].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="text-green-400" size={20} />
                                <span className="font-medium text-white">{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
