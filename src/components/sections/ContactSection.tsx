import { useState } from "react";
import { Phone, Mail, MessageCircle, MapPin, Clock, Instagram, Twitter, Linkedin, Facebook, Clock3, Sparkles, Send, Loader2 } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { contact as contactApi } from "@/lib/api";
import { toast } from "sonner";

export function ContactSection() {
  const { t, dir } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", budget: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(t("contactForm.field.details"));
      return;
    }
    setSubmitting(true);
    try {
      await contactApi.send({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        service: form.service || undefined,
        budget: form.budget || undefined,
        message: form.message,
      });
      toast.success(t("contactForm.submit"));
      setForm({ name: "", phone: "", email: "", service: "", budget: "", message: "" });
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-background pb-24 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
            <Sparkles className="h-3 w-3" /> {t("contactForm.kicker")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl">
            {t("contactForm.title.lead")} <span className="text-primary">{t("contactForm.title.highlight")}</span> {t("contactForm.title.tail")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("contactForm.desc")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Info card — right in RTL (first in DOM) */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-primary to-primary-dark p-7 text-white shadow-md lg:col-span-2">
            <h3 className="text-xl font-bold">{t("contactForm.info.title")}</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/75">
              {t("contactForm.info.desc")}
            </p>

            <ul className="mt-6 space-y-4">
              <InfoRow icon={Phone} label={t("contactForm.info.call")} value="+966 50 123 4567" href="tel:+966501234567" />
              <InfoRow icon={Mail} label={t("contactForm.info.email")} value="info@sabadesign.com" href="mailto:info@sabadesign.com" />
              <InfoRow icon={MessageCircle} label={t("contactForm.info.whatsapp")} value="+966 50 123 4567" href="https://wa.me/966501234567" external />
              <InfoRow icon={MapPin} label={t("contactForm.info.location")} value={t("contactForm.info.locationV")} href="https://maps.google.com/?q=Saudi+Arabia" external />
            </ul>

            <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-white/70">{t("contactForm.info.hours")}</div>
                  <div className="mt-1 text-sm font-semibold">{t("contactForm.info.hoursV")}</div>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Clock className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[11px] text-white/70">{t("contactForm.info.follow")}</p>
              <div className="mt-3 flex items-center gap-2">
                {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 hover:scale-110"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form — left in RTL */}
          <form onSubmit={submit} className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">{t("contactForm.form.title")}</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                <Clock3 className="h-3 w-3" /> {t("contactForm.form.replyBadge")}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("contactForm.form.desc")}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label={t("contactForm.field.name")} placeholder={t("contactForm.field.namePh")} required value={form.name} onChange={(v) => update("name", v)} />
              <Field label={t("contactForm.field.phone")} placeholder="+966 5x xxx xxxx" required type="tel" dir="ltr" value={form.phone} onChange={(v) => update("phone", v)} />
              <div className="sm:col-span-2">
                <Field label={t("contactForm.field.email")} type="email" placeholder="name@example.com" required value={form.email} onChange={(v) => update("email", v)} />
              </div>
              <Select label={t("contactForm.field.service")} placeholder={t("contactForm.field.servicePh")} options={[t("contactForm.opt.web"), t("contactForm.opt.app"), t("contactForm.opt.store"), t("contactForm.opt.brand")]} required value={form.service} onChange={(v) => update("service", v)} />
              <Select label={t("contactForm.field.budget")} placeholder={t("contactForm.field.budgetPh")} options={[t("contactForm.budget.lt10k"), t("contactForm.budget.10_30k"), t("contactForm.budget.30_80k"), t("contactForm.budget.gt80k")]} required value={form.budget} onChange={(v) => update("budget", v)} />
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold text-foreground">
                  {t("contactForm.field.details")} <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder={t("contactForm.field.detailsPh")}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="w-full resize-none rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(30,91,148,0.6)] transition-all hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgba(30,91,148,0.7)]"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className={`h-4 w-4 transition-transform group-hover:-translate-x-1 ${dir === "ltr" ? "rotate-180" : ""}`} />}
                {t("contactForm.submit")}
              </button>
              <span className="text-xs text-muted-foreground">
                {t("contactForm.consent.lead")}{" "}
                <a href="#" className="text-primary underline-offset-2 hover:underline">{t("contactForm.consent.link")}</a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type = "text", placeholder, required, dir, value, onChange }: { label: string; type?: string; placeholder?: string; required?: boolean; dir?: "ltr" | "rtl"; value?: string; onChange?: (v: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        dir={dir}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 ${dir === "ltr" ? "text-left placeholder:text-left" : ""}`}
      />
    </div>
  );
}

function Select({ label, placeholder, options, required, value, onChange }: { label: string; placeholder: string; options: string[]; required?: boolean; value?: string; onChange?: (v: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <select value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15">
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, href, external }: { icon: any; label: string; value: string; href?: string; external?: boolean }) {
  const content = (
    <>
      <div className="min-w-0">
        <div className="text-[11px] text-white/65">{label}</div>
        <div className="truncate text-sm font-semibold" dir="ltr">{value}</div>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 transition group-hover:bg-white/25">
        <Icon className="h-4 w-4" />
      </span>
    </>
  );
  if (href) {
    return (
      <li>
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="group flex items-center justify-between gap-3 rounded-lg -mx-1 px-1 py-0.5 transition hover:bg-white/5"
        >
          {content}
        </a>
      </li>
    );
  }
  return <li className="flex items-center justify-between gap-3">{content}</li>;
}
