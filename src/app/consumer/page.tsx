"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import {
    ShoppingBag, Package, ShoppingCart, User,
    Search, Filter, CheckCircle2, QrCode, X,
    AlertTriangle, ArrowRight, Wallet, type LucideIcon
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_ORDERS, type MockProduct, type MockOrder } from "@/lib/mockData";
import Image from "next/image";

type Tab = "marketplace" | "orders" | "profile";

const NAV_ITEMS: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "orders", label: "My Orders", icon: ShoppingCart },
    { id: "profile", label: "My Profile", icon: User },
];

// ---------------------------------------------------------------
// CONSUMER DASHBOARD
// ---------------------------------------------------------------
export default function ConsumerDashboard() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("marketplace");

    // State
    const [products] = useState<MockProduct[]>(MOCK_PRODUCTS);
    const [orders, setOrders] = useState<MockOrder[]>(
        MOCK_ORDERS.filter((o) => o.consumerId === "u4") // Priya's orders for demo
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<MockProduct | null>(null);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [purchaseStep, setPurchaseStep] = useState<"detail" | "qr" | "success">("detail");

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== "consumer")) {
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

    const filteredProducts = products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.shopName.toLowerCase().includes(q);
    });

    const handlePurchase = () => {
        setPurchaseStep("qr");
        // Simulate scanner success after 2 seconds
        setTimeout(() => {
            const newOrder: MockOrder = {
                id: `o${Date.now()}`,
                consumerId: user.id,
                consumerName: user.name,
                shopkeeperId: selectedProduct?.shopkeeperId || "",
                productId: selectedProduct?.id || "",
                productName: selectedProduct?.name || "",
                amount: selectedProduct?.price || "₹0",
                status: "paid",
                createdAt: new Date().toISOString().split("T")[0],
            };
            setOrders((prev) => [newOrder, ...prev]);
            setPurchaseStep("success");
        }, 2000);
    };

    return (
        <DashboardShell
            navItems={NAV_ITEMS}
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t as Tab)}
            roleBadge={{ label: "Consumer", color: "bg-secondary/15 text-secondary border border-secondary/25" }}
            title={NAV_ITEMS.find((n) => n.id === activeTab)?.label ?? "Marketplace"}
            subtitle={`Welcome, ${user.name}`}
        >
            <AnimatePresence mode="wait">

                {/* ── MARKETPLACE ── */}
                {activeTab === "marketplace" && (
                    <motion.div key="marketplace" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                        {/* Search Bar */}
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search for products or shops..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="form-input pl-11 py-3 text-base"
                                />
                            </div>
                            <button className="p-3 bg-surface border border-white/5 rounded-xl text-muted hover:text-foreground transition-all">
                                <Filter size={20} />
                            </button>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredProducts.map((p) => (
                                <motion.div
                                    key={p.id}
                                    layout
                                    className={`glass-card p-0 overflow-hidden flex flex-col group ${p.isBanned ? 'opacity-70' : ''}`}
                                >
                                    <div className="relative h-44 bg-surface">
                                        <Image
                                            src={p.image || "/product-pot.png"}
                                            alt={p.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                                        {p.isBanned && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                                <div className="bg-danger/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5">
                                                    <AlertTriangle size={12} /> Blocked
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{p.category}</span>
                                            <span className="font-extrabold text-lg text-secondary">{p.price}</span>
                                        </div>
                                        <h3 className="font-bold text-base group-hover:text-primary transition-colors leading-tight">
                                            {p.name}
                                        </h3>
                                        <p className="text-muted text-xs font-semibold">By: {p.shopName}</p>

                                        <button
                                            onClick={() => {
                                                setSelectedProduct(p);
                                                setPurchaseStep("detail");
                                                setIsPurchaseModalOpen(true);
                                            }}
                                            className={`mt-4 w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${p.isBanned
                                                    ? 'bg-white/5 text-muted cursor-not-allowed'
                                                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                                }`}
                                            disabled={p.isBanned}
                                        >
                                            {p.isBanned ? "Listing Blocked" : "View Details"}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── ORDERS ── */}
                {activeTab === "orders" && (
                    <motion.div key="orders" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="glass-card p-0 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.05]">
                                <h2 className="text-lg font-extrabold">My Purchase History</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                            <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Order ID</th>
                                            <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Product</th>
                                            <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Amount</th>
                                            <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                                            <th className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((o) => (
                                            <tr key={o.id} className="border-b border-white/[0.04]">
                                                <td className="px-6 py-4 font-mono text-xs text-muted">#{o.id.slice(-6)}</td>
                                                <td className="px-6 py-4 font-semibold">{o.productName}</td>
                                                <td className="px-6 py-4 font-bold text-secondary">{o.amount}</td>
                                                <td className="px-6 py-4">
                                                    <span className="badge badge-success">{o.status}</span>
                                                </td>
                                                <td className="px-6 py-4 text-muted text-xs">{o.createdAt}</td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-muted">No purchases found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── PROFILE ── */}
                {activeTab === "profile" && (
                    <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl">
                        <div className="glass-card p-8">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold">{user.name}</h2>
                                    <p className="text-muted">{user.email}</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-muted uppercase tracking-widest block mb-2">Member Since</label>
                                    <p className="text-foreground font-semibold">January 2025</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted uppercase tracking-widest block mb-2">Total Purchases</label>
                                    <p className="text-foreground font-semibold">{orders.length} items</p>
                                </div>
                                <button className="btn-secondary py-3 px-6 text-sm">Edit Profile Settings</button>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>

            {/* ── PRODUCT & PURCHASE MODAL ── */}
            <AnimatePresence>
                {isPurchaseModalOpen && selectedProduct && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsPurchaseModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card w-full max-w-lg relative z-10 p-0 overflow-hidden"
                        >
                            <button
                                onClick={() => setIsPurchaseModalOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-20"
                            >
                                <X size={20} />
                            </button>

                            {/* Step 1: Detail */}
                            {purchaseStep === "detail" && (
                                <>
                                    <div className="relative h-56 w-full">
                                        <Image
                                            src={selectedProduct.image || "/product-pot.png"}
                                            alt={selectedProduct.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="text-xs font-bold text-primary uppercase tracking-widest">{selectedProduct.category}</span>
                                                <h2 className="text-2xl font-extrabold mt-1">{selectedProduct.name}</h2>
                                                <p className="text-sm text-muted mt-1 font-semibold">Sold by: {selectedProduct.shopName}</p>
                                            </div>
                                            <div className="text-2xl font-black text-secondary">{selectedProduct.price}</div>
                                        </div>
                                        <p className="text-muted leading-relaxed mb-8">
                                            {selectedProduct.description}
                                        </p>
                                        <button
                                            onClick={handlePurchase}
                                            className="btn-primary w-full justify-center py-4 text-lg"
                                        >
                                            Purchase Item <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Step 2: QR Scanner Simulation */}
                            {purchaseStep === "qr" && (
                                <div className="p-10 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 animate-pulse">
                                        <QrCode size={40} />
                                    </div>
                                    <h2 className="text-2xl font-extrabold mb-2">QR Payment Scanner</h2>
                                    <p className="text-muted mb-8">Scanning shopkeeper's payment code...</p>

                                    <div className="relative w-64 h-64 border-2 border-primary/30 rounded-3xl overflow-hidden mb-8">
                                        <div className="absolute inset-0 bg-primary/5" />
                                        {/* Scanner line animation */}
                                        <motion.div
                                            className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(99,102,241,0.8)] z-10"
                                            animate={{ top: ["0%", "100%", "0%"] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/20">
                                            <QrCode size={120} />
                                        </div>
                                    </div>

                                    <p className="text-xs font-bold text-muted uppercase tracking-widest">
                                        Simulating Camera Access...
                                    </p>
                                </div>
                            )}

                            {/* Step 3: Success */}
                            {purchaseStep === "success" && (
                                <div className="p-12 flex flex-col items-center text-center">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-24 h-24 bg-success/15 rounded-full flex items-center justify-center text-success mb-6"
                                    >
                                        <CheckCircle2 size={48} />
                                    </motion.div>
                                    <h2 className="text-3xl font-extrabold mb-3">Payment Successful!</h2>
                                    <p className="text-muted mb-8">
                                        Your order for <span className="text-foreground font-bold">{selectedProduct.name}</span> has been placed successfully.
                                    </p>
                                    <div className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-2 mb-8 items-start">
                                        <div className="flex justify-between w-full text-sm">
                                            <span className="text-muted">Transaction ID</span>
                                            <span className="font-mono">TXN-{Date.now().toString().slice(-8)}</span>
                                        </div>
                                        <div className="flex justify-between w-full text-sm">
                                            <span className="text-muted">Total Paid</span>
                                            <span className="font-bold text-secondary">{selectedProduct.price}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsPurchaseModalOpen(false);
                                            setActiveTab("orders");
                                        }}
                                        className="btn-primary w-full justify-center py-4"
                                    >
                                        View My Orders
                                    </button>
                                </div>
                            )}

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Flagged Alert Banner (Bottom) */}
            <AnimatePresence>
                {filteredProducts.some(p => p.isBanned) && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-danger/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3 text-white"
                    >
                        <AlertTriangle size={18} />
                        <p className="text-sm font-bold">
                            Some listings have been blocked due to suspicious content.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

        </DashboardShell>
    );
}
