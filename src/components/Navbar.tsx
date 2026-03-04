"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Mic, Menu, X, LayoutDashboard, LogOut } from "lucide-react";

const navLinks = [
  { href: "#problem", label: "Problem" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#demo", label: "Demo" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => setIsMobileMenuOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNavClick = () => setIsMobileMenuOpen(false);

  // Dynamic dashboard path based on user role
  const dashboardPath = useMemo(() => {
    if (!user) return "/dashboard";
    switch (user.role) {
      case "admin": return "/admin";
      case "shopkeeper": return "/shopkeeper";
      case "consumer": return "/consumer";
      default: return "/dashboard";
    }
  }, [user]);

  return (
    <>
      {/* Skip to main content (accessibility) */}
      <a href="#hero" className="skip-to-content">Skip to main content</a>

      <header
        className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-300 ${isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
          : "bg-transparent"
          }`}
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="CatalogBuddy homepage">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center neon-border group-hover:scale-110 transition-transform">
              <Mic className="text-white" size={17} aria-hidden="true" />
            </div>
            <span className="text-lg font-extrabold tracking-tighter gradient-text hidden sm:block">
              CatalogBuddy
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground rounded-xl hover:bg-white/5 transition-all"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardPath}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground rounded-xl hover:bg-white/5 transition-all"
                >
                  <LayoutDashboard size={15} aria-hidden="true" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-muted rounded-xl hover:text-danger hover:bg-danger/5 transition-all"
                  aria-label="Sign out"
                >
                  <LogOut size={15} aria-hidden="true" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary py-2 px-5 text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-muted hover:text-foreground hover:bg-white/5 transition-colors"
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isMobileMenuOpen
              ? <X size={22} aria-hidden="true" />
              : <Menu size={22} aria-hidden="true" />
            }
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleNavClick}
              className="fixed inset-0 z-[85] bg-black/50 backdrop-blur-sm md:hidden"
            />
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-16 left-0 right-0 z-[88] p-4 md:hidden"
            >
              <div className="glass-card p-6 space-y-1.5">
                {navLinks.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={handleNavClick}
                    className="flex items-center px-4 py-3.5 text-base font-semibold text-muted hover:text-foreground rounded-xl hover:bg-white/5 transition-all"
                  >
                    {label}
                  </a>
                ))}

                <div className="divider" />

                {isAuthenticated ? (
                  <>
                    <Link
                      href={dashboardPath}
                      onClick={handleNavClick}
                      className="flex items-center gap-2 px-4 py-3.5 text-base font-semibold text-muted hover:text-foreground rounded-xl hover:bg-white/5 transition-all"
                    >
                      <LayoutDashboard size={17} /> Dashboard
                    </Link>
                    <button
                      onClick={() => { handleNavClick(); logout(); }}
                      className="w-full text-left flex items-center gap-2 px-4 py-3.5 text-base font-semibold text-muted hover:text-danger hover:bg-danger/5 rounded-xl transition-all"
                    >
                      <LogOut size={17} /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 pt-2">
                    <Link
                      href="/login"
                      onClick={handleNavClick}
                      className="btn-secondary justify-center py-3"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={handleNavClick}
                      className="btn-primary justify-center py-3"
                    >
                      Get Started Free
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
