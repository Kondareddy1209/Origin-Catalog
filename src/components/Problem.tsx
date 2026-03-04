"use client";

import React from "react";
import { motion } from "framer-motion";
import { Keyboard, UserMinus, Languages, FileText, WifiOff, TrendingDown } from "lucide-react";

const challenges = [
    { icon: Keyboard, label: "Typing Barriers", desc: "Vendors struggle with complex digital form-filling", color: "text-orange-400", bg: "bg-orange-400/10" },
    { icon: UserMinus, label: "Low Digital Literacy", desc: "Millions excluded by interface complexity", color: "text-red-400", bg: "bg-red-400/10" },
    { icon: Languages, label: "Language Gaps", desc: "Platforms force interaction in a non-native language", color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { icon: FileText, label: "Complex Listing Systems", desc: "Dozens of fields intimidate first-time vendors", color: "text-primary", bg: "bg-primary/10" },
    { icon: WifiOff, label: "Poor Connectivity", desc: "Rural areas face unreliable internet access", color: "text-secondary", bg: "bg-secondary/10" },
    { icon: TrendingDown, label: "Lost Revenue", desc: "Offline vendors miss out on digital market growth", color: "text-accent", bg: "bg-accent/10" },
];

export default function Problem() {
    return (
        <section id="problem" className="relative py-24 overflow-hidden border-t border-white/[0.04]" aria-labelledby="problem-heading">
            {/* Ambient blob */}
            <div className="ambient-glow w-[600px] h-[600px] bg-red-500/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="section-container relative z-10 py-0">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold uppercase tracking-[0.2em] text-danger mb-4"
                    >
                        The Problem
                    </motion.p>
                    <motion.h2
                        id="problem-heading"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="heading-l"
                    >
                        Millions of vendors are{" "}
                        <span className="text-danger/80">left behind</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-p mx-auto"
                    >
                        Small and rural vendors face systemic barriers that prevent them from participating in digital commerce. The current solutions are built for the digitally fluent — not for everyone.
                    </motion.p>
                </div>

                {/* Challenge grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {challenges.map(({ icon: Icon, label, desc, color, bg }, idx) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.07 }}
                            className="glass-card flex gap-4 items-start p-6"
                        >
                            <div className={`p-3 rounded-xl ${bg} shrink-0 ${color}`}>
                                <Icon size={20} aria-hidden="true" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-foreground mb-1">{label}</h3>
                                <p className="text-sm text-muted leading-relaxed">{desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quote */}
                <motion.blockquote
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 max-w-3xl mx-auto text-center"
                >
                    <p className="text-2xl font-bold text-foreground/80 italic leading-relaxed mb-4">
                        &ldquo;Technology should empower everyone, not just those who are already digitally fluent.&rdquo;
                    </p>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-danger/50 to-transparent mx-auto" />
                </motion.blockquote>
            </div>
        </section>
    );
}
