# Saba Design — API Endpoints (المرجع الكامل)

> هذا الملف يوثّق ما الفرونت يستهلكه فعليًا. **المرجع الرسمي للباك** هو الـ spec اللي وصل في 2026-05-09 وتم مزامنته داخل الفرونت بالفعل (auth/cart/checkout/account/site/favorites/reviews). أي تغيير لاحق في أسماء endpoints أو الحقول يجب توثيقه هنا أولاً.

---

## 0) القواعد العامة (Hard rules)

| البند | القيمة |
|---|---|
| Base URL | `https://saba-design.com/api` |
| Auth | `Authorization: Bearer <jwt>` |
| Guest Cart | `X-Session-Id: <uuid>` على `/cart*` لما مفيش توكن |
| Lang | `Accept-Language: ar` أو `en` (الباك يرجّع الحقول مترجمة بالاتنين دايمًا) |
| Currency | SAR فقط |
| IDs | strings (UUID) — مش أرقام |
| Dates | ISO 8601 UTC |
| **VAT** | **يتم حسابه على السيرفر فقط** — الفرونت لا يحسبه، فقط يعرض القيم الراجعة (`subtotal`, `vat`, `total`). نسبة 15%. |

### Response envelope
```json
// نجاح
{ "success": true, "data": { ... }, "message": "optional" }
// قائمة مع pagination
{ "success": true, "data": { "items": [...], "total": 0, "page": 1, "pageSize": 20, "totalPages": 1 } }
// خطأ
{ "success": false, "message": "...", "errors": { "field": "msg" } }
```
- 401 → الفرونت يمسح التوكن ويوجّه لـ `/login`.
- 403 → عرض رسالة "غير مصرّح".
- 422 → عرض الأخطاء على الحقول.

### CORS
اسمح بالأصول: `*.lovable.app`, `saba-design.com`, `localhost:*`. اسمح بالـ headers: `Authorization`, `Content-Type`, `X-Session-Id`, `Accept-Language`.

---

## 1) Auth — `/auth/*`

| Method | Path | Body | Response `data` |
|---|---|---|---|
| POST | `/auth/signup` | `{ name, email, phone?, password }` | `{ user, token }` |
| POST | `/auth/login` | `{ email?, phone?, password }` | `{ user, token }` |
| POST | `/auth/oauth/google` | `{ idToken }` | `{ user, token }` |
| GET | `/auth/me` | — | `{ user }` |
| POST | `/auth/logout` | — | `{}` |
| POST | `/auth/forgot` | `{ email }` | `{}` |
| POST | `/auth/reset` | `{ token, password }` | `{}` |

---

## 2) المحتوى العام (Public)

| Method | Path | Query | Response `data` |
|---|---|---|---|
| GET | `/services` | `category?, q?` | `{ items: ServiceListItem[] }` |
| GET | `/services/:slug` | — | `{ service: ServiceFull }` |
| GET | `/services/:slug/reviews` | `page?, limit?, sort?` | `{ items, total, page, pageSize, totalPages }` |
| POST | `/services/:slug/reviews` | body `{ rating, comment? }` (auth) | `{ review }` |
| PATCH | `/reviews/:id` | `{ rating?, comment? }` | `{ review }` |
| DELETE | `/reviews/:id` | — | `{}` |
| GET | `/me/favorites` | (auth) | `{ slugs: string[] }` |
| POST | `/me/favorites` | `{ serviceSlug }` (auth) | `{ favorited: true }` |
| DELETE | `/me/favorites/:slug` | (auth) | `{ favorited: false }` |
| GET | `/plans` | — | `{ items: Plan[] }` |
| GET | `/portfolio` | `category?, page?` | `{ items, total, page, pageSize, totalPages }` |
| POST | `/contact` | `{ name, email, phone?, service?, budget?, message }` | `{}` |
| GET | `/site/settings` | — | إعدادات الموقع العامة |
| GET | `/tracking` | — | `{ pixels?, head?, body? }` (سكربتات تتبع تُحقن في `<head>`/`<body>`) |

---

## 3) Cart — `/cart*` (guest أو user)

> لو مفيش توكن، الفرونت يبعت `X-Session-Id`. الباك يحفظ السلة على هذا الـ session. عند تسجيل الدخول يجب دمج (merge) سلة الـ guest في سلة المستخدم.
>
> **VAT يُحسب هنا على السيرفر** ويُرجَع داخل الكائن `Cart`.

| Method | Path | Body | Response `data` (`Cart`) |
|---|---|---|---|
| GET | `/cart` | — | `Cart` |
| POST | `/cart/items` | `{ serviceSlug, planId?, qty? }` | `Cart` |
| PATCH | `/cart/items/:id` | `{ qty }` | `Cart` |
| DELETE | `/cart/items/:id` | — | `Cart` |

