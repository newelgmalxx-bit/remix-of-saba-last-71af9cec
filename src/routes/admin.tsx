import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة التحكم | سابا ديزاين" }] }),
  component: AdminShell,
});