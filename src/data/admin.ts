export const adminStats = {
  revenue: 284520,
  revenueGrowth: 12.5,
  ordersCount: 3842,
  monthlyTarget: 365000,
  remaining: 80480,
  totalServices: 12,
  activeServices: 9,
  totalBookings: 184,
  pending: 21,
  inProgress: 38,
  completed: 112,
  totalClients: 96,
  vipClients: 14,
  growthRate: 23.1,
  avgOrder: 1420,
};

export const monthlyRevenue = [
  { m: "ينا", v: 18 }, { m: "فبر", v: 26 }, { m: "مار", v: 32 }, { m: "أبر", v: 41 },
  { m: "ماي", v: 38 }, { m: "يون", v: 49 }, { m: "يول", v: 56 }, { m: "أغس", v: 64 },
  { m: "سبت", v: 72 }, { m: "أكت", v: 81 }, { m: "نوف", v: 88 }, { m: "ديس", v: 95 },
];

export const salesByCategory = [
  { name: "تصميم مواقع", value: 38, color: "#1E5B94" },
  { name: "هويات بصرية", value: 22, color: "#3a7fbe" },
  { name: "تطبيقات موبايل", value: 18, color: "#5fa1d9" },
  { name: "سوشيال ميديا", value: 14, color: "#9bc4e8" },
  { name: "أخرى", value: 8, color: "#cbe0f0" },
];

export type AdminService = {
  id: string; sku: string; slug: string; titleAr: string; titleEn: string; category: string;
  price: number; bookings: number; status: "active" | "draft" | "archived";
};

export const adminServices: AdminService[] = [
  { id: "s1", sku: "WEB-001", slug: "web-design", titleAr: "تصميم مواقع الكترونية", titleEn: "Web Design", category: "ويب", price: 7900, bookings: 64, status: "active" },
  { id: "s2", sku: "SEO-002", slug: "seo", titleAr: "تحسين محركات البحث (SEO)", titleEn: "SEO", category: "تسويق", price: 1500, bookings: 42, status: "active" },
  { id: "s3", sku: "UID-003", slug: "ui-design", titleAr: "تصميم واجهات مستخدم", titleEn: "UI Design", category: "تصميم", price: 3500, bookings: 38, status: "active" },
  { id: "s4", sku: "ADV-004", slug: "ad-videos", titleAr: "تصميم فيديوهات إعلانية", titleEn: "Ad Videos", category: "فيديو", price: 4900, bookings: 21, status: "active" },
  { id: "s5", sku: "SMM-005", slug: "social-media-design", titleAr: "تصميم سوشيال ميديا", titleEn: "Social Media", category: "تسويق", price: 2500, bookings: 19, status: "draft" },
];

export type AdminBooking = {
  id: string; number: string; client: string; email: string; service: string;
  total: number; payment: string; status: "pending" | "in_progress" | "review" | "completed" | "cancelled"; date: string;
  source?: "direct" | "partner";
  phone?: string; city?: string;
  paymentStatus?: "unpaid" | "paid" | "refunded";
};

export const adminBookings: AdminBooking[] = [
  { id: "b1", number: "SD-1024", client: "أحمد العبدالله", email: "ahmed@example.com", phone: "+966 55 111 2222", city: "الرياض", service: "تصميم مواقع", total: 10810, payment: "تابي", status: "in_progress", date: "10 فبراير 2026", source: "direct" },
  { id: "b2", number: "SD-1023", client: "نورة السالم", email: "noura@example.com", phone: "+966 50 333 4444", city: "جدة", service: "هوية بصرية", total: 4025, payment: "مدى", status: "completed", date: "9 فبراير 2026", source: "partner" },
  { id: "b3", number: "SD-1022", client: "محمد الزهراني", email: "m.z@example.com", phone: "+966 56 555 6666", city: "الدمام", service: "SEO", total: 1725, payment: "تمارا", status: "pending", date: "9 فبراير 2026", source: "direct" },
  { id: "b4", number: "SD-1021", client: "ريم الشهري", email: "reem@example.com", phone: "+966 53 777 8888", city: "الرياض", service: "سوشيال ميديا", total: 2875, payment: "Apple Pay", status: "review", date: "8 فبراير 2026", source: "partner" },
  { id: "b5", number: "SD-1020", client: "خالد القحطاني", email: "k@example.com", phone: "+966 55 999 0000", city: "مكة", service: "تطبيق موبايل", total: 21735, payment: "ماي فاتورة", status: "in_progress", date: "8 فبراير 2026", source: "direct" },
  { id: "b6", number: "SD-1019", client: "سارة المطيري", email: "s.m@example.com", phone: "+966 50 222 3333", city: "الرياض", service: "بنرات إعلانية", total: 3450, payment: "كاش", status: "cancelled", date: "7 فبراير 2026", source: "partner" },
];

