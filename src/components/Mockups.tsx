"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Mockups = () => {
    const mockups = [
        { title: "Voice Entry", img: "/voice-mockup.png", span: "md:col-span-1" },
        { title: "Dashboard", img: "/dashboard-mockup.png", span: "md:col-span-2" },
        { title: "Sync & Analytics", img: "/sync-mockup.png", span: "md:col-span-3" },
    ];

    return (
        <section id="mockups" className="py-24 bg-slate-950 overflow-hidden">
            <div className="section-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="heading-l">Platform <span className="text-primary">Preview</span></h2>
                    <p className="text-p max-w-2xl mx-auto">
                        Experience the future of voice-driven cataloging.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {mockups.map((mockup, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className={`relative group overflow-hidden rounded-3xl border border-white/10 glass ${mockup.span}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-60" />
                            <div className="relative aspect-video md:aspect-auto md:h-[400px]">
                                <Image
                                    src={mockup.img}
                                    alt={mockup.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                                <h3 className="text-2xl font-bold text-white mb-2">{mockup.title}</h3>
                                <div className="w-12 h-1 bg-primary rounded-full" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Mockups;
