import { Outlet, Link, createRootRoute } from "@tanstack/react-router";
import { Home, Search, ArrowLeft } from "lucide-react";

import "../styles.css";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { useTrackVisit } from "@/hooks/useTrackVisit";
import { useInjectTracking } from "@/hooks/useInjectTracking";
import { usePageTracking } from "@/hooks/usePageTracking";
import { MaintenanceGate } from "@/components/MaintenanceGate";

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
            <Home className="h-4 w-4" /> العودة للرئيسية
          </Link>
          <Link
            to="/contact"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary"
          >
            <Search className="h-4 w-4" /> تواصل معنا
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> الرجوع للخلف
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  useTrackVisit();
  useInjectTracking();
  usePageTracking();
  return (
    <LanguageProvider>
      <AuthProvider>
        <MaintenanceGate>
          <Outlet />
        </MaintenanceGate>
        <Toaster position="top-center" richColors closeButton />
      </AuthProvider>
    </LanguageProvider>
  );
}
