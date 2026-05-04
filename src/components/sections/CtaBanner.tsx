import { Rocket, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CtaBanner() {
  return (
    <section className="bg-background pb-20 pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary to-primary-dark px-8 py-12 shadow-lg">
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
              <Rocket className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1 text-center">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                جاهز للانطلاق نحو النجاح؟
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/80">
                دعنا نساعدك في تحقيق أهدافك الرقمية وبناء حضور مميز.
              </p>
              <Link
                to={"/contact" as any}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-white/40 bg-transparent px-7 text-sm font-bold text-white transition hover:bg-white hover:text-primary"
              >
                اطلب عرض سعر <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="hidden h-28 w-28 shrink-0 md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