شكل `Cart`:
```ts
{ items: CartItem[]; subtotal: number; vat: number; total: number; sessionId: string; discount?: number; code?: string }
```

---

## 4) Checkout — `/checkout`

| Method | Path | Body |
|---|---|---|
| POST | `/checkout` | (تحت) |

```ts
{
  contact: { name, email, phone, city?, address? },
  paymentMethod: "mayfatoorah" | "tabby" | "tamara" | "cod",
  notes?: string,
  couponCode?: string,
  // لو موجود → ابني الطلب من العناصر دي وتجاهل سلة المستخدم تمامًا (مهم لشراء الباقات من /plans).
  items?: { serviceSlug: string; serviceTitle?: string; planId?: string; planName?: string; price?: number; qty?: number }[]
}
```
Response `data`:
```ts
{ orderNumber: string; paymentUrl: string | null; payment: any | null; order: Order }
```
- لازم السيرفر يعيد حساب `subtotal` / `vat` / `total` من المخزون (ميصدّقش الأسعار من الفرونت).
- لو `paymentMethod = cod` → `paymentUrl = null` والطلب pending.
- لو غيره → ينشئ session دفع ويرجّع `paymentUrl`.

---

## 5) Account — `/account/*` (user)

| Method | Path | Body / Query | Response `data` |
|---|---|---|---|
| GET | `/account/profile` | — | `{ user }` |
| PUT | `/account/profile` | JSON أو `multipart/form-data` (لو فيه avatar) | `{ user }` |
| PUT | `/account/password` | `{ currentPassword, newPassword }` | `{}` |
| GET | `/account/orders` | `status?, page?` | paginated `Order` |
| GET | `/account/orders/:id` | — | `{ order: Order }` |
| **POST** | **`/account/orders/:id/pay`** | `{ paymentMethod? }` | `{ paymentUrl: string \| null }` |
| GET | `/account/tickets` | `page?` | paginated `Ticket` |
| GET | `/account/tickets/:id` | — | `{ ticket: Ticket }` |
| POST | `/account/tickets` | `{ subject, orderId?, priority, message }` | `{ id, number }` |
| POST | `/account/tickets/:id/messages` | `{ text }` | `{ message }` |
| PATCH | `/account/tickets/:id/close` | — | `{}` |

### قواعد `POST /account/orders/:id/pay`
- يتحقق `order.user_id === auth.userId` وإلا **403**.
- **404** لو الطلب مش موجود.
- **400** لو الطلب مدفوع أصلًا أو ملغي.
- ينشئ session دفع جديد على نفس الـ `orderId` ويحفظ `payment_session_id`, `payment_url`, `payment_initiated_at`.
- الـ webhook يحدّث **نفس** الطلب (paid=true, paid_at, payment_status) ولا ينشئ طلب جديد.

---

## 6) Admin — `/admin/*` (role=admin)

### Services
| Method | Path |
|---|---|
| GET | `/admin/services?...` (paginated) |
| POST | `/admin/services` |
| GET | `/admin/services/:slug` |
| PUT | `/admin/services/:slug` |
| DELETE | `/admin/services/:slug` |
| GET | `/admin/services/export` → CSV blob |

### Plans
| Method | Path |
|---|---|
| GET | `/admin/plans` → `{ items }` |
| POST | `/admin/plans` |
| PUT | `/admin/plans/:id` |
| DELETE | `/admin/plans/:id` |

### Orders
| Method | Path |
|---|---|
| GET | `/admin/orders?...` |
| GET | `/admin/orders/:id` |
| PATCH | `/admin/orders/:id/status` `{ status, note? }` |
| PATCH | `/admin/orders/:id/payment-status` `{ paymentStatus }` |
| POST | `/admin/orders/:id/note` `{ text }` |

### Bookings (consultations)
| Method | Path |
|---|---|
| GET | `/admin/bookings?...` |
| PATCH | `/admin/bookings/:id/status` |
| POST | `/admin/bookings/:id/note` |

### Invoices
| Method | Path |
|---|---|
| GET | `/admin/invoices?...` |
| POST | `/admin/invoices` |
| PATCH | `/admin/invoices/:id` |
| DELETE | `/admin/invoices/:id` |
| GET | `/admin/invoices/:id/pdf` → PDF blob |

### Clients
| Method | Path |
|---|---|
| GET | `/admin/clients?...` |
| POST | `/admin/clients` |
| PUT | `/admin/clients/:id` |
| DELETE | `/admin/clients/:id` |

