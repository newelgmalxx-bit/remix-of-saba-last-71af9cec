// Shared API types matching the SABA backend contract.

export type Role = "client" | "admin" | "owner" | "manager" | "support";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  avatar: string | null;
  role: Role;
  language: "ar" | "en";
  createdAt: string;
};

export type AuthResponse = { user: User; token: string };

export type Service = {
  id: string;
  slug: string;
  sku: string;
  titleAr: string;
  titleEn: string;
  category: string;
  price: number;
  cover: string | null;
  subtitleAr: string;
  subtitleEn: string;
  status: "active" | "draft" | "archived";
};

export type ServicePlan = {
  id: string;
  name: string;
  price: number;
  featured: boolean;
  feats: string[];
};

export type ServiceFull = Service & {
  bannerImage: string | null;
  breadcrumbAr: string;
  breadcrumbEn: string;
  overviewDescriptionAr: string;
  overviewDescriptionEn: string;
  heroHighlights: { ar: string; en: string }[];
  overview: { titleAr: string; titleEn: string; descAr: string; descEn: string }[];
  benefits: { titleAr: string; titleEn: string; descAr: string; descEn: string }[];
  plans: ServicePlan[];
  steps: { titleAr: string; titleEn: string }[];
  stats: { v: string; labelAr: string; labelEn: string }[];
  testimonials: { name: string; role: string; text: string; avatar: string | null }[];
  faqs: { qAr: string; qEn: string; aAr: string; aEn: string }[];
  seo: {
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    keywords: string;
    ogImage: string | null;
  };
};

export type CartLine = {
  id: string;
  service_slug: string;
  service_title: string;
  plan_id: string;
  plan_name: string;
  price: number;
  qty: number;
};

export type CartResponse = {
  items: CartLine[];
  subtotal: number;
  vat: number;
  total: number;
  sessionId: string;
};

export type CheckoutPaymentMethod = "moyasar" | "tabby" | "tamara" | "mayfatoorah" | "cod";

export type CheckoutResponse = {
  orderNumber: string;
  paymentUrl: string | null;
  payment: {
    gateway: string;
    publishable_key: string;
    amount: number;
    currency: "SAR";
    description: string;
    callback_url: string;
    metadata: {
      order_number: string;
      order_id: string;
      client_name: string;
      client_email: string;
    };
  } | null;
  order: Order;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "review"
  | "completed"
  | "cancelled";

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  payment_method: string;
  payment_id: string | null;
  paid: boolean;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  contact_city: string | null;
  contact_address: string | null;
  items: CartLine[];
  subtotal: number;
  vat: number;
  total: number;
  notes: string | null;
  source: "direct" | "partner";
  timeline: { status: string; at: string; note: string | null }[];
  invoice: { id: string; number: string; status: string; total: number } | null;
};

export type Ticket = {
  id: string;
  number: string;
  subject: string;
  orderId: string | null;
  status: "open" | "answered" | "closed";
  priority: "low" | "normal" | "high";
  createdAt: string;
  messages: {
    id: string;
    from_type: "client" | "support";
    author: string;
    text: string;
    at: string;
  }[];
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type AdminBooking = {
  id: string;
  number: string;
  createdAt: string;
  client: string;
  email: string;
  phone: string | null;
  city: string | null;
  service: string;
  total: number;
  payment: string;
  status: string;
  source: "direct" | "partner";
  items: CartLine[];
  timeline: { status: string; at: string; note: string | null }[];
};

export type Invoice = {
  id: string;
  number: string;
  order_id: string | null;
  user_id: string | null;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_city: string | null;
  items: Record<string, unknown>[];
  subtotal: number;
  vat: number;
  total: number;
  status: "paid" | "pending" | "void";
  payment_method: string | null;
  due_date: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
};

export type AdminClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  segment: "vip" | "regular" | "new" | string;
  joinedAt: string;
  city: string | null;
};

export type AdminPortfolio = {
  id: string;
  titleAr: string;
  titleEn: string;
  category: string;
  cover: string;
  image: string | null;
  descriptionAr: string | null;
  descriptionEn: string | null;
  tech: string[];
  client_name: string | null;
  year: string | null;
  link: string | null;
  visible: boolean;
  sortOrder: number;
};

export type Plan = {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  featuresAr: string[];
  featuresEn: string[];
  features: string[];
  highlighted: boolean;
  sortOrder: number;
  status: string;
};

export type AnalyticsData = {
  revenue: number;
  revenueGrowth: number;
  ordersCount: number;
  monthlyTarget: number;
  remaining: number;
  totalServices: number;
  activeServices: number;
  totalBookings: number;
  pending: number;
  inProgress: number;
  completed: number;
  totalClients: number;
  vipClients: number;
  growthRate: number;
  avgOrder: number;
  monthlyRevenue: { m: string; v: number }[];
  salesByCategory: { name: string; value: number }[];
  visits: { date: string; views: number }[];
  sources: { name: string; value: number }[];
  topPages: { path: string; views: number }[];
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  last_login: string | null;
  createdAt: string;
};

export type AdminNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  related_id: number | null;
  related_type: string | null;
  is_read: boolean;
  createdAt: string;
};

export type SiteSettings = {
  logo?: string;
  nameAr?: string;
  nameEn?: string;
  taglineAr?: string;
  taglineEn?: string;
  social?: Record<string, string>;
  maintenanceMode?: boolean;
};