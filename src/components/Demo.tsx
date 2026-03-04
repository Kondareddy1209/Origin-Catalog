"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ImageIcon, Loader2, Check, ArrowRight, RotateCcw, Upload, Trash2 } from "lucide-react";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import Image from "next/image";

type DemoMode = "voice" | "image" | null;
type DemoState = "idle" | "listening" | "processing" | "result";

interface GeneratedData {
    name: string;
    category: string;
    price: string;
    quantity: string;
    desc: string;
    image?: string;
}

const DEFAULT_DATA: GeneratedData = {
    name: "New Product",
    category: "General",
    price: "₹0",
    quantity: "1",
    desc: "Awaiting input...",
};

export default function Demo() {
    const { isListening: srIsListening, transcript, startListening, stopListening, error: srError } = useSpeechRecognition();

    const [mode, setMode] = useState<DemoMode>(null);
    const [demoState, setDemoState] = useState<DemoState>("idle");
    const [generatedData, setGeneratedData] = useState<GeneratedData>(DEFAULT_DATA);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync speech recognition state with demo state
    useEffect(() => {
        if (srIsListening && mode === "voice") {
            setDemoState("listening");
        } else if (!srIsListening && demoState === "listening" && mode === "voice") {
            // Speech ended, process the transcript
            if (transcript) {
                handleProcessVoice(transcript);
            } else {
                setDemoState("idle");
                setMode(null);
            }
        }
    }, [srIsListening, transcript, mode]);

    const handleProcessVoice = (text: string) => {
        setDemoState("processing");

        // Simulate AI analysis time
        setTimeout(() => {
            const parsed = parseVoiceInput(text);
            setGeneratedData(parsed);
            setDemoState("result");
        }, 1500);
    };

    const parseVoiceInput = (text: string) => {
        const lower = text.toLowerCase();

        // Price detection
        const priceMatch = lower.match(/(?:price|rate|at|for|cost) (?:is )?(\d+)/) || lower.match(/(\d+) (?:rupees|rs|bucks)/);
        const price = priceMatch ? `₹${priceMatch[1]}` : "₹0";

        // Quantity detection
        const qtyMatch = lower.match(/(?:quantity|qty|stock|units|count) (?:is )?(\d+)/) || lower.match(/(\d+) (?:units|kg|items|pieces)/);
        const quantity = qtyMatch ? qtyMatch[1] : "1";

        // Category detection
        const category =
            lower.includes("pot") || lower.includes("clay") ? "Handicrafts" :
                lower.includes("rice") || lower.includes("dal") || lower.includes("food") || lower.includes("kg") ? "Grocery" :
                    lower.includes("scarf") || lower.includes("silk") || lower.includes("cloth") || lower.includes("dress") ? "Apparel" : "General";

        // Name detection (take text before price/quantity/keywords)
        const namePart = text.split(/price|quantity|qty|for|at|rs|rupees/i)[0].trim();
        const name = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : "Voice Catalog Item";

        return {
            name,
            category,
            price,
            quantity,
            desc: `Automatically generated from voice: "${text}"`
        };
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (prev) => {
            const dataUrl = prev.target?.result as string;
            setPreviewImage(dataUrl);
            setMode("image");
            setDemoState("processing");

            // Simulate AI Image Analysis
            setTimeout(() => {
                // Heuristic mapping based on common filenames/mock logic
                const fileName = file.name.toLowerCase();
                let name = "Scanned Product";
                let category = "General";
                let desc = "AI-analyzed product from uploaded image.";

                if (fileName.includes("pot") || fileName.includes("clay")) {
                    name = "Handcrafted Clay Pot";
                    category = "Home Decor";
                    desc = "Traditional cooling clay pot, handcrafted by local artisans.";
                } else if (fileName.includes("scarf") || fileName.includes("silk") || fileName.includes("textile")) {
                    name = "Premium Silk Scarf";
                    category = "Apparel";
                    desc = "Fine silk scarf with traditional patterns and vibrant colors.";
                } else if (fileName.includes("food") || fileName.includes("rice") || fileName.includes("grocery")) {
                    name = "Organic Grocery Item";
                    category = "Grocery";
                    desc = "Locally sourced organic product with sustainable packaging.";
                }

                setGeneratedData({
                    name,
                    category,
                    price: "₹" + (Math.floor(Math.random() * 500) + 100).toString(),
                    quantity: "1",
                    desc,
                    image: dataUrl
                });
                setDemoState("result");
            }, 2000);
        };
        reader.readAsDataURL(file);
    };

    const reset = () => {
        setMode(null);
        setDemoState("idle");
        setGeneratedData(DEFAULT_DATA);
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const startVoiceDemo = () => {
        setMode("voice");
        startListening({
            onError: (err) => {
                setDemoState("idle");
                setMode(null);
            }
        });
    };

    const triggerImageDemo = () => {
        fileInputRef.current?.click();
    };

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
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Functional Sandbox</p>
                    <h2 id="demo-heading" className="heading-l">
                        Experience <span className="gradient-text">Magic</span>
                    </h2>
                    <p className="text-p max-w-2xl mx-auto">
                        Toggle between voice and image input. These are not static videos — they are functional tools you can test right now.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-10 items-start">
                    {/* Interactive Controls */}
                    <div className="space-y-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />

                        {/* Voice Input Trigger */}
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            onClick={demoState === "listening" ? stopListening : startVoiceDemo}
                            disabled={demoState === "processing" || (mode === "image" && demoState !== "idle")}
                            className={`w-full text-left glass-card p-7 border-l-4 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${mode === "voice" ? "border-l-primary bg-primary/5" : "border-l-transparent hover:border-l-primary/40"
                                }`}
                            aria-pressed={mode === "voice"}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className={`p-3 rounded-2xl transition-all ${demoState === "listening" ? "bg-primary text-white animate-pulse" : "bg-primary/10 text-primary"}`}>
                                    <Mic size={22} className={demoState === "listening" ? "animate-bounce" : ""} aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-extrabold">{demoState === "listening" ? "Listening..." : "Voice Input Listing"}</h3>
                            </div>
                            <p className="text-sm text-muted mb-4">
                                {demoState === "listening"
                                    ? "Speak clearly: 'Product Name, Price [Value], Quantity [Value]'"
                                    : "Click 'Run Demo' and specify your product details naturally by speaking."}
                            </p>
                            <span className="text-primary font-bold text-sm flex items-center gap-1.5 group">
                                {demoState === "listening" ? "Stop Listening" : "Run Demo"} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </span>
                        </motion.button>

                        {/* Image Input Trigger */}
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            onClick={triggerImageDemo}
                            disabled={demoState === "processing" || (mode === "voice" && demoState !== "idle")}
                            className={`w-full text-left glass-card p-7 border-l-4 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${mode === "image" ? "border-l-secondary bg-secondary/5" : "border-l-transparent hover:border-l-secondary/40"
                                }`}
                            aria-pressed={mode === "image"}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                                    <Upload size={22} aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-extrabold">Image Scan Listing</h3>
                            </div>
                            <p className="text-sm text-muted mb-4">Upload a photo of your product. Our AI will identify the item and suggest attributes.</p>
                            <span className="text-secondary font-bold text-sm flex items-center gap-1.5 group">
                                {mode === "image" && demoState === "result" ? "Change Image" : "Run Demo"} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </span>
                        </motion.button>

                        {mode && (
                            <button onClick={reset} className="btn-secondary text-sm py-2.5 px-5 gap-2 transition-all hover:text-danger hover:border-danger/30" aria-label="Reset demo">
                                <RotateCcw size={14} aria-hidden="true" /> Reset Experience
                            </button>
                        )}
                    </div>

                    {/* Output panel */}
                    <div className="glass-card min-h-[480px] relative overflow-hidden flex flex-col p-0" aria-live="polite" aria-label="Demo output">
                        {/* Top accent */}
                        <div className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent ${mode === 'voice' ? 'via-primary' : mode === 'image' ? 'via-secondary' : 'via-white/10'} to-transparent z-20`} />

                        <AnimatePresence mode="wait">
                            {demoState === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8"
                                >
                                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-white/10">
                                        <Sparkles size={32} aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-extrabold tracking-tight">System Ready</p>
                                        <p className="text-sm text-muted mt-1">Initialize any demo to start extraction</p>
                                    </div>
                                </motion.div>
                            )}

                            {demoState === "listening" && (
                                <motion.div
                                    key="listening"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center gap-8 p-12 bg-primary/[0.02]"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                                        <div className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]">
                                            <Mic size={40} className="animate-bounce" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-2xl font-black mb-2 text-primary">I'm Listening</h4>
                                        <p className="text-muted font-medium mb-6">Describe your product (name, price, qty)...</p>
                                        <div className="px-6 py-4 glass bg-white/5 rounded-2xl border border-white/10 w-full max-w-sm italic text-foreground min-h-[60px]">
                                            {transcript || "Waiting for audio..."}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {demoState === "processing" && (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center gap-6 p-8"
                                >
                                    <div className="relative">
                                        <Loader2 size={56} className={`${mode === 'voice' ? 'text-primary' : 'text-secondary'} animate-spin`} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {mode === 'voice' ? <Mic size={20} className="text-primary" /> : <ImageIcon size={20} className="text-secondary" />}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-black mb-2 tracking-tight uppercase">
                                            {mode === "voice" ? "Processing Speech..." : "Analyzing Vision..."}
                                        </p>
                                        <p className="text-sm text-muted font-medium">Extracting structured metadata using AI</p>
                                    </div>
                                    <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: mode === 'voice' ? 1.4 : 1.9, ease: "easeInOut" }}
                                            className={`h-full ${mode === 'voice' ? 'bg-primary' : 'bg-secondary'} rounded-full`}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {demoState === "result" && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex-1 flex flex-col p-0"
                                >
                                    {/* Preview Header */}
                                    {mode === "image" && previewImage && (
                                        <div className="relative h-48 w-full group">
                                            <Image
                                                src={previewImage}
                                                alt="Scanned Preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                                            <div className="absolute top-4 left-4">
                                                <span className="badge badge-secondary shadow-lg">Vision Active</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-8 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Catalog Preview</span>
                                            <span className="badge badge-success gap-1.5 py-1 px-3">
                                                <Check size={12} /> AI Extraction Complete
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-black leading-tight tracking-tight">{generatedData.name}</h3>
                                                    <p className="text-xs font-bold text-muted uppercase tracking-widest mt-1">{generatedData.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-secondary">{generatedData.price}</p>
                                                    <p className="text-[10px] font-bold text-muted uppercase tracking-tighter">Qty: {generatedData.quantity}</p>
                                                </div>
                                            </div>

                                            <div className="glass p-4 bg-white/5 border-white/5 rounded-2xl">
                                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Generated Description</p>
                                                <p className="text-sm text-slate-300 leading-relaxed italic">
                                                    {generatedData.desc}
                                                </p>
                                            </div>

                                            <div className="flex gap-3">
                                                <div className="flex-1 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                                                    <p className="text-[9px] font-black text-muted uppercase mb-1">Confidence</p>
                                                    <p className="text-sm font-bold text-success">98.2%</p>
                                                </div>
                                                <div className="flex-1 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                                                    <p className="text-[9px] font-black text-muted uppercase mb-1">Processing</p>
                                                    <p className="text-sm font-bold text-secondary">{mode === 'voice' ? '1.4s' : '2.1s'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button onClick={reset} className="btn-secondary py-3 flex-1 justify-center">
                                                <Trash2 size={16} /> Discard
                                            </button>
                                            <button className="btn-primary py-3 flex-[2] justify-center shadow-lg shadow-primary/20">
                                                <Check size={18} /> Confirm Listing
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}

const Sparkles = ({ size, className, ariaHidden }: { size: number, className?: string, ariaHidden?: boolean }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden={ariaHidden}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
);
