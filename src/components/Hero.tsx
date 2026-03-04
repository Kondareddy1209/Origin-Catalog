"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic, ImageIcon, ShoppingCart, Globe, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const floatingItems = [
    { Icon: Mic, label: "Voice Input", top: "15%", left: "8%", delay: 0, color: "text-primary" },
    { Icon: ImageIcon, label: "Image Upload", top: "20%", right: "10%", delay: 0.5, color: "text-secondary" },
    { Icon: ShoppingCart, label: "E-Commerce Ready", bottom: "25%", left: "6%", delay: 1, color: "text-accent" },
    { Icon: Globe, label: "Multilingual", bottom: "20%", right: "8%", delay: 1.5, color: "text-primary" },
];

export default function Hero() {
    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
            aria-label="Hero section"
        >
            {/* Background image with mask */}
            <div className="absolute inset-0 z-0 hero-mask">
                <div
                    className="absolute inset-0 hero-bg bg-cover bg-center bg-no-repeat opacity-20"
                    role="img"
                    aria-label="Futuristic dark background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/20 to-background" />
            </div>

            {/* Ambient glow blobs */}
            <div className="ambient-glow w-[500px] h-[500px] bg-primary/20 top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/4" />
            <div className="ambient-glow w-[400px] h-[400px] bg-secondary/15 top-1/3 right-0" />
            <div className="ambient-glow w-[300px] h-[300px] bg-accent/10 bottom-0 left-1/2" />

            {/* Floating feature pills */}
            <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
                {floatingItems.map(({ Icon, label, top, left, right, bottom, delay, color }, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: delay + 0.8 }}
                        className="absolute hidden md:flex items-center gap-2.5 px-4 py-2.5 glass rounded-2xl border-white/10"
                        style={{ top, left, right, bottom }}
                    >
                        <div className={`p-1.5 rounded-lg bg-white/5 ${color}`}>
                            <Icon size={15} aria-hidden="true" />
                        </div>
                        <span className="text-xs font-bold text-slate-300">{label}</span>
                    </motion.div>
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/30 text-xs font-bold text-primary mb-8 neon-border"
                >
                    <Sparkles size={12} aria-hidden="true" />
                    Voice-First AI Catalog Platform
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="heading-xl gradient-text mb-6"
                >
                    CatalogBuddy
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-2xl md:text-3xl font-bold text-slate-300 mb-6"
                >
                    Voice-First Digital Commerce
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-lg text-muted max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Helping small vendors create product listings using <strong className="text-foreground font-semibold">voice</strong> or{" "}
                    <strong className="text-foreground font-semibold">images</strong> — no typing, no complexity, just commerce.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-4"
                >
                    <a
                        href="#features"
                        className="btn-primary text-base py-3.5 px-8 group"
                    >
                        Explore Features
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </a>
                    <a
                        href="#how-it-works"
                        className="btn-secondary text-base py-3.5 px-8"
                    >
                        How It Works
                    </a>
                    <Link
                        href="/signup"
                        className="btn-secondary text-base py-3.5 px-8 border-primary/30 text-primary hover:bg-primary/10"
                    >
                        Get Started Free
                    </Link>
                </motion.div>

                {/* Social proof row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted"
                    aria-label="Key statistics"
                >
                    {[
                        { value: "Voice", label: "First Interaction" },
                        { value: "3+", label: "Languages Supported" },
                        { value: "Offline", label: "First Architecture" },
                    ].map(({ value, label }) => (
                        <div key={value} className="text-center">
                            <div className="text-2xl font-extrabold text-foreground">{value}</div>
                            <div className="text-xs font-semibold text-muted uppercase tracking-wider mt-1">{label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                aria-hidden="true"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-[1px] h-12 bg-gradient-to-b from-primary/60 to-transparent mx-auto"
                />
            </motion.div>
        </section>
    );
}
