"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Globe, Smartphone, TrendingUp } from "lucide-react";

const impacts = [
    { icon: Smartphone, title: "80% less time", desc: "Vendors spend far less time on catalog creation with voice input.", color: "text-primary", bg: "bg-primary/10" },
    { icon: Users, title: "Barrier-free access", desc: "No typing or tech skills required — anyone can participate in digital commerce.", color: "text-secondary", bg: "bg-secondary/10" },
    { icon: Globe, title: "Language inclusive", desc: "Vendors interact in their own tongue. Commerce without language barriers.", color: "text-accent", bg: "bg-accent/10" },
    { icon: TrendingUp, title: "Market reach expanded", desc: "Local products connect with regional and global buyers through digital listings.", color: "text-success", bg: "bg-success/10" },
];

export default function Impact() {
    return (
        <section id="impact" className="relative py-24 overflow-hidden border-t border-white/[0.04]" aria-labelledby="impact-heading">
            <div className="ambient-glow w-[500px] h-[500px] bg-success/8 top-1/2 left-0 -translate-y-1/2 pointer-events-none" />

            <div className="section-container py-0 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-success mb-4">Impact</p>
                    <h2 id="impact-heading" className="heading-l">
                        Making commerce <span className="gradient-text">accessible</span>
                    </h2>
                    <p className="text-p max-w-2xl mx-auto">
                        CatalogBuddy doesn&apos;t just simplify listings — it opens the digital economy to those who were never invited in.
                    </p>
                </motion.div>

                {/* Impact cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                    {impacts.map(({ icon: Icon, title, desc, color, bg }, idx) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.08 }}
                            className="glass-card text-center group p-7"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color} mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                                <Icon size={24} aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-extrabold mb-2">{title}</h3>
                            <p className="text-sm text-muted leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Centered pull-quote */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-card max-w-3xl mx-auto text-center p-12 border-primary/10 bg-primary/[0.03] relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <p className="text-2xl md:text-3xl font-extrabold leading-relaxed mb-5">
                        &ldquo;Technology should empower everyone, regardless of digital literacy.&rdquo;
                    </p>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent mx-auto" />
                </motion.div>
            </div>
        </section>
    );
}
