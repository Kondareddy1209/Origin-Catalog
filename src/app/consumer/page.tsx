"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import {
    ShoppingBag, Package, ShoppingCart, User, Mic,
    Search, Filter, CheckCircle2, QrCode, X,
    AlertTriangle, ArrowRight, Wallet, Trash2, Plus, Minus, type LucideIcon
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_ORDERS, type MockProduct, type MockOrder } from "@/lib/mockData";
import Image from "next/image";

type Tab = "marketplace" | "orders" | "profile";

const NAV_ITEMS: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "orders", label: "My Orders", icon: ShoppingCart },
    { id: "profile", label: "My Profile", icon: User },
];

interface CartItem extends MockProduct {
    cartQuantity: number;
}

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
    const [isListening, setIsListening] = useState(false);

    // Cart logic
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Purchase/Payment flow
    const [selectedProduct, setSelectedProduct] = useState<MockProduct | null>(null);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [purchaseStep, setPurchaseStep] = useState<"detail" | "cart" | "payment" | "success">("detail");

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

    // Voice search simulation
    const handleVoiceSearch = () => {
        setIsListening(true);
        setTimeout(() => {
            setSearchQuery("Handicrafts");
            setIsListening(false);
        }, 1500);
    };

    // Cart handlers
    const addToCart = (p: MockProduct) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === p.id);
            if (existing) {
                return prev.map(item => item.id === p.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item);
            }
            return [...prev, { ...p, cartQuantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));

    const updateCartQty = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.cartQuantity + delta);
                return { ...item, cartQuantity: newQty };
            }
            return item;
        }));
    };

    const cartTotalNum = cart.reduce((acc, item) => {
        const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
        return acc + (priceNum * item.cartQuantity);
    }, 0);

    const handleCheckout = () => {
        setPurchaseStep("payment");
        setIsPurchaseModalOpen(true);
    };

    const finalizePayment = () => {
        // Simulate payment processing
        setTimeout(() => {
            const newOrders: MockOrder[] = cart.map(item => ({
                id: `o${Date.now()}-${item.id}`,
                consumerId: user.id,
                consumerName: user.name,
                shopkeeperId: item.shopkeeperId,
                productId: item.id,
                productName: item.name,
                amount: item.price,
                status: "paid",
                createdAt: new Date().toISOString().split("T")[0],
            }));

            setOrders(prev => [...newOrders, ...prev]);
            setCart([]);
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
            headerAction={
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2.5 rounded-xl bg-surface border border-white/5 text-muted hover:text-foreground transition-all"
                >
                    <ShoppingCart size={18} />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {cart.length}
                        </span>
                    )}
                </button>
            }
        >
            <AnimatePresence mode="wait">

                {/* ── MARKETPLACE ── */}
                {activeTab === "marketplace" && (
                    <motion.div key="marketplace" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                        {/* Search Bar with Voice */}
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search for products or shops..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="form-input pl-11 pr-12 py-3 text-base"
                                />
                                <button
                                    onClick={handleVoiceSearch}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${isListening ? "bg-primary text-white animate-pulse" : "text-muted hover:text-primary"
                                        }`}
                                    title="Search by Voice"
                                >
                                    <Mic size={18} className={isListening ? "animate-bounce" : ""} />
                                </button>
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

                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(p);
                                                    setPurchaseStep("detail");
                                                    setIsPurchaseModalOpen(true);
                                                }}
                                                className="flex-1 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold text-muted hover:text-foreground transition-all uppercase tracking-wider"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => addToCart(p)}
                                                disabled={p.isBanned}
                                                className={`flex-[2] py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${p.isBanned
                                                        ? 'bg-white/5 text-muted cursor-not-allowed'
                                                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                                    }`}
                                            >
                                                <Plus size={14} /> Add to Cart
                                            </button>
                                        </div>
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
                                                <td className="px-6 py-4 font-mono text-xs text-muted">#{o.id.split('-')[0].slice(-6)}</td>
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

            {/* ── CART SLIDE-OVER ── */}
            <AnimatePresence>
                {isCartOpen && (
                    <div className="fixed inset-0 z-[250] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="relative w-full max-w-md bg-surface border-l border-white/5 h-full flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart size={20} className="text-primary" />
                                    <h2 className="text-xl font-extrabold">My Cart</h2>
                                </div>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl hover:bg-white/5 text-muted">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center gap-4 text-center opacity-50">
                                        <ShoppingCart size={48} />
                                        <p className="text-lg font-bold">Your cart is empty</p>
                                        <button onClick={() => setIsCartOpen(false)} className="btn-primary py-2 px-6 text-sm">Start Shopping</button>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                                <Image src={item.image || "/product-pot.png"} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-sm truncate">{item.name}</h3>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-muted hover:text-danger">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-muted mb-2">By {item.shopName}</p>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
                                                        <button onClick={() => updateCartQty(item.id, -1)} className="p-1 hover:bg-white/10 rounded-md"><Minus size={12} /></button>
                                                        <span className="text-xs font-bold w-4 text-center">{item.cartQuantity}</span>
                                                        <button onClick={() => updateCartQty(item.id, 1)} className="p-1 hover:bg-white/10 rounded-md"><Plus size={12} /></button>
                                                    </div>
                                                    <span className="font-extrabold text-secondary">{item.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-6 border-t border-white/5 bg-black/20 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted font-bold uppercase text-xs tracking-widest">Total Amount</span>
                                        <span className="text-2xl font-black text-secondary">₹{cartTotalNum.toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        className="btn-primary w-full justify-center py-4 text-base"
                                    >
                                        Proceed to Checkout <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── PURCHASE & PAYMENT MODAL ── */}
            <AnimatePresence>
                {isPurchaseModalOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsPurchaseModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card w-full max-w-lg relative z-10 p-0 overflow-hidden"
                        >
                            {purchaseStep !== "success" && (
                                <button
                                    onClick={() => setIsPurchaseModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-20"
                                >
                                    <X size={20} />
                                </button>
                            )}

                            {/* Step Detail */}
                            {purchaseStep === "detail" && selectedProduct && (
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
                                            onClick={() => {
                                                addToCart(selectedProduct);
                                                setIsCartOpen(true);
                                                setIsPurchaseModalOpen(false);
                                            }}
                                            className="btn-primary w-full justify-center py-4 text-lg"
                                        >
                                            Add to Cart <Plus size={20} />
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Step Payment Confirmation */}
                            {purchaseStep === "payment" && (
                                <div className="p-10 flex flex-col">
                                    <h2 className="text-2xl font-extrabold mb-6">Confirm Payment</h2>
                                    <div className="space-y-4 mb-8">
                                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                                            {cart.map(item => (
                                                <div key={item.id} className="flex justify-between text-sm py-2 border-b border-white/5">
                                                    <span className="text-muted">{item.name} (x{item.cartQuantity})</span>
                                                    <span className="font-bold">{item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center pt-4">
                                            <span className="text-lg font-bold">Total Payable</span>
                                            <span className="text-2xl font-black text-secondary">₹{cartTotalNum.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setIsPurchaseModalOpen(false)}
                                            className="btn-secondary py-4"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={finalizePayment}
                                            className="btn-primary py-4 justify-center"
                                        >
                                            Confirm & Pay
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-muted text-center mt-6 uppercase tracking-widest font-bold">
                                        Secure Encrypted Transaction
                                    </p>
                                </div>
                            )}

                            {/* Step Success */}
                            {purchaseStep === "success" && (
                                <div className="p-12 flex flex-col items-center text-center">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-24 h-24 bg-success/15 rounded-full flex items-center justify-center text-success mb-6"
                                    >
                                        <CheckCircle2 size={48} />
                                    </motion.div>
                                    <h2 className="text-3xl font-extrabold mb-3">Order Placed!</h2>
                                    <p className="text-muted mb-8">
                                        Your payment was successful. The shopkeepers have been notified.
                                    </p>
                                    <div className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-2 mb-8 items-start">
                                        <div className="flex justify-between w-full text-sm">
                                            <span className="text-muted">Status</span>
                                            <span className="text-success font-bold uppercase tracking-widest text-[10px]">Confirmed</span>
                                        </div>
                                        <div className="flex justify-between w-full text-sm">
                                            <span className="text-muted">Total Paid</span>
                                            <span className="font-bold text-secondary">₹{cartTotalNum.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsPurchaseModalOpen(false);
                                            setActiveTab("orders");
                                            setIsCartOpen(false);
                                        }}
                                        className="btn-primary w-full justify-center py-4"
                                    >
                                        Track My Orders
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
