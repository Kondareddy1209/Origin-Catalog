import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { DataProvider } from "@/lib/DataContext";
import PWARegistration from "@/components/PWARegistration";

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
  manifest: "/manifest.json",
  themeColor: "#6366f1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CatalogBuddy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <PWARegistration />
        <AuthProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
