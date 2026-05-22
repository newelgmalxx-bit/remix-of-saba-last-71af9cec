import type { LucideIcon } from "lucide-react";
import { Banknote, CreditCard, Wallet, Truck, Smartphone } from "lucide-react";
import tabbyLogo from "@/assets/tabby-logo.webp";
import tamaraLogo from "@/assets/tamara-logo.webp";
import applePayLogo from "@/assets/pay-applepay.png";
import visaLogo from "@/assets/pay-visa.webp";
import mastercardLogo from "@/assets/pay-mastercard.png";

export type PaymentMethod = "tabby" | "tamara" | "myfatoorah" | "cod";

export const paymentMethods: {
  id: PaymentMethod;
  name: string;
  desc: string;
  icon: LucideIcon;
  logo?: string;
  brands?: { name: string; logo?: string; icon?: LucideIcon }[];
  badge?: string;
  comingSoon?: boolean;
  disabled?: boolean;
}[] = [
  {
    id: "myfatoorah",
    name: "ماي فاتورة",
    desc: "فيزا، ماستر كارد، مدى، وApple Pay",
    icon: Banknote,
    badge: "الأكثر استخداماً",
    brands: [
      { name: "Visa", logo: visaLogo },
      { name: "Mastercard", logo: mastercardLogo },
      { name: "Apple Pay", logo: applePayLogo },
    ],
  },
  { id: "tamara", name: "تمارا", desc: "ادفع بعد 30 يوم أو على 3 دفعات", icon: Wallet, logo: tamaraLogo },
  { id: "cod", name: "الدفع عند الاستلام", desc: "ادفع بعد استلام الخدمة", icon: Truck },
  { id: "tabby", name: "تابي", desc: "قسّمها على 4 دفعات بدون فوائد", icon: Wallet, logo: tabbyLogo },
];

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "review"
  | "completed"
  | "cancelled";

export const statusLabels: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "بانتظار التأكيد", color: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed: { label: "تم التأكيد", color: "bg-sky-100 text-sky-700 border-sky-200" },
  in_progress: { label: "قيد التنفيذ", color: "bg-blue-100 text-blue-700 border-blue-200" },
  review: { label: "قيد المراجعة", color: "bg-purple-100 text-purple-700 border-purple-200" },
  completed: { label: "مكتمل", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { label: "ملغي", color: "bg-rose-100 text-rose-700 border-rose-200" },
};

export const statusFlow: OrderStatus[] = [
  "pending",
  "confirmed",
  "in_progress",
  "review",
  "completed",
];

export type CartItem = {
  id: string; // unique line id
  serviceSlug: string;
  serviceTitle: string;
  planName: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  payment: PaymentMethod;
  paid: boolean;
  paymentStatus?: "unpaid" | "paid" | "refunded";
  invoice?: { id: string; number: string; status: string; total: number } | null;
  items: CartItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes?: string;
  timeline: { status: OrderStatus; at: string; note?: string }[];
};

export type TicketMessage = {
  id: string;
  from: "client" | "support";
  author: string;
  text: string;
  at: string;
};

export type Ticket = {
  id: string;
  number: string;
  subject: string;
  orderId?: string;
  status: "open" | "answered" | "closed";
  priority: "low" | "normal" | "high";
  createdAt: string;
  messages: TicketMessage[];
};

export const mockUser = {
  name: "أحمد العبدالله",
  email: "ahmed@example.com",
  phone: "+966 55 123 4567",
  city: "الرياض",
  joinedAt: "2025-08-12",
  avatar: "أ",
};

