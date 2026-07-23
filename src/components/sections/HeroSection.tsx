import { Link } from "@tanstack/react-router";
import { HeroMock } from "@/components/sections/HeroMock";
import { useLang } from "@/i18n/LanguageProvider";

type HeroIconName = "sparkles" | "arrow" | "shield" | "gauge" | "headphones" | "badge" | "send" | "grid";

const heroIconPaths: Record<HeroIconName, string[]> = {
  sparkles: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  arrow: ["M19 12H5m0 0 6-6m-6 6 6 6"],
  shield: ["M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z", "m9 12 2 2 4-5"],
  gauge: ["M4 14a8 8 0 1 1 16 0", "M12 14l4-4", "M7 14h.01M17 14h.01"],
  headphones: ["M4 13a8 8 0 0 1 16 0", "M4 13v4a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2Z", "M20 13v4a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z"],
  badge: ["M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z", "m9 12 2 2 4-5"],
  send: ["M22 2 11 13", "M22 2 15 22l-4-9-9-4 20-7Z"],
  grid: ["M4 4h7v7H4z", "M13 4h7v7h-7z", "M4 13h7v7H4z", "M13 13h7v7h-7z"],
};

function HeroIcon({ name, className = "h-4 w-4" }: { name: HeroIconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {heroIconPaths[name].map((path) => <path key={path} d={path} />)}
    </svg>
  );
}

export function HeroSection() {
  const { t, dir } = useLang();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/40 via-background to-background">
      <div className="pointer-events-none absolute inset-0 hidden bg-grid opacity-40 sm:block" />
      <div className="pointer-events-none absolute -top-32 right-0 hidden h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl md:block" />
      <div className="pointer-events-none absolute top-32 left-0 hidden h-[320px] w-[320px] rounded-full bg-primary/10 blur-3xl md:block" />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text — RIGHT side in RTL */}
          <div className="order-2 text-start lg:order-1 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5 text-[11px] font-semibold text-primary shadow-sm">
              <HeroIcon name="sparkles" className="h-3.5 w-3.5" />
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
                <HeroIcon name="send" className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                {t("hero.cta.start")}
                <HeroIcon name="arrow" className={`h-4 w-4 transition-transform group-hover:-translate-x-1 ${dir === "ltr" ? "rotate-180" : ""}`} />
              </Link>
              <Link
                to={"/services" as any}
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-border bg-white px-7 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
              >
                <HeroIcon name="grid" className="h-4 w-4 transition-transform group-hover:rotate-6" />
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
            { icon: "badge" as const, tk: "hero.feat.quality.t" as const, dk: "hero.feat.quality.d" as const },
            { icon: "headphones" as const, tk: "hero.feat.support.t" as const, dk: "hero.feat.support.d" as const },
            { icon: "gauge" as const, tk: "hero.feat.perf.t" as const, dk: "hero.feat.perf.d" as const },
            { icon: "shield" as const, tk: "hero.feat.security.t" as const, dk: "hero.feat.security.d" as const },
          ].map((f) => (
            <div key={f.tk} className="text-center">
              <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
                <HeroIcon name={f.icon} className="h-5 w-5" />
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
            <h2 className="text-lg font-extrabold text-foreground">{t("hero.partner.title")}</h2>
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
