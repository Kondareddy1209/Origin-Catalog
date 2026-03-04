import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disallow embedding in iframes (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // Restrict referrer information
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable dangerous browser features
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Force HTTPS (1 year)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  // XSS protection for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval in dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // Image optimisation settings
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // TypeScript strict checks in builds
  typescript: {
    ignoreBuildErrors: false,
  },

  // Enable React strict mode for catching bugs early
  reactStrictMode: true,

  // Suppress powered-by header (reduces attack surface)
  poweredByHeader: false,

  // Compress responses
  compress: true,
};

export default nextConfig;
