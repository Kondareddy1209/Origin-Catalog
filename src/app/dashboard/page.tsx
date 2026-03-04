"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

/**
 * Dashboard Router
 * Redirects users to their specific role-based dashboard.
 */
export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated || !user) {
                router.replace("/login");
            } else {
                // Role-based redirection logic
                switch (user.role) {
                    case "admin":
                        router.replace("/admin");
                        break;
                    case "shopkeeper":
                        router.replace("/shopkeeper");
                        break;
                    case "consumer":
                        router.replace("/consumer");
                        break;
                    default:
                        router.replace("/login");
                }
            }
        }
    }, [isLoading, isAuthenticated, user, router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted font-bold tracking-widest uppercase text-xs">Identifying Role...</p>
            </div>
        </div>
    );
}
