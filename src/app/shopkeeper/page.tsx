"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useData } from "@/lib/DataContext";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import {
    Plus, Edit2, Trash2, Package, LayoutDashboard, User, Mic,
    QrCode, CheckCircle2, Save, X, AlertTriangle, type LucideIcon
} from "lucide-react";
import { type MockProduct } from "@/lib/mockData";
import { detectScam, getMatchedKeywords } from "@/lib/scamDetection";
import Image from "next/image";

type Tab = "overview" | "products" | "addproduct" | "payment" | "profile";

const NAV_ITEMS: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "My Products", icon: Package },
    { id: "addproduct", label: "Add Product", icon: Plus },
    { id: "payment", label: "QR Payment", icon: QrCode },
    { id: "profile", label: "Shop Profile", icon: User },
];

const CATEGORIES = ["Home Decor", "Fashion", "Food", "Handicrafts", "Textiles", "Jewellery", "Other"] as const;

// ---------------------------------------------------------------
// SIMULATED QR SVG
// ---------------------------------------------------------------
function FakeQR({ amount, id }: { amount: string; id: string }) {
    const cells: boolean[] = Array.from({ length: 25 * 25 }, (_, i) => {
        const row = Math.floor(i / 25);
        const col = i % 25;
        if ((row < 7 && col < 7) || (row < 7 && col > 17) || (row > 17 && col < 7)) return true;
        const seed = (row * 31 + col * 17 + id.charCodeAt(0)) % 3;
        return seed === 0;
    });

    return (
        <div aria-label="Payment QR code" role="img" className="inline-block p-4 bg-white rounded-2xl">
            <div className="grid gap-[1px]" style={{ gridTemplateColumns: "repeat(25, 8px)" }}>
                {cells.map((on, i) => (
                    <div key={i} className={`w-2 h-2 rounded-[1px] ${on ? "bg-gray-900" : "bg-white"}`} />
                ))}
            </div>
            <p className="text-center text-xs text-gray-600 mt-2 font-bold">{amount}</p>
        </div>
    );
}

