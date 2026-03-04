"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Mic, LogOut, Menu, X, Home, Bell, type LucideIcon } from "lucide-react";

export interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface DashboardShellProps {
    navItems: NavItem[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    roleBadge: { label: string; color: string };
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    headerAction?: React.ReactNode;
}

export default function DashboardShell({
    navItems,
    activeTab,
    onTabChange,
    roleBadge,
    children,
    title,
    subtitle,
    headerAction,
}: DashboardShellProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.replace("/login");
    };

    const SidebarContent = () => (
        <aside className="h-full flex flex-col p-6 w-64 shrink-0" aria-label="Sidebar navigation">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 mb-4 group" aria-label="CatalogBuddy homepage">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center neon-border shrink-0">
                    <Mic className="text-white" size={18} aria-hidden="true" />
                </div>
                <span className="text-lg font-extrabold tracking-tighter gradient-text">CatalogBuddy</span>
            </Link>

            {/* Role badge */}
            <div className={`mb-8 px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-widest w-fit ${roleBadge.color}`}>
                {roleBadge.label}
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1.5" aria-label="Main navigation">
                {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => { onTabChange(id); setIsMobileOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === id
                                ? "bg-primary/15 text-primary border border-primary/30"
                                : "text-muted hover:text-foreground hover:bg-white/5"
                            }`}
                        aria-current={activeTab === id ? "page" : undefined}
                    >
                        <Icon size={17} aria-hidden="true" />
                        {label}
                    </button>
                ))}
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted hover:text-foreground hover:bg-white/5 transition-all"
                >
                    <Home size={17} aria-hidden="true" /> Back to Site
                </Link>
            </nav>

            {/* User */}
            <div className="border-t border-white/5 pt-5 mt-4 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">{user?.name}</p>
                        <p className="text-xs text-muted truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-muted hover:text-danger hover:bg-danger/5 rounded-xl transition-all"
                    aria-label="Logout"
                >
                    <LogOut size={16} aria-hidden="true" /> Logout
                </button>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex border-r border-white/[0.05] bg-surface/50 backdrop-blur-xl">
                <SidebarContent />
            </div>

            {/* Mobile overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 z-50 bg-surface border-r border-white/5 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="border-b border-white/[0.05] bg-surface/30 backdrop-blur-xl px-6 py-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-muted"
                            aria-label="Open navigation"
                        >
                            {isMobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
                        </button>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight">{title}</h1>
                            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-xl hover:bg-white/5 text-muted" aria-label="Notifications">
                            <Bell size={18} aria-hidden="true" />
                        </button>
                        {headerAction}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
