"use client";
import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const WorkCard = ({ project }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            onMouseMove={handleMouseMove}
            className="group relative h-[300px] md:h-[350px] w-full rounded-3xl bg-neutral-900/50 border border-white/5 overflow-hidden"
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(147, 51, 234, 0.15),
              transparent 80%
            )
          `,
                }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-6 z-10">
                <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="relative z-20 transform transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-400 text-sm font-medium tracking-wider uppercase">{project.category}</span>
                        <ExternalLink size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-neutral-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 line-clamp-2">
                        {project.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default WorkCard;
