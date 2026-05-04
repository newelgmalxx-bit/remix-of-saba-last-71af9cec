import { Rocket } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CtaBanner() {
  return (
    <section className="bg-background pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary to-primary-dark px-8 py-12 shadow-lg">
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-right">
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                جاهز للانطلاق نحو النجاح؟
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/80">
                دعنا نساعدك في تحويل أفكارك إلى مشاريع رقمية ناجحة. تواصل معنا اليوم.
              </p>
              <Link
                to={"/contact" as any}
                className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-7 text-sm font-bold text-primary shadow-md transition hover:bg-white/95"
              >
                اطلب عرض سعر
              </Link>
            </div>
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
              <Rocket className="h-14 w-14 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}