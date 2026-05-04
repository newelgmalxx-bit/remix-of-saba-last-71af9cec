import { Headphones, Award, Users, Package } from "lucide-react";

const stats = [
  { icon: Headphones, v: "24/7", l: "دعم فني" },
  { icon: Award, v: "+5", l: "سنوات خبرة" },
  { icon: Users, v: "+300", l: "عميل سعيد" },
  { icon: Package, v: "+500", l: "مشروع مكتمل" },
];

export function StatsBanner() {
  return (
    <section className="bg-gradient-to-l from-primary to-primary-dark py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div key={s.l} className="flex items-center justify-center gap-3 text-white">
            <div className="text-right">
              <div className="text-2xl font-extrabold" dir="ltr">{s.v}</div>
              <div className="text-[11px] text-white/80">{s.l}</div>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
              <s.icon className="h-5 w-5" />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
