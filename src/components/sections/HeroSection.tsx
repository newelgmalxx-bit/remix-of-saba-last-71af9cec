import { Link } from "@tanstack/react-router";
import { Sparkles, Star, ArrowLeft, ShieldCheck, Gauge, Headphones, BadgeCheck } from "lucide-react";
import heroMock from "@/assets/hero-mock.png";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/40 via-background to-background">
      {/* animated grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute top-32 left-0 h-[320px] w-[320px] rounded-full bg-primary/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8 lg:pt-20 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div className="order-2 text-right lg:order-1 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>وكالة برمجة وتصميم رقمية</span>
              <span className="text-foreground/40">•</span>
              <span className="text-foreground/60">2026</span>
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.2] text-foreground sm:text-5xl lg:text-6xl">
              نصمم <span className="text-gradient-primary">تجارب رقمية</span>
              <br />
              تترك <span className="text-gradient-primary">أثراً</span> يدوم
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              في سابا ديزاين نحوّل أفكارك إلى منتجات رقمية احترافية: مواقع، تطبيقات، وحلول ذكية تعزز نجاح أعمالك وتضعك في المقدمة.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={"/contact" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-md transition hover:bg-primary-dark"
              >
                ابدأ مشروعك الآن
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                to={"/services" as any}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-white px-7 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary"
              >
                تصفح خدماتنا
              </Link>
            </div>

            {/* Feature row UNDER the CTA buttons (matches design) */}
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { icon: ShieldCheck, t: "أمان وموثوقية", d: "حماية بياناتك وبناء المعايير في أول خطوة" },
                { icon: Gauge, t: "أداء عالي", d: "سرعة وفعالية، نتائج ملموسة قوية" },
                { icon: Headphones, t: "دعم مستمر", d: "فريق جاهز لمساعدتك بعد الإطلاق وخلال التطوير" },
                { icon: BadgeCheck, t: "جودة مضمونة", d: "تسليم احترافي بتوازن بين الشكل والنتيجة" },
              ].map((f) => (
                <div key={f.t} className="text-center">
                  <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
                    <f.icon className="h-4 w-4" />
                  </span>
                  <div className="text-xs font-bold text-foreground">{f.t}</div>
                  <div className="mt-1 text-[10px] leading-4 text-muted-foreground">{f.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual mock */}
          <div className="relative order-1 lg:order-2 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative mx-auto max-w-md animate-float-slow">
              <img
                src={heroMock}
                alt="منصة سابا ديزاين"
                width={520}
                height={680}
                className="relative z-10 h-auto w-full drop-shadow-[0_30px_60px_rgba(30,91,148,0.35)]"
              />
              {/* glow behind */}
              <div className="pointer-events-none absolute inset-0 -z-0 rounded-[2.5rem] bg-primary/20 blur-3xl" />

              {/* rating badge */}
              <div className="absolute -bottom-2 right-2 z-20 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-border animate-fade-up" style={{ animationDelay: "0.5s" }}>
                <div>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="mt-1 text-center text-lg font-extrabold leading-none text-foreground">4.9/5</div>
                  <div className="mt-1 text-center text-[10px] text-muted-foreground">من +1200 تقييم</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip — matches design (right side has heading text, left has 4 stats) */}
      <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-6 rounded-2xl border border-border bg-white px-6 py-7 shadow-sm lg:grid-cols-5">
          {[
            { v: "+50", l: "خبير ومختص" },
            { v: "+150", l: "مشروع مكتمل" },
            { v: "+200", l: "عميل سعيد" },
            { v: "+3", l: "سنوات خبرة" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl font-extrabold text-primary">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
          <div className="text-center lg:text-right">
            <h3 className="text-lg font-extrabold text-foreground">شريكك في التحول الرقمي</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              نساعدك على بناء مستقبل رقمي أفضل بتجربة واضحة ونتيجة فائقة الجودة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}