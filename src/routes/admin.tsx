import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة التحكم | سابا ديزاين" }] }),
  component: lazyRouteComponent(() => import("@/pages/routes/admin"), "AdminShell"),
});