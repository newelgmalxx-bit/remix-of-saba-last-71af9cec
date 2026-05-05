import { Headphones, Award, Users, Package } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import type { TKey } from "@/i18n/translations";

const stats: { icon: typeof Headphones; v: string; key: TKey }[] = [
  { icon: Headphones, v: "24/7", key: "stats.support" },
  { icon: Award, v: "+5", key: "stats.years" },
  { icon: Users, v: "+300", key: "stats.clients" },
  { icon: Package, v: "+500", key: "stats.projects" },
];

export function StatsBanner() {
  const { t } = useLang();
  return (
    <section className="bg-gradient-to-l from-primary to-primary-dark py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div key={s.key} className="flex items-center justify-center gap-3 text-white">
            <div className="text-start">
              <div className="text-2xl font-extrabold" dir="ltr">{s.v}</div>
              <div className="text-[11px] text-white/80">{t(s.key)}</div>
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
