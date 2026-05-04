import {
  Layout, Smartphone, Megaphone, Users2, Video, Search, Code2, TrendingUp, Palette, MonitorSmartphone, Sparkles,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

const services = [
  { slug: "web-design", icon: Layout, title: "تصميم مواقع إلكترونية", desc: "تصميم مواقع احترافية متجاوبة مع جميع الأجهزة بأحدث التقنيات" },
  { slug: "ui-design", icon: MonitorSmartphone, title: "تصميم واجهات مستخدم", desc: "تصميم واجهات جذابة وسهلة الاستخدام تركز على تجربة العميل" },
  { slug: "ad-banners", icon: Megaphone, title: "تصميم بنرات إعلانية", desc: "تصميم بنرات إعلانية تحقق أعلى نتائج لحملاتك التسويقية" },
  { slug: "social-media-design", icon: Sparkles, title: "تصميم سوشيال ميديا", desc: "تصميم محتوى بصري احترافي لمنصات التواصل الاجتماعي" },
  { slug: "social-media-setup", icon: Users2, title: "إنشاء حسابات سوشيال ميديا", desc: "إنشاء وإعداد حسابات احترافية تليق بهويتك التجارية" },
  { slug: "ad-videos", icon: Video, title: "تصميم فيديوهات إعلانية", desc: "فيديوهات إعلانية احترافية تجذب الانتباه وتزيد من مبيعاتك" },
  { slug: "ad-campaigns", icon: Megaphone, title: "إطلاق حملات إعلانية", desc: "إدارة وتنفيذ حملات إعلانية مدفوعة تحقق أفضل عائد على الاستثمار" },
  { slug: "digital-marketing", icon: TrendingUp, title: "تسويق إلكتروني", desc: "استراتيجيات تسويق رقمي متكاملة لزيادة الوعي والمبيعات" },
  { slug: "debugging", icon: Code2, title: "تصحيح أخطاء برمجية", desc: "كشف وإصلاح الأخطاء البرمجية وإعادتها لتعمل بكفاءة عالية" },
  { slug: "seo", icon: Search, title: "تحسين محركات البحث SEO", desc: "تحسين ظهور موقعك في نتائج البحث وزيادة الزيارات الطبيعية" },
];

export function ServicesGrid() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">خدماتنا</span>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            حلول متكاملة لجميع احتياجاتك الرقمية
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary/70" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.title}
              className="group flex flex-col rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{s.desc}</p>
              <div className="mt-4 flex flex-1 items-end justify-center gap-2">
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="inline-flex h-9 items-center gap-1 rounded-full bg-primary px-4 text-[11px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  اطلب الخدمة
                </Link>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="inline-flex h-9 items-center gap-1 rounded-full border border-border bg-secondary/40 px-3 text-[11px] font-bold text-foreground/80 transition hover:border-primary/40 hover:text-primary"
                >
                  التفاصيل <ArrowLeft className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
