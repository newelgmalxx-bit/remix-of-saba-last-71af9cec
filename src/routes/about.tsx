import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import aboutHero from "@/assets/about-hero.jpg";
import {
  Sparkles, Target, Eye, Heart, Award, Users, Rocket, Globe2,
  Lightbulb, ShieldCheck, Handshake, TrendingUp, ArrowLeft, Quote,
  Briefcase, Code2, Palette, Megaphone, CheckCircle2, Star, Zap, Layers,
} from "lucide-react";

const stats = [
  { value: "+250", label: "مشروع منجز", icon: Briefcase },
  { value: "+120", label: "عميل سعيد", icon: Users },
  { value: "+15", label: "دولة حول العالم", icon: Globe2 },
  { value: "+8", label: "سنوات من الخبرة", icon: Award },
];

const values = [
  { icon: Lightbulb, title: "الإبداع", desc: "نحول الأفكار إلى تجارب رقمية ملهمة تترك أثراً." },
  { icon: ShieldCheck, title: "الجودة", desc: "نلتزم بأعلى معايير الجودة في كل تفصيلة من تفاصيل العمل." },
  { icon: Handshake, title: "الشراكة", desc: "علاقتنا مع العميل شراكة طويلة المدى مبنية على الثقة." },
  { icon: TrendingUp, title: "النمو", desc: "نسعى دائماً لتطوير مهاراتنا وأدواتنا لنواكب المستقبل." },
];

const services = [
  { icon: Code2, title: "تطوير المواقع والتطبيقات" },
  { icon: Palette, title: "الهوية البصرية والتصميم" },
  { icon: Megaphone, title: "التسويق الرقمي" },
  { icon: Rocket, title: "إطلاق المنتجات الرقمية" },
];

const process = [
  { icon: Lightbulb, title: "الاكتشاف", desc: "نفهم عملك، عملاءك، وأهدافك بعمق قبل أي خط أو كود." },
  { icon: Layers, title: "التصميم", desc: "نحوّل الرؤية إلى واجهات بصرية أنيقة ومدروسة بدقة." },
  { icon: Code2, title: "التطوير", desc: "نبني المنتج بأحدث التقنيات مع التركيز على الأداء والأمان." },
  { icon: Rocket, title: "الإطلاق والنمو", desc: "نطلق مشروعك ونواكبه بالتحسينات والدعم المستمر." },
];

const testimonials = [
  { name: "خالد العبدالله", role: "مدير عام، شركة تك ستارت", quote: "تجربة استثنائية. الفريق فهم رؤيتنا من أول اجتماع وقدّم نتيجة فاقت توقعاتنا بمراحل." },
  { name: "نورة السالم", role: "مؤسسة، علامة نمط", quote: "احترافية في كل تفصيلة، التزام بالمواعيد، وذوق راقي. سابا ديزاين شريك حقيقي وليس مجرد مزود خدمة." },
  { name: "عبدالرحمن المالكي", role: "مدير تسويق، مجموعة الأفق", quote: "حصلنا على هوية رقمية رفعت من قيمة علامتنا التجارية وضاعفت معدل التحويل بشكل ملموس." },
];

const tools = [
  "Figma", "React", "Next.js", "Webflow", "Shopify",
  "TypeScript", "Node.js", "Tailwind", "Framer", "Adobe",
];

const journey = [
  { year: "2017", title: "البداية", desc: "تأسست سابا ديزاين بفريق صغير وحلم كبير." },
  { year: "2019", title: "التوسع", desc: "افتتاح أول فرع إقليمي وتوسع المحفظة لـ 50 مشروعاً." },
  { year: "2022", title: "الاعتراف", desc: "حصلنا على عدة جوائز إقليمية في التصميم والابتكار." },
  { year: "2025", title: "الانطلاق العالمي", desc: "خدمة عملاء في أكثر من 15 دولة حول العالم." },
];

