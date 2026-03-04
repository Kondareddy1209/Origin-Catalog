// ============================================================
//  MOCK DATABASE — shared across all dashboards
// ============================================================

export type UserRole = "admin" | "shopkeeper" | "consumer";

export interface MockUser {
    id: string;
    name: string;
    email: string;
    password: string; // plain-text for demo only
    role: UserRole;
    status: "active" | "suspended";
    createdAt: string;
}

export interface MockProduct {
    id: string;
    shopkeeperId: string;
    shopName: string;
    name: string;
    description: string;
    price: string;
    priceNum: number;
    category: string;
    image: string;
    quantity: number;
    status: "active" | "suspended" | "flagged";
    isBanned: boolean;
    isScam: boolean;
    createdAt: string;
}

export interface MockOrder {
    id: string;
    consumerId: string;
    consumerName: string;
    shopkeeperId: string;
    shopName: string;
    productId: string;
    productName: string;
    quantity: number;
    amount: string;
    status: "pending" | "paid" | "cancelled";
    createdAt: string;
}

// ---------------------------------------------------------------
// USERS
// ---------------------------------------------------------------
export const MOCK_USERS: MockUser[] = [
    {
        id: "u1",
        name: "Admin User",
        email: "admin@catalogbuddy.com",
        password: "Admin@123",
        role: "admin",
        status: "active",
        createdAt: "2025-01-01",
    },
    {
        id: "u2",
        name: "Ravi Shopkeeper",
        email: "ravi@shop.com",
        password: "Shop@123",
        role: "shopkeeper",
        status: "active",
        createdAt: "2025-02-10",
    },
    {
        id: "u3",
        name: "Meena Vendor",
        email: "meena@shop.com",
        password: "Shop@123",
        role: "shopkeeper",
        status: "suspended",
        createdAt: "2025-03-01",
    },
    {
        id: "u4",
        name: "Priya Consumer",
        email: "priya@mail.com",
        password: "User@123",
        role: "consumer",
        status: "active",
        createdAt: "2025-04-05",
    },
    {
        id: "u5",
        name: "Arjun Consumer",
        email: "arjun@mail.com",
        password: "User@123",
        role: "consumer",
        status: "active",
        createdAt: "2025-04-20",
    },
];

// ---------------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------------
export const MOCK_PRODUCTS: MockProduct[] = [
    {
        id: "p1",
        shopkeeperId: "u2",
        shopName: "Ravi's Handicrafts",
        name: "Handmade Clay Pot",
        description: "Traditional cooling clay pot for water storage. Handcrafted by local artisans.",
        price: "₹800",
        priceNum: 800,
        category: "Home Decor",
        image: "/product-pot.png",
        quantity: 15,
        status: "active",
        isBanned: false,
        isScam: false,
        createdAt: "2025-05-01",
    },
    {
        id: "p2",
        shopkeeperId: "u2",
        shopName: "Ravi's Handicrafts",
        name: "Red Silk Scarf",
        description: "Pure silk scarf with intricate traditional prints. Premium quality.",
        price: "₹1200",
        priceNum: 1200,
        category: "Fashion",
        image: "/product-scarf.png",
        quantity: 8,
        status: "active",
        isBanned: false,
        isScam: false,
        createdAt: "2025-05-03",
    },
    {
        id: "p3",
        shopkeeperId: "u3",
        shopName: "Meena Textiles",
        name: "Cotton Fabric Roll",
        description: "High-quality cotton fabric, 5 metre roll. Ideal for traditional wear.",
        price: "₹650",
        priceNum: 650,
        category: "Textiles",
        image: "/product-scarf.png",
        quantity: 25,
        status: "active",
        isBanned: false,
        isScam: false,
        createdAt: "2025-05-05",
    },
    {
        id: "p4",
        shopkeeperId: "u3",
        shopName: "Meena Textiles",
        name: "FREE Money Lottery Scheme",
        description: "Win cash prizes instantly! Click to claim your free lottery reward now! Get rich quick!",
        price: "₹0",
        priceNum: 0,
        category: "Other",
        image: "/product-pot.png",
        quantity: 999,
        status: "flagged",
        isBanned: true,
        isScam: true,
        createdAt: "2025-05-07",
    },
];

// ---------------------------------------------------------------
// ORDERS
// ---------------------------------------------------------------
export const MOCK_ORDERS: MockOrder[] = [
    {
        id: "o1",
        consumerId: "u4",
        consumerName: "Priya Consumer",
        shopkeeperId: "u2",
        shopName: "Ravi's Handicrafts",
        productId: "p1",
        productName: "Handmade Clay Pot",
        quantity: 1,
        amount: "₹800",
        status: "paid",
        createdAt: "2025-05-10",
    },
    {
        id: "o2",
        consumerId: "u5",
        consumerName: "Arjun Consumer",
        shopkeeperId: "u2",
        shopName: "Ravi's Handicrafts",
        productId: "p2",
        productName: "Red Silk Scarf",
        quantity: 1,
        amount: "₹1200",
        status: "pending",
        createdAt: "2025-05-11",
    },
    {
        id: "o3",
        consumerId: "u4",
        consumerName: "Priya Consumer",
        shopkeeperId: "u3",
        shopName: "Meena Textiles",
        productId: "p3",
        productName: "Cotton Fabric Roll",
        quantity: 2,
        amount: "₹1300",
        status: "paid",
        createdAt: "2025-05-12",
    },
];
