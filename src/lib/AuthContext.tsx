"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { MOCK_USERS, type UserRole } from "@/lib/mockData";

// ---------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------
interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthResult {
    success: boolean;
    error?: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<AuthResult>;
    signup: (name: string, email: string, password: string) => Promise<AuthResult>;
    logout: () => void;
}

// ---------------------------------------------------------------
// SECURITY HELPERS
// ---------------------------------------------------------------
function sanitise(str: string): string {
    return str.replace(/<[^>]*>/g, "").replace(/[&<>'"]/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c] ?? c)
    ).trim().substring(0, 256);
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password: string): boolean {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

function safeParseUser(raw: string | null): AuthUser | null {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as unknown;
        if (
            typeof parsed === "object" &&
            parsed !== null &&
            typeof (parsed as Record<string, unknown>).id === "string" &&
            typeof (parsed as Record<string, unknown>).name === "string" &&
            typeof (parsed as Record<string, unknown>).email === "string" &&
            ["admin", "shopkeeper", "consumer"].includes(
                (parsed as Record<string, unknown>).role as string
            )
        ) {
            return parsed as AuthUser;
        }
    } catch {
        // malformed JSON — ignore
    }
    return null;
}

// ---------------------------------------------------------------
// CONTEXT
// ---------------------------------------------------------------
const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "cb_auth_user_v2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Rehydrate session on mount
    useEffect(() => {
        // Cleanup legacy localStorage session if it exists to fix persistent login issues
        if (typeof window !== "undefined") {
            localStorage.removeItem("cb_auth_user");
            localStorage.removeItem("cb_auth_user_v2");

            const stored = safeParseUser(sessionStorage.getItem(STORAGE_KEY));
            setUser(stored);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
        await new Promise((r) => setTimeout(r, 400)); // simulate latency

        const cleanEmail = sanitise(email).toLowerCase();

        if (!isValidEmail(cleanEmail)) {
            return { success: false, error: "Please enter a valid email address." };
        }
        if (!password) {
            return { success: false, error: "Password is required." };
        }

        // Check against mock database
        const match = MOCK_USERS.find(
            (u) => u.email.toLowerCase() === cleanEmail && u.password === password
        );

        if (!match) {
            return { success: false, error: "Invalid email or password. Please try again." };
        }

        if (match.status === "suspended") {
            return { success: false, error: "Your account has been suspended. Please contact support." };
        }

        const authUser: AuthUser = {
            id: match.id,
            name: match.name,
            email: match.email,
            role: match.role,
        };

        // Only store non-sensitive fields
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        setUser(authUser);
        return { success: true };
    }, []);

    const signup = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
        await new Promise((r) => setTimeout(r, 400));

        const cleanName = sanitise(name);
        const cleanEmail = sanitise(email).toLowerCase();

        if (cleanName.length < 2) return { success: false, error: "Name must be at least 2 characters." };
        if (!isValidEmail(cleanEmail)) return { success: false, error: "Please enter a valid email." };
        if (!isStrongPassword(password)) {
            return { success: false, error: "Password must be 8+ chars with an uppercase letter and number." };
        }

        // Check if email already exists
        const exists = MOCK_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
        if (exists) return { success: false, error: "An account with this email already exists." };

        // New users are always consumers
        const authUser: AuthUser = {
            id: `u${Date.now()}`,
            name: cleanName,
            email: cleanEmail,
            role: "consumer",
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        setUser(authUser);
        return { success: true };
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            isLoading,
            login,
            signup,
            logout,
        }),
        [user, isLoading, login, signup, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
