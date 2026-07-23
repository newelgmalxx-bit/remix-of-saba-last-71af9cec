import { Outlet } from "@tanstack/react-router";
import { AuthGuard } from "@/components/auth/AuthGuard";

export function AdminShell() {
  return (
    <AuthGuard requireAdmin>
      <Outlet />
    </AuthGuard>
  );
}