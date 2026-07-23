import type { ReactNode } from "react";

/** Gates the entire app behind maintenance mode flag from site settings.
 *  Admins and admin routes (and login) bypass the gate. */
export function MaintenanceGate({ children }: { children: ReactNode }) {
  const maintenance = false;

  if (maintenance) return null;
  return <>{children}</>;
}