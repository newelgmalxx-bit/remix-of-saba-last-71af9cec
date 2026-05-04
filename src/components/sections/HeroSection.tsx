import { Link } from "@tanstack/react-router";
import { Sparkles, Star, ArrowLeft } from "lucide-react";

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
              تصميم المستقبل
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.2] text-foreground sm:text-5xl lg:text-6xl">
              نصمم <span className="text-gradient-primary">تجارب رقمية</span>
              <br />
              تترك <span className="text-gradient-primary">أثراً</span> يدوم
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              من أفكار رائدة لشركات رائدة. نقدم حلولاً رقمية متكاملة وتصاميم مبتكرة وتطوير تقني متقدم لتحويل رؤيتك إلى واقع.
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
          </div>

          {/* Visual mock */}
          <div className="relative order-1 lg:order-2 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative mx-auto aspect-[4/5] max-w-md animate-float-slow">
              <div className="absolute inset-0 rounded-[2.5rem] bg-primary-dark glow-primary" />
              <div className="absolute inset-x-6 top-6 bottom-6 rounded-[2rem] bg-primary-dark/95 ring-1 ring-white/5">
                {/* window dots */}
                <div className="flex items-center gap-1.5 border-b border-white/5 px-5 py-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                </div>
                <div className="space-y-3 p-5">
                  <div className="h-3 w-3/4 rounded-full bg-white/10" />
                  <div className="h-3 w-1/2 rounded-full bg-white/10" />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="h-16 rounded-xl bg-white/5" />
                    <div className="h-16 rounded-xl bg-primary/40" />
                  </div>
                  <div className="h-24 rounded-xl bg-white/5" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 rounded-lg bg-white/5" />
                    <div className="h-10 rounded-lg bg-white/5" />
                    <div className="h-10 rounded-lg bg-white/5" />
                  </div>
                </div>
              </div>

              {/* rating badge */}
              <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-border">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div>
                  <div className="text-lg font-extrabold leading-none text-foreground">4.9/5</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">تقييم العملاء</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature row */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "جودة مضمونة", desc: "ضمان استرداد المال" },
            { label: "دعم مستمر", desc: "خدمة 24/7" },
            { label: "أداء عالي", desc: "نتائج موثقة" },
            { label: "أمان وموثوقية", desc: "حماية عالية" },
          ].map((f) => (
            <div key={f.label} className="text-right">
              <div className="text-sm font-bold text-foreground">{f.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid items-center gap-6 rounded-2xl border border-border bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: "+50", l: "خبير وموهبة" },
            { v: "+150", l: "عميل سعيد" },
            { v: "+200", l: "مشروع منجز" },
            { v: "+3", l: "سنوات خبرة" },
          ].map((s, i) => (
            <div
              key={s.l}
              className={`text-center ${i !== 0 ? "lg:border-r lg:border-border" : ""}`}
            >
              <div className="text-3xl font-extrabold text-primary">{s.v}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
          <div className="hidden lg:col-span-4 lg:block" />
        </div>
      </div>
    </section>
  );
}