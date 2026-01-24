import React from 'react';
import { motion } from 'framer-motion';

const GlowingBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,17,17,1)_0%,_rgba(5,5,5,1)_100%)]" />

            {/* Moving Orbs */}
            <motion.div
                animate={{
                    x: [0, 100, -100, 0],
                    y: [0, -100, 100, 0],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.33, 0.66, 1]
                }}
                className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]"
            />

            <motion.div
                animate={{
                    x: [0, -150, 150, 0],
                    y: [0, 100, -100, 0],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.33, 0.66, 1]
                }}
                className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]"
            />

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
        </div>
    );
};

export default GlowingBackground;