### Portfolio
| Method | Path |
|---|---|
| GET | `/admin/portfolio?...` |
| POST | `/admin/portfolio` |
| PUT | `/admin/portfolio/:id` |
| DELETE | `/admin/portfolio/:id` |
| PATCH | `/admin/portfolio/:id/visibility` `{ visible }` |

### Users / Roles
| Method | Path |
|---|---|
| GET | `/admin/users?...` |
| POST | `/admin/users/invite` |
| PUT | `/admin/users/:id` |
| PATCH | `/admin/users/:id/role` `{ role }` |
| DELETE | `/admin/users/:id` |

### Tickets
| Method | Path |
|---|---|
| GET | `/admin/tickets?...` |
| GET | `/admin/tickets/:id` |
| POST | `/admin/tickets/:id/messages` `{ text }` |
| PATCH | `/admin/tickets/:id/status` `{ status }` |
| PATCH | `/admin/tickets/:id/priority` `{ priority }` |

### Reviews moderation
| Method | Path |
|---|---|
| GET | `/admin/reviews?...` |
| PATCH | `/admin/reviews/:id/status` `{ status }` |
| DELETE | `/admin/reviews/:id` |

### Settings
| Method | Path |
|---|---|
| GET | `/admin/settings/:group` (groups: `appearance`, `integrations`, `notifications`, `profile`, `team`, `payment`, `seo`) |
| PUT | `/admin/settings/:group` |
| GET | `/admin/site/settings` (إعدادات الموقع) |
| PUT | `/admin/site/settings` |

### Tracking codes
| Method | Path |
|---|---|
| GET | `/admin/tracking` → `{ items }` |
| POST | `/admin/tracking` |
| PUT | `/admin/tracking/:id` |
| PATCH | `/admin/tracking/:id/toggle` |
| DELETE | `/admin/tracking/:id` |

### Analytics / Stats / Reports / Notifications / Uploads
| Method | Path |
|---|---|
| GET | `/admin/analytics?range=` |
| GET | `/admin/stats` |
| POST | `/admin/reports/generate` `{ type, range, format: "json"\|"csv" }` (csv → blob) |
| GET | `/admin/notifications?limit=` |
| PATCH | `/admin/notifications?id=` (mark read) |
| POST | `/admin/uploads` (multipart `file`) → `{ url }` |

---

## 7) أنواع البيانات (Source of truth)

الفرونت يستورد الأنواع من `src/lib/api/types.ts`. لازم الباك يلتزم بنفس أسماء الحقول حرفيًا.

```ts
Price       = { amount, originalAmount|null, currency:"SAR", discountPercent|null }
User        = { id, name, email, phone|null, city|null, avatar|null, role, language, createdAt }
ServiceListItem = { id, slug, sku, titleAr, titleEn, subtitleAr, subtitleEn, category, price:Price, cover|null, status, rating, reviewsCount, isFavorited }
ServiceFull = ServiceListItem & { bannerImage|null, breadcrumbAr/En, overviewDescriptionAr/En, heroHighlights:[{ar,en}], overview, benefits, steps, stats, testimonials, faqs, plans:ServicePlan[], seo }
CartItem    = { id, service_slug, service_title, plan_id|null, plan_name|null, price, original_price|null, qty }
Cart        = { items, subtotal, vat, total, sessionId, discount?, code? }
Order       = { id, number, createdAt, status, payment_method, payment_id|null, paid, contact_*, items:OrderItem[], subtotal, vat, total, notes|null, source, timeline:[{status,at,note}], invoice|null }
Ticket      = { id, number, subject, orderId|null, status, priority, createdAt, messages:[{id,from_type,author,text,at}] }
Plan        = { id, nameAr, nameEn, price:Price, badgeAr|null, badgeEn|null, descriptionAr, descriptionEn, featuresAr[], featuresEn[], highlighted, sortOrder, status }
```

---

## 8) ملاحظات نقل (Migration notes)

- لا توجد قاعدة بيانات محلية في المشروع. كل البيانات تأتي من `/api`.
- لا يوجد Supabase / Edge Functions / Server functions في الفرونت — تم إزالتها.
- VAT 15% يُحسب على السيرفر في `/cart` و`/checkout` و`/account/orders/:id` فقط. الفرونت يعرض القيم كما هي.
- لو هتضيف حقل جديد، أضفه **اختياري** ولا تحذف القديم.

---

## 9) Checklist بعد ما تخلّص الباك

ابعتلي:
1. الـ Base URL النهائي لو مختلف.
2. أي endpoint غيّرت اسمه أو شكله.
3. أي حقل ناقص / زيادة.
4. حالة الـ webhook لـ pay-again (هل بيحدّث نفس الطلب؟).

وأنا أراجع الربط في الفرونت وأظبط أي حاجة مش متربطة صح.