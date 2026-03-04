"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Mic, BrainCircuit, Server, Cloud, Link } from "lucide-react";

const TechStack = () => {
    const stack = [
        { category: "Mobile App", icon: <Smartphone />, items: ["Flutter", "SQLite / Hive", "Firebase"] },
        { category: "Voice Recognition", icon: <Mic />, items: ["Vosk (Offline)", "Google Speech API"] },
        { category: "AI Models", icon: <BrainCircuit />, items: ["IndicBERT", "spaCy NLP", "Vision tagging"] },
        { category: "Backend", icon: <Server />, items: ["FastAPI", "MongoDB", "Redis Queue"] },
        { category: "Deployment", icon: <Cloud />, items: ["Docker", "GitHub Actions", "GCP / Render"] },
        { category: "External APIs", icon: <Link />, items: ["ONDC Seller API", "WhatsApp API", "Google Calendar API", "Amazon / Shopify APIs"] },
    ];

    return (
        <section id="tech-stack" className="py-24 bg-slate-950 relative overflow-hidden">
            <div className="section-container relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="heading-l">Modern <span className="gradient-text">Tech Stack</span></h2>
                    <p className="text-p max-w-2xl mx-auto">
                        Leveraging cutting-edge technologies for reliability and performance.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stack.map((group, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ rotateY: 10, rotateX: 5 }}
                            className="glass p-8 rounded-3xl border-white/5 bg-slate-900/40 relative group perspective-1000"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                {group.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-6 text-primary flex items-center gap-3">
                                {group.icon}
                                {group.category}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {group.items.map((item, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-400 font-mono">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechStack;
