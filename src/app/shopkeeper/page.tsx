"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useData } from "@/lib/DataContext";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import {
    Plus, Edit2, Trash2, Package, LayoutDashboard, User, Mic, TrendingUp, BarChart3,
    QrCode, CheckCircle2, Save, AlertTriangle, Upload, Volume2, Info, Loader2, type LucideIcon
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

const CATEGORIES = ["Handicrafts", "Fashion", "Grocery", "Home Decor", "Textiles", "Jewellery", "Other"] as const;

const CATEGORY_KEYWORDS: Record<string, string> = {
    "Handicrafts": "pottery,handicraft,artisan,clay",
    "Fashion": "clothing,fashion,ethnic,apparel",
    "Grocery": "fruit,vegetable,grocery,spices",
    "Home Decor": "homedecor,interior,furniture,craft",
    "Textiles": "fabric,textile,yarn,weaving",
    "Jewellery": "jewellery,jewelry,gold,necklace",
    "Other": "product,commerce,item"
};

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
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        quantity: "1", unit: "pcs", unitType: "count" as "count" | "weight", image: "",
    };
    const [form, setForm] = useState(blankForm);
    const [editId, setEditId] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    // QR payment state
    const [qrAmount, setQrAmount] = useState("₹0");
    const [qrGenerated, setQrGenerated] = useState(false);
    const [qrPaid, setQrPaid] = useState(false);
    const [txnId, setTxnId] = useState("");
    const [selectedLang, setSelectedLang] = useState("en-IN");

    const speak = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const synth = new SpeechSynthesisUtterance(text);
        synth.lang = selectedLang;
        synth.rate = 1.1;
        window.speechSynthesis.speak(synth);
    };

    // --- AUTO IMAGE GENERATION EFFECT ---
    useEffect(() => {
        // Only run if we are in Add Product tab and image is empty or already a loremflickr url
        if (activeTab !== "addproduct") return;

        const timer = setTimeout(() => {
            const hasEnoughInfo = form.name.trim().length >= 3;
            const isAutoImage = !form.image || form.image.startsWith("https://loremflickr.com");

            if (hasEnoughInfo && isAutoImage) {
                const isEnglish = /^[a-zA-Z0-9\s,.'-]*$/.test(form.name.trim());

                let searchQuery = "";
                if (isEnglish) {
                    searchQuery = `${form.name.trim()},commerce`;
                } else {
                    const keywords = CATEGORY_KEYWORDS[form.category] || "product";
                    searchQuery = `${keywords},commerce`;
                }

                const randomSeed = Math.floor(Math.random() * 1000);
                const newImg = `https://loremflickr.com/800/600/${encodeURIComponent(searchQuery)}?lock=${randomSeed}`;

                // Only update if the URL actually changed to prevent infinite loops or flickering
                if (form.image !== newImg) {
                    setForm(prev => ({ ...prev, image: newImg }));
                }
            }
        }, 1200);

        return () => clearTimeout(timer);
    }, [form.name, form.category, activeTab]);

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
        setForm({
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            quantity: String(p.quantity),
            unit: p.unit || "pcs",
            unitType: p.unitType || "count",
            image: p.image ?? ""
        });
        setEditId(p.id);
        setActiveTab("addproduct");
        setFormError("");
        setFormSuccess("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        if (!user) {
            setFormError("Unauthorized. Please login again.");
            return;
        }

        if (!form.name.trim() || !form.price) {
            setFormError("Please fill in the product name and price.");
            return;
        }

        if (detectScam(form.name, form.description)) {
            const kws = getMatchedKeywords(form.name, form.description);
            setFormError(`Product listing blocked due to suspicious content. Detected keywords: ${kws.join(", ")}`);
            return;
        }

        const priceNum = parseFloat(form.price.replace(/[^0-9.]/g, "")) || 0;
        const quantityNum = parseInt(form.quantity) || 1;

        // BETTER AUTO-IMAGE GENERATION
        let finalImage = form.image;
        if (!finalImage || finalImage === "/product-pot.png" || finalImage === "/product-scarf.png") {
            // If the name is non-English (like Telugu/Hindi), 
            // loremflickr might not find anything good. 
            // We'll use the category as a fallback/hint.
            const isEnglish = /^[a-zA-Z0-9\s,.'-]*$/.test(form.name.trim());

            let searchQuery = "";
            if (isEnglish) {
                searchQuery = `${form.name.trim()},commerce`;
            } else {
                // For non-English name, use category + " " + common keywords
                searchQuery = `${form.category},product,commerce`;
            }

            // Randomize slightly to avoid getting the exact same image for same category
            const randomSeed = Math.floor(Math.random() * 1000);
            finalImage = `https://loremflickr.com/800/600/${encodeURIComponent(searchQuery)}?lock=${randomSeed}`;
        }

        if (editId) {
            updateProduct(editId, {
                ...form,
                priceNum,
                image: finalImage,
                quantity: quantityNum
            });
            setFormSuccess("Product updated successfully!");
        } else {
            addProduct({
                shopkeeperId: user.id,
                shopName: profile.shopName,
                name: form.name.trim(),
                description: form.description.trim(),
                price: form.price,
                priceNum,
                category: form.category,
                image: finalImage,
                quantity: quantityNum,
                unit: form.unit,
                unitType: form.unitType,
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
                const lower = text.toLowerCase();

                // Price detection
                const priceMatch = lower.match(/(?:price|rate|at|for|cost) (?:is )?(\d+)/) || lower.match(/(\d+) (?:rupees|rs|bucks)/);
                const priceValue = priceMatch ? `₹${priceMatch[1]}` : form.price;

                // Quantity detection
                const qtyMatch = lower.match(/(?:quantity|qty|stock|units|count) (?:is )?(\d+)/) || lower.match(/(\d+) (?:units|kg|items|pieces)/);
                const qtyValue = qtyMatch ? qtyMatch[1] : form.quantity;

                // Unit detection
                const unitType = lower.includes("kg") || lower.includes("kilo") || lower.includes("gram") || lower.includes("litre") ? "weight" : "count";
                const unitValue = lower.includes("kg") || lower.includes("kilo") ? "kg" :
                    lower.includes("gram") ? "grams" :
                        lower.includes("litre") ? "litre" : "pcs";

                // Category detection
                const categoryMatch = CATEGORIES.find(c => lower.includes(c.toLowerCase()));

                // Name detection
                const namePart = text.split(/price|quantity|qty|for|at|rs|rupees/i)[0].trim().replace(/^listing\s+/i, "");
                const nameValue = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : form.name;

                setForm(prev => ({
                    ...prev,
                    name: nameValue,
                    price: priceValue,
                    quantity: qtyValue,
                    unit: unitValue,
                    unitType: unitType,
                    category: categoryMatch || prev.category,
                    description: `Captured by voice (${selectedLang}): "${text}"`
                }));

                speak(`Listing ${nameValue} at ${priceValue}. Quantity ${qtyValue} ${unitValue}. Please confirm the details.`);
            },
            lang: selectedLang,
            onError: (err) => setFormError(`Voice Error: ${err}`)
        });
    };

    const handleImageScan = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        const reader = new FileReader();
        reader.onload = (prev) => {
            const dataUrl = prev.target?.result as string;

            // Simulate AI Analysis
            setTimeout(() => {
                const fileName = file.name.toLowerCase();
                let name = form.name;
                let category = form.category;
                let desc = form.description;

                if (fileName.includes("pot") || fileName.includes("clay")) {
                    name = "Handcrafted Clay Pot";
                    category = "Handicrafts";
                    desc = "Beautiful clay pot for water storage and cooling.";
                } else if (fileName.includes("scarf") || fileName.includes("silk")) {
                    name = "Pure Silk Scarf";
                    category = "Fashion";
                    desc = "Elegant silk scarf with traditional artisan patterns.";
                }

                setForm(prevForm => ({
                    ...prevForm,
                    name: name || "New Scanned Product",
                    category,
                    description: desc || "Automatically analyzed from image.",
                    image: dataUrl
                }));
                setIsScanning(false);
            }, 1800);
        };
        reader.readAsDataURL(file);
    };

    const generateQR = (e: React.FormEvent) => {
        e.preventDefault();
        setQrGenerated(true);
        setQrPaid(false);
        setTxnId(`TXN-${Math.random().toString(36).substring(7).toUpperCase()}`);
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

                        {/* 📈 GROWTH ANALYTICS */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 glass-card p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="text-success" size={20} />
                                        <h3 className="text-base font-extrabold uppercase tracking-widest text-slate-200">Revenue Momentum</h3>
                                    </div>
                                    <span className="text-[10px] font-black bg-success/10 text-success px-3 py-1 rounded-full uppercase tracking-tighter shadow-[0_0_10px_rgba(var(--success-rgb),0.1)]">+14.2% THIS WEEK</span>
                                </div>
                                <div className="h-[180px] flex items-end gap-3 px-2">
                                    {[35, 65, 45, 85, 55, 95, 75].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                            <div className="w-full relative">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: 0.1 * i, duration: 1, ease: "easeOut" }}
                                                    className="w-full bg-gradient-to-t from-primary/20 via-primary/60 to-primary rounded-t-xl relative group-hover:brightness-125 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
                                                >
                                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-surface/90 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-lg text-[10px] font-black shadow-xl z-10 pointer-events-none">
                                                        ₹{h}k
                                                    </div>
                                                </motion.div>
                                            </div>
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-6 flex flex-col">
                                <div className="flex items-center gap-2 mb-6">
                                    <BarChart3 className="text-secondary" size={20} />
                                    <h3 className="text-base font-extrabold uppercase tracking-widest text-slate-200">Smart Audit</h3>
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 relative group cursor-default">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                            <Info size={12} className="text-primary" />
                                        </div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">Top Performer</span>
                                            <span className="text-[9px] font-black text-success uppercase">Active Listing</span>
                                        </div>
                                        <p className="text-sm font-black text-foreground truncate">Handmade Clay Pot</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-danger/5 border border-danger/10 group cursor-default">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[9px] font-black text-danger/60 uppercase tracking-widest text-center">Critical Stock</span>
                                            <span className="text-[9px] font-black text-danger uppercase animate-pulse">Low Supply</span>
                                        </div>
                                        <p className="text-sm font-black text-foreground truncate">Red Silk Scarf (2 pcs left)</p>
                                    </div>
                                </div>
                                <button className="mt-6 text-[10px] font-black text-primary hover:text-primary-light uppercase tracking-[0.2em] text-center transition-colors py-2 border border-primary/10 rounded-xl hover:bg-primary/5" title="Export detailed analytics">
                                    GENERATE REPORT <TrendingUp size={10} className="inline ml-1" />
                                </button>
                            </div>
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
                                                {["Buyer Details", "Product Sold", "Qty", "Amount", "Method", "Status", "Time & Date"].map(h => (
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
                                                    <td className="px-6 py-4 text-muted font-bold">
                                                        {o.quantity} <span className="text-[10px] text-muted-foreground ml-1">{o.unit || "pcs"}</span>
                                                    </td>
                                                    <td className="px-6 py-4 font-black text-secondary">{o.amount}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[9px] font-black uppercase bg-secondary/10 text-secondary px-2 py-1 rounded-md">{o.paymentMethod || "COD"}</span>
                                                    </td>
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
                                                <span className="text-[10px] text-muted font-bold">Qty: {p.quantity} {p.unit}</span>
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
                    <motion.div key="addproduct" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl">
                        <div className="grid md:grid-cols-[1fr_280px] gap-6">
                            <div className="glass-card p-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                    <h2 className="text-2xl font-extrabold">{editId ? "Edit Product" : "Quick List Product"}</h2>
                                    <div className="flex items-center gap-2">
                                        {/* Lang Selector */}
                                        <select
                                            title="Voice Language"
                                            value={selectedLang}
                                            onChange={(e) => setSelectedLang(e.target.value)}
                                            className="bg-surface/50 border border-white/10 rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-tighter text-muted hover:text-foreground transition-colors cursor-pointer outline-none"
                                        >
                                            <option value="en-IN">English</option>
                                            <option value="hi-IN">Hindi (हिंदी)</option>
                                            <option value="te-IN">Telugu (తెలుగు)</option>
                                            <option value="ta-IN">Tamil (தமிழ்)</option>
                                            <option value="mr-IN">Marathi (मराठी)</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={handleVoiceListing}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isListening
                                                ? "bg-danger text-white animate-pulse shadow-[0_0_15px_rgba(var(--danger-rgb),0.4)]"
                                                : "bg-primary/10 text-primary hover:bg-primary/20"
                                                }`}
                                            title={isListening ? "Stop listening" : "Start voice listing"}
                                        >
                                            <Mic size={16} className={isListening ? "animate-bounce" : ""} />
                                            {isListening ? "Listening..." : "List by Voice"}
                                            {isListening && <Volume2 size={12} className="ml-1 opacity-70" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all"
                                            title="Scan from image"
                                        >
                                            {isScanning ? <span className="animate-spin inline-block">◌</span> : <Upload size={16} />}
                                            {isScanning ? "Scanning..." : "Image Scan"}
                                        </button>
                                        <input type="file" ref={fileInputRef} onChange={handleImageScan} accept="image/*" className="hidden" />
                                    </div>
                                </div>

                                {(formError || speechError) && (
                                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm mb-6" role="alert" aria-live="polite">
                                        <AlertTriangle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
                                        <div>
                                            <p className="font-bold">Entry Blocked</p>
                                            <p className="mt-0.5 opacity-90">{formError || speechError}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {formSuccess && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-4 rounded-xl bg-success/10 border border-success/30 text-success text-sm mb-6" role="status">
                                        <CheckCircle2 size={17} aria-hidden="true" /> {formSuccess}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="pname" className="text-xs font-bold text-muted uppercase tracking-widest">Product Name *</label>
                                        <input id="pname" type="text" required maxLength={128} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" placeholder="e.g. Handmade Clay Pot" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="pdesc" className="text-xs font-bold text-muted uppercase tracking-widest">Description *</label>
                                        <textarea id="pdesc" required maxLength={512} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-input min-h-[100px] resize-none" placeholder="Describe your product manually or via AI tools above..." />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label htmlFor="pprice" className="text-xs font-bold text-muted uppercase tracking-widest">Listing Price *</label>
                                            <input id="pprice" type="text" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="form-input" placeholder="₹500" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label htmlFor="pqty" className="text-xs font-bold text-muted uppercase tracking-widest">Available Qty *</label>
                                            <div className="flex gap-2">
                                                <input id="pqty" type="number" min={1} required value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="form-input flex-1" />
                                                <select
                                                    className="form-input w-24 appearance-none cursor-pointer"
                                                    value={form.unit}
                                                    title="Select quantity unit"
                                                    onChange={e => {
                                                        const u = e.target.value;
                                                        const ut: "weight" | "count" = (u === "kg" || u === "grams" || u === "litre") ? "weight" : "count";
                                                        setForm({ ...form, unit: u, unitType: ut });
                                                    }}
                                                >
                                                    <option value="pcs">pcs</option>
                                                    <option value="kg">kg</option>
                                                    <option value="grams">grams</option>
                                                    <option value="litre">litre</option>
                                                    <option value="units">units</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="pcat" className="text-xs font-bold text-muted uppercase tracking-widest">Market Category</label>
                                        <select id="pcat" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="form-input appearance-none cursor-pointer">
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button type="submit" className="btn-primary flex-2 justify-center py-4 text-base" title="List your product">
                                            <Save size={18} aria-hidden="true" /> {editId ? "Update System" : "Publish Listing"}
                                        </button>
                                        <button type="button" onClick={() => { setActiveTab("products"); setForm(blankForm); setEditId(null); setFormError(""); }} className="btn-secondary py-4 px-6" title="Cancel creation">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Preview Card */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block pl-1">Live Preview</label>
                                <div className="glass-card p-0 overflow-hidden border-white/5 bg-white/[0.02]">
                                    <div className="relative h-40 bg-surface">
                                        {isScanning || (form.image.startsWith("https://loremflickr.com") && form.name.length > 2) ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/20 backdrop-blur-sm z-10 pointer-events-none">
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md">
                                                    <Loader2 size={12} className="text-primary animate-spin" />
                                                    <span className="text-[9px] font-black uppercase text-primary tracking-widest">AI Vision Active</span>
                                                </div>
                                            </div>
                                        ) : null}
                                        <Image src={form.image || "/product-pot.png"} alt="Preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                                    </div>
                                    <div className="p-5 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] leading-none">{form.category || "CATEGORY"}</span>
                                            <span className="text-lg font-black text-secondary leading-none">{form.price || "₹0"}</span>
                                        </div>
                                        <h4 className="font-extrabold text-foreground leading-tight truncate">{form.name || "Untitled Product"}</h4>
                                        <p className="text-[11px] text-muted italic line-clamp-2 leading-relaxed h-[36px]">{form.description || "Description will appear here..."}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                    <p className="text-[9px] font-black text-muted uppercase mb-2 tracking-widest text-center">Safety Status</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <CheckCircle2 size={12} className="text-success" />
                                        <span className="text-[10px] font-bold text-success uppercase">Approved by AI</span>
                                    </div>
                                </div>
                            </div>
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
                                    <h2 className="text-2xl font-extrabold">Instant QR Generator</h2>
                                    <p className="text-sm text-muted">Generate a payment link for on-site sales</p>
                                </div>
                            </div>

                            {!qrGenerated ? (
                                <form onSubmit={generateQR} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="qramt" className="text-xs font-bold text-muted uppercase tracking-widest">Sale Amount *</label>
                                        <input id="qramt" type="text" required value={qrAmount} onChange={e => setQrAmount(e.target.value)} className="form-input text-2xl font-black text-secondary" placeholder="₹0" />
                                    </div>
                                    <button type="submit" className="btn-primary w-full justify-center py-4 text-base" title="Generate QR Code">
                                        <QrCode size={20} aria-hidden="true" /> Generate Dynamic QR
                                    </button>
                                </form>
                            ) : (
                                <div className="flex flex-col items-center gap-6">
                                    <p className="text-sm text-muted text-center font-medium">Customer scans this code to initiate an instant bank-to-bank transfer.</p>
                                    <FakeQR amount={qrAmount} id={user.id} />

                                    {!qrPaid ? (
                                        <div className="w-full space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-muted justify-center animate-pulse">
                                                <div className="w-2.5 h-2.5 rounded-full bg-warning shadow-[0_0_8px_rgba(var(--warning-rgb),0.5)]" aria-hidden="true" />
                                                Listening for payment confirmation...
                                            </div>
                                            <button onClick={simulatePayment} className="btn-secondary w-full justify-center py-3 text-sm" title="Simulate consumer payment">
                                                Simulate Verified Payment ↗
                                            </button>
                                        </div>
                                    ) : (
                                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full flex flex-col items-center gap-3">
                                            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center shadow-[0_0_30px_rgba(var(--success-rgb),0.2)]">
                                                <CheckCircle2 size={40} className="text-success" aria-hidden="true" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-black text-success">SUCCESS!</p>
                                                <p className="text-sm text-muted">Transaction ID: {txnId}</p>
                                                <p className="text-lg font-bold text-foreground mt-1">{qrAmount} added to wallet.</p>
                                            </div>
                                            <button onClick={() => { setQrGenerated(false); setQrPaid(false); setQrAmount("₹0"); }} className="btn-primary py-3 px-8 text-sm mt-4 shadow-lg shadow-primary/20" title="Create new payment">
                                                Complete & Reset
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
                    <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl">
                        <div className="glass-card p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] pointer-events-none" />
                            <h2 className="text-2xl font-black mb-8 tracking-tight">Vender Profile Settings</h2>
                            <form onSubmit={e => { e.preventDefault(); setFormSuccess("Shop information updated!"); setTimeout(() => setFormSuccess(""), 2000); }} className="space-y-6">
                                {formSuccess && (
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-bold uppercase tracking-wider" role="status">
                                        <CheckCircle2 size={14} aria-hidden="true" /> {formSuccess}
                                    </div>
                                ) || null}
                                <div className="space-y-1.5">
                                    <label htmlFor="sname" className="text-xs font-black text-muted uppercase tracking-[0.2em]">Shop Name Identity</label>
                                    <input id="sname" type="text" value={profile.shopName} onChange={e => setProfile({ ...profile, shopName: e.target.value })} className="form-input text-lg font-bold" />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="sdesc" className="text-xs font-black text-muted uppercase tracking-[0.2em]">Platform Biography</label>
                                    <textarea id="sdesc" value={profile.description} onChange={e => setProfile({ ...profile, description: e.target.value })} className="form-input min-h-[100px] resize-none leading-relaxed" />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="scontact" className="text-xs font-black text-muted uppercase tracking-[0.2em]">Point of Contact (Email/Phone)</label>
                                    <input id="scontact" type="text" value={profile.contact} onChange={e => setProfile({ ...profile, contact: e.target.value })} className="form-input font-mono" />
                                </div>
                                <button type="submit" className="btn-primary py-4 px-10 font-black text-sm shadow-xl shadow-primary/20" title="Save profile settings">
                                    UPDATE PROFESSIONAL IDENTITY
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </DashboardShell>
    );
}

const ShoppingCart = ({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);

