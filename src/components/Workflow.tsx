"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic, Cpu, LayoutList, CheckSquare, Database, RefreshCcw, ChevronRight } from "lucide-react";

const steps = [
    { icon: Mic, number: "01", title: "Product Input", desc: "The vendor speaks product details or uploads an image — in any language, at any pace.", color: "bg-primary/15 text-primary border-primary/25" },
    { icon: Cpu, number: "02", title: "AI Processing", desc: "Our ASR + LLM pipeline transcribes, translates, and extracts structured product data.", color: "bg-secondary/15 text-secondary border-secondary/25" },
    { icon: LayoutList, number: "03", title: "Catalog Creation", desc: "Product listings are automatically structured with name, category, price, and description.", color: "bg-accent/15 text-accent border-accent/25" },
    { icon: CheckSquare, number: "04", title: "Vendor Review", desc: "The vendor quickly reviews the AI-generated card and approves or edits it.", color: "bg-success/15 text-success border-success/25" },
    { icon: Database, number: "05", title: "Offline Storage", desc: "Approved listings save locally. No internet? No problem — work continues uninterrupted.", color: "bg-warning/15 text-warning border-warning/25" },
    { icon: RefreshCcw, number: "06", title: "Auto Sync", desc: "Once connectivity returns, all new listings synchronise instantly to the cloud.", color: "bg-primary/15 text-primary border-primary/25" },
];

export default function Workflow() {
    return (
        <section id="how-it-works" className="relative py-24 overflow-hidden border-t border-white/[0.04]" aria-labelledby="workflow-heading">
            <div className="ambient-glow w-[500px] h-[500px] bg-secondary/8 bottom-0 left-0 pointer-events-none" />

            <div className="section-container py-0 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-4">Workflow</p>
                    <h2 id="workflow-heading" className="heading-l">
                        How it <span className="gradient-text">works</span>
                    </h2>
                    <p className="text-p max-w-2xl mx-auto">
                        From a spoken sentence to a published listing — the entire journey takes under 30 seconds.
                    </p>
                </motion.div>

                {/* Steps grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {steps.map(({ icon: Icon, number, title, desc, color }, idx) => (
                        <motion.div
                            key={number}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.08 }}
                            className="glass-card relative p-7 group border-white/[0.05] hover:border-primary/20"
                        >
                            {/* Step number */}
                            <span className="absolute top-5 right-5 text-4xl font-black text-white/[0.04] select-none" aria-hidden="true">
                                {number}
                            </span>

                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-5 ${color} group-hover:scale-110 transition-transform`}>
                                <Icon size={22} aria-hidden="true" />
                            </div>

                            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
                            <p className="text-sm text-muted leading-relaxed">{desc}</p>

                            {/* Connector arrow (not on last items in row) */}
                            {idx < steps.length - 1 && (
                                <ChevronRight
                                    size={18}
                                    className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/10 z-10"
                                    aria-hidden="true"
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
