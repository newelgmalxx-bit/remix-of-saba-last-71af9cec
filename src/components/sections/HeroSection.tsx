import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowLeft, ShieldCheck, Gauge, Headphones, BadgeCheck, Send, LayoutGrid } from "lucide-react";
import { HeroMock } from "@/components/sections/HeroMock";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/40 via-background to-background">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute top-32 left-0 h-[320px] w-[320px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text — RIGHT side in RTL */}
          <div className="order-2 text-right lg:order-1 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5 text-[11px] font-semibold text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>وكالة برمجة وتصميم رقمية</span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">2026</span>
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.25] text-primary sm:text-5xl lg:text-[3.4rem]">
              نصمم تجارب رقمية
              <br />
              تترك أثراً يدوم
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              في سابا ديزاين نحوّل أفكارك إلى منتجات رقمية احترافية: مواقع، تطبيقات، وحلول ذكية تعزز نجاح أعمالك وتضعك في المقدمة.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={"/contact" as any}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_10px_30px_-8px_rgba(30,91,148,0.55)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_16px_36px_-10px_rgba(30,91,148,0.7)]"
              >
                <Send className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                ابدأ مشروعك الآن
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Link>
              <Link
                to={"/services" as any}
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-border bg-white px-7 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
              >
                <LayoutGrid className="h-4 w-4 transition-transform group-hover:rotate-6" />
                تصفح خدماتنا
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
            { icon: BadgeCheck, t: "جودة مضمونة", d: "تسليم احترافي بتوازن بين الشكل والوظيفة" },
            { icon: Headphones, t: "دعم مستمر", d: "فريق جاهز لمساعدتك بعد الإطلاق وخلال التطوير" },
            { icon: Gauge, t: "أداء عالي", d: "سرعة وفعالية بأداء يحقق نتائج ملموسة" },
            { icon: ShieldCheck, t: "أمان وموثوقية", d: "حماية بياناتك ضمن أعلى المعايير في كل خطوة" },
          ].map((f) => (
            <div key={f.t} className="text-center">
              <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <div className="text-sm font-bold text-foreground">{f.t}</div>
              <div className="mt-1 text-[11px] leading-5 text-muted-foreground">{f.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-white px-8 py-8 shadow-sm lg:flex-row lg:justify-between">
          <div className="text-center lg:max-w-xs lg:text-right">
            <h3 className="text-lg font-extrabold text-foreground">شريكك في التحول الرقمي</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              نساعدك على بناء مستقبل رقمي أفضل بتجربة واضحة ونتيجة فائقة الجودة تليق بالنمو.
            </p>
          </div>
          <div className="flex flex-1 items-center justify-around gap-6">
            {[
              { v: "+50", l: "خبير ومختص" },
              { v: "+150", l: "مشروع مكتمل" },
              { v: "+200", l: "عميل سعيد" },
              { v: "+3", l: "سنوات خبرة" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-3xl font-extrabold text-primary" dir="ltr">{s.v}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
