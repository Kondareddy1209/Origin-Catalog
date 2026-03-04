"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const Conclusion = () => {
    return (
        <section id="conclusion" className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />

            <div className="section-container relative z-10">
                <div className="max-w-4xl mx-auto glass-card p-12 md:p-20 text-center border-white/10 hover:border-primary/30">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-10"
                    >
                        <CheckCircle2 size={40} />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black mb-8 text-white leading-tight"
                    >
                        Bridging the <br />
                        <span className="gradient-text">Digital Divide</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-300 mb-12 leading-relaxed"
                    >
                        CatalogBuddy is a voice-first multilingual catalog platform designed to remove barriers in digital commerce. By combining offline speech recognition, AI language processing, and marketplace integrations, the system allows vendors to enter the digital economy without needing digital literacy.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="inline-block px-10 py-5 bg-gradient-to-r from-primary to-secondary text-background font-black text-xl rounded-2xl neon-border hover:scale-105 transition-transform cursor-pointer"
                    >
                        Join the Revolution
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Conclusion;
