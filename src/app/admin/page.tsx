"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useData } from "@/lib/DataContext";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import {
    Users, ShoppingBag, Package, ShoppingCart,
    CheckCircle2, XCircle, Eye, AlertTriangle,
    LayoutDashboard, type LucideIcon
} from "lucide-react";
import {
    MOCK_USERS,
    type MockUser, type MockProduct,
} from "@/lib/mockData";

type Tab = "overview" | "shopkeepers" | "products" | "flagged" | "transactions";

const NAV_ITEMS: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "shopkeepers", label: "Manage Shopkeepers", icon: Users },
    { id: "products", label: "Product Monitor", icon: Package },
    { id: "flagged", label: "Flagged Products", icon: AlertTriangle },
    { id: "transactions", label: "Purchase Logs", icon: ShoppingCart },
];

// ---------------------------------------------------------------
// STAT CARD
// ---------------------------------------------------------------
function StatCard({ label, value, icon: Icon, color }: {
    label: string; value: string | number;
    icon: LucideIcon; color: string;
}) {
    return (
        <div className="glass-card flex items-center gap-4 p-5">
            <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
                <Icon size={22} aria-hidden="true" />
            </div>
            <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-extrabold mt-0.5">{value}</p>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------
// STATUS BADGE
// ---------------------------------------------------------------
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        active: "badge-success",
        suspended: "badge-warning",
        flagged: "badge badge-warning",
        paid: "badge-success",
        pending: "badge-warning",
        cancelled: "bg-danger/15 text-danger border-danger/30",
    };
    return <span className={`badge ${map[status] ?? "badge-primary"}`}>{status}</span>;
}

