"use client";

import React from "react";
import { Mic, Github, Twitter, Linkedin, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
    { href: "#problem", label: "Problem" },
    { href: "#solution", label: "Solution" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#demo", label: "Demo" },
    { href: "#impact", label: "Impact" },
];

const accountLinks = [
    { href: "/login", label: "Sign In" },
    { href: "/signup", label: "Get Started" },
    { href: "/dashboard", label: "Dashboard" },
];

const socialLinks = [
    { Icon: Github, href: "#", label: "GitHub repository" },
    { Icon: Twitter, href: "#", label: "Twitter profile" },
    { Icon: Linkedin, href: "#", label: "LinkedIn profile" },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer
            id="footer"
            className="relative border-t border-white/[0.05] bg-surface/30 backdrop-blur-xl"
            aria-label="Site footer"
        >
            {/* Ambient blob */}
            <div className="ambient-glow w-[600px] h-[300px] bg-primary/5 bottom-0 left-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Top: brand + links */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-16 border-b border-white/[0.05]">

                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-3 mb-5 group" aria-label="CatalogBuddy homepage">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center neon-border group-hover:scale-110 transition-transform">
                                <Mic className="text-white" size={19} aria-hidden="true" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tighter gradient-text">CatalogBuddy</span>
                        </Link>

                        <p className="text-muted text-sm leading-relaxed max-w-xs mb-6">
                            Voice-First AI Catalog Creation Platform for Small Vendors. Making digital commerce accessible for everyone.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-3" aria-label="Social media links">
                            {socialLinks.map(({ Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    title={label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }}
                                    className="w-9 h-9 glass rounded-xl flex items-center justify-center text-muted hover:text-primary transition-colors border-white/5"
                                >
                                    <Icon size={16} aria-hidden="true" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav aria-label="Footer site navigation">
                        <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-foreground mb-5">Navigation</h3>
                        <ul className="space-y-3">
                            {navLinks.map(({ href, label }) => (
                                <li key={href}>
                                    <a
                                        href={href}
                                        className="text-sm text-muted hover:text-primary transition-colors font-medium"
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Account */}
                    <nav aria-label="Footer account links">
                        <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-foreground mb-5">Account</h3>
                        <ul className="space-y-3">
                            {accountLinks.map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-sm text-muted hover:text-primary transition-colors font-medium"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Bottom bar */}
                <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-muted">
                        © {year} CatalogBuddy. All rights reserved.
                    </p>
                    <p className="text-xs text-muted flex items-center gap-1.5">
                        Making digital commerce accessible for everyone
                        <Heart size={11} className="text-accent fill-accent" aria-hidden="true" />
                    </p>
                </div>
            </div>
        </footer>
    );
}
