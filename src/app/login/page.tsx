"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mic, Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, User, Crown, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

const ROLE_REDIRECT: Record<string, string> = {
    admin: "/admin",
    shopkeeper: "/shopkeeper",
    consumer: "/consumer",
};

const DEMO_ACCOUNTS = [
    { icon: Crown, label: "Admin", email: "admin@catalogbuddy.com", password: "Admin@123", color: "text-accent" },
    { icon: ShoppingBag, label: "Shopkeeper", email: "ravi@shop.com", password: "Shop@123", color: "text-primary" },
    { icon: User, label: "Consumer", email: "priya@mail.com", password: "User@123", color: "text-secondary" },
];

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { login, isAuthenticated, isLoading: authLoading, user } = useAuth();
    const router = useRouter();

    // Redirect already-logged-in users
    useEffect(() => {
        if (!authLoading && isAuthenticated && user) {
            router.replace(ROLE_REDIRECT[user.role] ?? "/");
        }
    }, [isAuthenticated, authLoading, user, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;
        setError("");
        setIsLoading(true);

        const result = await login(email, password);
        if (result.success) {
            // user state will update → useEffect handles redirect
        } else {
            setError(result.error ?? "Login failed.");
            setIsLoading(false);
        }
    };

    const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
        setEmail(acc.email);
        setPassword(acc.password);
        setError("");
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Blobs */}
            <div className="ambient-glow w-80 h-80 bg-primary/15 -top-20 -left-20 pointer-events-none" />
            <div className="ambient-glow w-80 h-80 bg-secondary/10 bottom-0 -right-20 pointer-events-none" />

            {/* Logo */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <Link href="/" className="flex items-center gap-3 group" aria-label="Go to homepage">
                    <div className="w-11 h-11 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg neon-border">
                        <Mic className="text-white" size={22} aria-hidden="true" />
                    </div>
                    <span className="text-2xl font-extrabold tracking-tighter gradient-text">CatalogBuddy</span>
                </Link>
            </motion.div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

                    <div className="mb-7">
                        <h1 className="text-3xl font-extrabold mb-1.5 tracking-tight">Welcome back</h1>
                        <p className="text-muted text-sm">Sign in — your role is detected automatically.</p>
                    </div>

                    {/* Demo accounts */}
                    <div className="mb-6">
                        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Quick demo login</p>
                        <div className="grid grid-cols-3 gap-2">
                            {DEMO_ACCOUNTS.map(({ icon: Icon, label, color, ...acc }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => fillDemo({ icon: Icon, label, color, ...acc })}
                                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold border border-white/[0.07] hover:border-primary/40 hover:bg-primary/5 transition-all ${color}`}
                                    title={`Fill demo ${label} credentials`}
                                    aria-label={`Use ${label} demo account`}
                                >
                                    <Icon size={16} aria-hidden="true" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="divider" />

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-semibold text-slate-300">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={17} aria-hidden="true" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input pl-11"
                                    placeholder="you@example.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-sm font-semibold text-slate-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={17} aria-hidden="true" />
                                <input
                                    id="password"
                                    type={showPwd ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input pl-11 pr-12"
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-slate-200 transition-colors p-1 rounded"
                                    aria-label={showPwd ? "Hide password" : "Show password"}
                                >
                                    {showPwd ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                role="alert"
                                aria-live="polite"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-medium"
                            >
                                <span aria-hidden="true">⚠</span> {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full justify-center py-3.5 text-base mt-2"
                        >
                            {isLoading ? (
                                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in...</>
                            ) : (
                                <>Sign In <ArrowRight size={18} aria-hidden="true" /></>
                            )}
                        </button>
                    </form>

                    {/* Security note */}
                    <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted">
                        <ShieldCheck size={13} className="text-primary/60" aria-hidden="true" />
                        Role-based access — powered by CatalogBuddy
                    </div>

                    <div className="divider" />

                    <p className="text-center text-slate-400 text-sm">
                        New vendor?{" "}
                        <Link href="/signup" className="text-primary font-bold hover:text-primary-light transition-colors">
                            Create account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