// ---------------------------------------------------------------
// SHOPKEEPER DASHBOARD
// ---------------------------------------------------------------
export default function ShopkeeperDashboard() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { products, orders, addProduct, updateProduct, deleteProduct } = useData();
    const { isListening, startListening, stopListening, error: speechError } = useSpeechRecognition();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("overview");

    // My products & orders
    const myProducts = products.filter((p) => p.shopkeeperId === user?.id);
    const myOrders = orders.filter((o) => o.shopkeeperId === user?.id);

    // Shop profile
    const [profile, setProfile] = useState({
        shopName: "Ravi's Handicrafts",
        description: "Traditional handmade products from local artisans.",
        contact: "ravi@shop.com",
    });

    // Add/edit form
    const blankForm = {
        name: "", description: "", price: "", category: CATEGORIES[0] as string,
        quantity: "1", image: "/product-pot.png",
    };
    const [form, setForm] = useState(blankForm);
    const [editId, setEditId] = useState<string | null>(null);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    // QR payment state
    const [qrAmount, setQrAmount] = useState("₹0");
    const [qrGenerated, setQrGenerated] = useState(false);
    const [qrPaid, setQrPaid] = useState(false);

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || user?.role !== "shopkeeper")) {
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

    const startEdit = (p: MockProduct) => {
        setForm({ name: p.name, description: p.description, price: p.price, category: p.category, quantity: String(p.quantity), image: p.image ?? "/product-pot.png" });
        setEditId(p.id);
        setActiveTab("addproduct");
        setFormError("");
        setFormSuccess("");
    };

    const saveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        // Scam detection
        if (detectScam(form.name, form.description)) {
            const kws = getMatchedKeywords(form.name, form.description);
            setFormError(`Product listing blocked due to suspicious content. Detected keywords: ${kws.join(", ")}`);
            return;
        }

        if (editId) {
            updateProduct(editId, {
                ...form,
                priceNum: parseFloat(form.price.replace(/[^0-9.]/g, "")) || 0,
                quantity: parseInt(form.quantity) || 0
            });
            setFormSuccess("Product updated successfully!");
        } else {
            addProduct({
                shopkeeperId: user.id,
                shopName: profile.shopName,
                name: form.name.trim(),
                description: form.description.trim(),
                price: form.price,
                priceNum: parseFloat(form.price.replace(/[^0-9.]/g, "")) || 0,
                category: form.category,
                image: form.image,
                quantity: parseInt(form.quantity) || 1,
            });
            setFormSuccess("Product listed successfully!");
        }
        setForm(blankForm);
        setEditId(null);
        setTimeout(() => { setActiveTab("products"); setFormSuccess(""); }, 1200);
    };

    const handleVoiceListing = () => {
        if (isListening) {
            stopListening();
            return;
        }

        startListening({
            onResult: (text) => {
                // Heuristic parsing: Name, Price, Category
                // e.g. "Listing Bamboo Basket for 500 rupees in Handicrafts"
                const parts = text.toLowerCase().split(" for ");
                const namePart = parts[0]?.replace("listing ", "").trim();
                const priceMatch = text.match(/(\d+)/);
                const categoryMatch = CATEGORIES.find(c => text.toLowerCase().includes(c.toLowerCase()));

                setForm(prev => ({
                    ...prev,
                    name: namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : prev.name,
                    price: priceMatch ? `₹${priceMatch[0]}` : prev.price,
                    category: categoryMatch || prev.category,
                    description: `Captured by voice: "${text}"`
                }));
            },
            onError: (err) => setFormError(`Voice Error: ${err}`)
        });
    };

    const generateQR = (e: React.FormEvent) => {
        e.preventDefault();
        setQrGenerated(true);
        setQrPaid(false);
    };

    const simulatePayment = () => {
        setTimeout(() => setQrPaid(true), 1500);
    };

    return (
        <DashboardShell
            navItems={NAV_ITEMS}
            activeTab={activeTab}
            onTabChange={(t) => { setActiveTab(t as Tab); setFormError(""); setFormSuccess(""); }}
            roleBadge={{ label: "Shopkeeper", color: "bg-primary/15 text-primary border border-primary/25" }}
            title={NAV_ITEMS.find((n) => n.id === activeTab)?.label ?? "Dashboard"}
            subtitle={`${profile.shopName} — ${user.name}`}
            headerAction={
                <button onClick={() => { setEditId(null); setForm(blankForm); setActiveTab("addproduct"); }} className="btn-primary py-2 px-4 text-sm" title="Add new product">
                    <Plus size={15} aria-hidden="true" /> Add Product
                </button>
            }
        >
            <AnimatePresence mode="wait">

                {/* ── OVERVIEW ── */}
                {activeTab === "overview" && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "My Products", value: myProducts.length, color: "text-primary" },
                                { label: "Active", value: myProducts.filter(p => !p.isBanned).length, color: "text-success" },
                                { label: "Orders", value: myOrders.length, color: "text-secondary" },
                                { label: "Revenue (est)", value: `₹${myOrders.filter(o => o.status === "paid").reduce((s, o) => s + parseInt(o.amount.replace(/\D/g, "")), 0).toLocaleString()}`, color: "text-accent" },
                            ].map((s, i) => (
                                <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass-card flex flex-col gap-1 p-5">
                                    <p className="text-xs font-semibold text-muted uppercase tracking-widest">{s.label}</p>
                                    <p className={`text-2xl font-extrabold mt-0.5 ${s.color}`}>{s.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Transactions / Purchase Logs */}
                        <div className="glass-card p-0 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.05] flex justify-between items-center">
                                <h2 className="text-lg font-extrabold">Recent Purchase Logs</h2>
                                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Shared Transaction History</span>
                            </div>
                            {myOrders.length === 0 ? (
                                <div className="py-20 flex flex-col items-center justify-center opacity-40">
                                    <ShoppingCart size={48} className="mb-2" />
                                    <p className="font-bold">No sales records found.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                                {["Buyer Details", "Product Sold", "Qty", "Amount", "Status", "Time & Date"].map(h => (
                                                    <th key={h} className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myOrders.map((o) => (
                                                <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-foreground">{o.consumerName}</div>
                                                        <div className="text-[10px] text-muted font-mono">#{o.consumerId}</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-primary">{o.productName}</td>
                                                    <td className="px-6 py-4 text-muted font-bold">{o.quantity}</td>
                                                    <td className="px-6 py-4 font-black text-secondary">{o.amount}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`badge ${o.status === "paid" ? "badge-success" : "badge-warning"}`}>{o.status}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-muted text-[11px] font-semibold leading-tight">{o.createdAt}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── PRODUCTS ── */}
                {activeTab === "products" && (
                    <motion.div key="products" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        {myProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <Package size={56} className="text-white/10" aria-hidden="true" />
                                <p className="text-muted text-lg">No products listed yet.</p>
                                <button onClick={() => setActiveTab("addproduct")} className="btn-primary py-2 px-6 text-sm" title="Add product">
                                    <Plus size={15} aria-hidden="true" /> Add First Product
                                </button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {myProducts.map((p) => (
                                    <div key={p.id} className="glass-card flex flex-col p-0 overflow-hidden group">
                                        <div className="relative h-40 bg-surface overflow-hidden">
                                            <Image src={p.image ?? "/product-pot.png"} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                                            {p.isBanned && (
                                                <div className="absolute top-2 left-2 badge bg-danger/15 text-danger border-danger/30">
                                                    <AlertTriangle size={11} aria-hidden="true" /> Flagged
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex flex-col gap-2 flex-1">
                                            <div className="flex justify-between">
                                                <span className="text-xs font-bold text-primary/80 uppercase tracking-widest">{p.category}</span>
                                                <span className="font-extrabold">{p.price}</span>
                                            </div>
                                            <h3 className="font-bold">{p.name}</h3>
                                            <p className="text-muted text-sm line-clamp-2">{p.description}</p>
                                            <div className="flex gap-2 mt-auto pt-3">
                                                <button onClick={() => startEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all" aria-label={`Edit ${p.name}`} title={`Edit ${p.name}`}>
                                                    <Edit2 size={13} aria-hidden="true" /> Edit
                                                </button>
                                                <button onClick={() => deleteProduct(p.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-danger/10 text-danger hover:bg-danger/20 transition-all" aria-label={`Delete ${p.name}`} title={`Delete ${p.name}`}>
                                                    <Trash2 size={13} aria-hidden="true" /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── ADD/EDIT PRODUCT ── */}
                {activeTab === "addproduct" && (
                    <motion.div key="addproduct" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl">
                        <div className="glass-card p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-2xl font-extrabold">{editId ? "Edit Product" : "New Product Listing"}</h2>
                                <button
                                    type="button"
                                    onClick={handleVoiceListing}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isListening
                                        ? "bg-danger text-white animate-pulse"
                                        : "bg-primary/10 text-primary hover:bg-primary/20"
                                        }`}
                                    title={isListening ? "Stop listening" : "Start voice listing"}
                                >
                                    <Mic size={16} className={isListening ? "animate-bounce" : ""} />
                                    {isListening ? "Listening..." : "List by Voice"}
                                </button>
                            </div>

                            {(formError || speechError) && (
                                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm mb-5" role="alert" aria-live="polite">
                                    <AlertTriangle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
                                    <div>
                                        <p className="font-bold">Error Encountered</p>
                                        <p className="mt-0.5 opacity-90">{formError || speechError}</p>
                                    </div>
                                </motion.div>
                            )}

                            {formSuccess && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-4 rounded-xl bg-success/10 border border-success/30 text-success text-sm mb-5" role="status">
                                    <CheckCircle2 size={17} aria-hidden="true" /> {formSuccess}
                                </motion.div>
                            )}

                            <form onSubmit={saveProduct} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="pname" className="text-xs font-bold text-muted uppercase tracking-widest">Product Name *</label>
                                    <input id="pname" type="text" required maxLength={128} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" placeholder="e.g. Handmade Clay Pot" />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="pdesc" className="text-xs font-bold text-muted uppercase tracking-widest">Description *</label>
                                    <textarea id="pdesc" required maxLength={512} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-input min-h-[90px] resize-none" placeholder="Describe your product..." />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="pprice" className="text-xs font-bold text-muted uppercase tracking-widest">Price *</label>
                                        <input id="pprice" type="text" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="form-input" placeholder="₹500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label htmlFor="pqty" className="text-xs font-bold text-muted uppercase tracking-widest">Quantity *</label>
                                        <input id="pqty" type="number" min={1} required value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="form-input" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="pcat" className="text-xs font-bold text-muted uppercase tracking-widest">Category</label>
                                    <select id="pcat" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="form-input appearance-none cursor-pointer">
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="btn-primary flex-1 justify-center py-3" title="List your product">
                                        <Save size={16} aria-hidden="true" /> {editId ? "Save Changes" : "List Product"}
                                    </button>
                                    <button type="button" onClick={() => { setActiveTab("products"); setForm(blankForm); setEditId(null); setFormError(""); }} className="btn-secondary py-3 px-5" title="Cancel creation">
                                        <X size={16} aria-hidden="true" /> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* ── QR PAYMENT ── */}
                {activeTab === "payment" && (
                    <motion.div key="payment" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-lg">
                        <div className="glass-card p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                                    <QrCode size={24} aria-hidden="true" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold">QR Payment</h2>
                                    <p className="text-sm text-muted">Generate a QR for consumer payment</p>
                                </div>
                            </div>

                            {!qrGenerated ? (
                                <form onSubmit={generateQR} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="qramt" className="text-xs font-bold text-muted uppercase tracking-widest">Amount *</label>
                                        <input id="qramt" type="text" required value={qrAmount} onChange={e => setQrAmount(e.target.value)} className="form-input text-xl font-bold" placeholder="₹500" />
                                    </div>
                                    <button type="submit" className="btn-primary w-full justify-center py-3.5 text-base" title="Generate QR Code">
                                        <QrCode size={18} aria-hidden="true" /> Generate QR Code
                                    </button>
                                </form>
                            ) : (
                                <div className="flex flex-col items-center gap-6">
                                    <p className="text-sm text-muted text-center">Show this QR to the consumer to scan and pay.</p>
                                    <FakeQR amount={qrAmount} id={user.id} />

                                    {!qrPaid ? (
                                        <div className="w-full space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-muted justify-center animate-pulse">
                                                <div className="w-2 h-2 rounded-full bg-warning" aria-hidden="true" />
                                                Waiting for payment…
                                            </div>
                                            <button onClick={simulatePayment} className="btn-secondary w-full justify-center py-3 text-sm" title="Simulate consumer payment">
                                                Simulate Consumer Payment ↗
                                            </button>
                                        </div>
                                    ) : (
                                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center">
                                                <CheckCircle2 size={36} className="text-success" aria-hidden="true" />
                                            </div>
                                            <p className="text-xl font-extrabold text-success">Payment Confirmed!</p>
                                            <p className="text-sm text-muted">{qrAmount} received successfully.</p>
                                            <button onClick={() => { setQrGenerated(false); setQrPaid(false); setQrAmount("₹0"); }} className="btn-secondary py-2.5 px-6 text-sm mt-2" title="Create new payment">
                                                New Payment
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── PROFILE ── */}
                {activeTab === "profile" && (
                    <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-lg">
                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-extrabold mb-6">Shop Profile</h2>
                            <form onSubmit={e => { e.preventDefault(); setFormSuccess("Profile saved!"); setTimeout(() => setFormSuccess(""), 2000); }} className="space-y-4">
                                {formSuccess && (
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/30 text-success text-sm" role="status">
                                        <CheckCircle2 size={15} aria-hidden="true" /> {formSuccess}
                                    </div>
                                ) || null}
                                <div className="space-y-1.5">
                                    <label htmlFor="sname" className="text-xs font-bold text-muted uppercase tracking-widest">Shop Name</label>
                                    <input id="sname" type="text" value={profile.shopName} onChange={e => setProfile({ ...profile, shopName: e.target.value })} className="form-input" />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="sdesc" className="text-xs font-bold text-muted uppercase tracking-widest">Description</label>
                                    <textarea id="sdesc" value={profile.description} onChange={e => setProfile({ ...profile, description: e.target.value })} className="form-input min-h-[80px] resize-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="scontact" className="text-xs font-bold text-muted uppercase tracking-widest">Contact</label>
                                    <input id="scontact" type="text" value={profile.contact} onChange={e => setProfile({ ...profile, contact: e.target.value })} className="form-input" />
                                </div>
                                <button type="submit" className="btn-primary py-3 px-6" title="Save profile settings">
                                    <Save size={16} aria-hidden="true" /> Save Profile
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </DashboardShell>
    );
}

// Sub-components used
const ShoppingCart = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);
