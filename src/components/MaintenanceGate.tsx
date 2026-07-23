import { useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/i18n/LanguageProvider";
import { lazy, Suspense, type ReactNode } from "react";

const MaintenanceScreen = lazy(() => import("./MaintenanceScreen").then((m) => ({ default: m.MaintenanceScreen })));

/** Gates the entire app behind maintenance mode flag from site settings.
 *  Admins and admin routes (and login) bypass the gate. */
export function MaintenanceGate({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const { lang } = useLang();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const maintenance = false;

  const bypass =
    isAdmin ||
    path.startsWith("/admin") ||
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password");

  if (maintenance && !bypass) {
    return <Suspense fallback={null}><MaintenanceScreen lang={lang} /></Suspense>;
  }
  return <>{children}</>;
}