// ---------------------------------------------------------------
// ADMIN DASHBOARD PAGE
// ---------------------------------------------------------------
export default function AdminDashboard() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { products, orders, updateProduct, deleteProduct } = useData();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [shopkeepers, setShopkeepers] = useState<MockUser[]>(
        MOCK_USERS.filter((u) => u.role === "shopkeeper")
    );
    const [selectedProduct, setSelectedProduct] = useState<MockProduct | null>(null);

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
            router.replace("/login");
        }
    }, [authLoading, isAuthenticated, user, router]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const consumers = MOCK_USERS.filter((u) => u.role === "consumer");
    const flagged = products.filter((p) => p.isScam || p.isBanned);
    const activeProducts = products.filter((p) => !p.isScam && !p.isBanned);

    const toggleAccountStatus = (id: string) => {
        setShopkeepers((prev) =>
            prev.map((s) =>
                s.id === id ? { ...s, status: s.status === "active" ? "suspended" : "active" } : s
            )
        );
    };

    const removeProduct = (id: string) => {
        deleteProduct(id);
        if (selectedProduct?.id === id) setSelectedProduct(null);
    };

    const approveProduct = (id: string) => {
        updateProduct(id, { isScam: false, isBanned: false, status: "active" });
    };

    const stats = [
        { label: "Total Shopkeepers", value: shopkeepers.length, icon: ShoppingBag, color: "text-primary" },
        { label: "Total Consumers", value: consumers.length, icon: Users, color: "text-secondary" },
        { label: "Total Products", value: products.length, icon: Package, color: "text-accent" },
        { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "text-success" },
    ];

    return (
        <DashboardShell
            navItems={NAV_ITEMS}
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t as Tab)}
            roleBadge={{ label: "Admin Panel", color: "bg-accent/15 text-accent border border-accent/25" }}
            title={NAV_ITEMS.find((n) => n.id === activeTab)?.label ?? "Admin"}
            subtitle={`Welcome back, ${user.name}`}
        >
            <AnimatePresence mode="wait">
                {/* ── OVERVIEW ── */}
                {activeTab === "overview" && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {stats.map((s, i) => (
                                <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                                    <StatCard {...s} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent alert */}
                        {flagged.length > 0 && (
                            <div className="glass-card p-5 border-danger/20 bg-danger/5 flex items-start gap-4 mb-6">
                                <AlertTriangle size={22} className="text-danger shrink-0 mt-0.5" aria-hidden="true" />
                                <div>
                                    <p className="font-bold text-danger">Safety Alert</p>
                                    <p className="text-sm text-muted mt-0.5">
                                        {flagged.length} item{flagged.length > 1 ? "s" : ""} flagged by the Scam Engine. Review as soon as possible.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Recent transactions summary */}
                        <div className="glass-card p-0 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.05] flex justify-between items-center">
                                <h2 className="text-lg font-extrabold">Recent Platform Activity</h2>
                                <button onClick={() => setActiveTab("transactions")} className="text-xs font-bold text-primary hover:underline">View All Logs →</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                            {["Customer", "Product", "Shop", "Amount", "Method", "Time"].map((h) => (
                                                <th key={h} className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 5).map((o) => (
                                            <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-3 font-semibold">{o.consumerName}</td>
                                                <td className="px-6 py-3 text-primary font-bold">{o.productName}</td>
                                                <td className="px-6 py-3 italic text-muted text-xs">{o.shopName}</td>
                                                <td className="px-6 py-3 font-bold text-secondary">{o.amount}</td>
                                                <td className="px-6 py-3">
                                                    <span className="text-[10px] font-black uppercase text-accent bg-accent/10 px-2 py-0.5 rounded-full">{o.paymentMethod || "COD"}</span>
                                                </td>
                                                <td className="px-6 py-3 text-muted text-[10px] uppercase font-bold">{o.createdAt}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── SHOPKEEPERS ── */}
                {activeTab === "shopkeepers" && (
                    <motion.div key="shopkeepers" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="glass-card p-0 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.05] flex justify-between items-center">
                                <h2 className="text-lg font-extrabold">Account Monitoring</h2>
                                <span className="badge badge-primary">{shopkeepers.length} retailers</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                            {["Name", "Email", "Status", "Joined", "Actions"].map((h) => (
                                                <th key={h} className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shopkeepers.map((s) => (
                                            <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 font-semibold">{s.name}</td>
                                                <td className="px-6 py-4 text-muted">{s.email}</td>
                                                <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                                                <td className="px-6 py-4 text-muted text-xs">{s.createdAt}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleAccountStatus(s.id)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${s.status === "active"
                                                            ? "bg-danger/10 text-danger hover:bg-danger/20"
                                                            : "bg-success/10 text-success hover:bg-success/20"
                                                            }`}
                                                        title={s.status === "active" ? "Block Access" : "Grant Access"}
                                                    >
                                                        {s.status === "active" ? "Suspend" : "Approve"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── PRODUCTS ── */}
                {activeTab === "products" && (
                    <motion.div key="products" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="glass-card p-0 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.05] flex justify-between items-center">
                                <h2 className="text-lg font-extrabold">Product Inventory Audit</h2>
                                <span className="badge badge-primary">{activeProducts.length} verified listings</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                            {["Listing", "Shop", "Category", "Price", "Qty", "Safety Score", "Actions"].map((h) => (
                                                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((p) => (
                                            <tr key={p.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${p.isBanned ? "opacity-60 bg-danger/[0.02]" : ""}`}>
                                                <td className="px-5 py-4 font-semibold max-w-[180px] truncate">{p.name}</td>
                                                <td className="px-5 py-4 text-muted text-xs">{p.shopName}</td>
                                                <td className="px-5 py-4 text-muted">{p.category}</td>
                                                <td className="px-5 py-4 text-primary font-bold">{p.price}</td>
                                                <td className="px-5 py-4 text-muted">
                                                    {p.quantity} <span className="text-[10px] opacity-70">{p.unit || "pcs"}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-1.5 w-12 rounded-full overflow-hidden ${p.isBanned ? 'bg-danger/20' : 'bg-success/20'}`}>
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: p.isBanned ? '15%' : '98%' }}
                                                                className={`h-full ${p.isBanned ? 'bg-danger' : 'bg-success'}`}
                                                            />
                                                        </div>
                                                        <span className={`text-[10px] font-black ${p.isBanned ? 'text-danger' : 'text-success'}`}>
                                                            {p.isBanned ? '15%' : '98%'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setSelectedProduct(p)} className="p-1.5 rounded-lg bg-white/5 text-muted hover:text-primary" title="Details"><Eye size={14} /></button>
                                                        <button onClick={() => removeProduct(p.id)} className="p-1.5 rounded-lg bg-danger/5 text-danger hover:bg-danger/15" title="Remove Listing"><XCircle size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── TRANSACTIONS ── */}
                {activeTab === "transactions" && (
                    <motion.div key="transactions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="glass-card p-0 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.02]">
                                <div>
                                    <h2 className="text-xl font-black">Global Purchase Logs</h2>
                                    <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Universal Transaction Audit Trail</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-secondary">₹{orders.reduce((s, o) => s + parseInt(o.amount.replace(/\D/g, "") || "0"), 0).toLocaleString()}</span>
                                    <p className="text-[10px] text-muted font-bold uppercase tracking-tighter">Platform Gross Value</p>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.05] bg-black/20">
                                            {["Order ID", "Customer Details", "Product & Shop", "Qty", "Amount", "Method", "Status", "Time & Date"].map((h) => (
                                                <th key={h} className="text-left px-6 py-4 text-[10px] font-black text-muted uppercase tracking-[0.2em]">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((o) => (
                                            <tr key={o.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-all">
                                                <td className="px-6 py-4 font-mono text-[10px] text-muted">#{o.id.slice(-8)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-extrabold text-foreground">{o.consumerName}</div>
                                                    <div className="text-[10px] text-muted font-mono">{o.consumerId}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-primary">{o.productName}</div>
                                                    <div className="text-[10px] text-muted italic">Store: {o.shopName}</div>
                                                </td>
                                                <td className="px-6 py-4 font-black">
                                                    {o.quantity} <span className="text-[10px] text-muted-foreground ml-1">{o.unit || "pcs"}</span>
                                                </td>
                                                <td className="px-6 py-4 font-black text-secondary">{o.amount}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-[10px] font-black uppercase text-primary border border-primary/20 bg-primary/5 px-2 py-1 rounded-md text-center">{o.paymentMethod || "COD"}</div>
                                                </td>
                                                <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                                                <td className="px-6 py-4 text-[10px] font-bold text-muted leading-tight">{o.createdAt}</td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-20 text-center opacity-40 font-bold italic">No platform transactions recorded.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── FLAGGED ── */}
                {activeTab === "flagged" && (
                    <motion.div key="flagged" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        {flagged.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-50">
                                <CheckCircle2 size={56} className="text-success" />
                                <p className="text-muted text-lg font-semibold tracking-wide">Infrastructure Secure: Zero Threats Detected</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {flagged.map((p) => (
                                    <div key={p.id} className="glass-card border-danger/30 bg-danger/[0.02] p-6 flex flex-col md:flex-row gap-6 items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="badge bg-danger text-white border-none text-[10px] font-black uppercase">Scam Alert</span>
                                                <span className="text-xs font-mono text-muted">{p.id}</span>
                                            </div>
                                            <h3 className="text-xl font-black mb-2">{p.name}</h3>
                                            <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-3">{p.description}</p>
                                            <div className="flex gap-4 text-[10px] font-bold text-muted uppercase">
                                                <span>Shop: {p.shopName}</span>
                                                <span>Vendor ID: {p.shopkeeperId}</span>
                                            </div>
                                        </div>
                                        <div className="flex md:flex-col gap-2 shrink-0">
                                            <button onClick={() => approveProduct(p.id)} className="px-6 py-3 rounded-xl text-xs font-black bg-success/10 text-success hover:bg-success hover:text-white transition-all">APPROVE</button>
                                            <button onClick={() => removeProduct(p.id)} className="px-6 py-3 rounded-xl text-xs font-black bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all">TERMINATE</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Product detail modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card max-w-lg w-full p-10 relative z-10">
                            <h3 className="text-2xl font-black mb-6">{selectedProduct.name}</h3>
                            <div className="space-y-4 text-sm mb-8">
                                {[
                                    ["Origin Store", selectedProduct.shopName],
                                    ["Category", selectedProduct.category],
                                    ["Market Price", selectedProduct.price],
                                    ["Current Stock", String(selectedProduct.quantity)],
                                    ["Safety Status", selectedProduct.isBanned ? "FLAGGED FOR REVIEW" : "VERIFIED ACTIVE"],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-muted font-bold uppercase text-[10px] tracking-widest">{k}</span>
                                        <span className="font-extrabold">{v}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setSelectedProduct(null)} className="btn-primary w-full justify-center py-4">Exit Investigation</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardShell>
    );
}
