"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mic, Mail, Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

function PasswordStrengthBar({ password }: { password: string }) {
    const getStrength = () => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    if (!password) return null;
    const score = getStrength();
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const barColors = ["", "bg-danger", "bg-warning", "bg-secondary", "bg-success"];
    const textColors = ["", "text-danger", "text-warning", "text-secondary", "text-success"];

    return (
        <div className="mt-2 space-y-1.5" aria-live="polite">
            <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? barColors[score] : "bg-white/[0.06]"}`}
                    />
                ))}
            </div>
            {score > 0 && (
                <p className={`text-xs font-semibold ${textColors[score]}`}>
                    {labels[score]} password
                </p>
            )}
        </div>
    );
}

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { signup, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;

        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        const result = await signup(name, email, password);

        if (result.success) {
            router.replace("/dashboard");
        } else {
            setError(result.error ?? "Signup failed. Please try again.");
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
            {/* Background blobs */}
            <div className="ambient-glow w-96 h-96 bg-secondary/10 -top-20 -right-20 pointer-events-none" />
            <div className="ambient-glow w-80 h-80 bg-primary/10 bottom-0 -left-20 pointer-events-none" />

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-10"
            >
                <Link href="/" className="flex items-center gap-3 group" aria-label="Go to homepage">
                    <div className="w-11 h-11 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/40 transition-all neon-border">
                        <Mic className="text-white" size={22} aria-hidden="true" />
                    </div>
                    <span className="text-2xl font-extrabold tracking-tighter gradient-text">CatalogBuddy</span>
                </Link>
            </motion.div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />

                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold mb-1.5 tracking-tight">Create account</h1>
                        <p className="text-muted text-base">Start building your AI-powered digital catalog</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="text-sm font-semibold text-slate-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={17} aria-hidden="true" />
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input pl-11"
                                    placeholder="Your name"
                                    required
                                    disabled={isLoading}
                                    minLength={2}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-semibold text-slate-300">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={17} aria-hidden="true" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
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
                                    type={showPassword ? "text" : "password"}
                                    name="new-password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input pl-11 pr-12"
                                    placeholder="Min. 8 chars, 1 uppercase, 1 number"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-slate-200 transition-colors p-1 rounded"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                                </button>
                            </div>
                            <PasswordStrengthBar password={password} />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-300">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={17} aria-hidden="true" />
                                <input
                                    id="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    name="confirm-password"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input pl-11 pr-12"
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-slate-200 transition-colors p-1 rounded"
                                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                                    title={showConfirm ? "Hide confirm password" : "Show confirm password"}
                                >
                                    {showConfirm ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                                </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-xs text-red-400 font-medium mt-1" role="alert" aria-live="polite">
                                    Passwords do not match
                                </p>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                id="signup-error"
                                role="alert"
                                aria-live="polite"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium"
                            >
                                <span className="shrink-0">⚠</span>
                                {error}
                            </motion.div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full justify-center py-3.5 text-base mt-3"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account <ArrowRight size={18} aria-hidden="true" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security note */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
                        <ShieldCheck size={13} className="text-primary/60" aria-hidden="true" />
                        Your information is encrypted and never shared
                    </div>

                    <div className="divider" />

                    <p className="text-center text-slate-400 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-bold hover:text-primary-light transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
