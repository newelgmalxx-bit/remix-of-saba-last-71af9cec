import { Percent, Tag, Users, Lightbulb, Clock, Shield } from "lucide-react";

const items = [
  { icon: Percent, title: "أسعار تنافسية", desc: "أفضل قيمة مقابل السعر" },
  { icon: Tag, title: "أسعار الجملة", desc: "خصومات مميزة للكميات" },
  { icon: Users, title: "فريق محترف", desc: "خبراء متخصصون" },
  { icon: Lightbulb, title: "حلول مبتكرة", desc: "أفكار إبداعية" },
  { icon: Clock, title: "تسليم في الوقت", desc: "التزام بالمواعيد" },
  { icon: Shield, title: "جودة عالية", desc: "معايير احترافية" },
];

export function WhyUsSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            مميزاتنا
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            لماذا تختار ديزاين؟
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((i) => (
            <div key={i.title} className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                <i.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-3 text-sm font-bold text-foreground">{i.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}