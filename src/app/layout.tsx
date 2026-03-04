import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "CatalogBuddy | Voice-First AI Catalog Platform for Small Vendors",
  description:
    "CatalogBuddy helps small vendors create digital product catalogs using voice or images. No typing required — speak, snap, and publish.",
  keywords: [
    "CatalogBuddy",
    "voice commerce",
    "AI product catalog",
    "small vendors",
    "inclusitve commerce",
    "digital listings",
    "offline sync",
    "rural vendors",
    "inclusitve commerce",
    "rural vendors",
  ],
  openGraph: {
    title: "CatalogBuddy — Voice-First Digital Commerce",
    description: "AI-powered catalog creation for small vendors. No typing needed.",
    type: "website",
    siteName: "CatalogBuddy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Security headers as meta tags (supplement to HTTP headers) */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta
          httpEquiv="Permissions-Policy"
          content="camera=(), microphone=(), geolocation=()"
        />
        {/* Prevent caching of sensitive pages */}
        <meta httpEquiv="Cache-Control" content="no-store" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
