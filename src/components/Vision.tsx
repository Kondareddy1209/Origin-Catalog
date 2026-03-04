"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Rocket, Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";

const pillars = [
    {
        icon: Target,
        title: "Remove Technical Barriers",
        desc: "Eliminate the need for keyboards, forms, and digital fluency. Just speak or snap.",
        color: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/20",
    },
    {
        icon: Rocket,
        title: "Accelerate Digital Inclusion",
        desc: "Enable any vendor — anywhere — to participate in digital commerce with zero prior experience.",
        color: "text-secondary",
        bg: "bg-secondary/10",
        border: "border-secondary/20",
    },
    {
        icon: Lightbulb,
        title: "Scalable Across Regions",
        desc: "The same voice-first model adapts to any language, dialect, or regional marketplace globally.",
        color: "text-accent",
        bg: "bg-accent/10",
        border: "border-accent/20",
    },
];

export default function Vision() {
    return (
        <section
            id="vision"
            className="relative py-24 overflow-hidden border-t border-white/[0.04]"
            aria-labelledby="vision-heading"
        >
            {/* Background blobs */}
            <div className="ambient-glow w-[500px] h-[500px] bg-primary/10 top-0 right-0 pointer-events-none" />
            <div className="ambient-glow w-[400px] h-[400px] bg-accent/8 bottom-0 left-0 pointer-events-none" />

            <div className="section-container py-0 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left — text */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">Vision</p>
                        <h2 id="vision-heading" className="heading-l">
                            The future of <span className="gradient-text">inclusive commerce</span>
                        </h2>
                        <p className="text-p mb-10">
                            CatalogBuddy is a step toward a world where anyone can become a digital vendor — not just those who are already online.
                        </p>

                        <div className="space-y-5">
                            {pillars.map(({ icon: Icon, title, desc, color, bg, border }, idx) => (
                                <motion.div
                                    key={title}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`flex gap-4 p-5 rounded-2xl border ${border} ${bg}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 shrink-0 ${color}`}>
                                        <Icon size={20} aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">{title}</h3>
                                        <p className="text-sm text-muted leading-relaxed">{desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-10 flex flex-wrap gap-4"
                        >
                            <Link href="/signup" className="btn-primary text-base py-3.5 px-8 group">
                                Get Started Free
                                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </Link>
                            <a href="#demo" className="btn-secondary text-base py-3.5 px-8">
                                Watch Demo
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Right — abstract visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative hidden lg:flex items-center justify-center"
                        aria-hidden="true"
                    >
                        {/* Outer spinning ring */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                            className="absolute w-72 h-72 rounded-full border border-dashed border-primary/20"
                        />
                        {/* Middle ring */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            className="absolute w-48 h-48 rounded-full border border-dashed border-secondary/20"
                        />

                        {/* Center glass card */}
                        <div className="relative w-52 h-52 glass rounded-[2rem] flex flex-col items-center justify-center gap-3 border-white/10 z-10">
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                            <p className="text-4xl font-black gradient-text relative z-10">Empower</p>
                            <p className="text-xs font-bold text-muted uppercase tracking-[0.25em] relative z-10">Rural Commerce</p>
                        </div>

                        {/* Pulsing glow behind card */}
                        <div className="absolute w-48 h-48 bg-primary/20 rounded-full blur-[80px] animate-pulse-slow" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
