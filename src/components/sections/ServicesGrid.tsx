import {
  Layout,
  Smartphone,
  ShoppingBag,
  TrendingUp,
  Palette,
  Search,
  Shield,
  Sparkles,
  Code2,
  Database,
} from "lucide-react";

const services = [
  { icon: Layout, title: "تصميم مواقع إلكترونية", desc: "مواقع احترافية بتصاميم عصرية وتجربة مستخدم متميزة" },
  { icon: Smartphone, title: "تصميم تطبيقات الجوال", desc: "تطبيقات iOS و Android بأحدث التقنيات" },
  { icon: ShoppingBag, title: "المتاجر الإلكترونية", desc: "حلول متاجر إلكترونية متكاملة وآمنة" },
  { icon: TrendingUp, title: "التسويق الرقمي", desc: "استراتيجيات تسويقية فعّالة لزيادة المبيعات" },
  { icon: Palette, title: "تصميم هويات بصرية", desc: "هوية بصرية احترافية تعكس قيم علامتك" },
  { icon: Search, title: "تحسين محركات البحث", desc: "ظهور متقدم في نتائج البحث" },
  { icon: Shield, title: "حلول الأمن السيبراني", desc: "حماية شاملة ضد الاختراق والهجمات" },
  { icon: Sparkles, title: "تصميم تجربة المستخدم", desc: "تجارب رقمية سلسة وممتعة" },
  { icon: Code2, title: "تطوير برمجيات مخصصة", desc: "حلول برمجية تلبي احتياجاتك" },
  { icon: Database, title: "تخزين سحابي آمن", desc: "بنية تحتية سحابية موثوقة" },
];

export function ServicesGrid() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            خدماتنا
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            حلول متكاملة لجميع احتياجاتك الرقمية
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-border bg-white p-6 text-right shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}