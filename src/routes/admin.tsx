import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة التحكم | سابا ديزاين" }] }),
  component: AdminShell,
});

function AdminShell() {
  return (
    <AuthGuard requireAdmin>
      <Outlet />
    </AuthGuard>
  );
}