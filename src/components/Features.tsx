"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic, Languages, ImageIcon, WifiOff, LayoutDashboard, ShoppingCart, Smartphone, Zap } from "lucide-react";

const features = [
    { icon: Mic, title: "Voice-Based Listing", desc: "Speak product details naturally. NLP handles extraction.", color: "text-primary", bg: "bg-primary/10" },
    { icon: Languages, title: "Multilingual Support", desc: "Tamil, Hindi, English — interact in your own language.", color: "text-secondary", bg: "bg-secondary/10" },
    { icon: ImageIcon, title: "Image Catalog Creation", desc: "Snap a photo and our AI creates the listing automatically.", color: "text-accent", bg: "bg-accent/10" },
    { icon: WifiOff, title: "Offline-First", desc: "Create listings without internet. Auto-syncs when online.", color: "text-warning", bg: "bg-warning/10" },
    { icon: LayoutDashboard, title: "Vendor Dashboard", desc: "Simple, fast, and designed for non-technical users.", color: "text-success", bg: "bg-success/10" },
    { icon: ShoppingCart, title: "Marketplace Ready", desc: "Listings export to ONDC and major e-commerce platforms.", color: "text-primary", bg: "bg-primary/10" },
    { icon: Smartphone, title: "Low-End Device Support", desc: "Optimised for budget Android phones used in rural areas.", color: "text-secondary", bg: "bg-secondary/10" },
    { icon: Zap, title: "Instant AI Processing", desc: "From voice to structured listing in under 2 seconds.", color: "text-accent", bg: "bg-accent/10" },
];

export default function Features() {
    return (
        <section id="features" className="relative py-24 overflow-hidden border-t border-white/[0.04]" aria-labelledby="features-heading">
            {/* Ambient center glow */}
            <div className="ambient-glow w-[700px] h-[400px] bg-primary/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="section-container py-0 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Key Features</p>
                    <h2 id="features-heading" className="heading-l">
                        Built for the <span className="gradient-text-primary">real world</span>
                    </h2>
                    <p className="text-p max-w-2xl mx-auto">
                        Every feature is designed to remove friction for small vendors — not add more.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map(({ icon: Icon, title, desc, color, bg }, idx) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card group flex flex-col gap-4 p-6 border-white/[0.05] hover:border-primary/25"
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color} group-hover:scale-110 transition-transform duration-300`}>
                                <Icon size={22} aria-hidden="true" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold mb-1.5 group-hover:text-primary transition-colors">{title}</h3>
                                <p className="text-sm text-muted leading-relaxed">{desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