function AboutPage() {
  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div
            className="absolute inset-0 -z-0"
            style={{ background: "linear-gradient(135deg, rgba(84,130,174,0.10) 0%, rgba(30,91,148,0.04) 60%, transparent 100%)" }}
          />
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl animate-pulse-glow" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />

          <div className="relative mx-auto max-w-7xl px-4 py-24 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                من نحن
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
                نصنع <span className="text-gradient-primary">تجارب رقمية</span>
                <br />
                تترك أثراً يدوم
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                سابا ديزاين وكالة رقمية متخصصة في تحويل أفكارك إلى منتجات عصرية تجمع بين
                الجمال والوظيفة. نؤمن بأن التصميم العظيم يبدأ من فهم عميق للإنسان قبل التقنية.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-primary-dark"
                >
                  ابدأ مشروعك معنا
                  <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary"
                >
                  استعرض أعمالنا
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-background px-6 py-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl font-extrabold text-gradient-primary">{s.value}</div>
                <div className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* STORY */}
        <section className="mx-auto max-w-7xl px-4 py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">قصتنا</span>
              <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
                من فكرة بسيطة
                <br />
                إلى وكالة بصمة عربية
              </h2>
              <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
                <p>
                  بدأت رحلتنا عام 2017 بإيمان عميق بأن المنطقة العربية تستحق تجارب رقمية
                  بمستوى عالمي. جمعنا فريقاً من المصممين والمطورين الذين يشاركون نفس الشغف:
                  صناعة منتجات يفتخر بها العميل.
                </p>
                <p>
                  اليوم، ومع أكثر من 250 مشروعاً مكتملاً وعملاء في 15 دولة، ما زلنا نحافظ
                  على نفس المبدأ: الاهتمام بالتفاصيل، احترام وقت العميل، وتقديم قيمة حقيقية
                  تتجاوز التوقعات.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <div key={s.title} className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <s.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-foreground">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-square overflow-hidden rounded-3xl shadow-lg">
                <img src={aboutHero} alt="منصة سابا ديزاين الرقمية" className="absolute inset-0 h-full w-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(30,91,148,0) 30%, rgba(15,40,75,0.85) 100%)" }}
                />
                <div className="relative flex h-full flex-col justify-end p-8 text-white md:p-10">
                  <Quote className="mb-4 h-10 w-10 opacity-70" />
                  <p className="text-xl font-bold leading-relaxed md:text-2xl">
                    "نحن لا نصمم مواقع.
                    <br />
                    نصنع تجارب رقمية يتذكرها الناس."
                  </p>
                  <div className="mt-5 h-0.5 w-16 bg-white/70" />
                  <span className="mt-2 text-sm text-white/85">— فلسفة سابا ديزاين</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 hidden h-32 w-32 rounded-2xl border-4 border-background bg-white p-4 shadow-lg lg:block">
                <div className="flex h-full flex-col justify-between">
                  <Award className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-2xl font-extrabold text-foreground">+15</div>
                    <div className="text-[10px] font-bold text-muted-foreground">جائزة عالمية</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION / VISION */}
        <section className="bg-secondary/30 py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Target, title: "رسالتنا", desc: "تمكين الشركات والأفراد من بناء حضور رقمي قوي ومتميز يحقق أهدافهم بأفضل الممارسات العالمية." },
                { icon: Eye, title: "رؤيتنا", desc: "أن نكون الوكالة الرقمية الأولى التي تختارها العلامات الطموحة في المنطقة العربية والعالم." },
                { icon: Heart, title: "وعدنا", desc: "نلتزم بالشفافية، الجودة، والتسليم في الوقت — لأن سمعتنا تُبنى مع كل مشروع نسلمه." },
              ].map((c) => (
                <div
                  key={c.title}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-background p-8 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition group-hover:scale-150" />
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
                      <c.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-extrabold text-foreground">{c.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="mx-auto max-w-7xl px-4 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">قيمنا</span>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
              المبادئ التي تحركنا كل يوم
            </h2>
            <p className="mt-4 text-muted-foreground">أربعة أركان نبني عليها كل قرار وكل سطر كود وكل بكسل.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.title} className="relative rounded-3xl border border-border bg-white p-6 transition hover:border-primary/40 hover:shadow-md">
                <div className="absolute -top-4 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white shadow-md">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* JOURNEY */}
        <section className="bg-secondary/30 py-24">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">رحلتنا</span>
              <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
                ثمانية أعوام من النمو المستمر
              </h2>
            </div>
            <div className="relative mt-16">
              <div className="absolute right-1/2 top-0 hidden h-full w-0.5 translate-x-1/2 bg-gradient-to-b from-primary via-primary/30 to-transparent md:block" />
              <div className="space-y-10">
                {journey.map((j, i) => (
                  <div key={j.year} className={`flex flex-col gap-4 md:flex-row md:items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="flex-1 md:text-left">
                      <div className={`rounded-2xl border border-border bg-background p-6 shadow-sm ${i % 2 === 0 ? "md:mr-12 md:text-right" : "md:ml-12 md:text-left"}`}>
                        <div className="text-2xl font-extrabold text-primary">{j.year}</div>
                        <h3 className="mt-1 text-lg font-bold text-foreground">{j.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{j.desc}</p>
                      </div>
                    </div>
                    <div className="relative z-10 mx-auto hidden h-5 w-5 shrink-0 rounded-full border-4 border-background bg-primary shadow-md md:block" />
                    <div className="hidden flex-1 md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="mx-auto max-w-7xl px-4 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">منهجيتنا</span>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
              كيف نعمل من الفكرة إلى الإطلاق
            </h2>
            <p className="mt-4 text-muted-foreground">منهجية واضحة بأربع مراحل تضمن تسليماً ناجحاً ونتائج تستمر.</p>
          </div>
          <div className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <div key={p.title} className="group relative rounded-3xl border border-border bg-white p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <span className="text-4xl font-extrabold text-primary/10 transition group-hover:text-primary/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-secondary/30 py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">آراء عملائنا</span>
              <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
                ما يقوله من عملوا معنا
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="relative rounded-3xl border border-border bg-background p-7 shadow-sm transition hover:shadow-md">
                  <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/15" />
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-foreground">"{t.quote}"</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TOOLS / TECH */}
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">أدواتنا</span>
            <h2 className="mt-3 text-2xl font-extrabold text-foreground md:text-3xl">
              تقنيات عالمية في يد فريق محترف
            </h2>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {tools.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-foreground shadow-sm transition hover:border-primary hover:text-primary"
              >
                <Zap className="h-3.5 w-3.5 text-primary" />
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* WHY US */}
        <section className="bg-secondary/30 py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">لماذا سابا ديزاين؟</span>
                <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
                  ما يميزنا عن غيرنا
                </h2>
                <p className="mt-4 leading-8 text-muted-foreground">
                  لا نقدم خدمات جاهزة — نصمم حلولاً مفصلة على مقاس مشروعك وأهدافك. كل عميل
                  يحصل على فريق متخصص واهتمام شخصي حقيقي.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "فريق محترف بخبرة تتجاوز 8 سنوات في السوق",
                    "تسليم في الوقت المتفق عليه — 98% التزام",
                    "دعم فني مستمر بعد إطلاق المشروع",
                    "أسعار تنافسية مقابل جودة عالمية",
                    "ضمان رضا العميل على كل مرحلة من المشروع",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-foreground">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: "98%", l: "نسبة العملاء الراضين" },
                  { v: "24h", l: "متوسط زمن الاستجابة" },
                  { v: "100%", l: "ضمان الجودة" },
                  { v: "+50", l: "خبير في الفريق" },
                ].map((b) => (
                  <div key={b.l} className="rounded-3xl border border-border bg-background p-6 text-center shadow-sm">
                    <div className="text-3xl font-extrabold text-gradient-primary">{b.v}</div>
                    <div className="mt-2 text-xs font-bold text-muted-foreground">{b.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-24">
          <div
            className="relative overflow-hidden rounded-3xl p-10 text-white md:p-16"
            style={{ background: "linear-gradient(135deg, #5482AE 0%, #1E5B94 100%)" }}
          >
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
                  جاهزون لبناء شيء استثنائي معاً؟
                </h2>
                <p className="mt-3 text-white/85">
                  أخبرنا عن مشروعك وسنرد عليك خلال 24 ساعة بخطة مبدئية واقتراحات عملية.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-extrabold text-primary shadow-xl transition hover:bg-white/90"
              >
                تواصل معنا الآن
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن | سابا ديزاين - وكالة رقمية بصمة عربية" },
      { name: "description", content: "تعرّف على فريق سابا ديزاين، قصتنا، قيمنا، ورؤيتنا في صناعة تجارب رقمية تترك أثراً يدوم." },
    ],
  }),
  component: AboutPage,
});
