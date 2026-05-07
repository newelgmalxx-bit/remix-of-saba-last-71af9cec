import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { admin as adminApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/i18n/LanguageProvider";
import { MaintenanceScreen } from "./MaintenanceScreen";

/** Gates the entire app behind maintenance mode flag from site settings.
 *  Admins and admin routes (and login) bypass the gate. */
export function MaintenanceGate({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const { lang } = useLang();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data: any = await adminApi.settings.get<any>("site");
        if (!cancelled) setMaintenance(!!(data?.maintenance ?? data?.maintenanceMode));
      } catch {
        if (!cancelled) setMaintenance(false);
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const bypass =
    isAdmin ||
    path.startsWith("/admin") ||
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password");

  if (maintenance && !bypass) {
    return <MaintenanceScreen lang={lang} />;
  }
  return <>{children}</>;
}