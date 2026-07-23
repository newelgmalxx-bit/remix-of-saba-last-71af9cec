import { Outlet, Link, createRootRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";

import { LanguageProvider } from "@/i18n/LanguageProvider";
import { AuthProvider } from "@/hooks/useAuth";

const LazyToaster = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));
const LazyTrackingEffects = lazy(() => import("@/components/TrackingEffects").then((m) => ({ default: m.TrackingEffects })));

function NotFoundComponent() {
  return (
    <div dir="rtl" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 px-4">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="select-none bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-[9rem] sm:text-[12rem] font-black leading-none text-transparent drop-shadow-sm">
          404
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
          الصفحة غير موجودة
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها إلى مكان آخر.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
          >
            <RootIcon path="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5Z" /> العودة للرئيسية
          </Link>
          <Link
            to="/contact"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary"
          >
            <RootIcon path="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" /> تواصل معنا
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <RootIcon path="M19 12H5m0 0 6-6m-6 6 6 6" /> الرجوع للخلف
          </button>
        </div>
      </div>
    </div>
  );
}

function RootIcon({ path }: { path: string }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Outlet />
        <AfterFirstPaint delay={9000}>
          <Suspense fallback={null}>
            <LazyTrackingEffects />
            <LazyToaster position="top-center" richColors closeButton />
          </Suspense>
        </AfterFirstPaint>
      </AuthProvider>
    </LanguageProvider>
  );
}

function AfterFirstPaint({ children, delay }: { children: ReactNode; delay: number }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready || typeof window === "undefined") return;
    let timeoutId: number | undefined;
    const reveal = () => setReady(true);
    const start = () => { timeoutId = window.setTimeout(reveal, delay); };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    window.addEventListener("pointerdown", reveal, { once: true, passive: true });
    window.addEventListener("keydown", reveal, { once: true });
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      window.removeEventListener("load", start);
      window.removeEventListener("pointerdown", reveal);
      window.removeEventListener("keydown", reveal);
    };
  }, [delay, ready]);

  return ready ? <>{children}</> : null;
}
