"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Layers, Server, Globe, Database } from "lucide-react";

const Architecture = () => {
    const layers = [
        {
            title: "User Layer",
            icon: <Smartphone size={18} />,
            color: "border-primary",
            items: ["Mobile Application", "Web Dashboard", "Voice Input", "Image Upload"],
        },
        {
            title: "AI Processing Layer",
            icon: <Layers size={18} />,
            color: "border-secondary",
            items: ["Speech Recognition (ASR)", "NLP Processing", "IndicBERT Language Model", "Vision Detection"],
        },
        {
            title: "Application Services",
            icon: <Server size={18} />,
            color: "border-accent",
            items: ["Product Catalog CRUD", "Customer Management", "Invoice Management", "Delivery Tracking"],
        },
        {
            title: "Integration Layer",
            icon: <Globe size={18} />,
            color: "border-primary",
            items: ["ONDC Marketplace API", "Amazon Marketplace", "WhatsApp Business API", "Google Calendar API"],
        },
        {
            title: "Infrastructure Layer",
            icon: <Database size={18} />,
            color: "border-white/20",
            items: ["API Gateway", "Redis Queue", "MongoDB Database", "Authentication"],
        },
    ];

    return (
        <section id="architecture" className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#00f2ff,transparent_50%)]" />
            </div>

            <div className="section-container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="heading-l">System <span className="gradient-text">Architecture</span></h2>
                    <p className="text-p max-w-2xl mx-auto">
                        Layered architecture designed for scalability, offline resilience, and AI efficiency.
                    </p>
                </motion.div>

                <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                    {layers.map((layer, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            whileHover={{ scale: 1.02, x: 10 }}
                            className={`glass flex flex-col md:flex-row items-center border-l-8 ${layer.color} p-6 gap-8`}
                        >
                            <div className="flex flex-col items-center gap-2 min-w-[150px]">
                                <div className="p-3 bg-white/5 rounded-full text-primary">
                                    {layer.icon}
                                </div>
                                <h3 className="font-bold text-lg text-white text-center whitespace-nowrap">{layer.title}</h3>
                            </div>

                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                {layer.items.map((item, i) => (
                                    <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300">
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

export default Architecture;
