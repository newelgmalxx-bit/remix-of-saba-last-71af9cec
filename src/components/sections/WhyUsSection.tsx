import { Wand2, Tag, Headphones, Clock, Lightbulb, Award } from "lucide-react";

const items = [
  { icon: Wand2, title: "خبرة واحترافية", desc: "فريق محترف بخبرة طويلة في المجال" },
  { icon: Tag, title: "أسعار تنافسية", desc: "أفضل قيمة مقابل السعر تناسب جميع الميزانيات" },
  { icon: Headphones, title: "دعم مستمر", desc: "دعم فني متواصل قبل وبعد تسليم المشروع" },
  { icon: Clock, title: "الالتزام بالمواعيد", desc: "نلتزم بتسليم المشاريع في الوقت المحدد" },
  { icon: Lightbulb, title: "تصاميم إبداعية", desc: "أفكار مبتكرة وتصاميم تجذب الانتباه" },
  { icon: Award, title: "جودة عالية", desc: "نحرص على تقديم أعلى جودة في كل ما نقدمه" },
];

export function WhyUsSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">لماذا تختار ديزاين؟</h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary/70" />
        </div>
        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((i) => (
            <div key={i.title} className="flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                <i.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-sm font-bold text-foreground">{i.title}</h3>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
