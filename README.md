# CatalogBuddy 🎙️

> **Voice-First AI Catalog Platform for Small Vendors**

CatalogBuddy is a full-stack web application that empowers small vendors and street merchants to create digital product catalogs using nothing but their **voice** or a **smartphone camera** — no typing, no complexity, no tech expertise required.

Built as a hackathon project, it demonstrates how AI-assisted voice interfaces can democratize e-commerce access for underserved markets, with offline-first support, multilingual voice input, and automated product image generation.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🎙️ **Voice Listing** | Dictate product details in your language — AI extracts name, price, quantity & category |
| 🌐 **Multilingual** | Supports English, Hindi, Telugu, Tamil, and Marathi |
| 🖼️ **Auto Image Generation** | No photo? AI auto-generates a representative product image based on the product name & category |
| 📸 **Image Scan** | Upload a product photo and the system analyses it to pre-fill listing details |
| 🛡️ **Scam Detection** | Built-in NLP keyword engine flags and blocks suspicious or fraudulent listings |
| 📊 **Vendor Dashboard** | Revenue analytics, stock alerts, and order history at a glance |
| 💳 **QR Payment** | Generate instant payment QR codes for on-site transactions |
| 🛒 **Consumer Marketplace** | Browse, search (including voice search), add to cart, and checkout with multiple payment methods |
| 👮 **Admin Panel** | Full product moderation, shopkeeper management, and platform-wide transaction audit logs |
| 📱 **PWA Ready** | Installable as a progressive web app with service worker support |

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page (Hero, Features, Architecture, etc.)
│   ├── login/page.tsx        # Login screen
│   ├── signup/page.tsx       # Registration screen
│   ├── dashboard/page.tsx    # Role-based redirect hub
│   ├── shopkeeper/page.tsx   # Vendor dashboard (listing, analytics, QR payment)
│   ├── consumer/page.tsx     # Consumer marketplace (browse, cart, checkout)
│   └── admin/page.tsx        # Admin panel (moderation, audit, user management)
│
├── components/
│   ├── DashboardShell.tsx    # Shared layout shell for all dashboards
│   ├── Hero.tsx              # Landing page hero section
│   ├── Features.tsx          # Feature grid
│   ├── Solution.tsx          # How it solves the problem
│   ├── Architecture.tsx      # System architecture diagram
│   ├── TechStack.tsx         # Technology stack showcase
│   ├── Workflow.tsx          # Step-by-step workflow
│   └── ...                   # More landing page sections
│
└── lib/
    ├── AuthContext.tsx        # Authentication state, login, signup, logout
    ├── DataContext.tsx        # Global product & order state (localStorage backed)
    ├── mockData.ts            # Seed data for users, products, and orders
    ├── scamDetection.ts       # Banned keyword detection engine
    ├── useSpeechRecognition.ts# Browser Web Speech API hook
    └── utils.ts               # Shared utility helpers
```

---

## 🔐 Demo Accounts

These pre-seeded accounts are available for testing all user flows:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@catalogbuddy.com` | `Admin@123` |
| **Shopkeeper** | `ravi@shop.com` | `Shop@123` |
| **Consumer** | `priya@mail.com` | `User@123` |
| **Consumer** | `arjun@mail.com` | `User@123` |

> New accounts created via Sign Up will always be assigned the **Consumer** role.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** 9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Kondareddy1209/Origin-Catalog.git
cd Origin-Catalog

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **3D / Graphics** | Three.js + React Three Fiber |
| **Icons** | Lucide React |
| **Voice** | Web Speech API (browser-native, no API key) |
| **Image AI** | LoremFlickr (auto-generated product images) |
| **Auth** | Session-based (sessionStorage, no backend) |
| **Data** | Context API + localStorage persistence |
| **PWA** | Custom service worker (`/public/sw.js`) |

---

## 🧠 Voice Listing — How It Works

1. Navigate to **Shopkeeper → Add Product**
2. Select your language (English, Hindi, Telugu, Tamil, or Marathi)
3. Click **"List by Voice"** and speak naturally, e.g.:
   > *"కందులు quantity 5 kg price 50"* (Telugu)
   > *"Tomatoes for 30 rupees, 10 kg available"* (English)
4. The system extracts: **name, price, quantity, unit, and category**
5. No photo needed — the **AI auto-generates** a representative product image
6. Review the live preview and click **"Publish Listing"**

---

## 🖼️ Auto Image Generation

When a vendor doesn't upload a photo, the system automatically:
- Detects whether the product name is in **English or a regional language**
- For English names: searches for image using the product name directly
- For regional language names: uses the **product category keywords** (e.g., "Grocery" → fruits, vegetables, spices)
- Applies a **random seed** so different products in the same category get unique images
- Shows a live **"AI Vision Active"** indicator in the listing preview

This ensures **every product always has a visual**, improving catalog quality and consumer trust.

---

## 🛡️ Scam Detection

Every listing is checked against a built-in keyword engine before publishing. Products containing terms like:

> `"free money"`, `"lottery"`, `"get rich"`, `"crypto investment"`, `"guaranteed income"`, `"counterfeit"`, etc.

...are **automatically blocked** with a clear error message to the vendor. Admins can also review and act on flagged products from the Admin Panel.

---

## 📁 Data Persistence

All data is stored client-side:

| Store | Key | Contents |
|---|---|---|
| `sessionStorage` | `cb_auth_user_v2` | Logged-in user session |
| `localStorage` | `cb_products_v1` | Product listings |
| `localStorage` | `cb_shared_orders_v1` | Order / transaction history |

> No backend or database required. Data resets when localStorage is cleared.

---

## 🔒 Security

- **Content Security Policy (CSP)** enforced via `next.config.ts` headers
- **XSS protection** with input sanitisation in `AuthContext`
- **HTTPS enforcement** via HSTS headers
- **Permissions Policy** limits camera/microphone access to same-origin only
- No credentials or sensitive data are ever stored in localStorage

---

## 🗺️ Roadmap

- [ ] Real backend integration (FastAPI / Supabase)
- [ ] ONDC Seller API export
- [ ] Offline-first with service worker caching
- [ ] WhatsApp OTP authentication
- [ ] Actual AI image generation (Stable Diffusion / Gemini Vision)
- [ ] Real-time inventory sync across devices

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ for small vendors everywhere.
</div>
