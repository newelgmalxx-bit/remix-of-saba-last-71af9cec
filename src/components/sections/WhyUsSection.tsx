import { Wand2, Tag, Headphones, Clock, Lightbulb, Award } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import type { TKey } from "@/i18n/translations";

const items: { icon: typeof Wand2; tk: TKey; dk: TKey }[] = [
  { icon: Wand2, tk: "why.expertise.t", dk: "why.expertise.d" },
  { icon: Tag, tk: "why.price.t", dk: "why.price.d" },
  { icon: Headphones, tk: "why.support.t", dk: "why.support.d" },
  { icon: Clock, tk: "why.time.t", dk: "why.time.d" },
  { icon: Lightbulb, tk: "why.creative.t", dk: "why.creative.d" },
  { icon: Award, tk: "why.quality.t", dk: "why.quality.d" },
];

export function WhyUsSection() {
  const { t } = useLang();
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">{t("why.title")}</h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary/70" />
        </div>
        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((i) => (
            <div key={i.tk} className="flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                <i.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-sm font-bold text-foreground">{t(i.tk)}</h3>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{t(i.dk)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
