"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { MOCK_PRODUCTS, MOCK_ORDERS, type MockProduct, type MockOrder } from "@/lib/mockData";

interface DataContextValue {
    products: MockProduct[];
    orders: MockOrder[];
    addProduct: (product: Omit<MockProduct, "id" | "createdAt" | "status" | "isBanned" | "isScam">) => void;
    updateProduct: (id: string, updates: Partial<MockProduct>) => void;
    deleteProduct: (id: string) => void;
    placeOrder: (orderItems: Omit<MockOrder, "id" | "createdAt" | "status">[]) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

const STORAGE_KEY_PRODUCTS = "cb_products_v1";
const STORAGE_KEY_ORDERS = "cb_shared_orders_v1";

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<MockProduct[]>([]);
    const [orders, setOrders] = useState<MockOrder[]>([]);

    // Initial load
    useEffect(() => {
        const storedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
        const storedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);

        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        } else {
            setProducts(MOCK_PRODUCTS);
        }

        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        } else {
            setOrders(MOCK_ORDERS);
        }
    }, []);

    // Persistence
    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
        }
    }, [products]);

    useEffect(() => {
        if (orders.length > 0) {
            localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
        }
    }, [orders]);

    const addProduct = useCallback((p: Omit<MockProduct, "id" | "createdAt" | "status" | "isBanned" | "isScam">) => {
        const newProduct: MockProduct = {
            ...p,
            id: `p${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: "active",
            isBanned: false,
            isScam: false
        };
        setProducts(prev => [newProduct, ...prev]);
    }, []);

    const updateProduct = useCallback((id: string, updates: Partial<MockProduct>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, []);

    const deleteProduct = useCallback((id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    }, []);

    const placeOrder = useCallback((items: Omit<MockOrder, "id" | "createdAt" | "status">[]) => {
        const timestamp = new Date().toLocaleString(); // "MM/DD/YYYY, HH:MM:SS AM/PM"
        const newOrders: MockOrder[] = items.map((item, idx) => ({
            ...item,
            id: `o${Date.now()}-${idx}`,
            status: "paid",
            createdAt: timestamp
        }));
        setOrders(prev => [...newOrders, ...prev]);
    }, []);

    const value = useMemo(() => ({
        products,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        placeOrder
    }), [products, orders, addProduct, updateProduct, deleteProduct, placeOrder]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used within DataProvider");
    return ctx;
}
