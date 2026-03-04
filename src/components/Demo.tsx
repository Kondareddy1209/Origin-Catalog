"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ImageIcon, Loader2, Check, ArrowRight, RotateCcw } from "lucide-react";

type DemoMode = "voice" | "image" | null;
type DemoState = "idle" | "processing" | "result";

const VOICE_RESULT = {
    name: "Handmade Clay Pot",
    category: "Home Decor",
    price: "₹800",
    desc: "Traditional cooling clay pot, 5L capacity, handcrafted by local artisans.",
};

const IMAGE_RESULT = {
    name: "Premium Cotton Fabric",
    category: "Textiles",
    price: "₹350/metre",
    desc: "High-thread-count cotton fabric with intricate block-print patterns.",
};

export default function Demo() {
    const [mode, setMode] = useState<DemoMode>(null);
    const [demoState, setDemoState] = useState<DemoState>("idle");

    const runDemo = (type: DemoMode) => {
        setMode(type);
        setDemoState("processing");
        setTimeout(() => setDemoState("result"), 2200);
    };

    const reset = () => {
        setMode(null);
        setDemoState("idle");
    };

    const result = mode === "voice" ? VOICE_RESULT : IMAGE_RESULT;

    return (
        <section id="demo" className="relative py-24 overflow-hidden border-t border-white/[0.04]" aria-labelledby="demo-heading">
            <div className="ambient-glow w-[600px] h-[400px] bg-primary/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="section-container py-0 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Live Demo</p>
                    <h2 id="demo-heading" className="heading-l">
                        Try it <span className="gradient-text">yourself</span>
                    </h2>
                    <p className="text-p max-w-2xl mx-auto">
                        Click either demo to see how CatalogBuddy converts raw input into a structured product listing in seconds.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-10 items-start">
                    {/* Buttons */}
                    <div className="space-y-4">
                        {/* Voice card */}
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            onClick={() => runDemo("voice")}
                            disabled={demoState === "processing"}
                            className={`w-full text-left glass-card p-7 border-l-4 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${mode === "voice" ? "border-l-primary bg-primary/5" : "border-l-transparent hover:border-l-primary/40"
                                }`}
                            aria-pressed={mode === "voice"}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <Mic size={22} aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-extrabold">Voice Input Demo</h3>
                            </div>
                            <p className="text-sm text-muted mb-4">Simulate a vendor speaking product details to generate a listing.</p>
                            <span className="text-primary font-bold text-sm flex items-center gap-1.5 group">
                                Run demo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </span>
                        </motion.button>

                        {/* Image card */}
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            onClick={() => runDemo("image")}
                            disabled={demoState === "processing"}
                            className={`w-full text-left glass-card p-7 border-l-4 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${mode === "image" ? "border-l-secondary bg-secondary/5" : "border-l-transparent hover:border-l-secondary/40"
                                }`}
                            aria-pressed={mode === "image"}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                                    <ImageIcon size={22} aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-extrabold">Image Scan Demo</h3>
                            </div>
                            <p className="text-sm text-muted mb-4">Upload a product photo and watch our AI extract the listing data.</p>
                            <span className="text-secondary font-bold text-sm flex items-center gap-1.5 group">
                                Run demo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </span>
                        </motion.button>

                        {mode && (
                            <button onClick={reset} className="btn-secondary text-sm py-2.5 px-5 gap-2" aria-label="Reset demo">
                                <RotateCcw size={14} aria-hidden="true" /> Reset
                            </button>
                        )}
                    </div>

                    {/* Output panel */}
                    <div className="glass-card min-h-[360px] relative overflow-hidden flex flex-col p-8" aria-live="polite" aria-label="Demo output">
                        {/* Top accent */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                        <AnimatePresence mode="wait">
                            {demoState === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center gap-4 text-center"
                                >
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/15 flex items-center justify-center text-white/20">
                                        <Mic size={28} aria-hidden="true" />
                                    </div>
                                    <p className="text-muted font-medium">Choose a demo input on the left to begin</p>
                                </motion.div>
                            )}

                            {demoState === "processing" && (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center gap-6"
                                >
                                    <Loader2 size={40} className="text-primary animate-spin" aria-hidden="true" />
                                    <div className="text-center">
                                        <p className="text-lg font-bold mb-1">
                                            {mode === "voice" ? "Transcribing voice…" : "Analysing image…"}
                                        </p>
                                        <p className="text-sm text-muted">Extracting product attributes…</p>
                                    </div>
                                    {/* Fake progress */}
                                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2.1, ease: "easeInOut" }}
                                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {demoState === "result" && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex-1 flex flex-col gap-5"
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-center">
                                        <span className="badge badge-success gap-1.5">
                                            <Check size={11} aria-hidden="true" /> Generated in 1.4s
                                        </span>
                                        <span className="badge badge-primary">{mode === "voice" ? "Voice" : "Image"} Input</span>
                                    </div>

                                    {/* Source */}
                                    <div className="flex gap-3 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                                        <div className={`p-2.5 rounded-xl shrink-0 ${mode === "voice" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                                            {mode === "voice" ? <Mic size={18} aria-hidden="true" /> : <ImageIcon size={18} aria-hidden="true" />}
                                        </div>
                                        <p className="text-sm text-foreground/70 italic leading-relaxed">
                                            {mode === "voice"
                                                ? '"Handmade clay pot, five litres, works for water cooling, price eight hundred rupees."'
                                                : '"Cotton_Fabric_blockprint_01.jpg" — scanned successfully'
                                            }
                                        </p>
                                    </div>

                                    {/* Generated listing */}
                                    <div className="glass-card flex-1 p-5 bg-white/[0.02] border-white/[0.06] space-y-3.5">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">✦ AI Generated Listing</p>

                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <p className="text-xs text-muted font-semibold uppercase tracking-widest mb-0.5">Name</p>
                                                <p className="text-lg font-extrabold">{result.name}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-xs text-muted font-semibold uppercase tracking-widest mb-0.5">Price</p>
                                                <p className="text-lg font-extrabold text-primary">{result.price}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-muted font-semibold uppercase tracking-widest mb-0.5">Category</p>
                                                <p className="text-sm font-bold">{result.category}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted font-semibold uppercase tracking-widest mb-0.5">Status</p>
                                                <span className="badge badge-success text-[10px]">Ready to publish</span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted font-semibold uppercase tracking-widest mb-0.5">Description</p>
                                            <p className="text-sm text-muted italic leading-relaxed">{result.desc}</p>
                                        </div>
                                    </div>

                                    <button className="btn-primary justify-center py-3">
                                        <Check size={16} aria-hidden="true" /> Confirm &amp; Save Listing
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