export const mockOrders: Order[] = [
  {
    id: "ord_1024",
    number: "SD-1024",
    createdAt: "2026-04-22",
    status: "in_progress",
    payment: "tabby",
    paid: true,
    items: [
      { id: "i1", serviceSlug: "web-design", serviceTitle: "تصميم مواقع الكترونية", planName: "Pro", price: 7900, qty: 1 },
      { id: "i2", serviceSlug: "seo", serviceTitle: "تحسين محركات البحث (SEO)", planName: "Basic", price: 1500, qty: 1 },
    ],
    subtotal: 9400,
    vat: 1410,
    total: 10810,
    notes: "أرغب في تصميم بألوان تتناسب مع هويتي البصرية الحالية.",
    timeline: [
      { status: "pending", at: "2026-04-22 10:14", note: "تم استلام الطلب" },
      { status: "confirmed", at: "2026-04-22 13:02", note: "تم التأكيد بعد سداد الدفعة الأولى" },
      { status: "in_progress", at: "2026-04-23 09:30", note: "بدأ فريق التصميم العمل" },
    ],
  },
  {
    id: "ord_1018",
    number: "SD-1018",
    createdAt: "2026-03-08",
    status: "completed",
    payment: "myfatoorah",
    paid: true,
    items: [
      { id: "i1", serviceSlug: "social-media-design", serviceTitle: "تصميم سوشيال ميديا", planName: "Pro", price: 3500, qty: 1 },
    ],
    subtotal: 3500,
    vat: 525,
    total: 4025,
    timeline: [
      { status: "pending", at: "2026-03-08 11:00" },
      { status: "confirmed", at: "2026-03-08 12:15" },
      { status: "in_progress", at: "2026-03-09 09:00" },
      { status: "review", at: "2026-03-15 17:40" },
      { status: "completed", at: "2026-03-18 14:22", note: "تم التسليم النهائي" },
    ],
  },
  {
    id: "ord_1009",
    number: "SD-1009",
    createdAt: "2026-02-01",
    status: "cancelled",
    payment: "cod",
    paid: false,
    items: [
      { id: "i1", serviceSlug: "ad-banners", serviceTitle: "تصميم بنرات إعلانية", planName: "Basic", price: 1500, qty: 2 },
    ],
    subtotal: 3000,
    vat: 450,
    total: 3450,
    timeline: [
      { status: "pending", at: "2026-02-01 09:10" },
      { status: "cancelled", at: "2026-02-02 10:00", note: "تم الإلغاء بناء على طلب العميل" },
    ],
  },
];

export const mockTickets: Ticket[] = [
  {
    id: "tk_201",
    number: "TK-201",
    subject: "تعديل بسيط على الصفحة الرئيسية",
    orderId: "ord_1024",
    status: "answered",
    priority: "normal",
    createdAt: "2026-04-25",
    messages: [
      { id: "m1", from: "client", author: "أحمد", text: "السلام عليكم، أحتاج تغيير الصورة الرئيسية في الهيرو سيكشن.", at: "2026-04-25 14:00" },
      { id: "m2", from: "support", author: "فريق سابا", text: "وعليكم السلام، تم استلام طلبك وسيتم تنفيذه خلال 24 ساعة. هل لديك صورة مقترحة؟", at: "2026-04-25 14:35" },
    ],
  },
  {
    id: "tk_198",
    number: "TK-198",
    subject: "استفسار عن الفاتورة الضريبية",
    status: "closed",
    priority: "low",
    createdAt: "2026-03-20",
    messages: [
      { id: "m1", from: "client", author: "أحمد", text: "هل يمكن إصدار فاتورة ضريبية باسم الشركة؟", at: "2026-03-20 10:00" },
      { id: "m2", from: "support", author: "فريق سابا", text: "بالتأكيد، تفضل بإرسال السجل التجاري والرقم الضريبي.", at: "2026-03-20 11:15" },
      { id: "m3", from: "client", author: "أحمد", text: "تم الإرسال على الإيميل، شكراً لكم.", at: "2026-03-20 12:00" },
    ],
  },
];

export const formatCurrency = (n: number, lang: "ar" | "en" = "ar") => {
  const locale = lang === "en" ? "en-US" : "ar-SA";
  const suffix = lang === "en" ? " SAR" : " ر.س";
  return new Intl.NumberFormat(locale, { style: "decimal", maximumFractionDigits: 0 }).format(n) + suffix;
};

export const paymentName = (p: PaymentMethod | string, lang: "ar" | "en" = "ar") => {
  // Accept legacy "mayfatoorah" spelling coming from older API records.
  const key = (p === ("mayfatoorah" as any) ? "myfatoorah" : p) as PaymentMethod;
  const en: Record<PaymentMethod, string> = {
    tabby: "Tabby",
    tamara: "Tamara",
    myfatoorah: "MyFatoorah",
    cod: "Cash on delivery",
  };
  if (lang === "en") return en[key] ?? String(p);
  return paymentMethods.find((m) => m.id === key)?.name ?? String(p);
};

export const paymentIcon = (p: PaymentMethod): LucideIcon =>
  paymentMethods.find((m) => m.id === p)?.icon ?? Smartphone;