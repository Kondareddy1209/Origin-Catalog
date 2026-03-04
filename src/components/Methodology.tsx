"use client";

import React from "react";
import { motion } from "framer-motion";
import { Hammer, Mic2, Brain, Laptop, Terminal, Bug } from "lucide-react";

const Methodology = () => {
    const processes = [
        { title: "System Design", icon: <Hammer />, items: ["Local and cloud database design", "Offline-first sync model"] },
        { title: "Voice Processing", icon: <Mic2 />, items: ["Hindi, Tamil, English support", "ASR with Vosk / Google STT"] },
        { title: "AI Processing", icon: <Brain />, items: ["IndicBERT for understanding", "Entity recognition for products"] },
        { title: "App Development", icon: <Laptop />, items: ["Flutter mobile application", "Responsive web dashboard"] },
        { title: "Integration", icon: <Terminal />, items: ["WhatsApp Business integration", "ONDC & Amazon marketplace sync"] },
        { title: "Testing", icon: <Bug />, items: ["Rural usability testing", "Speech optimization"] },
    ];

    return (
        <section id="methodology" className="py-24 bg-background overflow-hidden relative">
            <div className="section-container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="heading-l">Implementation <span className="text-secondary">Methodology</span></h2>
                    <p className="text-p max-w-2xl mx-auto">
                        A comprehensive, modular approach to bringing CatalogBuddy to life.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {processes.map((process, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card hover:bg-slate-900/40 p-10 border-white/5 border-t-4 border-t-primary/30"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-8 animate-float" style={{ animationDelay: `${idx * 0.5}s` }}>
                                {process.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-6 text-white uppercase tracking-tight">{process.title}</h3>
                            <ul className="space-y-4">
                                {process.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-400 group">
                                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full group-hover:bg-primary transition-colors" />
                                        <span className="group-hover:text-slate-200 transition-colors">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Methodology;
