import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronLeft, Lock, ShieldCheck, FileText, Loader2, AlertCircle } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useCart } from "@/hooks/useCart";
import { paymentMethods, type PaymentMethod, formatCurrency } from "@/data/account";
import { useLang } from "@/i18n/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import api, { ApiError } from "@/lib/api";
import { toast } from "sonner";
import { useCheckoutStore } from "@/store/checkoutStore";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/checkout")({
  head: () => {
    const seo = buildSeo({ title: "إتمام الطلب | سابا ديزاين", description: "أكمل بيانات طلبك واختر وسيلة الدفع المناسبة بأمان.", path: "/checkout", noindex: true });
    return { meta: seo.meta, links: seo.links };
  },
  component: CheckoutShell,
});

function CheckoutShell() {
  const location = useLocation();

  if (location.pathname !== "/checkout") {
    return <Outlet />;
  }

  return <CheckoutPage />;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, vat, total, clear } = useCart();
  const [step, setStep] = useState(0);
  const { t, lang } = useLang();
  const L = (a: string, e: string) => (lang === "en" ? e : a);
  const { user } = useAuth();
  const steps = [t("checkout.steps.info"), t("checkout.steps.payment"), t("checkout.steps.review")];

  const [info, setInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: "",
    notes: "",
    agree: true,
  });
  const [payment, setPayment] = useState<PaymentMethod>("myfatoorah");
  const [submitting, setSubmitting] = useState(false);
  const [useSaved, setUseSaved] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // When the logged-in user toggles between saved data and new data, refill the form.
  const applyMode = (saved: boolean) => {
    setUseSaved(saved);
    if (saved) {
      setInfo((prev) => ({
        ...prev,
        name: user?.name || "",
        email: user?.email || "",
        phone: (user as any)?.phone || "",
      }));
    } else {
      setInfo((prev) => ({ ...prev, name: "", email: "", phone: "" }));
    }
  };

  if (submitting) {
    const isCod = payment === "cod";
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <SiteHeader />
        <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <h1 className="mt-6 text-xl font-bold">
            {isCod
              ? (lang === "ar" ? "جارٍ تأكيد طلبك..." : "Confirming your order...")
              : (lang === "ar" ? "جارٍ تحويلك لبوابة الدفع..." : "Redirecting to payment gateway...")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "ar" ? "من فضلك لا تغلق هذه الصفحة." : "Please do not close this page."}
          </p>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <SiteHeader />
        <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">{t("checkout.empty.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("checkout.empty.desc")}</p>
          <Link to={"/services" as any} className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground">
            {t("checkout.empty.cta")}
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const placeOrder = async () => {
    setError(null);
    setFieldErrors({});
    if (!info.name || !info.email || !info.phone) {
      setError(lang === "ar" ? "يرجى تعبئة بيانات التواصل" : "Please fill contact info");
      setStep(0);
      return;
    }
    const phone = info.phone.replace(/[\s-]/g, "");
    const saudiOk = /^(05\d{8}|\+9665\d{8}|009665\d{8})$/.test(phone);
    if (!saudiOk) {
      setError(
        lang === "ar"
          ? "رقم الجوال يجب أن يبدأ بـ 05 (مثال: 0512345678) أو +9665."
          : "Phone must start with 05 (e.g. 0512345678) or +9665.",
      );
      setStep(0);
      return;
    }
    setSubmitting(true);
    let keepRedirectScreen = false;
    try {
      if (user) {
        try {
          const updates: Record<string, string> = {};
          if (!useSaved) {
            if (info.name && info.name !== user.name) updates.name = info.name;
            if (info.phone && info.phone !== (user as any).phone) updates.phone = info.phone;
            if (info.email && info.email !== user.email) updates.email = info.email;
          } else if (info.phone && !(user as any).phone) {
            updates.phone = info.phone;
          }
          if (Object.keys(updates).length > 0) {
            await api.account.updateProfile(updates);
          }
        } catch { /* non-blocking */ }
      }
      const res = await api.checkout.submit({
        contact: {
          name: info.name,
          email: info.email,
          phone: info.phone,
          city: undefined,
          address: undefined,
        },
        paymentMethod: payment as any,
        notes: info.notes || undefined,
        items: items.map((it) => ({
          serviceSlug: it.serviceSlug,
          serviceTitle: it.serviceTitle,
          planId: it.planId,
          planName: it.planName,
          price: it.price,
          qty: it.qty,
        })),
      });
      try {
        useCheckoutStore.getState().setLastOrder({
          orderId: res.orderId,
          orderNumber: res.orderNumber,
          total,
          payment,
          items: items.map((it) => ({
            serviceSlug: it.serviceSlug,
            serviceTitle: it.serviceTitle,
            planId: it.planId,
            planName: it.planName,
            price: it.price,
            qty: it.qty,
          })),
          info: {
            name: info.name,
            email: info.email,
            phone: info.phone,
            notes: info.notes || undefined,
          },
        });
      } catch {}
      await clear();
      const isCod = payment === "cod";
      // Online gateways: redirect to the payment URL returned by that provider.
      if (!isCod) {
        let url = res.paymentUrl as string | null | undefined;
        if (!url && res.orderId && payment === "myfatoorah") {
          try {
            const init: any = await api.checkout.initiateMyfatoorah(res.orderId);
            const d = init?.data ?? init ?? {};
            url = d.paymentUrl ?? d.payment_url ?? d.invoiceURL ?? d.url ?? null;
          } catch { /* ignore — fall through to success page */ }
        }
        if (url) {
          keepRedirectScreen = true;
          toast.success(lang === "ar" ? "جارٍ تحويلك لبوابة الدفع" : "Redirecting to payment");
          window.location.replace(url);
          return;
        }
        // No payment URL available — send user to success page (will offer Pay now).
        toast.message(lang === "ar" ? "تم إنشاء الطلب — أكمل الدفع" : "Order created — complete payment");
        navigate({
          to: "/checkout/success" as any,
          search: { order: res.orderId, o: res.orderNumber } as any,
        });
        return;
      }
      // Cash on delivery: go straight to success page.
      toast.success(lang === "ar" ? "تم استلام طلبك بنجاح" : "Order placed successfully");
      navigate({
        to: "/checkout/success" as any,
        search: { order: res.orderId, o: res.orderNumber, cod: "true" } as any,
      });
    } catch (err) {
      // Auth errors and validation errors should still surface to the user.
      if (err instanceof ApiError && (err.status === 401 || err.status === 422)) {
        if (err.status === 401) {
          setError(lang === "ar" ? "يجب تسجيل الدخول لإتمام الطلب." : "Please sign in to place an order.");
        } else {
          setError(lang === "ar" ? "تحقق من البيانات أدناه." : "Please review the highlighted fields.");
        }
        if (err.errors) setFieldErrors(err.errors as any);
        toast.error(error || (lang === "ar" ? "فشل إتمام الطلب" : "Checkout failed"));
      } else {
        // Surface the real backend error — do NOT fabricate a local order number.
        const msg = (err as any)?.message || (lang === "ar" ? "تعذّر إتمام الطلب. حاول مرة أخرى." : "Could not complete the order. Please try again.");
        setError(msg);
        toast.error(msg);
        return;
      }
    } finally {
      if (!keepRedirectScreen) setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to={"/cart" as any} className="hover:text-primary">{t("checkout.crumb.cart")}</Link>
            <span>/</span>
            <span className="text-foreground">{t("checkout.crumb.checkout")}</span>
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
              {error && (
                <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold">{error}</div>
                    {Object.keys(fieldErrors).length > 0 && (
                      <ul className="mt-1 list-disc ps-5 text-xs">
                        {Object.entries(fieldErrors).flatMap(([f, msgs]) =>
                          (Array.isArray(msgs) ? msgs : [String(msgs)]).map((m, i) => (
                            <li key={`${f}-${i}`}><span className="font-semibold">{f}:</span> {m}</li>
                          )),
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              )}
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold">{t("checkout.contact")}</h2>
                  {user && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => applyMode(true)}
                        className={`rounded-xl border-2 p-3 text-right text-sm font-bold transition ${
                          useSaved ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        {lang === "ar" ? "استخدم بياناتي المحفوظة" : "Use my saved info"}
                      </button>
                      <button
                        type="button"
                        onClick={() => applyMode(false)}
                        className={`rounded-xl border-2 p-3 text-right text-sm font-bold transition ${
                          !useSaved ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        {lang === "ar" ? "إدخال بيانات جديدة" : "Enter new info"}
                      </button>
                    </div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={t("checkout.fullName")} value={info.name} onChange={(v) => setInfo({ ...info, name: v })} />
                    <Field label={t("checkout.email")} type="email" value={info.email} onChange={(v) => setInfo({ ...info, email: v })} />
                    <Field label={t("checkout.phone")} value={info.phone} onChange={(v) => setInfo({ ...info, phone: v })} dir="ltr" type="tel" />
                    <Field label={t("checkout.company")} value={info.company} onChange={(v) => setInfo({ ...info, company: v })} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold">{t("checkout.notes")}</label>
                    <textarea
                      value={info.notes}
                      onChange={(e) => setInfo({ ...info, notes: e.target.value })}
                      rows={4}
                      placeholder={t("checkout.notesAlt")}
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
                      {t("checkout.agree")}
                    </span>
                  </label>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold">{t("checkout.payment.title")}</h2>
                    <p className="text-sm text-muted-foreground">{t("checkout.payment.desc")}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {paymentMethods.map((m) => {
                      const Icon = m.icon;
                      const active = payment === m.id;
                      const isDisabled = !!m.disabled;
                      return (
                        <button
                          key={m.id}
                          onClick={() => !isDisabled && setPayment(m.id)}
                          type="button"
                          disabled={isDisabled}
                          aria-disabled={isDisabled}
                          className={`relative text-right rounded-2xl border-2 p-4 transition-all ${
                            isDisabled
                              ? "border-border bg-muted/40 cursor-not-allowed opacity-60"
                              : active
                              ? "border-primary bg-primary/5 shadow-[0_10px_30px_-15px_rgba(30,91,148,0.5)]"
                              : "border-border bg-card hover:border-primary/50"
                          }`}
                        >
                          {m.comingSoon && (
                            <span className="absolute -top-2 right-4 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                              {lang === "en" ? "Coming soon" : "قريباً"}
                            </span>
                          )}
                          {!m.comingSoon && m.badge && (
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
                    <span>{t("checkout.payment.note")}</span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold">{t("checkout.review.title")}</h2>
                  <ReviewBlock title={t("checkout.review.customer")}>
                    <ReviewRow label={t("checkout.review.name")} value={info.name} />
                    <ReviewRow label={t("checkout.review.email")} value={info.email} />
                    <ReviewRow label={t("checkout.review.phone")} value={info.phone} ltr />
                    {info.company && <ReviewRow label={t("checkout.review.company")} value={info.company} />}
                    {info.notes && <ReviewRow label={t("checkout.review.notes")} value={info.notes} />}
                  </ReviewBlock>
                  <ReviewBlock title={t("checkout.review.payment")}>
                    <ReviewRow label={t("checkout.review.method")} value={paymentMethods.find((m) => m.id === payment)?.name ?? ""} />
                  </ReviewBlock>
                  <ReviewBlock title={t("checkout.review.items")}>
                    {items.map((it) => (
                      <div key={it.id} className="flex items-center justify-between border-b border-dashed border-border py-2 last:border-0 text-sm">
                        <div>
                          <div className="font-bold">{it.serviceTitle}</div>
                          <div className="text-xs text-muted-foreground">{t("cart.planLabel")} {it.planName} × {it.qty}</div>
                        </div>
                        <div className="font-bold text-primary" data-ltr-number>{formatCurrency(it.price * it.qty)}</div>
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
                  {t("checkout.prev")}
                </button>
                {step < steps.length - 1 ? (
                  <button
                    onClick={next}
                    disabled={step === 0 && !info.agree}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-50"
                  >
                    {t("checkout.next")}
                  </button>
                ) : (
                  <button
                    onClick={placeOrder}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    {submitting ? t("checkout.confirming") : `${t("checkout.confirm.full")} — ${formatCurrency(total)}`}
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar summary */}
            <aside className="space-y-4">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-bold">{t("checkout.summary.short")}</h3>
                <div className="mt-4 max-h-64 space-y-3 overflow-auto">
                  {items.map((it) => (
                    <div key={it.id} className="flex items-start justify-between gap-3 text-sm">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold line-clamp-1">{it.serviceTitle}</div>
                        <div className="text-xs text-muted-foreground">{it.planName} × {it.qty}</div>
                      </div>
                      <div className="text-xs font-bold text-primary whitespace-nowrap" data-ltr-number>{formatCurrency(it.price * it.qty)}</div>
                    </div>
                  ))}
                </div>
                <div className="my-4 h-px bg-border" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.summary.subtotal")}</span><span data-ltr-number>{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.summary.vat")}</span><span data-ltr-number>{formatCurrency(vat)}</span></div>
                  <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                    <span>{t("checkout.summary.total")}</span>
                    <span className="text-primary" data-ltr-number>{formatCurrency(total)}</span>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  {t("checkout.invoice.note")}
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

function Field({ label, value, onChange, type = "text", dir }: { label: string; value: string; onChange: (v: string) => void; type?: string; dir?: "ltr" | "rtl" }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold">{label}</label>
      <input
        type={type}
        value={value}
        dir={dir}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${dir === "ltr" ? "text-left" : ""}`}
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

function ReviewRow({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span dir={ltr ? "ltr" : undefined} className="font-medium text-foreground text-left">{value}</span>
    </div>
  );
}