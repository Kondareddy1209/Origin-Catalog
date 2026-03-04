"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import {
    Users, ShoppingBag, Package, ShoppingCart,
    CheckCircle2, XCircle, Eye, AlertTriangle,
    Crown, LayoutDashboard, type LucideIcon
} from "lucide-react";
import {
    MOCK_USERS, MOCK_PRODUCTS, MOCK_ORDERS,
    type MockUser, type MockProduct,
} from "@/lib/mockData";

type Tab = "overview" | "shopkeepers" | "products" | "flagged";

const NAV_ITEMS: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "shopkeepers", label: "Manage Shopkeepers", icon: Users },
    { id: "products", label: "Product Monitor", icon: Package },
    { id: "flagged", label: "Flagged Products", icon: AlertTriangle },
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
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [shopkeepers, setShopkeepers] = useState<MockUser[]>(
        MOCK_USERS.filter((u) => u.role === "shopkeeper")
    );
    const [products, setProducts] = useState<MockProduct[]>(MOCK_PRODUCTS);
    const [selectedProduct, setSelectedProduct] = useState<MockProduct | null>(null);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
            router.replace("/login");
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading || !user) {
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
        setProducts((prev) => prev.filter((p) => p.id !== id));
        if (selectedProduct?.id === id) setSelectedProduct(null);
    };

    const approveProduct = (id: string) => {
        setProducts((prev) =>
            prev.map((p) => p.id === id ? { ...p, isScam: false, isBanned: false, status: "active" } : p)
        );
    };

    const stats = [
        { label: "Total Shopkeepers", value: shopkeepers.length, icon: ShoppingBag, color: "text-primary" },
        { label: "Total Consumers", value: consumers.length, icon: Users, color: "text-secondary" },
        { label: "Total Products", value: products.length, icon: Package, color: "text-accent" },
        { label: "Total Orders", value: MOCK_ORDERS.length, icon: ShoppingCart, color: "text-success" },
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

                        {/* Flagged alert */}
                        {flagged.length > 0 && (
                            <div className="glass-card p-5 border-danger/20 bg-danger/5 flex items-start gap-4 mb-6">
                                <AlertTriangle size={22} className="text-danger shrink-0 mt-0.5" aria-hidden="true" />
                                <div>
                                    <p className="font-bold text-danger">Flagged Products Alert</p>
                                    <p className="text-sm text-muted mt-0.5">
                                        {flagged.length} product{flagged.length > 1 ? "s" : ""} flagged for suspicious content.{" "}
                                        <button onClick={() => setActiveTab("flagged")} className="text-primary font-semibold underline underline-offset-2">Review now →</button>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Recent orders */}
                        <div className="glass-card p-0 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.05]">
                                <h2 className="text-lg font-extrabold">Recent Orders</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                            {["Order ID", "Consumer", "Product", "Amount", "Status"].map((h) => (
                                                <th key={h} className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MOCK_ORDERS.map((o) => (
                                            <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-3 font-mono text-xs text-muted">{o.id}</td>
                                                <td className="px-6 py-3 font-semibold">{o.consumerName}</td>
                                                <td className="px-6 py-3 text-muted">{o.productName}</td>
                                                <td className="px-6 py-3 font-bold text-primary">{o.amount}</td>
                                                <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
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
                                <h2 className="text-lg font-extrabold">All Shopkeepers</h2>
                                <span className="badge badge-primary">{shopkeepers.length} total</span>
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
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => toggleAccountStatus(s.id)}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${s.status === "active"
                                                                    ? "bg-danger/10 text-danger hover:bg-danger/20"
                                                                    : "bg-success/10 text-success hover:bg-success/20"
                                                                }`}
                                                            aria-label={s.status === "active" ? `Suspend ${s.name}` : `Approve ${s.name}`}
                                                        >
                                                            {s.status === "active"
                                                                ? <><XCircle size={13} aria-hidden="true" /> Suspend</>
                                                                : <><CheckCircle2 size={13} aria-hidden="true" /> Approve</>
                                                            }
                                                        </button>
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

                {/* ── PRODUCTS ── */}
                {activeTab === "products" && (
                    <motion.div key="products" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="glass-card p-0 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.05] flex justify-between items-center">
                                <h2 className="text-lg font-extrabold">All Product Listings</h2>
                                <span className="badge badge-primary">{activeProducts.length} active</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                            {["Product", "Shop", "Category", "Price", "Qty", "Status", "Actions"].map((h) => (
                                                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((p) => (
                                            <tr key={p.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${p.isBanned ? "opacity-60" : ""}`}>
                                                <td className="px-5 py-4 font-semibold max-w-[180px] truncate">{p.name}</td>
                                                <td className="px-5 py-4 text-muted text-xs">{p.shopName}</td>
                                                <td className="px-5 py-4 text-muted">{p.category}</td>
                                                <td className="px-5 py-4 text-primary font-bold">{p.price}</td>
                                                <td className="px-5 py-4 text-muted">{p.quantity}</td>
                                                <td className="px-5 py-4">
                                                    <StatusBadge status={p.isBanned ? "flagged" : "active"} />
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setSelectedProduct(p)}
                                                            className="p-1.5 rounded-lg bg-white/5 text-muted hover:text-primary transition-colors"
                                                            aria-label={`View ${p.name}`}
                                                        >
                                                            <Eye size={14} aria-hidden="true" />
                                                        </button>
                                                        <button
                                                            onClick={() => removeProduct(p.id)}
                                                            className="p-1.5 rounded-lg bg-danger/5 text-danger hover:bg-danger/15 transition-colors"
                                                            aria-label={`Remove ${p.name}`}
                                                        >
                                                            <XCircle size={14} aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Product detail modal */}
                        <AnimatePresence>
                            {selectedProduct && (
                                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" aria-modal="true" role="dialog" aria-label="Product details">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card max-w-md w-full p-8 relative z-10 overflow-hidden">
                                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                                        <h3 className="text-xl font-extrabold mb-4">{selectedProduct.name}</h3>
                                        <div className="space-y-3 text-sm">
                                            {[
                                                ["Shop", selectedProduct.shopName],
                                                ["Category", selectedProduct.category],
                                                ["Price", selectedProduct.price],
                                                ["Quantity", String(selectedProduct.quantity)],
                                                ["Status", selectedProduct.isBanned ? "🚫 Flagged" : "✅ Active"],
                                            ].map(([k, v]) => (
                                                <div key={k} className="flex justify-between">
                                                    <span className="text-muted font-semibold">{k}</span>
                                                    <span className="font-bold">{v}</span>
                                                </div>
                                            ))}
                                            <div>
                                                <p className="text-muted font-semibold mb-1">Description</p>
                                                <p className="text-foreground/80 leading-relaxed">{selectedProduct.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-6">
                                            <button onClick={() => setSelectedProduct(null)} className="btn-secondary flex-1 justify-center py-2.5 text-sm">Close</button>
                                            <button onClick={() => removeProduct(selectedProduct.id)} className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-danger border border-danger/30 hover:bg-danger/10 transition-all">Remove Listing</button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ── FLAGGED ── */}
                {activeTab === "flagged" && (
                    <motion.div key="flagged" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        {flagged.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <CheckCircle2 size={56} className="text-success/40" aria-hidden="true" />
                                <p className="text-muted text-lg font-semibold">No flagged products. Platform is clean ✓</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 p-4 glass-card border-danger/20 bg-danger/5">
                                    <AlertTriangle size={20} className="text-danger shrink-0" aria-hidden="true" />
                                    <p className="text-sm text-muted">
                                        Products below were automatically flagged by our scam detection system. Review and approve or permanently remove them.
                                    </p>
                                </div>
                                {flagged.map((p) => (
                                    <div key={p.id} className="glass-card border-danger/20 bg-danger/[0.03] p-6 flex flex-col sm:flex-row gap-5 justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="badge bg-danger/15 text-danger border-danger/30">🚫 Scam Detected</span>
                                                <span className="text-xs text-muted">{p.shopName}</span>
                                            </div>
                                            <h3 className="text-lg font-bold mb-1">{p.name}</h3>
                                            <p className="text-sm text-muted leading-relaxed">{p.description}</p>
                                            <p className="text-xs text-danger/70 mt-2 font-semibold">
                                                Reason: Suspicious keywords detected in listing
                                            </p>
                                        </div>
                                        <div className="flex sm:flex-col gap-2 sm:gap-3 shrink-0">
                                            <button
                                                onClick={() => approveProduct(p.id)}
                                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-success/10 text-success hover:bg-success/20 transition-all"
                                                aria-label={`Approve ${p.name}`}
                                            >
                                                <CheckCircle2 size={14} aria-hidden="true" /> Approve
                                            </button>
                                            <button
                                                onClick={() => removeProduct(p.id)}
                                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-danger/10 text-danger hover:bg-danger/20 transition-all"
                                                aria-label={`Remove ${p.name}`}
                                            >
                                                <XCircle size={14} aria-hidden="true" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardShell>
    );
}