export const bookingStatusMap: Record<AdminBooking["status"], { label: string; tone: "amber" | "primary" | "violet" | "emerald" | "rose" }> = {
  pending: { label: "بانتظار التأكيد", tone: "amber" },
  in_progress: { label: "قيد التنفيذ", tone: "primary" },
  review: { label: "قيد المراجعة", tone: "violet" },
  completed: { label: "مكتمل", tone: "emerald" },
  cancelled: { label: "ملغي", tone: "rose" },
};

export const paymentMethods = ["مدى", "فيزا", "ماستركارد", "Apple Pay", "تابي", "تمارا", "ماي فاتورة", "تحويل بنكي", "كاش"];

export type AdminInvoice = {
  id: string; number: string; orderNumber: string; client: string; email: string;
  phone?: string; city?: string; payment?: string;
  amount: number; status: "paid" | "pending" | "void"; issued: string;
};

export const adminInvoices: AdminInvoice[] = [
  { id: "i1", number: "INV-7821", orderNumber: "SD-1024", client: "أحمد العبدالله", email: "ahmed@example.com", phone: "+966 55 111 2222", city: "الرياض", payment: "تابي", amount: 10810, status: "paid", issued: "10 فبراير 2026" },
  { id: "i2", number: "INV-7820", orderNumber: "SD-1023", client: "نورة السالم", email: "noura@example.com", phone: "+966 50 333 4444", city: "جدة", payment: "مدى", amount: 4025, status: "paid", issued: "9 فبراير 2026" },
  { id: "i3", number: "INV-7819", orderNumber: "SD-1022", client: "محمد الزهراني", email: "m.z@example.com", phone: "+966 56 555 6666", city: "الدمام", payment: "تمارا", amount: 1725, status: "pending", issued: "9 فبراير 2026" },
  { id: "i4", number: "INV-7818", orderNumber: "SD-1021", client: "ريم الشهري", email: "reem@example.com", phone: "+966 53 777 8888", city: "الرياض", payment: "Apple Pay", amount: 2875, status: "paid", issued: "8 فبراير 2026" },
  { id: "i5", number: "INV-7817", orderNumber: "SD-1020", client: "خالد القحطاني", email: "k@example.com", phone: "+966 55 999 0000", city: "مكة", payment: "ماي فاتورة", amount: 21735, status: "pending", issued: "8 فبراير 2026" },
  { id: "i6", number: "INV-7816", orderNumber: "SD-1019", client: "سارة المطيري", email: "s.m@example.com", phone: "+966 50 222 3333", city: "الرياض", payment: "كاش", amount: 3450, status: "void", issued: "7 فبراير 2026" },
];

export type AdminClient = {
  id: string; name: string; email: string; phone: string; orders: number;
  totalSpent: number; segment: "vip" | "regular" | "new"; joinedAt: string;
  region?: string; city?: string; language?: string; address?: string; notes?: string;
};

export const adminClients: AdminClient[] = [
  { id: "c1", name: "أحمد العبدالله", email: "ahmed@example.com", phone: "+966 55 111 2222", orders: 12, totalSpent: 48320, segment: "vip", joinedAt: "مارس 2024", region: "السعودية", city: "الرياض", language: "العربية", address: "حي الملقا، الرياض", notes: "عميل VIP — مشاريع متعددة" },
  { id: "c2", name: "نورة السالم", email: "noura@example.com", phone: "+966 50 333 4444", orders: 8, totalSpent: 32158, segment: "regular", joinedAt: "يونيو 2024", region: "السعودية", city: "جدة", language: "العربية", address: "حي الروضة، جدة", notes: "تفضّل التواصل عبر البريد" },
  { id: "c3", name: "محمد الزهراني", email: "m.z@example.com", phone: "+966 56 555 6666", orders: 15, totalSpent: 67452, segment: "vip", joinedAt: "يناير 2024", region: "السعودية", city: "الدمام", language: "العربية", address: "حي الشاطئ، الدمام", notes: "" },
  { id: "c4", name: "ريم الشهري", email: "reem@example.com", phone: "+966 53 777 8888", orders: 3, totalSpent: 8920, segment: "new", joinedAt: "أكتوبر 2025", region: "السعودية", city: "الرياض", language: "العربية", address: "—", notes: "عميلة جديدة" },
  { id: "c5", name: "خالد القحطاني", email: "k@example.com", phone: "+966 55 999 0000", orders: 7, totalSpent: 28764, segment: "regular", joinedAt: "أغسطس 2024", region: "السعودية", city: "مكة", language: "العربية", address: "—", notes: "" },
];

