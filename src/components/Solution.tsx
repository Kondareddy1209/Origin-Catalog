"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Mic, ImageIcon, CheckCircle2, ArrowRight } from "lucide-react";

const pillars = [
    {
        icon: Mic,
        title: "Speak your listing",
        desc: "Describe your product in plain language — any dialect, any pace. Our AI extracts the details.",
        color: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/20",
    },
    {
        icon: ImageIcon,
        title: "Snap a photo",
        desc: "Point your camera at a product. Our vision AI reads the item and auto-fills the listing form.",
        color: "text-secondary",
        bg: "bg-secondary/10",
        border: "border-secondary/20",
    },
    {
        icon: CheckCircle2,
        title: "Review and publish",
        desc: "Glance at the AI-generated card, make quick edits, and push it live — in seconds.",
        color: "text-success",
        bg: "bg-success/10",
        border: "border-success/20",
    },
];

export default function Solution() {
    return (
        <section id="solution" className="relative py-24 overflow-hidden border-t border-white/[0.04]" aria-labelledby="solution-heading">
            <div className="ambient-glow w-[500px] h-[500px] bg-primary/10 top-1/2 right-0 -translate-y-1/2 pointer-events-none" />

            <div className="section-container py-0 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left — text */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Our Solution</p>
                        <h2 id="solution-heading" className="heading-l">
                            A <span className="gradient-text-primary">simpler way</span> to list your products
                        </h2>
                        <p className="text-p mb-10">
                            CatalogBuddy replaces the keyboard with your voice and camera. No forms, no complexity — just speak or snap, and your product listing is ready.
                        </p>

                        <div className="space-y-6">
                            {pillars.map(({ icon: Icon, title, desc, color, bg, border }, idx) => (
                                <motion.div
                                    key={title}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`flex gap-4 p-4 rounded-2xl border ${border} ${bg}`}
                                >
                                    <div className={`p-2.5 rounded-xl bg-white/5 shrink-0 ${color}`}>
                                        <Icon size={20} aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">{title}</h3>
                                        <p className="text-muted text-sm leading-relaxed">{desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-8"
                        >
                            <a href="#demo" className="btn-primary inline-flex text-base py-3 px-7 group">
                                See it in action
                                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Right — animated demo card */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative"
                    >
                        <div className="glass-card p-0 rounded-[2rem] overflow-hidden border-primary/10">
                            <div className="bg-surface rounded-[1.9rem] p-8 min-h-[380px] flex flex-col justify-center items-center relative overflow-hidden gap-6">

                                {/* Scanning line animation */}
                                <motion.div
                                    animate={{ y: [-120, 120, -120] }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                                />

                                {/* Mic icon pulsing */}
                                <div className="relative">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                                    />
                                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                                        <Mic size={34} className="text-white" aria-hidden="true" />
                                    </div>
                                </div>

                                {/* Waveform */}
                                <div className="flex gap-1.5 items-end h-7" aria-label="Voice waveform animation" role="img">
                                    {[0.3, 0.7, 0.4, 1, 0.6, 0.9, 0.5, 0.8, 0.35, 0.65, 0.45].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ scaleY: [h, h + 0.4, h] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
                                            className="w-1.5 rounded-full bg-primary origin-bottom"
                                            style={{ height: `${h * 100}%` }}
                                        />
                                    ))}
                                </div>

                                {/* Status */}
                                <p className="text-sm font-semibold text-primary/80 animate-pulse">Listening…</p>

                                {/* Auto-filled card preview */}
                                <div className="glass-card w-full p-4 mt-2 bg-white/[0.03] border-white/[0.06]">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Auto-Generated Listing</p>
                                    <p className="text-sm text-foreground/80 italic leading-relaxed">
                                        &ldquo;Handmade red silk scarf, 2m long, premium material, ₹800…&rdquo;
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Glow blobs behind card */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/15 blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 blur-[60px] rounded-full pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
