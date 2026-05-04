import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronLeft, Lock, ShieldCheck, FileText } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useCart } from "@/hooks/useCart";
import { paymentMethods, type PaymentMethod, formatCurrency, mockUser } from "@/data/account";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "إتمام الطلب | سابا ديزاين" }],
  }),
  component: CheckoutPage,
});

const steps = ["معلومات العميل", "طريقة الدفع", "المراجعة"] as const;

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, vat, total, clear } = useCart();
  const [step, setStep] = useState(0);

  const [info, setInfo] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    company: "",
    notes: "",
    agree: true,
  });
  const [payment, setPayment] = useState<PaymentMethod>("tabby");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <SiteHeader />
        <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">لا توجد عناصر للدفع</h1>
          <p className="mt-2 text-sm text-muted-foreground">سلتك فارغة. أضف باقة لتبدأ.</p>
          <Link to={"/services" as any} className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground">
            تصفح الخدمات
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const placeOrder = () => {
    setSubmitting(true);
    setTimeout(() => {
      const orderNumber = `SD-${Math.floor(1000 + Math.random() * 9000)}`;
      // Save mock pending order summary in localStorage for the success view
      try {
        localStorage.setItem(
          "saba_last_order",
          JSON.stringify({ number: orderNumber, total, payment, items, info }),
        );
      } catch {}
      clear();
      navigate({ to: "/checkout/success" as any, search: { o: orderNumber } as any });
    }, 900);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to={"/cart" as any} className="hover:text-primary">السلة</Link>
            <span>/</span>
            <span className="text-foreground">إتمام الطلب</span>
          </div>

          {/* Stepper */}
          <div className="mb-8 rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-4">
              {steps.map((label, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <div key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                        done
                          ? "bg-primary text-primary-foreground"
                          : active
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : i + 1}
                    </div>
                    <div className={`text-xs sm:text-sm font-bold ${active || done ? "text-foreground" : "text-muted-foreground"}`}>
                      {label}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 rounded-full ${done ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm min-h-[400px]">
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold">معلومات العميل</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="الاسم الكامل" value={info.name} onChange={(v) => setInfo({ ...info, name: v })} />
                    <Field label="البريد الإلكتروني" type="email" value={info.email} onChange={(v) => setInfo({ ...info, email: v })} />
                    <Field label="رقم الجوال" value={info.phone} onChange={(v) => setInfo({ ...info, phone: v })} />
                    <Field label="اسم الشركة (اختياري)" value={info.company} onChange={(v) => setInfo({ ...info, company: v })} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold">ملاحظات إضافية</label>
                    <textarea
                      value={info.notes}
                      onChange={(e) => setInfo({ ...info, notes: e.target.value })}
                      rows={4}
                      placeholder="أخبرنا عن متطلباتك أو أي تفاصيل تريد توضيحها..."
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={info.agree}
                      onChange={(e) => setInfo({ ...info, agree: e.target.checked })}
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <span className="text-muted-foreground">
                      أوافق على <Link to={"/contact" as any} className="text-primary underline">الشروط والأحكام</Link> وسياسة الخصوصية
                    </span>
                  </label>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold">طريقة الدفع</h2>
                    <p className="text-sm text-muted-foreground">اختر الطريقة الأنسب لك. كل العمليات آمنة ومشفّرة.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {paymentMethods.map((m) => {
                      const Icon = m.icon;
                      const active = payment === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setPayment(m.id)}
                          type="button"
                          className={`relative text-right rounded-2xl border-2 p-4 transition-all ${
                            active
                              ? "border-primary bg-primary/5 shadow-[0_10px_30px_-15px_rgba(30,91,148,0.5)]"
                              : "border-border bg-card hover:border-primary/50"
                          }`}
                        >
                          {m.badge && (
                            <span className="absolute -top-2 right-4 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                              {m.badge}
                            </span>
                          )}
                          <div className="flex items-center gap-3">
                            <div className={`flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl ${m.logo ? "bg-white border border-border p-1" : active ? "bg-primary text-white" : "bg-primary-light text-primary"}`}>
                              {m.logo ? (
                                <img src={m.logo} alt={m.name} className="max-h-8 w-auto object-contain" />
                              ) : (
                                <Icon className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold">{m.name}</div>
                              <div className="text-xs text-muted-foreground">{m.desc}</div>
                              {m.brands && (
                                <div className="mt-2 flex items-center gap-1.5">
                                  {m.brands.map((b) =>
                                    b.logo ? (
                                      <span key={b.name} className="inline-flex h-6 items-center rounded-md border border-border bg-white px-1.5">
                                        <img src={b.logo} alt={b.name} className="h-4 w-auto object-contain" />
                                      </span>
                                    ) : (
                                      <span key={b.name} className="inline-flex h-6 items-center gap-1 rounded-md border border-border bg-white px-2 text-[10px] font-bold text-foreground/70">
                                        {b.icon && <b.icon className="h-3 w-3" />}
                                        {b.name}
                                      </span>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                active ? "border-primary bg-primary" : "border-border"
                              }`}
                            >
                              {active && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-primary-light/60 p-3 text-xs text-primary-dark">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>عملية الدفع تتم عبر بوابة آمنة ومشفّرة بمعايير PCI-DSS.</span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold">مراجعة الطلب</h2>
                  <ReviewBlock title="معلومات العميل">
                    <ReviewRow label="الاسم" value={info.name} />
                    <ReviewRow label="البريد" value={info.email} />
                    <ReviewRow label="الجوال" value={info.phone} />
                    {info.company && <ReviewRow label="الشركة" value={info.company} />}
                    {info.notes && <ReviewRow label="ملاحظات" value={info.notes} />}
                  </ReviewBlock>
                  <ReviewBlock title="طريقة الدفع">
                    <ReviewRow label="الطريقة" value={paymentMethods.find((m) => m.id === payment)?.name ?? ""} />
                  </ReviewBlock>
                  <ReviewBlock title="العناصر">
                    {items.map((it) => (
                      <div key={it.id} className="flex items-center justify-between border-b border-dashed border-border py-2 last:border-0 text-sm">
                        <div>
                          <div className="font-bold">{it.serviceTitle}</div>
                          <div className="text-xs text-muted-foreground">باقة {it.planName} × {it.qty}</div>
                        </div>
                        <div className="font-bold text-primary">{formatCurrency(it.price * it.qty)}</div>
                      </div>
                    ))}
                  </ReviewBlock>
                </div>
              )}

              {/* Nav buttons */}
              <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
                <button
                  onClick={prev}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-5 py-2.5 text-sm font-bold disabled:opacity-40 hover:bg-muted"
                >
                  <ChevronLeft className="h-4 w-4" />
                  السابق
                </button>
                {step < steps.length - 1 ? (
                  <button
                    onClick={next}
                    disabled={step === 0 && !info.agree}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-50"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    onClick={placeOrder}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
                  >
                    <Lock className="h-4 w-4" />
                    {submitting ? "جارِ التأكيد..." : `تأكيد الطلب وإتمام الدفع — ${formatCurrency(total)}`}
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar summary */}
            <aside className="space-y-4">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-bold">ملخّص</h3>
                <div className="mt-4 max-h-64 space-y-3 overflow-auto">
                  {items.map((it) => (
                    <div key={it.id} className="flex items-start justify-between gap-3 text-sm">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold line-clamp-1">{it.serviceTitle}</div>
                        <div className="text-xs text-muted-foreground">{it.planName} × {it.qty}</div>
                      </div>
                      <div className="text-xs font-bold text-primary whitespace-nowrap">{formatCurrency(it.price * it.qty)}</div>
                    </div>
                  ))}
                </div>
                <div className="my-4 h-px bg-border" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">المجموع</span><span>{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ض. القيمة المضافة</span><span>{formatCurrency(vat)}</span></div>
                  <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                    <span>الإجمالي</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  ستحصل على فاتورة ضريبية فور إتمام الدفع.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <h3 className="mb-2 text-sm font-bold text-primary">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground text-left">{value}</span>
    </div>
  );
}