export type AdminPortfolio = {
  id: string; titleAr: string; titleEn: string; category: string; image: string; visible: boolean; link: string;
  cover?: string; description?: string; tech?: string[]; client?: string; year?: string;
};

export const adminPortfolio: AdminPortfolio[] = [
  { id: "p1", titleAr: "موقع متجر اليمامة", titleEn: "Yamamah Store", category: "ويب", image: "🛒", visible: true, link: "#", cover: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80", description: "متجر إلكتروني متكامل بتجربة شراء سلسة وواجهة عربية متجاوبة.", tech: ["React", "Next.js", "Tailwind", "Stripe"], client: "متجر اليمامة", year: "2025" },
  { id: "p2", titleAr: "هوية مطعم الواحة", titleEn: "Oasis Brand", category: "هوية بصرية", image: "🍽️", visible: true, link: "#", cover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80", description: "هوية بصرية كاملة لمطعم فاخر تشمل الشعار، نظام الألوان، والمطبوعات.", tech: ["Illustrator", "Photoshop"], client: "مطعم الواحة", year: "2025" },
  { id: "p3", titleAr: "تطبيق صحتي+", titleEn: "Sehaty App", category: "تطبيقات موبايل", image: "📱", visible: false, link: "#", cover: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80", description: "تطبيق صحي لمتابعة المواعيد الطبية وتذكير الأدوية.", tech: ["React Native", "Firebase"], client: "صحتي", year: "2024" },
  { id: "p4", titleAr: "حملة فعالية الرياض", titleEn: "Riyadh Event", category: "تسويق", image: "🎯", visible: true, link: "#", cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80", description: "حملة تسويقية رقمية متكاملة لفعالية موسمية في الرياض.", tech: ["Meta Ads", "Google Ads", "Figma"], client: "هيئة الفعاليات", year: "2025" },
];

export const portfolioCategories = [
  "ويب", "هوية بصرية", "تطبيقات موبايل", "تسويق", "تصميم واجهات", "سوشيال ميديا", "فيديو", "أخرى",
];

export type AdminUser = {
  id: string; name: string; email: string; phone: string; role: "owner" | "admin" | "manager" | "support";
  active: boolean; joinedAt: string;
};

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "John Doe", email: "john@saba.sa", phone: "+966 55 111 0001", role: "owner", active: true, joinedAt: "يناير 2024" },
  { id: "u2", name: "Sarah Johnson", email: "sarah@saba.sa", phone: "+966 55 111 0002", role: "admin", active: true, joinedAt: "فبراير 2024" },
  { id: "u3", name: "Mike Chen", email: "mike@saba.sa", phone: "+966 55 111 0003", role: "manager", active: true, joinedAt: "مارس 2024" },
  { id: "u4", name: "Emma Wilson", email: "emma@saba.sa", phone: "+966 55 111 0004", role: "support", active: false, joinedAt: "أبريل 2024" },
];

import React from "react";
import sarLogo from "@/assets/sar.png";

export const fmtSARNumber = (n: number) =>
  new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 0 }).format(n);

export const fmtSAR = (n: number): React.ReactNode =>
  React.createElement(
    "span",
    { className: "inline-flex items-center gap-1", dir: "ltr" },
    React.createElement("span", { "data-ltr-number": true }, fmtSARNumber(n)),
    React.createElement("img", {
      src: sarLogo,
      alt: "SAR",
      className: "inline-block h-[0.85em] w-auto align-[-0.05em] opacity-90",
      draggable: false,
    })
  );