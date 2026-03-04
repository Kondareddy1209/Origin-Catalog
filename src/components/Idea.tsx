"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic, Image as ImageIcon, Type, BrainCircuit, FileText, Truck, Smartphone, WifiOff } from "lucide-react";

const Idea = () => {
    const features = [
        { title: "Voice Input", desc: "Speak naturally in local languages.", icon: <Mic size={24} /> },
        { title: "Product Images", icon: <ImageIcon size={24} />, desc: "Auto-tagging from photos." },
        { title: "Simple Text", icon: <Type size={24} />, desc: "Minimal typing required." },
        { title: "AI Agent", icon: <BrainCircuit size={24} />, desc: "LLM-powered listing generation." },
        { title: "Invoice Tracking", icon: <FileText size={24} />, desc: "Automated billing support." },
        { title: "Delivery Tracking", icon: <Truck size={24} />, desc: "Real-time logistics sync." },
        { title: "Mobile & Web", icon: <Smartphone size={24} />, desc: "Works on any device." },
        { title: "Offline-First", icon: <WifiOff size={24} />, desc: "Syncs when internet returns." },
    ];

    return (
        <section id="idea" className="py-24 bg-gradient-to-b from-background to-slate-900/50">
            <div className="section-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="heading-l">Our <span className="text-primary">Solution</span></h2>
                    <p className="text-p max-w-2xl mx-auto">
                        CatalogBuddy empowers vendors to create product listings using voice, images, and AI intelligence, bridging the gap between local commerce and global marketplaces.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card hover:border-primary group"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                            <p className="text-slate-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Idea;
