import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowLeft, ShieldCheck, Gauge, Headphones, BadgeCheck, Send, LayoutGrid } from "lucide-react";
import { HeroMock } from "@/components/sections/HeroMock";
import { useLang } from "@/i18n/LanguageProvider";

export function HeroSection() {
  const { t, dir } = useLang();
  const ArrowDir = dir === "rtl" ? ArrowLeft : ArrowLeft; // visual is fine; Lucide ArrowLeft works for both with rotation
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/40 via-background to-background">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute top-32 left-0 h-[320px] w-[320px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text — RIGHT side in RTL */}
          <div className="order-2 text-start lg:order-1 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5 text-[11px] font-semibold text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("hero.badge")}</span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">2021</span>
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.25] text-primary sm:text-5xl lg:text-[3.4rem]">
              {t("hero.title.l1")}
              <br />
              {t("hero.title.l2")}
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              {t("hero.desc")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={"/contact" as any}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_10px_30px_-8px_rgba(30,91,148,0.55)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_16px_36px_-10px_rgba(30,91,148,0.7)]"
              >
                <Send className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                {t("hero.cta.start")}
                <ArrowDir className={`h-4 w-4 transition-transform group-hover:-translate-x-1 ${dir === "ltr" ? "rotate-180" : ""}`} />
              </Link>
              <Link
                to={"/services" as any}
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-border bg-white px-7 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
              >
                <LayoutGrid className="h-4 w-4 transition-transform group-hover:rotate-6" />
                {t("hero.cta.browse")}
              </Link>
            </div>
          </div>

          {/* Visual mock — LEFT side in RTL */}
          <div className="relative order-1 lg:order-2 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative animate-float-slow">
              <div className="pointer-events-none absolute inset-0 -z-0 rounded-[2.5rem] bg-primary/20 blur-3xl" />
              <HeroMock />
            </div>
          </div>
        </div>

        {/* Feature row — full-width 4 columns under hero */}
        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { icon: BadgeCheck, tk: "hero.feat.quality.t" as const, dk: "hero.feat.quality.d" as const },
            { icon: Headphones, tk: "hero.feat.support.t" as const, dk: "hero.feat.support.d" as const },
            { icon: Gauge, tk: "hero.feat.perf.t" as const, dk: "hero.feat.perf.d" as const },
            { icon: ShieldCheck, tk: "hero.feat.security.t" as const, dk: "hero.feat.security.d" as const },
          ].map((f) => (
            <div key={f.tk} className="text-center">
              <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <div className="text-sm font-bold text-foreground">{t(f.tk)}</div>
              <div className="mt-1 text-[11px] leading-5 text-muted-foreground">{t(f.dk)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-white px-8 py-8 shadow-sm lg:flex-row lg:justify-between">
          <div className="text-center lg:max-w-xs lg:text-start">
            <h3 className="text-lg font-extrabold text-foreground">{t("hero.partner.title")}</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">{t("hero.partner.desc")}</p>
          </div>
          <div className="flex flex-1 items-center justify-around gap-6">
            {[
              { v: "+50", lk: "hero.stat.experts" as const },
              { v: "+150", lk: "hero.stat.projects" as const },
              { v: "+200", lk: "hero.stat.clients" as const },
              { v: "+3", lk: "hero.stat.years" as const },
            ].map((s) => (
              <div key={s.lk} className="text-center">
                <div className="text-3xl font-extrabold text-primary" dir="ltr">{s.v}</div>
                <div className="mt-1 text-xs text-muted-foreground">{t(s.lk)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
